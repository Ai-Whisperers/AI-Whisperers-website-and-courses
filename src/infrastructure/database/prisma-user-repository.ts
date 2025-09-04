// Infrastructure: Prisma User Repository Implementation
// Adapter implementing the UserRepository domain interface

import { PrismaClient } from '@prisma/client'
import { UserRepository } from '../../domain/interfaces/user-repository'
import { User, UserRole } from '../../domain/entities/user'
import { UserId } from '../../domain/value-objects/user-id'
import { DatabaseError } from '../../domain/errors/domain-errors'

export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: UserId): Promise<User | null> {
    try {
      const userData = await this.prisma.user.findUnique({
        where: { id: id.value }
      })

      return userData ? this.toDomainEntity(userData) : null
    } catch (error) {
      throw new DatabaseError('findById', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const userData = await this.prisma.user.findUnique({
        where: { email: email.toLowerCase() }
      })

      return userData ? this.toDomainEntity(userData) : null
    } catch (error) {
      throw new DatabaseError('findByEmail', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  async findAll(): Promise<User[]> {
    try {
      const usersData = await this.prisma.user.findMany({
        orderBy: { createdAt: 'desc' }
      })

      return usersData.map(userData => this.toDomainEntity(userData))
    } catch (error) {
      throw new DatabaseError('findAll', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  async findByRole(role: string): Promise<User[]> {
    try {
      const usersData = await this.prisma.user.findMany({
        where: { role: role as any },
        orderBy: { createdAt: 'desc' }
      })

      return usersData.map(userData => this.toDomainEntity(userData))
    } catch (error) {
      throw new DatabaseError('findByRole', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  async save(user: User): Promise<void> {
    try {
      const data = this.toPersistenceModel(user)

      await this.prisma.user.upsert({
        where: { id: user.id.value },
        create: data,
        update: {
          ...data,
          id: undefined // Don't update the ID
        }
      })
    } catch (error) {
      throw new DatabaseError('save', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  async delete(id: UserId): Promise<void> {
    try {
      await this.prisma.user.delete({
        where: { id: id.value }
      })
    } catch (error) {
      throw new DatabaseError('delete', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  async existsByEmail(email: string): Promise<boolean> {
    try {
      const count = await this.prisma.user.count({
        where: { email: email.toLowerCase() }
      })
      return count > 0
    } catch (error) {
      throw new DatabaseError('existsByEmail', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  async count(): Promise<number> {
    try {
      return await this.prisma.user.count()
    } catch (error) {
      throw new DatabaseError('count', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  async countByRole(role: string): Promise<number> {
    try {
      return await this.prisma.user.count({
        where: { role: role as any }
      })
    } catch (error) {
      throw new DatabaseError('countByRole', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  // Private mapping methods
  private toDomainEntity(data: any): User {
    return new User({
      id: UserId.fromString(data.id),
      email: data.email,
      name: data.name,
      role: data.role as UserRole,
      emailVerified: data.emailVerified,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    })
  }

  private toPersistenceModel(user: User): any {
    return {
      id: user.id.value,
      email: user.email,
      name: user.name,
      role: user.role,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }
  }
}