import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { signIn } from '../fire'
import toast from './Toast'
import Modal from './Modal'
import Button from './Button'
import Input from './Input'
import ForgotPassword from './ForgotPassword'

const Login = () => {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const validEmail = /\S+@\S+\.\S+/.test(email)
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

          {/* <div className="mt-3">{signInWithMicrosoftBtn}</div> */}
        </form>
      </div>
    </div>
  )
}

export default Login
