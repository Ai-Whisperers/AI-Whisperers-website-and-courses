// Auto-generated content file - Do not edit manually
// Generated from: src/content/pages/architecture.yml

import type { PageContent } from '@/types/content';

export const architectureContent: PageContent = {
  "navigation": {
    "brand": {
      "text": "AI Whisperers",
      "href": "/"
    },
    "items": [
      {
        "text": "Inicio",
        "href": "/"
      },
      {
        "text": "Servicios",
        "href": "/servicios"
      },
      {
        "text": "Sobre Nosotros",
        "href": "/sobre-nosotros"
      },
      {
        "text": "Arquitectura",
        "href": "/architecture"
      },
      {
        "text": "Contacto",
        "href": "/contacto"
      }
    ],
    "cta": {
      "text": "Empezar Ahora",
      "href": "/contacto"
    }
  },
  "hero": {
    "headline": "Arquitectura del Sistema",
    "subheadline": "Visualización Interactiva EC4RO-HGN",
    "description": "Explorar nuestra arquitectura completa del sistema utilizando la metodología EC4RO-HGN - C4 Extendido con Orquestación Raíz y Navegación Jerárquica de Grafos."
  },
  "methodology": {
    "title": "Metodología EC4RO-HGN",
    "description": "Extended C4 with Root Orchestration and Hierarchical Graph Navigation",
    "levels": [
      {
        "level": -1,
        "title": "Orquestación Raíz",
        "description": "Artefactos de despliegue → Transformación del sistema en funcionamiento",
        "color": "from-red-500 to-red-600",
        "components": 4
      },
      {
        "level": 0,
        "title": "Arquitectura Maestra",
        "description": "Vista general de componentes del sistema con 78 vértices principales",
        "color": "from-blue-500 to-blue-600",
        "components": 25
      },
      {
        "level": 1,
        "title": "Sub-Grafos de Componentes",
        "description": "Arquitectura interna de componentes y métodos",
        "color": "from-green-500 to-green-600",
        "components": 32
      },
      {
        "level": 2,
        "title": "Detalle de Implementación",
        "description": "Granularidad a nivel de función y método",
        "color": "from-purple-500 to-purple-600",
        "components": 17
      }
    ]
  },
  "benefits": {
    "title": "Beneficios de la Arquitectura",
    "items": [
      {
        "title": "Visibilidad Completa",
        "description": "Desde la configuración de despliegue hasta los detalles de implementación, vea cada aspecto de nuestro sistema con divulgación progresiva controlada.",
        "icon": "Eye"
      },
      {
        "title": "Multi-Stakeholder",
        "description": "Diferentes niveles de detalle sirven a ejecutivos, arquitectos, desarrolladores y equipos DevOps con la profundidad de información apropiada.",
        "icon": "Users"
      },
      {
        "title": "Análisis Sistemático",
        "description": "El aislamiento de problemas basado en grafos permite la resolución sistemática de errores y el análisis integral de impacto en todas las capas del sistema.",
        "icon": "Search"
      }
    ]
  },
  "statistics": {
    "title": "Estadísticas de Arquitectura",
    "metrics": [
      {
        "value": "78",
        "description": "Componentes Totales"
      },
      {
        "value": "0",
        "description": "Dependencias Circulares"
      },
      {
        "value": "A-",
        "description": "Calificación de Arquitectura"
      },
      {
        "value": "100%",
        "description": "Cobertura"
      }
    ]
  },
  "navigation_help": {
    "title": "Cómo Navegar",
    "sections": [
      {
        "title": "Navegación por Niveles",
        "items": [
          "Haga clic en las pestañas de nivel para cambiar entre niveles de jerarquía",
          "Cada nivel muestra progresivamente más detalle",
          "Las migas de pan muestran su ruta de navegación actual"
        ]
      },
      {
        "title": "Interacción con Componentes",
        "items": [
          "Haga clic en los componentes para ver información detallada",
          "Las líneas punteadas muestran dependencias entre componentes",
          "La codificación por colores indica complejidad y estado"
        ]
      }
    ]
  },
  "footer": {
    "brand": {
      "text": "AI Whisperers"
    },
    "copyright": "© 2024 AI Whisperers. Todos los derechos reservados."
  },
  "meta": {
    "title": "Architecture - AI Whisperers",
    "description": "AI education and consulting services",
    "keywords": [
      "AI",
      "education"
    ],
    "language": "en"
  }
} as const;

export default architectureContent;
