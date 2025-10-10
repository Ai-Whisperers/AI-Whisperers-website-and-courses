import { NextResponse } from 'next/server'
import { architectureProvider } from '@/lib/architecture/DynamicArchitectureProvider'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const forceRefresh = url.searchParams.get('refresh') === 'true'
    
    // Get real-time architecture data
    const architectureData = await architectureProvider.getArchitectureData(forceRefresh)
    const systemStats = await architectureProvider.getSystemStats()
    const criticalComponents = await architectureProvider.getCriticalComponents()
    const healthSummary = await architectureProvider.getHealthSummary()

    return NextResponse.json({
      success: true,
      data: {
        levels: architectureData.levels,
        stats: systemStats,
        criticalComponents,
        healthSummary,
        metadata: {
          ...architectureData.metadata,
          endpoint: '/api/architecture',
          methodology: 'EC4RO-HGN',
          realTime: true
        }
      }
    })
  } catch (error) {
    console.error('Architecture API error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to analyze codebase architecture',
      fallback: 'Using static architecture data',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

// Health check endpoint for architecture system
export async function POST(request: Request) {
  try {
    const { action } = await request.json()
    
    if (action === 'invalidate-cache') {
      architectureProvider.invalidateCache()
      return NextResponse.json({
        success: true,
        message: 'Architecture cache invalidated',
        timestamp: new Date().toISOString()
      })
    }

    if (action === 'health-check') {
      const healthSummary = await architectureProvider.getHealthSummary()
      return NextResponse.json({
        success: true,
        health: healthSummary,
        timestamp: new Date().toISOString()
      })
    }

    return NextResponse.json({
      success: false,
      error: 'Unknown action'
    }, { status: 400 })
  } catch (error) {
    console.error('Architecture POST error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Architecture action failed',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}