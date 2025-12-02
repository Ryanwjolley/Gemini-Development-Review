import { useEffect } from 'react'
import { signOut } from '../fire'
import toast from './Toast'

const Logout = () => {
  useEffect(() => {
    signOut()
      .then(() => window.location.replace('/login'))
      .catch(e => toast.error(`${e}`))
  }, [])

  return null
}

export default Logout
