// Domain Interface: UserRepository  
// Port defining the contract for user persistence

import { User } from '../entities/user'
import { UserId } from '../value-objects/user-id'

export interface UserRepository {
  // Query methods
  findById(id: UserId): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  findAll(): Promise<User[]>
  findByRole(role: string): Promise<User[]>
  
  // Command methods
  save(user: User): Promise<void>
  delete(id: UserId): Promise<void>
  
  // Utility methods
  existsByEmail(email: string): Promise<boolean>
  count(): Promise<number>
  countByRole(role: string): Promise<number>
}