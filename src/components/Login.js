import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { signIn } from '../fire'
import { useMockAuth, mockUsers } from '../fire/mockAuth'
import toast from './Toast'
import Modal from './Modal'
import Button from './Button'
import Input from './Input'
import { SelectSimple as Select } from './Select'
import ForgotPassword from './ForgotPassword'

const Login = () => {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const validEmail = /\S+@\S+\.\S+/.test(email)
  const isMockAuth = useMockAuth()
  
  if (token) return null // signing in with auth token, so don't show form

  return (
    <div
      className="flex flex-col items-center h-screen"
      style={{ backgroundColor: 'rgba(69,109,160, 0.3)' }}
    >
      <div className="mt-5">
        <img
          src="/img/logo192.png"
          style={{ width: '128px', height: '128px' }}
          alt="logo"
        />
      </div>

      <div
        className="w-full mt-2 flex justify-center"
        style={{ maxWidth: '450px' }}
      >
        {isMockAuth ? (
          <form
            className="w-full pt-3"
            onSubmit={async e => {
              e.preventDefault()
              try {
                setLoading(true)
                await signIn({ email, password })
                window.location.reload()
              } catch (err) {
                console.log(err)
                toast.error('User not found')
                setLoading(false)
              }
            }}
          >
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
              <p className="text-sm text-blue-800 font-semibold mb-2">🧪 Mock Auth Mode - Testing</p>
              <p className="text-xs text-blue-600">Select a user to sign in (no password required)</p>
            </div>
            <div className="mb-4">
              <label>Select Test User</label>
              <Select
                value={email}
                onChange={value => setEmail(value)}
                options={mockUsers.map(u => ({ value: u.email, label: `${u.name} (${u.role})` }))}
                placeholder="Choose a user..."
              />
            </div>
            <Button type="submit" variant="primary" disabled={loading || !email}>
              Sign in as Test User
            </Button>
          </form>
        ) : (
          <form
            className="w-full pt-3"
            onSubmit={async e => {
              e.preventDefault()
              try {
                setLoading(true)
                await signIn({ email, password })
              } catch (err) {
                console.log(err)
                toast.error('The email or password was incorrect')
                setLoading(false)
              }
            }}
          >
            <div className="mb-4">
              <label>Email address</label>
              <Input
                type="text"
                onChange={e => setEmail(e.target.value)}
                value={email}
                hasError={!validEmail}
                placeholder="Email"
              />
            </div>
            <div className="mb-4">
              <label>Password</label>
              <Input
                type="password"
                onChange={e => setPassword(e.target.value)}
                value={password}
                placeholder="Password"
              />
            </div>
            <Button type="submit" variant="primary" disabled={loading}>
              Sign in
            </Button>

            <Modal
              maxWidth="500px"
              title="Forgot Password"
              trigger={openModal => (
                <Button
                  disabled={loading}
                  type="button"
                  variant="primary"
                  className="ml-1"
                  onClick={openModal}
                >
                  Forgot Password
                </Button>
              )}
              body={() => <ForgotPassword />}
            />
          </form>
        )}
      </div>
    </div>
  )
}

export default Login
