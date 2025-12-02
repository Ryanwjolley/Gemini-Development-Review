import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { passwordResetFromEmailLink } from '../fire'
import { passwordInput } from '@shared/shared'
import toast from './Toast'
import Button from './Button'
import PasswordInput from './PasswordInput'

const PasswordResetFromEmail = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const oobCode = searchParams.get('oobCode')
  const mode = searchParams.get('mode')
  const [newPassword, setNewPassword] = useState('')
  const [updating, setUpdating] = useState(false)
  const strengthValidation = passwordInput.validate(newPassword)
  const { isStrong } = strengthValidation

  useEffect(() => {
    if (!oobCode || mode !== 'resetPassword') {
      toast.error(
        'The reset password link was not valid.  Try sending a new password reset email.'
      )
      navigate('/', { replace: true })
    }
  }, [oobCode, mode, navigate])

  return (
    <div className="flex reset-password-container">
      <div
        className="w-full p-3 rounded m-auto bg-white"
        style={{ maxWidth: '400px' }}
      >
        <div className="flex flex-wrap -mx-2 mb-3">
          <div className="flex-1 px-2">
            <label className="flex items-center">
              {/* drop in a logo someday perhaps */}
              {/* <img
                src="/img/logo-32x32.png"
                style={{ height: '30px' }}
                alt="logo"
              />{' '} */}
              <span className="">Reset Password</span>
            </label>
            <PasswordInput
              value={newPassword}
              setValue={setNewPassword}
              {...strengthValidation}
            />
          </div>
        </div>

        <Button
          variant="primary"
          disabled={updating || !newPassword || !isStrong}
          onClick={async () => {
            setUpdating(true)
            try {
              await passwordResetFromEmailLink({ oobCode, newPassword })
              toast.success('Your password has been reset successfully.')
              navigate('/', { replace: true })
            } catch (e) {
              setUpdating(false)
              toast.error(e.message)
            }
          }}
        >
          Save
        </Button>
      </div>
    </div>
  )
}

export default PasswordResetFromEmail
