// Jest setup file - runs before each test file
import '@testing-library/jest-dom'

// =============================================================================
// Polyfill Edge Runtime Globals for API Routes
// =============================================================================

// Mock edge runtime globals for Next.js API routes
// These are required for testing API route handlers
if (typeof global.Request === 'undefined') {
  // Create minimal Request mock
  global.Request = class Request {
    constructor(input, init = {}) {
      this.url = typeof input === 'string' ? input : input.url
      this.method = init.method || 'GET'
      this.headers = new Map(Object.entries(init.headers || {}))
      this.body = init.body
    }
  }
}

if (typeof global.Response === 'undefined') {
  // Create minimal Response mock
  global.Response = class Response {
    constructor(body, init = {}) {
      this.body = body
      this.status = init.status || 200
      this.statusText = init.statusText || 'OK'
      this.headers = new Map(Object.entries(init.headers || {}))
    }

    async json() {
      return typeof this.body === 'string' ? JSON.parse(this.body) : this.body
    }

    async text() {
      return typeof this.body === 'string' ? this.body : JSON.stringify(this.body)
    }
  }
}

if (typeof global.Headers === 'undefined') {
  global.Headers = class Headers extends Map {
    constructor(init = {}) {
      super(Object.entries(init))
    }

    get(name) {
      return super.get(name.toLowerCase())
    }

    set(name, value) {
      return super.set(name.toLowerCase(), String(value))
    }

    has(name) {
      return super.has(name.toLowerCase())
    }

    delete(name) {
      return super.delete(name.toLowerCase())
    }
  }
}

if (typeof global.FormData === 'undefined') {
  global.FormData = class FormData extends Map {}
}

// =============================================================================
// Mock Next.js Server Components
// =============================================================================

// Mock NextResponse for API route tests
jest.mock('next/server', () => {
  const actual = jest.requireActual('next/server')
  return {
    ...actual,
    NextResponse: class NextResponse extends global.Response {
      constructor(body, init) {
        super(body, init)
      }

      static json(data, init = {}) {
        const response = new NextResponse(JSON.stringify(data), {
          ...init,
          headers: {
            'content-type': 'application/json',
            ...(init.headers || {}),
          },
        })
        return response
      }

      static redirect(url, status = 307) {
        return new NextResponse(null, {
          status,
          headers: {
            Location: url,
          },
        })
      }

      static rewrite(url) {
        return new NextResponse(null, {
          headers: {
            'x-middleware-rewrite': url,
          },
        })
      }

      static next() {
        return new NextResponse(null)
      }
    },
    NextRequest: class NextRequest extends global.Request {
      constructor(input, init) {
        super(input, init)
        const url = new URL(typeof input === 'string' ? input : input.url)
        this.nextUrl = {
          href: url.href,
          origin: url.origin,
          protocol: url.protocol,
          username: url.username,
          password: url.password,
          host: url.host,
          hostname: url.hostname,
          port: url.port,
          pathname: url.pathname,
          search: url.search,
          searchParams: url.searchParams,
          hash: url.hash,
        }
        this.url = url.href
        this.cookies = new Map()
        this.geo = {}
        this.ip = '127.0.0.1'
      }
    },
  }
})

// =============================================================================
// Mock Next.js Navigation
// =============================================================================

jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      pathname: '/',
      query: {},
      asPath: '/',
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  },
  useParams() {
    return {}
  },
  notFound: jest.fn(),
  redirect: jest.fn(),
}))

// =============================================================================
// Mock Next.js Image
// =============================================================================

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} />
  },
}))

// =============================================================================
// Mock Next.js Link
// =============================================================================

jest.mock('next/link', () => {
  return ({ children, href }) => {
    return <a href={href}>{children}</a>
  }
})

// =============================================================================
// Mock Browser APIs
// =============================================================================

// Mock localStorage
const localStorageMock = (() => {
  let store = {}

  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString()
    }),
    removeItem: jest.fn((key) => {
      delete store[key]
    }),
    clear: jest.fn(() => {
      store = {}
    }),
    key: jest.fn((index) => {
      const keys = Object.keys(store)
      return keys[index] || null
    }),
    get length() {
      return Object.keys(store).length
    },
  }
})()

global.localStorage = localStorageMock
global.sessionStorage = localStorageMock

// Mock BroadcastChannel
global.BroadcastChannel = class BroadcastChannel {
  constructor(name) {
    this.name = name
  }
  postMessage = jest.fn()
  close = jest.fn()
  addEventListener = jest.fn()
  removeEventListener = jest.fn()
  dispatchEvent = jest.fn()
}

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return []
  }
  unobserve() {}
}

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// =============================================================================
// Mock Environment Variables
// =============================================================================

process.env.NEXTAUTH_URL = 'http://localhost:3000'
process.env.NEXTAUTH_SECRET = 'test-secret-minimum-32-characters-long-for-testing'
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test'
process.env.NODE_ENV = 'test'

// =============================================================================
// Suppress Console Warnings in Tests
// =============================================================================

const originalWarn = console.warn
const originalError = console.error

beforeAll(() => {
  console.warn = (...args) => {
    // Suppress known warnings
    const warningMessage = args[0]
    if (
      typeof warningMessage === 'string' &&
      (warningMessage.includes('Warning: ReactDOM.render') ||
        warningMessage.includes('Not implemented: HTMLFormElement.prototype.submit'))
    ) {
      return
    }
    originalWarn.call(console, ...args)
  }

  console.error = (...args) => {
    // Suppress known errors
    const errorMessage = args[0]
    if (
      typeof errorMessage === 'string' &&
      (errorMessage.includes('Warning: ReactDOM.render') ||
        errorMessage.includes('Not implemented: HTMLFormElement.prototype.submit'))
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.warn = originalWarn
  console.error = originalError
})

// =============================================================================
// Global Test Utilities
// =============================================================================

// Add custom matchers if needed
expect.extend({
  // Example custom matcher
  toBeWithinRange(received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling
    if (pass) {
      return {
        message: () =>
          `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      }
    } else {
      return {
        message: () =>
          `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      }
    }
  },
})
