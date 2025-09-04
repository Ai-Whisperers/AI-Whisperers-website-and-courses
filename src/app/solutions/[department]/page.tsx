import { SolutionsPage } from '@/components/pages/SolutionsPage'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ department: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { department } = await params
  
  const departmentTitles: Record<string, string> = {
    'ejecutivos': 'Soluciones para Ejecutivos',
    'ventas': 'Soluciones para Equipos de Ventas',
    'finanzas': 'Soluciones para Personal de Finanzas',
    'rrhh': 'Soluciones para Equipos de RRHH',
    'operaciones': 'Soluciones para Operaciones',
    'atencion-cliente': 'Soluciones para Atención al Cliente'
  }
  
  const title = departmentTitles[department] || 'Soluciones AI'
  
  return {
    title: `${title} - AI Paraguay`,
    description: `Soluciones de inteligencia artificial personalizadas para ${department}. Automatización, capacitación y herramientas especializadas.`,
    keywords: ['AI', 'inteligencia artificial', department, 'automatización', 'Paraguay'],
  }
}

export default async function DepartmentSolutionsPage({ params }: PageProps) {
  const { department } = await params
  
  return <SolutionsPage department={department} />
}