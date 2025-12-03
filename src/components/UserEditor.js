import _ from 'lodash'
import api from '../api'
import { useSetState } from '../utils'
import { permissionGroupNames } from '@shared'
import ToggleSwitch from './ToggleSwitch'
import { SelectSimple } from './Select'
import Button from './Button'
import Input from './Input'
import toast from './Toast'
import { validateEmail } from '@shared'

const UserEditor = ({
  newUser,
  onClose,
  user: { id, ...initialValues } = {},
}) => {
  const [
    { loading, name, email, vpEmail, permissions, appRoles, enabled },
    setState,
  ] = useSetState({
    loading: false,
    permissions: [],
    enabled: true,
    name: '',
    email: '',
    ...initialValues,
  })
  const validVpEmail = !vpEmail || validateEmail(vpEmail)
  const valid = _.every([validVpEmail, !_.isEmpty(permissions)])

  return (
    <div>
      <div className="flex flex-wrap -mx-2">
        <div className="mb-4 px-2 w-full xl:w-1/3">
          <label>Full Name</label>
          <Input
            type="text"
            onChange={e => setState({ name: e.target.value })}
            value={name}
            hasError={!name}
            placeholder=""
          />
        </div>

        <div className="mb-4 px-2 w-full xl:w-1/3">
          <label>Email</label>
          <Input
            type="email"
            onChange={e => setState({ email: e.target.value })}
            value={email}
            hasError={!email}
          />
        </div>

        <div className="mb-4 px-2 w-full xl:w-1/3">
          <label>Permission Groups</label>
          <SelectSimple
            isMulti
            options={_.map(permissionGroupNames, value => ({
              label: _.startCase(value),
              value,
            }))}
            onChange={change => setState({ permissions: change })}
            value={permissions}
            hasError={_.isEmpty(permissions)}
          />
        </div>

        <div className="mb-4 px-2 w-full xl:w-1/3">
          <label>Enabled</label>
          <div>
            <ToggleSwitch
              checked={enabled}
              onChange={checked => setState({ enabled: checked })}
            />
          </div>
        </div>
      </div>

      <div className="flex mt-2 justify-end">
        <Button variant="danger" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="primary"
          className="ml-2"
          disabled={loading || !valid}
          onClick={async () => {
            setState({ loading: true })

            try {
              const values = {
                name,
                permissions,
                appRoles,
                email,
                vpEmail,
                enabled,
              }
              if (newUser) {
                await api('/user/create', values)
              } else {
                await api('/user/update', { userId: id, ...values })
              }
              onClose()
            } catch (e) {
              toast.error('An error occurred: ' + e)
              setState({ loading: false })
            }
          }}
        >
          Save
        </Button>
      </div>
    </div>
  )
}

export default UserEditor
