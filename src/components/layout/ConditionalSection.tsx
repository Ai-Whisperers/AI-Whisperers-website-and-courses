import React from 'react'

interface ConditionalSectionProps {
  condition: boolean
  children: React.ReactNode
}

export function ConditionalSection({ condition, children }: ConditionalSectionProps) {
  if (!condition) return null
  return <>{children}</>
}