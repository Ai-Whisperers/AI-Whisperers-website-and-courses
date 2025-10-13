/**
 * Prisma User Repository Implementation
 * Concrete implementation of UserRepository interface using Prisma ORM
 *
 * This adapter bridges the domain layer with the database layer,
 * converting between Prisma User models and domain User entities.
 */

import { PrismaClient, User as PrismaUser, UserRole as PrismaUserRole } from '@prisma/client'
import { UserRepository } from '@/domain/interfaces/user-repository'
import { User, UserRole } from '@/domain/entities/user'
import { UserId } from '@/domain/value-objects/user-id'

export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Find user by ID
   */
  async findById(id: UserId): Promise<User | null> {
    const prismaUser = await this.prisma.user.findUnique({
      where: { id: id.value },
    })

    return prismaUser ? this.toDomain(prismaUser) : null
  }

  /**
   * Find user by email (unique identifier for authentication)
   */
  async findByEmail(email: string): Promise<User | null> {
    const prismaUser = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    })

    return prismaUser ? this.toDomain(prismaUser) : null
  }

  /**
   * Find all users
   */
  async findAll(): Promise<User[]> {
    const prismaUsers = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return prismaUsers.map(user => this.toDomain(user))
  }

  /**
   * Find users by role (Student, Instructor, Admin)
   */
  async findByRole(role: string): Promise<User[]> {
    const prismaUsers = await this.prisma.user.findMany({
      where: { role: role as PrismaUserRole },
      orderBy: { createdAt: 'desc' },
    })

    return prismaUsers.map(user => this.toDomain(user))
  }

  /**
   * Save user (create or update)
   * Uses upsert to handle both cases
   */
  async save(user: User): Promise<void> {
    const prismaData = this.toPrisma(user)

    await this.prisma.user.upsert({
      where: { id: user.id.value },
      create: prismaData,
      update: prismaData,
    })
  }

  /**
   * Delete user by ID
   * Note: This will cascade delete related enrollments, progress, etc.
   */
  async delete(id: UserId): Promise<void> {
    await this.prisma.user.delete({
      where: { id: id.value },
    })
  }

  /**
   * Check if user with email exists
   * Useful for email uniqueness validation during registration
   */
  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: { email: email.toLowerCase().trim() },
    })

    return count > 0
  }

  /**
   * Count total users
   */
  async count(): Promise<number> {
    return this.prisma.user.count()
  }

  /**
   * Count users by role
   */
  async countByRole(role: string): Promise<number> {
    return this.prisma.user.count({
      where: { role: role as PrismaUserRole },
    })
  }

  // ============================================================================
  // Mapper Methods: Prisma ↔ Domain
  // ============================================================================

  /**
   * Convert Prisma model to Domain entity
   */
  private toDomain(prismaUser: PrismaUser): User {
    return new User({
      id: new UserId(prismaUser.id),
      email: prismaUser.email,
      name: prismaUser.name || undefined,
      role: this.mapRole(prismaUser.role),
      emailVerified: prismaUser.emailVerified || undefined,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
    })
  }

  /**
   * Convert Domain entity to Prisma model data
   */
  private toPrisma(user: User) {
    return {
      id: user.id.value,
      email: user.email,
      name: user.name || null,
      role: user.role as PrismaUserRole,
      emailVerified: user.emailVerified || null,
      // Prisma handles timestamps automatically, but we can override if needed
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  }

  /**
   * Map Prisma role enum to Domain role enum
   */
  private mapRole(prismaRole: PrismaUserRole): UserRole {
    switch (prismaRole) {
      case 'STUDENT':
        return UserRole.STUDENT
      case 'INSTRUCTOR':
        return UserRole.INSTRUCTOR
      case 'ADMIN':
        return UserRole.ADMIN
      default:
        throw new Error(`Unknown user role: ${prismaRole}`)
    }
  }
}

/**
 * Factory function to create repository instance
 * This is useful for dependency injection
 */
export function createPrismaUserRepository(prisma: PrismaClient): UserRepository {
  return new PrismaUserRepository(prisma)
}
