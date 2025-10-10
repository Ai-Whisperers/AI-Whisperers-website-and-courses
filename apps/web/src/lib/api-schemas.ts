/**
 * API Request/Response Validation Schemas
 * Using Zod for type-safe validation
 */

import { z } from 'zod'

// Course Query Parameters
export const CourseQuerySchema = z.object({
  published: z.boolean().optional(),
  featured: z.boolean().optional(),
  difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']).optional(),
  limit: z.number().int().positive().max(100).optional(),
  offset: z.number().int().nonnegative().optional(),
})

export type CourseQuery = z.infer<typeof CourseQuerySchema>

// Course Slug Parameter
export const CourseSlugSchema = z.object({
  slug: z.string().min(1).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
})

export type CourseSlugParam = z.infer<typeof CourseSlugSchema>

// Content Page Name Parameter
export const ContentPageSchema = z.object({
  pageName: z.enum([
    'homepage',
    'about',
    'contact',
    'services',
    'solutions',
    'faq',
    'privacy',
    'terms',
    'architecture',
  ]),
})

export type ContentPageName = z.infer<typeof ContentPageSchema>

// Helper function to parse query parameters
export function parseQueryParams<T>(
  searchParams: URLSearchParams,
  schema: z.ZodSchema<T>
): { success: true; data: T } | { success: false; error: z.ZodError } {
  const params: Record<string, any> = {}

  searchParams.forEach((value, key) => {
    // Convert boolean strings
    if (value === 'true') params[key] = true
    else if (value === 'false') params[key] = false
    // Convert numbers
    else if (!isNaN(Number(value))) params[key] = Number(value)
    // Keep as string
    else params[key] = value
  })

  const result = schema.safeParse(params)
  return result.success 
    ? { success: true, data: result.data }
    : { success: false, error: result.error }
}

// API Error Response
export const ApiErrorSchema = z.object({
  error: z.string(),
  message: z.string().optional(),
  details: z.any().optional(),
})

export type ApiError = z.infer<typeof ApiErrorSchema>
