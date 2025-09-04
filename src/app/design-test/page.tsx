import { DepartmentAlternatives } from '@/components/sections/DepartmentAlternatives'

const sampleDepartments = [
  {
    title: "Ejecutivos",
    description: "Necesitan apoyo para decisiones y síntesis estratégica",
    icon: "👔"
  },
  {
    title: "Equipos de Ventas",
    description: "Investigación de prospectos y escritura de propuestas",
    icon: "📈"
  },
  {
    title: "Personal de Finanzas",
    description: "Automatización de análisis presupuestario y reportes",
    icon: "💰"
  },
  {
    title: "Equipos de RRHH",
    description: "Optimización de reclutamiento y analítica de empleados",
    icon: "👥"
  },
  {
    title: "Operaciones",
    description: "Optimización de procesos y gestión de proveedores",
    icon: "⚙️"
  },
  {
    title: "Atención al Cliente",
    description: "Mejora de calidad de respuesta y eficiencia",
    icon: "🎧"
  }
]

export default function DesignTestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Department Section Design Alternatives</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Compare these 3 different design approaches for the departments section. 
            Each removes emoji-style icons and uses modern UI patterns instead.
          </p>
        </div>
        
        <DepartmentAlternatives departments={sampleDepartments} />
      </div>
    </div>
  )
}