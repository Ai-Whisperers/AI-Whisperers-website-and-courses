'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { DynamicIcon } from '@/components/content/DynamicIcon'

interface PricingConfig {
  companySize: 'small' | 'medium' | 'large' | 'enterprise'
  departments: string[]
  trainingType: 'basic' | 'advanced' | 'premium'
  implementation: boolean
  support: 'basic' | 'premium'
}

interface PricingBreakdown {
  training: number
  implementation: number
  support: number
  total: number
  roiProjection: {
    timeSaved: number
    costSaved: number
    paybackMonths: number
  }
}

export function PricingCalculator() {
  const [config, setConfig] = useState<PricingConfig>({
    companySize: 'medium',
    departments: ['executives'],
    trainingType: 'basic',
    implementation: false,
    support: 'basic'
  })

  const [pricing, setPricing] = useState<PricingBreakdown>({
    training: 0,
    implementation: 0,
    support: 0,
    total: 0,
    roiProjection: {
      timeSaved: 0,
      costSaved: 0,
      paybackMonths: 0
    }
  })

  const companySizes = [
    { id: 'small', label: 'Small (1-50)', multiplier: 0.8, employees: 25 },
    { id: 'medium', label: 'Medium (51-200)', multiplier: 1.0, employees: 125 },
    { id: 'large', label: 'Large (201-1000)', multiplier: 1.5, employees: 500 },
    { id: 'enterprise', label: 'Enterprise (1000+)', multiplier: 2.0, employees: 2000 }
  ]

  const departments = [
    { id: 'executives', label: 'Executives', basePrice: 2000 },
    { id: 'sales', label: 'Sales Teams', basePrice: 1800 },
    { id: 'finance', label: 'Finance', basePrice: 1900 },
    { id: 'hr', label: 'HR Teams', basePrice: 1700 },
    { id: 'operations', label: 'Operations', basePrice: 2100 },
    { id: 'customer-service', label: 'Customer Service', basePrice: 1600 }
  ]

  const trainingTypes = [
    { id: 'basic', label: 'Basic Training', multiplier: 1.0, description: '2-week program' },
    { id: 'advanced', label: 'Advanced Training', multiplier: 1.4, description: '4-week program' },
    { id: 'premium', label: 'Premium Training', multiplier: 1.8, description: '8-week program' }
  ]

  useEffect(() => {
    calculatePricing()
  }, [config])

  const calculatePricing = () => {
    const sizeData = companySizes.find(s => s.id === config.companySize)!
    const trainingData = trainingTypes.find(t => t.id === config.trainingType)!
    
    // Calculate training cost
    const departmentCosts = config.departments.reduce((total, deptId) => {
      const dept = departments.find(d => d.id === deptId)!
      return total + dept.basePrice
    }, 0)
    
    const trainingCost = departmentCosts * sizeData.multiplier * trainingData.multiplier

    // Calculate implementation cost
    const implementationCost = config.implementation ? trainingCost * 0.6 : 0

    // Calculate support cost (annual)
    const supportMultiplier = config.support === 'premium' ? 0.3 : 0.15
    const supportCost = trainingCost * supportMultiplier

    // Calculate ROI projection
    const hoursPerEmployeePerWeek = 5 // Hours saved per employee per week
    const averageHourlyRate = 25 // USD
    const employeeCount = Math.min(sizeData.employees, config.departments.length * 20)
    
    const weeklyTimeSaved = hoursPerEmployeePerWeek * employeeCount
    const weeklyCostSaved = weeklyTimeSaved * averageHourlyRate
    const annualCostSaved = weeklyCostSaved * 52

    const total = trainingCost + implementationCost + supportCost
    const paybackMonths = total / (annualCostSaved / 12)

    setPricing({
      training: trainingCost,
      implementation: implementationCost,
      support: supportCost,
      total,
      roiProjection: {
        timeSaved: weeklyTimeSaved,
        costSaved: annualCostSaved,
        paybackMonths
      }
    })
  }

  const handleDepartmentToggle = (deptId: string) => {
    setConfig(prev => ({
      ...prev,
      departments: prev.departments.includes(deptId)
        ? prev.departments.filter(d => d !== deptId)
        : [...prev.departments, deptId]
    }))
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          AI Implementation Cost Calculator
        </h2>
        <p className="text-lg text-gray-600">
          Get an instant estimate for your AI transformation project
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Configuration Panel */}
        <div className="space-y-6">
          {/* Company Size */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Company Size
            </label>
            <div className="grid grid-cols-2 gap-2">
              {companySizes.map(size => (
                <button
                  key={size.id}
                  onClick={() => setConfig(prev => ({ ...prev, companySize: size.id as PricingConfig['companySize'] }))}
                  className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                    config.companySize === size.id
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>

          {/* Departments */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Departments to Train
            </label>
            <div className="grid grid-cols-2 gap-2">
              {departments.map(dept => (
                <button
                  key={dept.id}
                  onClick={() => handleDepartmentToggle(dept.id)}
                  className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                    config.departments.includes(dept.id)
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {dept.label}
                </button>
              ))}
            </div>
          </div>

          {/* Training Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Training Program
            </label>
            <div className="space-y-2">
              {trainingTypes.map(type => (
                <button
                  key={type.id}
                  onClick={() => setConfig(prev => ({ ...prev, trainingType: type.id as PricingConfig['trainingType'] }))}
                  className={`w-full p-3 rounded-lg border text-left transition-all ${
                    config.trainingType === type.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium">{type.label}</div>
                  <div className="text-sm text-gray-600">{type.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Add-ons */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Additional Services
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={config.implementation}
                onChange={(e) => setConfig(prev => ({ ...prev, implementation: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2">Custom Implementation (+60%)</span>
            </label>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Support Level
              </label>
              <select
                value={config.support}
                onChange={(e) => setConfig(prev => ({ ...prev, support: e.target.value as PricingConfig['support'] }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="basic">Basic Support (15% annually)</option>
                <option value="premium">Premium Support (30% annually)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Investment Breakdown</h3>
          
          <div className="space-y-4 mb-6">
            <div className="flex justify-between">
              <span>Training Program</span>
              <span className="font-medium">${pricing.training.toLocaleString()}</span>
            </div>
            
            {config.implementation && (
              <div className="flex justify-between">
                <span>Implementation</span>
                <span className="font-medium">${pricing.implementation.toLocaleString()}</span>
              </div>
            )}
            
            <div className="flex justify-between">
              <span>Annual Support</span>
              <span className="font-medium">${pricing.support.toLocaleString()}</span>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total Investment</span>
                <span className="text-blue-600">${pricing.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* ROI Projection */}
          <div className="bg-white rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <DynamicIcon name="TrendingUp" className="h-5 w-5 text-green-600 mr-2" />
              ROI Projection
            </h4>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Weekly time saved</span>
                <span className="font-medium">{pricing.roiProjection.timeSaved} hours</span>
              </div>
              <div className="flex justify-between">
                <span>Annual cost savings</span>
                <span className="font-medium text-green-600">
                  ${pricing.roiProjection.costSaved.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Payback period</span>
                <span className="font-medium">
                  {pricing.roiProjection.paybackMonths.toFixed(1)} months
                </span>
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Get Detailed Proposal
          </motion.button>
        </div>
      </div>
    </div>
  )
}