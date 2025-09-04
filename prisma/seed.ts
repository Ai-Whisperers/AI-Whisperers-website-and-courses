import { PrismaClient, Difficulty, UserRole } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

// Course data extracted from documentation repository
const coursesData = [
  {
    title: "AI Foundations - First Steps",
    slug: "ai-foundations",
    description: "Complete beginners course with no-code practical AI mastery. Learn fundamental AI concepts and applications with hands-on workshops.",
    price: 29900, // $299.00 in cents
    duration: 720, // 12 hours in minutes
    difficulty: Difficulty.BEGINNER,
    published: true,
    featured: true,
    metaTitle: "AI Foundations Course - Learn AI Without Coding",
    metaDescription: "Master AI fundamentals with our beginner-friendly course. No coding required. 65% cost savings vs university programs.",
    learningObjectives: [
      "Understand fundamental AI concepts and applications",
      "Use no-code AI tools effectively for practical tasks", 
      "Evaluate AI outputs for quality, bias, and appropriateness",
      "Create AI-assisted projects demonstrating learned skills",
      "Make informed decisions about AI tool adoption"
    ],
    prerequisites: ["Basic computer literacy", "No programming experience required"],
    modules: [
      {
        title: "Introduction to AI",
        description: "Understanding what AI is and its real-world applications",
        order: 1,
        duration: 120,
        lessons: [
          {
            title: "What is Artificial Intelligence?",
            description: "Core concepts and definitions",
            content: "# What is Artificial Intelligence?\n\nArtificial Intelligence (AI) represents...",
            order: 1,
            duration: 30
          },
          {
            title: "Types of AI Systems",
            description: "Understanding different AI categories", 
            content: "# Types of AI Systems\n\nAI systems can be categorized...",
            order: 2,
            duration: 45
          }
        ]
      },
      {
        title: "No-Code AI Tools",
        description: "Hands-on experience with AI tools that require no programming",
        order: 2,
        duration: 180,
        lessons: [
          {
            title: "ChatGPT and Language Models",
            description: "Mastering conversational AI",
            content: "# ChatGPT and Language Models\n\nLearn to effectively use...",
            order: 1,
            duration: 60
          }
        ]
      }
    ]
  },
  {
    title: "Applied AI - APIs to Projects",
    slug: "applied-ai",
    description: "Technical professionals course focusing on API integration, data processing, and complete application development with AI.",
    price: 59900, // $599.00 in cents
    duration: 900, // 15 hours in minutes
    difficulty: Difficulty.INTERMEDIATE,
    published: true,
    featured: true,
    metaTitle: "Applied AI Course - API Integration & Projects",
    metaDescription: "Build real AI applications. Learn API integration, data processing, and deployment. 40% below bootcamp prices.",
    learningObjectives: [
      "Integrate multiple AI APIs with proper error handling",
      "Process various data formats for AI analysis", 
      "Build complete AI applications from concept to deployment",
      "Implement multilingual text analysis systems",
      "Create production-ready data processing pipelines"
    ],
    prerequisites: ["Basic programming knowledge", "Familiarity with APIs", "Understanding of data formats"],
    modules: [
      {
        title: "AI API Fundamentals",
        description: "Understanding and integrating AI APIs",
        order: 1,
        duration: 180,
        lessons: [
          {
            title: "OpenAI API Integration",
            description: "Working with GPT models via API",
            content: "# OpenAI API Integration\n\nLearn to integrate OpenAI's powerful APIs...",
            order: 1,
            duration: 60
          }
        ]
      }
    ]
  },
  {
    title: "AI-Powered Web Apps",
    slug: "ai-web-development", 
    description: "Advanced course for web developers pursuing AI specialization. Build full-stack AI applications with modern frameworks.",
    price: 129900, // $1,299.00 in cents
    duration: 1260, // 21 hours in minutes
    difficulty: Difficulty.ADVANCED,
    published: true,
    featured: true,
    metaTitle: "AI Web Development Course - Full Stack AI Apps",
    metaDescription: "Build production AI web applications. Next.js, React, TypeScript, real-time streaming. 60% below specialized programs.",
    learningObjectives: [
      "Develop full-stack AI applications using modern frameworks",
      "Implement real-time AI features with streaming responses",
      "Deploy scalable applications to production environments", 
      "Create accessible, responsive AI user interfaces",
      "Apply advanced testing and monitoring strategies"
    ],
    prerequisites: ["Proficiency in JavaScript/TypeScript", "React experience", "Understanding of web development"],
    modules: [
      {
        title: "Modern AI Web Architecture",
        description: "Building scalable AI web applications",
        order: 1,
        duration: 240,
        lessons: [
          {
            title: "Next.js for AI Applications",
            description: "Leveraging Next.js for AI-powered sites",
            content: "# Next.js for AI Applications\n\nDiscover how to build...",
            order: 1,
            duration: 90
          }
        ]
      }
    ]
  },
  {
    title: "Enterprise AI Business",
    slug: "enterprise-ai",
    description: "Executive-level course covering AI transformation strategy, ROI frameworks, governance models, and organizational change management.",
    price: 179900, // $1,799.00 in cents  
    duration: 1050, // 17.5 hours in minutes
    difficulty: Difficulty.EXPERT,
    published: true,
    featured: true,
    metaTitle: "Enterprise AI Strategy Course - Executive Education", 
    metaDescription: "Master AI business strategy. ROI frameworks, governance, change management. 90% below executive education equivalents.",
    learningObjectives: [
      "Develop comprehensive AI transformation strategies",
      "Create detailed ROI models and business cases",
      "Design AI governance and ethics frameworks",
      "Lead organizational change for AI adoption",
      "Present AI strategies to executive stakeholders"
    ],
    prerequisites: ["Senior management experience", "Understanding of business strategy", "Leadership responsibilities"],
    modules: [
      {
        title: "AI Strategy Framework",
        description: "Developing comprehensive AI business strategies",
        order: 1,
        duration: 210,
        lessons: [
          {
            title: "AI Opportunity Assessment",
            description: "Identifying AI opportunities in your business",
            content: "# AI Opportunity Assessment\n\nLearn systematic approaches...",
            order: 1,
            duration: 75
          }
        ]
      }
    ]
  }
]

async function createAdminUser() {
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@aiwhisperers.com' },
    update: {},
    create: {
      email: 'admin@aiwhisperers.com',
      name: 'AI Whisperers Admin',
      role: UserRole.ADMIN,
      emailVerified: new Date()
    }
  })
  
  console.log('✅ Created admin user:', adminUser.email)
  return adminUser
}

async function seedCourses() {
  console.log('🌱 Seeding courses...')
  
  for (const courseData of coursesData) {
    const { modules, ...courseFields } = courseData
    
    const course = await prisma.course.upsert({
      where: { slug: courseFields.slug },
      update: courseFields,
      create: courseFields
    })
    
    console.log(`✅ Created course: ${course.title}`)
    
    // Create modules for the course
    for (const moduleData of modules) {
      const { lessons, ...moduleFields } = moduleData
      
      const module = await prisma.module.upsert({
        where: { 
          courseId_order: {
            courseId: course.id,
            order: moduleFields.order
          }
        },
        update: moduleFields,
        create: {
          ...moduleFields,
          courseId: course.id
        }
      })
      
      console.log(`  ✅ Created module: ${module.title}`)
      
      // Create lessons for the module
      for (const lessonData of lessons) {
        const lesson = await prisma.lesson.upsert({
          where: {
            moduleId_order: {
              moduleId: module.id,
              order: lessonData.order
            }
          },
          update: lessonData,
          create: {
            ...lessonData,
            moduleId: module.id
          }
        })
        
        console.log(`    ✅ Created lesson: ${lesson.title}`)
      }
    }
  }
  
  console.log('🎉 Course seeding completed!')
}

async function main() {
  try {
    console.log('🚀 Starting database seed...')
    
    await createAdminUser()
    await seedCourses()
    
    console.log('✨ Database seeded successfully!')
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })