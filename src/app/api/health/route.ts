// API Route: Health Check
// Health check endpoint with database connectivity verification

import { NextResponse } from 'next/server'
import { prisma } from '@/infrastructure/database/prisma-client'

export async function GET() {
  try {
    // Test database connection
    await prisma.$connect()
    const dbStatus = await prisma.$queryRaw`SELECT 1 as test`
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        application: 'running',
        api: 'operational',
        database: 'connected'
      },
      version: '0.1.0',
      environment: process.env.NODE_ENV || 'development',
      database: {
        connected: true,
        query_test: dbStatus ? 'passed' : 'failed'
      }
    })
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'unhealthy', 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        services: {
          application: 'running',
          api: 'operational', 
          database: 'disconnected'
        }
      },
      { status: 503 }
    )
  } finally {
    await prisma.$disconnect()
  }
}