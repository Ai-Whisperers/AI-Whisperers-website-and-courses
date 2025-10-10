// Auto-generated content file - Do not edit manually
// Generated from: src/content/pages/contact.yml
// Language: EN

import type { PageContent } from '@/types/content';

export const contact_enContent: PageContent = {
  "meta": {
    "title": "Contact Us - Get in Touch | AI Whisperers",
    "description": "Contact the AI Whisperers team for course information, support, or partnership opportunities.",
    "keywords": [
      "contact AI Whisperers",
      "course support",
      "AI education help",
      "partnership opportunities"
    ],
    "language": "en"
  },
  "navigation": {
    "brand": {
      "text": "AI Whisperers"
    },
    "items": [
      {
        "text": "Home",
        "href": "/"
      },
      {
        "text": "Courses",
        "href": "/courses"
      },
      {
        "text": "About",
        "href": "/about"
      },
      {
        "text": "Contact",
        "href": "/contact"
      }
    ],
    "cta": {
      "text": "Get Started",
      "variant": "default"
    }
  },
  "hero": {
    "headline": "Get in Touch",
    "subheadline": "We're here to help with your AI learning journey",
    "description": "Have questions about our courses or need assistance? Our team is ready to help you succeed.",
    "location": "🌍 Available Worldwide",
    "primaryCta": {
      "text": "Send Message",
      "href": "#contact-form",
      "variant": "default"
    },
    "secondaryCta": {
      "text": "View FAQ",
      "href": "/faq",
      "variant": "outline"
    },
    "benefits": []
  },
  "contactOptions": {
    "title": "How to Reach Us",
    "description": "Choose your preferred contact method",
    "options": [
      {
        "icon": "Mail",
        "title": "Email Us",
        "description": "Get response within 24 hours",
        "value": "ai.whisperer.wvdp@gmail.com",
        "primaryMethod": true,
        "action": {
          "text": "Send Email",
          "href": "mailto:ai.whisperer.wvdp@gmail.com",
          "external": true
        }
      },
      {
        "icon": "Phone",
        "title": "Call Us",
        "description": "Monday-Friday, 9AM-6PM PST",
        "value": "+595 981 123456",
        "action": {
          "text": "Call Now",
          "href": "tel:+595 981 123456"
        }
      },
      {
        "icon": "MessageSquare",
        "title": "Live Chat",
        "description": "Chat with our support team",
        "value": "Available during business hours",
        "action": {
          "text": "Start Chat",
          "href": "#chat"
        }
      },
      {
        "icon": "Calendar",
        "title": "Schedule Meeting",
        "description": "Book a consultation call",
        "value": "15-30 minute sessions",
        "action": {
          "text": "Book Now",
          "href": "/schedule"
        }
      }
    ]
  },
  "officeInfo": {
    "title": "Our Location",
    "description": "Connect with us for AI consulting and training sessions",
    "address": {
      "street": "Av. General Santos",
      "neighborhood": "Innovation District",
      "city": "Asunción",
      "country": "Paraguay",
      "zipCode": "1209"
    },
    "workingHours": {
      "weekdays": "Monday - Friday: 9:00 AM - 5:00 PM (GMT-4)",
      "saturday": "Saturday: By appointment only",
      "sunday": "Sunday: Closed"
    },
    "map": {
      "embedUrl": "https://maps.google.com/placeholder"
    }
  },
  "consultationForm": {
    "title": "Request a Consultation",
    "description": "Fill out the form below and we'll get back to you within 24 hours",
    "fields": [
      {
        "name": "name",
        "label": "Full Name",
        "type": "text",
        "required": true,
        "placeholder": "John Doe"
      },
      {
        "name": "email",
        "label": "Email Address",
        "type": "email",
        "required": true,
        "placeholder": "john@example.com"
      },
      {
        "name": "subject",
        "label": "Subject",
        "type": "select",
        "required": true,
        "options": [
          "Course Information",
          "Technical Support",
          "Corporate Training",
          "Partnership Inquiry",
          "General Question"
        ]
      },
      {
        "name": "message",
        "label": "Message",
        "type": "textarea",
        "required": true,
        "rows": 5,
        "placeholder": "Tell us how we can help..."
      }
    ],
    "submitButton": {
      "text": "Send Message",
      "loadingText": "Sending..."
    },
    "privacyNote": "We respect your privacy and will never share your information"
  },
  "faq": {
    "title": "Frequently Asked Questions",
    "items": [
      {
        "question": "What are your response times?",
        "answer": "We respond to all inquiries within 24 business hours."
      },
      {
        "question": "Do you offer phone support?",
        "answer": "Yes, phone support is available Monday-Friday, 9AM-6PM PST."
      },
      {
        "question": "Can I schedule a consultation?",
        "answer": "Absolutely! Use our booking system to schedule a free 30-minute consultation."
      }
    ]
  },
  "socialProof": {
    "title": "Professional AI Consulting",
    "description": "Empowering businesses with practical artificial intelligence solutions",
    "stats": [
      {
        "value": "Expert Team",
        "label": "AI Strategy & Implementation"
      },
      {
        "value": "Global Reach",
        "label": "Worldwide Service"
      },
      {
        "value": "Fast Response",
        "label": "24-Hour Support"
      }
    ],
    "testimonials": [
      {
        "quote": "Placeholder testimonial 1.",
        "author": "Testimonial 1",
        "company": "Company 1"
      },
      {
        "quote": "Placeholder testimonial 2.",
        "author": "Placeholder testimonial 2",
        "company": "Company 2"
      }
    ]
  },
  "footer": {
    "brand": {
      "text": "AI Whisperers"
    },
    "copyright": "© 2025 AI Whisperers. All rights reserved."
  }
} as const;

export default contact_enContent;
