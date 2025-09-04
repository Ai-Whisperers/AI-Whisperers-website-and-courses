// API Route: Health Check
// Health check endpoint for application status

import { NextResponse } from 'next/server'

export async function GET() {
  try {
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        application: 'running',
        api: 'operational'
      },
      version: '0.1.0',
      environment: process.env.NODE_ENV || 'development'
    })
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'unhealthy', 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        services: {
          application: 'running',
          api: 'operational'
        }
      },
      { status: 503 }
    )
  }
}