'use client'

import { DynamicIcon } from '@/components/content/DynamicIcon'
import { motion } from 'framer-motion'

interface StatsCardProps {
  label: string
  value: string | number
  icon: string
  color?: 'blue' | 'green' | 'purple' | 'orange'
  trend?: {
    value: number
    direction: 'up' | 'down'
  }
}

const colorClasses = {
  blue: 'bg-blue-500/10 text-blue-600',
  green: 'bg-green-500/10 text-green-600',
  purple: 'bg-purple-500/10 text-purple-600',
  orange: 'bg-orange-500/10 text-orange-600',
}

export function StatsCard({ label, value, icon, color = 'blue', trend }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${
              trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              <DynamicIcon 
                name={trend.direction === 'up' ? 'TrendingUp' : 'TrendingDown'} 
                className="w-4 h-4" 
              />
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <DynamicIcon name={icon} className="w-6 h-6" />
        </div>
      </div>
    </motion.div>
  )
}
