// Auto-generated content file - Do not edit manually
// Generated from: src/content/pages/admin-es.yml
// Language: ES

import type { PageContent } from '@/types/content';

export const admin_esContent: PageContent = {
  "meta": {
    "title": "Panel de Administración | AI Whisperers",
    "description": "Gestiona usuarios, cursos, contenido y configuraciones de la plataforma.",
    "language": "es",
    "keywords": [
      "AI",
      "education"
    ]
  },
  "hero": {
    "title": "Panel de Administración",
    "subtitle": "Gestión y supervisión de la plataforma"
  },
  "navigation": {
    "items": [
      {
        "label": "Panel",
        "href": "/es/admin",
        "icon": "LayoutDashboard"
      },
      {
        "label": "Usuarios",
        "href": "/es/admin/users",
        "icon": "Users"
      },
      {
        "label": "Cursos",
        "href": "/es/admin/courses",
        "icon": "BookOpen"
      },
      {
        "label": "Contenido",
        "href": "/es/admin/content",
        "icon": "FileText"
      },
      {
        "label": "Analíticas",
        "href": "/es/admin/analytics",
        "icon": "BarChart"
      },
      {
        "label": "Configuración",
        "href": "/es/admin/settings",
        "icon": "Settings"
      }
    ]
  },
  "stats": {
    "title": "Resumen de Plataforma",
    "metrics": [
      {
        "label": "Usuarios Totales",
        "value": "0",
        "icon": "Users",
        "color": "blue"
      },
      {
        "label": "Cursos Activos",
        "value": "0",
        "icon": "BookOpen",
        "color": "green"
      },
      {
        "label": "Ingresos Totales",
        "value": "$0",
        "icon": "DollarSign",
        "color": "purple"
      },
      {
        "label": "Tasa de Finalización",
        "value": "0%",
        "icon": "TrendingUp",
        "color": "orange"
      }
    ]
  },
  "recent_activity": {
    "title": "Actividad Reciente",
    "empty": "Sin actividad administrativa reciente"
  },
  "quick_actions": {
    "title": "Acciones Rápidas",
    "actions": [
      {
        "label": "Agregar Nuevo Curso",
        "icon": "Plus",
        "href": "/es/admin/courses/new"
      },
      {
        "label": "Gestionar Usuarios",
        "icon": "UserPlus",
        "href": "/es/admin/users"
      },
      {
        "label": "Ver Analíticas",
        "icon": "BarChart",
        "href": "/es/admin/analytics"
      },
      {
        "label": "Configuración de Plataforma",
        "icon": "Settings",
        "href": "/es/admin/settings"
      }
    ]
  }
} as const;

export default admin_esContent;
