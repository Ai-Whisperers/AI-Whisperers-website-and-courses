// Auto-generated content file - Do not edit manually
// Generated from: src/content/pages/contacto.yml

import type { PageContent } from '@/types/content';

export const contactoContent: PageContent = {
  "meta": {
    "title": "Contacto - Ponte en Contacto | AI Whisperers",
    "description": "Contacta al equipo de AI Whisperers para información sobre cursos, soporte o oportunidades de asociación.",
    "keywords": [
      "contacto AI Whisperers",
      "soporte cursos",
      "ayuda educación AI",
      "oportunidades asociación"
    ],
    "language": "en"
  },
  "hero": {
    "title": "Ponte en Contacto",
    "subtitle": "Estamos aquí para ayudarte en tu camino de aprendizaje de IA",
    "description": "¿Tienes preguntas sobre nuestros cursos o necesitas asistencia? Nuestro equipo está listo para ayudarte a tener éxito."
  },
  "contact": {
    "email": "info@aiwhisperers.com",
    "phone": "+1 (555) 123-4567",
    "address": {
      "street": "123 Innovation Drive",
      "city": "Tech Valley",
      "state": "CA",
      "zip": "94000",
      "country": "USA"
    }
  },
  "departments": [
    {
      "title": "Soporte de Cursos",
      "email": "support@aiwhisperers.com",
      "description": "Soporte técnico y asistencia con cursos"
    },
    {
      "title": "Ventas e Inscripciones",
      "email": "sales@aiwhisperers.com",
      "description": "Información de cursos y asistencia con inscripciones"
    },
    {
      "title": "Entrenamiento Corporativo",
      "email": "corporate@aiwhisperers.com",
      "description": "Programas de entrenamiento personalizados para organizaciones"
    }
  ],
  "form": {
    "title": "Envíanos un mensaje",
    "subtitle": "Completa el formulario y te responderemos en 24 horas",
    "fields": [
      {
        "name": "name",
        "label": "Nombre Completo",
        "type": "text",
        "required": true
      },
      {
        "name": "email",
        "label": "Correo Electrónico",
        "type": "email",
        "required": true
      },
      {
        "name": "subject",
        "label": "Asunto",
        "type": "text",
        "required": true
      },
      {
        "name": "message",
        "label": "Mensaje",
        "type": "textarea",
        "required": true
      }
    ]
  }
} as const;

export default contactoContent;
