import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { Loader2 } from 'lucide-react'
import { signInWithCustomToken } from '../fire'
import api from '../api'
import toast from './Toast'

const AuthTokenLogin = ({ loggedIn }) => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) {
      navigate('/login', { replace: true })
      toast.error(
        'The temporary link is not valid.  Try sending a new password reset email'
      )
      return
    }
    const attemptSignIn = async () => {
      try {
        const authToken = await api('/user/verify-sign-in-token', { token })
        await signInWithCustomToken(authToken)
      } catch (e) {
        navigate('/login', { replace: true })
        toast.error(
          'The temporary link is not valid.  Try sending a new password reset email'
        )
      }
    }

    if (!loggedIn) {
      attemptSignIn()
    } else {
      navigate('/', { replace: true })
    }
  }, [token, loggedIn, navigate])

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center">
      <Loader2 size={48} className="animate-spin" />
    </div>
  )
}

export default AuthTokenLogin
