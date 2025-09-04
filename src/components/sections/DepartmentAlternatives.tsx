'use client'

import { motion } from "framer-motion"
import { DynamicIcon } from "@/components/content/DynamicIcon"

interface Department {
  title: string
  description: string
  icon: string
  color?: string
}

interface DepartmentAlternativesProps {
  departments: Department[]
}

export function DepartmentAlternatives({ departments }: DepartmentAlternativesProps) {
  return (
    <div className="space-y-16">
      {/* Alternative 1: Modern Card Design with Colored Borders */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Alternative 1: Modern Cards with Colored Accents</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((department, index) => (
            <motion.div
              key={`alt1-${index}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500 hover:shadow-lg hover:border-blue-600 transition-all group"
            >
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-lg shadow-sm">
                  <DynamicIcon name="Users" className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">{department.title}</h3>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed">{department.description}</p>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <span className="text-blue-600 text-sm font-medium">Soluciones especializadas →</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Alternative 2: Minimalist List Design */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Alternative 2: Clean Minimalist Layout</h3>
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {departments.map((department, index) => (
              <motion.div
                key={`alt2-${index}`}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex items-start space-x-4 p-6 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <DynamicIcon name="Target" className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">{department.title}</h3>
                  <p className="text-gray-600">{department.description}</p>
                  <div className="mt-3">
                    <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Alternative 3: Professional Grid with Icons */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Alternative 3: Professional Icon Grid</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((department, index) => {
            const icons = ['Briefcase', 'TrendingUp', 'Calculator', 'Users', 'Settings', 'Headphones']
            const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-indigo-500', 'bg-red-500']
            
            return (
              <motion.div
                key={`alt3-${index}`}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all text-center group"
              >
                <div className={`w-16 h-16 ${colors[index % colors.length]} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                  <DynamicIcon name={icons[index % icons.length]} className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 text-xl mb-3">{department.title}</h3>
                <p className="text-gray-600 leading-relaxed">{department.description}</p>
                <div className="mt-6">
                  <div className="inline-flex items-center text-blue-600 font-medium text-sm">
                    <span>Ver soluciones</span>
                    <DynamicIcon name="ArrowRight" className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}