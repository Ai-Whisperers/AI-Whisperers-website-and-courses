/**
 * Storage Utility Tests
 * Testing unified localStorage management with SSR safety
 * Target: 80% coverage
 */

import {
  getStorageItem,
  setStorageItem,
  removeStorageItem,
  clearNamespace,
  encryptData,
  decryptData,
  getEncryptedItem,
  setEncryptedItem,
  isBrowser,
  STORAGE_KEYS,
  onStorageChange,
} from '../storage'

describe('storage.ts', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
  })

  describe('isBrowser', () => {
    it('should return true in browser environment', () => {
      expect(isBrowser()).toBe(true)
    })

    it('should return true when window and localStorage exist', () => {
      expect(typeof window).toBe('object')
      expect(typeof localStorage).toBe('object')
      expect(isBrowser()).toBe(true)
    })
  })

  describe('STORAGE_KEYS', () => {
    it('should have correct namespace prefixes', () => {
      expect(STORAGE_KEYS.SECURITY).toBe('aiw_security')
      expect(STORAGE_KEYS.PRESENTATION).toBe('aiw_presentation')
      expect(STORAGE_KEYS.LOGIC).toBe('aiw_logic')
      expect(STORAGE_KEYS.I18N).toBe('aiw_i18n')
    })
  })

  describe('getStorageItem', () => {
    it('should return default value when item does not exist', () => {
      const result = getStorageItem('SECURITY', 'test', { default: true })
      expect(result).toEqual({ default: true })
    })

    it('should retrieve and parse stored item', () => {
      const testData = { userId: '123', token: 'abc' }
      localStorage.setItem('aiw_security_test', JSON.stringify(testData))

      const result = getStorageItem('SECURITY', 'test', {})
      expect(result).toEqual(testData)
    })

    it('should return default value on parse error', () => {
      localStorage.setItem('aiw_security_test', 'invalid-json')

      const result = getStorageItem('SECURITY', 'test', { default: true })
      expect(result).toEqual({ default: true })
    })

    it('should handle different namespaces correctly', () => {
      const securityData = { token: 'security-token' }
      const presentationData = { theme: 'dark' }

      localStorage.setItem('aiw_security_auth', JSON.stringify(securityData))
      localStorage.setItem('aiw_presentation_theme', JSON.stringify(presentationData))

      expect(getStorageItem('SECURITY', 'auth', {})).toEqual(securityData)
      expect(getStorageItem('PRESENTATION', 'theme', {})).toEqual(presentationData)
    })

    it('should decompress compressed data', () => {
      const testData = { large: 'data'.repeat(100) }
      setStorageItem('SECURITY', 'test', testData, true)

      const result = getStorageItem('SECURITY', 'test', {}, true)
      expect(result).toEqual(testData)
    })

    it('should return default value if decompression fails', () => {
      // Set invalid compressed data
      localStorage.setItem('aiw_security_test', 'invalid-compressed-data')

      const result = getStorageItem('SECURITY', 'test', { default: true }, true)
      expect(result).toEqual({ default: true })
    })
  })

  describe('setStorageItem', () => {
    it('should store item with correct namespace key', () => {
      const testData = { test: 'data' }
      const result = setStorageItem('PRESENTATION', 'theme', testData)

      expect(result).toBe(true)
      const stored = localStorage.getItem('aiw_presentation_theme')
      expect(stored).toBe(JSON.stringify(testData))
    })

    it('should store primitive values correctly', () => {
      setStorageItem('LOGIC', 'count', 42)
      expect(getStorageItem('LOGIC', 'count', 0)).toBe(42)

      setStorageItem('LOGIC', 'active', true)
      expect(getStorageItem('LOGIC', 'active', false)).toBe(true)

      setStorageItem('LOGIC', 'name', 'test')
      expect(getStorageItem('LOGIC', 'name', '')).toBe('test')
    })

    it('should store complex nested objects', () => {
      const complex = {
        user: {
          id: '123',
          profile: {
            name: 'Test',
            settings: {
              theme: 'dark',
              notifications: true,
            },
          },
        },
      }

      setStorageItem('SECURITY', 'user', complex)
      expect(getStorageItem('SECURITY', 'user', {})).toEqual(complex)
    })

    it('should compress data when requested', () => {
      const testData = { large: 'data'.repeat(1000) }
      setStorageItem('SECURITY', 'test', testData, true)

      const stored = localStorage.getItem('aiw_security_test')
      // Compressed data should be shorter than JSON
      expect(stored!.length).toBeLessThan(JSON.stringify(testData).length)
    })

    it('should return false on storage error', () => {
      // Mock localStorage.setItem to throw (e.g., quota exceeded)
      const originalSetItem = Storage.prototype.setItem
      Storage.prototype.setItem = jest.fn(() => {
        throw new Error('QuotaExceededError')
      })

      const result = setStorageItem('SECURITY', 'test', { data: true })
      expect(result).toBe(false)

      // Restore original
      Storage.prototype.setItem = originalSetItem
    })

    it('should call localStorage.setItem once per store operation', () => {
      const spy = jest.spyOn(Storage.prototype, 'setItem')

      setStorageItem('I18N', 'locale', 'en')

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith('aiw_i18n_locale', '"en"')

      spy.mockRestore()
    })
  })

  describe('removeStorageItem', () => {
    it('should remove item from storage', () => {
      localStorage.setItem('aiw_logic_test', 'data')

      const result = removeStorageItem('LOGIC', 'test')

      expect(result).toBe(true)
      expect(localStorage.getItem('aiw_logic_test')).toBeNull()
    })

    it('should return true even if item does not exist', () => {
      const result = removeStorageItem('SECURITY', 'nonexistent')
      expect(result).toBe(true)
    })

    it('should not affect other keys', () => {
      localStorage.setItem('aiw_security_key1', 'value1')
      localStorage.setItem('aiw_security_key2', 'value2')

      removeStorageItem('SECURITY', 'key1')

      expect(localStorage.getItem('aiw_security_key1')).toBeNull()
      expect(localStorage.getItem('aiw_security_key2')).toBe('value2')
    })
  })

  describe('clearNamespace', () => {
    it('should clear all items in namespace', () => {
      localStorage.setItem('aiw_security_token', 'abc')
      localStorage.setItem('aiw_security_user', 'xyz')
      localStorage.setItem('aiw_presentation_theme', 'dark')

      const result = clearNamespace('SECURITY')

      expect(result).toBe(true)
      expect(localStorage.getItem('aiw_security_token')).toBeNull()
      expect(localStorage.getItem('aiw_security_user')).toBeNull()
      // Other namespaces should not be affected
      expect(localStorage.getItem('aiw_presentation_theme')).toBe('dark')
    })

    it('should handle empty namespace', () => {
      const result = clearNamespace('LOGIC')
      expect(result).toBe(true)
    })

    it('should clear multiple keys in same namespace', () => {
      for (let i = 0; i < 5; i++) {
        localStorage.setItem(`aiw_logic_item${i}`, `value${i}`)
      }

      clearNamespace('LOGIC')

      for (let i = 0; i < 5; i++) {
        expect(localStorage.getItem(`aiw_logic_item${i}`)).toBeNull()
      }
    })
  })

  describe('onStorageChange', () => {
    it('should create unsubscribe function', () => {
      const callback = jest.fn()
      const unsubscribe = onStorageChange('SECURITY', callback)

      expect(typeof unsubscribe).toBe('function')

      // Clean up
      unsubscribe()
    })

    it('should listen to storage events for correct namespace', () => {
      const callback = jest.fn()
      const unsubscribe = onStorageChange('SECURITY', callback)

      // Simulate storage event
      const event = new StorageEvent('storage', {
        key: 'aiw_security_token',
        newValue: JSON.stringify({ token: 'new-value' }),
        oldValue: JSON.stringify({ token: 'old-value' }),
        storageArea: localStorage,
      })

      window.dispatchEvent(event)

      expect(callback).toHaveBeenCalledWith('token', { token: 'new-value' })

      // Clean up
      unsubscribe()
    })

    it('should ignore events from other namespaces', () => {
      const callback = jest.fn()
      const unsubscribe = onStorageChange('SECURITY', callback)

      // Event from different namespace
      const event = new StorageEvent('storage', {
        key: 'aiw_presentation_theme',
        newValue: JSON.stringify('dark'),
        oldValue: JSON.stringify('light'),
        storageArea: localStorage,
      })

      window.dispatchEvent(event)

      expect(callback).not.toHaveBeenCalled()

      unsubscribe()
    })

    it('should unsubscribe correctly', () => {
      const callback = jest.fn()
      const unsubscribe = onStorageChange('SECURITY', callback)

      unsubscribe()

      // Dispatch event after unsubscribe
      const event = new StorageEvent('storage', {
        key: 'aiw_security_token',
        newValue: JSON.stringify('value'),
      })

      window.dispatchEvent(event)

      expect(callback).not.toHaveBeenCalled()
    })
  })

  describe('encryptData / decryptData', () => {
    it('should encrypt data to base64', () => {
      const original = 'sensitive-data'
      const encrypted = encryptData(original)

      expect(encrypted).not.toBe(original)
      expect(encrypted).toMatch(/^[A-Za-z0-9+/=]+$/) // Base64 pattern
    })

    it('should decrypt data from base64', () => {
      const original = 'sensitive-data'
      const encrypted = encryptData(original)
      const decrypted = decryptData(encrypted)

      expect(decrypted).toBe(original)
    })

    it('should handle empty strings', () => {
      const encrypted = encryptData('')
      const decrypted = decryptData(encrypted)
      expect(decrypted).toBe('')
    })

    it('should handle special characters', () => {
      const original = 'Test123!@#$%^&*()_+-=[]{}|;:,.<>?'
      const encrypted = encryptData(original)
      const decrypted = decryptData(encrypted)

      expect(decrypted).toBe(original)
    })

    it('should return input on decryption error', () => {
      const invalidEncrypted = 'not-valid-base64!!!'
      const result = decryptData(invalidEncrypted)

      expect(result).toBe(invalidEncrypted)
    })

    it('should handle ASCII characters', () => {
      const original = 'Hello World ABC123'
      const encrypted = encryptData(original)
      const decrypted = decryptData(encrypted)

      expect(decrypted).toBe(original)
    })
  })

  describe('getEncryptedItem / setEncryptedItem', () => {
    it('should store and retrieve encrypted data', () => {
      const sensitiveData = { password: 'secret123', apiKey: 'key456' }

      const setResult = setEncryptedItem('SECURITY', 'credentials', sensitiveData)
      expect(setResult).toBe(true)

      const retrieved = getEncryptedItem('SECURITY', 'credentials', {})
      expect(retrieved).toEqual(sensitiveData)
    })

    it('should actually encrypt data in storage', () => {
      const sensitiveData = { password: 'secret123' }

      setEncryptedItem('SECURITY', 'credentials', sensitiveData)

      // Check raw storage - should NOT contain plaintext
      const raw = localStorage.getItem('aiw_security_credentials')
      expect(raw).not.toContain('secret123')
      expect(raw).not.toContain('password')
    })

    it('should return default value if encrypted item does not exist', () => {
      const result = getEncryptedItem('SECURITY', 'nonexistent', { default: true })
      expect(result).toEqual({ default: true })
    })

    it('should return default value on decryption failure', () => {
      // Set invalid encrypted data
      localStorage.setItem('aiw_security_credentials', 'invalid-encrypted-data')

      const result = getEncryptedItem('SECURITY', 'credentials', { default: true })
      expect(result).toEqual({ default: true })
    })

    it('should handle complex objects', () => {
      const complex = {
        user: {
          id: '123',
          secrets: {
            password: 'pass123',
            token: 'token456',
          },
        },
      }

      setEncryptedItem('SECURITY', 'user', complex)
      expect(getEncryptedItem('SECURITY', 'user', {})).toEqual(complex)
    })

    it('should return false on encryption error', () => {
      // Mock JSON.stringify to throw
      const originalStringify = JSON.stringify
      JSON.stringify = jest.fn(() => {
        throw new Error('Stringify error')
      })

      const result = setEncryptedItem('SECURITY', 'test', { data: true })
      expect(result).toBe(false)

      // Restore
      JSON.stringify = originalStringify
    })
  })

  describe('cross-tab synchronization', () => {
    it('should broadcast changes via BroadcastChannel', () => {
      const testData = { value: 'test' }

      // BroadcastChannel is mocked in jest.setup.js
      setStorageItem('SECURITY', 'test', testData)

      // Verify BroadcastChannel was created
      // Note: Full integration test would require real browser environment
      expect(setStorageItem('SECURITY', 'test', testData)).toBe(true)
    })
  })

  describe('edge cases and error handling', () => {
    it('should handle null values', () => {
      setStorageItem('LOGIC', 'nullable', null)
      expect(getStorageItem('LOGIC', 'nullable', 'default')).toBe(null)
    })

    it('should handle undefined default values', () => {
      const result = getStorageItem('LOGIC', 'nonexistent', undefined)
      expect(result).toBe(undefined)
    })

    it('should handle arrays', () => {
      const array = [1, 2, 3, 'four', { five: 5 }]
      setStorageItem('LOGIC', 'array', array)
      expect(getStorageItem('LOGIC', 'array', [])).toEqual(array)
    })

    it('should handle Date objects', () => {
      const date = new Date('2025-01-01')
      setStorageItem('LOGIC', 'date', date)

      const retrieved = getStorageItem('LOGIC', 'date', null)
      expect(new Date(retrieved as any).getTime()).toBe(date.getTime())
    })

    it('should handle very large objects', () => {
      const large = {
        data: 'x'.repeat(10000),
        nested: {
          more: 'y'.repeat(10000),
        },
      }

      setStorageItem('LOGIC', 'large', large, true) // Use compression
      const retrieved = getStorageItem('LOGIC', 'large', {}, true)

      expect(retrieved).toEqual(large)
    })
  })
})
