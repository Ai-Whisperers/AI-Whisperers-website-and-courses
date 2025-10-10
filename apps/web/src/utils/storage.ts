/**
 * Unified Storage Utility
 * Centralized localStorage/sessionStorage management with SSR safety
 * Supports encryption for sensitive data and LZ-string compression
 */

import { compress, decompress } from 'lz-string'

// Storage namespace prefixes for different contexts
export const STORAGE_KEYS = {
  SECURITY: 'aiw_security',
  PRESENTATION: 'aiw_presentation',
  LOGIC: 'aiw_logic',
  I18N: 'aiw_i18n',
} as const

export type StorageNamespace = keyof typeof STORAGE_KEYS

/**
 * SSR-safe check if we're in browser environment
 */
export const isBrowser = (): boolean => {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined'
}

/**
 * Get item from localStorage with SSR safety
 */
export function getStorageItem<T>(
  namespace: StorageNamespace,
  key: string,
  defaultValue: T,
  useCompression = false
): T {
  if (!isBrowser()) {
    return defaultValue
  }

  try {
    const namespaceKey = `${STORAGE_KEYS[namespace]}_${key}`
    let item = localStorage.getItem(namespaceKey)

    if (!item) {
      return defaultValue
    }

    // Decompress if compression was used
    if (useCompression) {
      const decompressed = decompress(item)
      if (!decompressed) {
        return defaultValue
      }
      item = decompressed
    }

    return JSON.parse(item) as T
  } catch (error) {
    console.warn(`[Storage] Failed to get ${namespace}.${key}:`, error)
    return defaultValue
  }
}

/**
 * Set item in localStorage with SSR safety and optional compression
 */
export function setStorageItem<T>(
  namespace: StorageNamespace,
  key: string,
  value: T,
  useCompression = false
): boolean {
  if (!isBrowser()) {
    return false
  }

  try {
    const namespaceKey = `${STORAGE_KEYS[namespace]}_${key}`
    let serialized = JSON.stringify(value)

    // Compress if requested (useful for large objects)
    if (useCompression) {
      serialized = compress(serialized)
    }

    localStorage.setItem(namespaceKey, serialized)

    // Broadcast change to other tabs
    broadcastStorageChange(namespace, key, value)

    return true
  } catch (error) {
    console.warn(`[Storage] Failed to set ${namespace}.${key}:`, error)
    return false
  }
}

/**
 * Remove item from localStorage with SSR safety
 */
export function removeStorageItem(
  namespace: StorageNamespace,
  key: string
): boolean {
  if (!isBrowser()) {
    return false
  }

  try {
    const namespaceKey = `${STORAGE_KEYS[namespace]}_${key}`
    localStorage.removeItem(namespaceKey)

    // Broadcast removal to other tabs
    broadcastStorageChange(namespace, key, null)

    return true
  } catch (error) {
    console.warn(`[Storage] Failed to remove ${namespace}.${key}:`, error)
    return false
  }
}

/**
 * Clear all items in a namespace
 */
export function clearNamespace(namespace: StorageNamespace): boolean {
  if (!isBrowser()) {
    return false
  }

  try {
    const prefix = STORAGE_KEYS[namespace]
    const keysToRemove: string[] = []

    // Find all keys with this namespace prefix
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith(prefix)) {
        keysToRemove.push(key)
      }
    }

    // Remove all found keys
    keysToRemove.forEach(key => localStorage.removeItem(key))

    return true
  } catch (error) {
    console.warn(`[Storage] Failed to clear namespace ${namespace}:`, error)
    return false
  }
}

/**
 * Listen for storage changes from other tabs
 */
export function onStorageChange(
  namespace: StorageNamespace,
  callback: (key: string, value: any) => void
): () => void {
  if (!isBrowser()) {
    return () => {}
  }

  const handleStorageChange = (event: StorageEvent) => {
    if (!event.key || !event.key.startsWith(STORAGE_KEYS[namespace])) {
      return
    }

    const key = event.key.replace(`${STORAGE_KEYS[namespace]}_`, '')

    try {
      const value = event.newValue ? JSON.parse(event.newValue) : null
      callback(key, value)
    } catch (error) {
      console.warn('[Storage] Failed to parse storage change:', error)
    }
  }

  window.addEventListener('storage', handleStorageChange)

  return () => {
    window.removeEventListener('storage', handleStorageChange)
  }
}

/**
 * Broadcast storage change to other tabs using BroadcastChannel
 */
function broadcastStorageChange(
  namespace: StorageNamespace,
  key: string,
  value: any
): void {
  if (!isBrowser() || typeof BroadcastChannel === 'undefined') {
    return
  }

  try {
    const channel = new BroadcastChannel(`storage_${namespace}`)
    channel.postMessage({ key, value })
    channel.close()
  } catch (error) {
    // BroadcastChannel not supported, fall back to storage events
    console.debug('[Storage] BroadcastChannel not available, using storage events')
  }
}

/**
 * Simple encryption for sensitive data (base64 encoding)
 * NOTE: This is NOT cryptographically secure - just obfuscation
 * For real security, use proper encryption libraries
 */
export function encryptData(data: string): string {
  if (!isBrowser()) {
    return data
  }
  return btoa(data)
}

/**
 * Simple decryption for sensitive data (base64 decoding)
 */
export function decryptData(encrypted: string): string {
  if (!isBrowser()) {
    return encrypted
  }
  try {
    return atob(encrypted)
  } catch {
    return encrypted
  }
}

/**
 * Get encrypted item from storage
 */
export function getEncryptedItem<T>(
  namespace: StorageNamespace,
  key: string,
  defaultValue: T
): T {
  const encrypted = getStorageItem<string>(namespace, key, '')

  if (!encrypted) {
    return defaultValue
  }

  try {
    const decrypted = decryptData(encrypted)
    return JSON.parse(decrypted) as T
  } catch {
    return defaultValue
  }
}

/**
 * Set encrypted item in storage
 */
export function setEncryptedItem<T>(
  namespace: StorageNamespace,
  key: string,
  value: T
): boolean {
  try {
    const serialized = JSON.stringify(value)
    const encrypted = encryptData(serialized)
    return setStorageItem(namespace, key, encrypted)
  } catch {
    return false
  }
}
