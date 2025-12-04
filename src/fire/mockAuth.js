// Mock authentication for testing - bypasses Firebase Auth
import _ from 'lodash'

const USE_MOCK_AUTH = import.meta.env.VITE_USE_MOCK_AUTH === 'true'

// Mock users for testing
export const mockUsers = [
  {
    id: 'user-public',
    name: 'John Q. Public',
    email: 'john.public@email.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
    role: 'Public',
    enabled: true,
  },
  {
    id: 'user-city-springfield',
    name: 'Jane Springfield',
    email: 'jane.springfield@email.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane',
    role: 'City User',
    city: 'Springfield',
    enabled: true,
  },
  {
    id: 'user-city-shelbyville',
    name: 'Tom Shelbyville',
    email: 'tom.shelbyville@email.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tom',
    role: 'City User',
    city: 'Shelbyville',
    enabled: true,
  },
  {
    id: 'user-reviewer-1',
    name: 'Alice Reviewer',
    email: 'alice.reviewer@email.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice',
    role: 'Reviewer',
    enabled: true,
  },
  {
    id: 'user-reviewer-2',
    name: 'Bob Reviewer',
    email: 'bob.reviewer@email.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob',
    role: 'Reviewer',
    enabled: true,
  },
]

let currentMockUser = null

export const useMockAuth = () => USE_MOCK_AUTH

export const mockSignIn = (email) => {
  const user = mockUsers.find(u => u.email === email)
  if (user) {
    currentMockUser = user
    sessionStorage.setItem('mockUser', JSON.stringify(user))
    return user
  }
  throw new Error('User not found')
}

export const mockSignOut = () => {
  currentMockUser = null
  sessionStorage.removeItem('mockUser')
}

export const getMockUser = () => {
  if (currentMockUser) return currentMockUser
  
  const stored = sessionStorage.getItem('mockUser')
  if (stored) {
    currentMockUser = JSON.parse(stored)
    return currentMockUser
  }
  
  // Auto-login with default user for testing (bypass login page)
  // Users can switch roles via Settings page
  currentMockUser = mockUsers[1] // Jane Springfield (City User - Springfield)
  sessionStorage.setItem('mockUser', JSON.stringify(currentMockUser))
  return currentMockUser
}

export const switchMockUser = (userId) => {
  const user = mockUsers.find(u => u.id === userId)
  if (user) {
    currentMockUser = user
    sessionStorage.setItem('mockUser', JSON.stringify(user))
    return user
  }
  throw new Error('User not found')
}

