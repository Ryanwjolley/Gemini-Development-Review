import React, { useState } from 'react'
import { sendPasswordResetEmail } from '../fire'
import toast from './Toast'
import Button from './Button'
import Input from './Input'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)
  const validEmail = /\S+@\S+\.\S+/.test(email)

  return (
    <div>
      <div>Please enter your email to receive a password reset link</div>
      <form
        onSubmit={async e => {
          e.stopPropagation()
          e.preventDefault()
          try {
            setSending(true)
            await sendPasswordResetEmail(email)
            toast.success(
              'Thank you. You should receive an email to reset your password shortly.'
            )
          } catch (err) {
            toast.error(`${err}`)
            setSending(false)
          }
        }}
      >
        <div className="my-2">
          <Input
            type="text"
            onChange={e => setEmail(e.target.value)}
            value={email}
            hasError={!validEmail}
            placeholder="Email"
          />
        </div>
        <Button
          type="submit"
          variant="primary"
          disabled={!validEmail || sending}
        >
          Reset Password
        </Button>
      </form>
    </div>
  )
}

export default ForgotPassword
