// Dynamic Architecture Data Provider
// Uses CodebaseAnalyzer to generate real-time EC4RO-HGN data
// Ensures no context loss by always reflecting actual codebase state

import { CodebaseAnalyzer } from './CodebaseAnalyzer'
import { GraphLevel } from '@/components/architecture/RealArchitectureData'

interface ArchitectureCache {
  data: GraphLevel[]
  timestamp: number
  stats: any
}

export class DynamicArchitectureProvider {
  private static instance: DynamicArchitectureProvider
  private analyzer: CodebaseAnalyzer
  private cache: ArchitectureCache | null = null
  private cacheValidityMs = 5 * 60 * 1000 // 5 minutes

  private constructor() {
    this.analyzer = new CodebaseAnalyzer()
  }

  public static getInstance(): DynamicArchitectureProvider {
    if (!this.instance) {
      this.instance = new DynamicArchitectureProvider()
    }
    return this.instance
  }

  // Get architecture data with caching for performance
  public async getArchitectureData(forceRefresh = false): Promise<{
    levels: GraphLevel[]
    stats: any
    metadata: {
      analysisTime: string
      totalFiles: number
      lastUpdated: Date
      cacheHit: boolean
    }
  }> {
    const now = Date.now()
    
    // Check if we need to refresh the cache
    if (!this.cache || forceRefresh || (now - this.cache.timestamp) > this.cacheValidityMs) {
      console.log('🔄 Refreshing architecture analysis...')
      
      const startTime = Date.now()
      const analysis = await this.analyzer.analyzeCodebase()
      const analysisTime = Date.now() - startTime

      this.cache = {
        data: analysis.levels,
        timestamp: now,
        stats: analysis.stats
      }

      return {
        levels: analysis.levels,
        stats: analysis.stats,
        metadata: {
          analysisTime: `${analysisTime}ms`,
          totalFiles: analysis.stats.totalFiles,
          lastUpdated: new Date(),
          cacheHit: false
        }
      }
    }

    // Return cached data
    return {
      levels: this.cache.data,
      stats: this.cache.stats,
      metadata: {
        analysisTime: 'cached',
        totalFiles: this.cache.stats.totalFiles,
        lastUpdated: new Date(this.cache.timestamp),
        cacheHit: true
      }
    }
  }

  // Get real-time system statistics
  public async getSystemStats(): Promise<{
    totalFiles: number
    totalDependencies: number
    circularDependencies: number
    architectureGrade: string
    qualityScore: number
    healthyComponents: number
    monitorComponents: number
    refactorComponents: number
    lastAnalyzed: Date
  }> {
    const { stats, metadata } = await this.getArchitectureData()
    
    return {
      totalFiles: stats.totalFiles,
      totalDependencies: stats.totalDependencies,
      circularDependencies: stats.circularDependencies,
      architectureGrade: stats.architectureGrade,
      qualityScore: stats.qualityScore,
      healthyComponents: stats.healthyComponents,
      monitorComponents: stats.monitorComponents,
      refactorComponents: stats.refactorComponents,
      lastAnalyzed: metadata.lastUpdated
    }
  }

  // Get critical components that need attention
  public async getCriticalComponents(): Promise<Array<{
    name: string
    category: string
    health: string
    imports: number
    exports: number
    files: string[]
    reason: string
  }>> {
    const { levels } = await this.getArchitectureData()
    const criticalComponents: Array<{
      name: string
      category: string
      health: string
      imports: number
      exports: number
      files: string[]
      reason: string
    }> = []

    levels.forEach(level => {
      level.vertices.forEach(vertex => {
        const metrics = vertex.metrics
        const health = vertex.health
        
        if (health === 'Monitor' || health === 'Refactor' || 
            (metrics && (metrics.importance === 'Critical' || 
                        (metrics.afferentCoupling && metrics.afferentCoupling > 15)))) {
          criticalComponents.push({
            name: vertex.name,
            category: vertex.category,
            health: health || 'Unknown',
            imports: metrics?.afferentCoupling || 0,
            exports: metrics?.efferentCoupling || 0,
            files: vertex.files || [],
            reason: this.getCriticalReason(vertex, metrics)
          })
        }
      })
    })

    return criticalComponents.sort((a, b) => b.imports - a.imports)
  }

  // Invalidate cache to force fresh analysis
  public invalidateCache(): void {
    this.cache = null
    console.log('🗑️ Architecture cache invalidated')
  }

  // Get architecture health summary
  public async getHealthSummary(): Promise<{
    overall: 'Excellent' | 'Good' | 'Monitor' | 'Refactor'
    score: number
    components: {
      excellent: number
      good: number
      monitor: number
      refactor: number
    }
    recommendations: string[]
  }> {
    const { levels, stats } = await this.getArchitectureData()
    const components = { excellent: 0, good: 0, monitor: 0, refactor: 0 }
    const recommendations: string[] = []

    levels.forEach(level => {
      level.vertices.forEach(vertex => {
        switch (vertex.health) {
          case 'Excellent': components.excellent++; break
          case 'Good': components.good++; break
          case 'Monitor': components.monitor++; break
          case 'Refactor': components.refactor++; break
        }
      })
    })

    const totalComponents = components.excellent + components.good + components.monitor + components.refactor
    const score = Math.round(
      ((components.excellent * 100) + (components.good * 80) + (components.monitor * 60) + (components.refactor * 20)) / totalComponents
    )

    // Generate recommendations
    if (components.refactor > 0) {
      recommendations.push(`${components.refactor} components need refactoring`)
    }
    if (components.monitor > 5) {
      recommendations.push(`${components.monitor} components require monitoring - consider splitting large modules`)
    }
    if (stats.totalDependencies > 150) {
      recommendations.push('High dependency count - review coupling between modules')
    }

    const overall = score >= 90 ? 'Excellent' : score >= 80 ? 'Good' : score >= 60 ? 'Monitor' : 'Refactor'

    return {
      overall,
      score,
      components,
      recommendations
    }
  }

  // Helper to determine why a component is critical
  private getCriticalReason(vertex: any, metrics: any): string {
    if (vertex.health === 'Refactor') return 'Requires refactoring'
    if (vertex.health === 'Monitor') return 'High complexity - monitor closely'
    if (metrics?.importance === 'Critical') return 'Critical system component'
    if (metrics?.afferentCoupling && metrics.afferentCoupling > 15) return 'High coupling - many dependencies'
    return 'Needs attention'
  }
}

// Singleton instance for use across the application
export const architectureProvider = DynamicArchitectureProvider.getInstance()