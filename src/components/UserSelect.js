import { getById } from '@shared'
import { forwardRef } from 'react'
import { useGlobalState } from '../globalState'
import { SelectSimple } from './Select'

const UserSelect = forwardRef(
  (
    {
      idKey = 'id',
      value,
      onChange,
      filterCallback = () => true,
      isMulti,
      ...props
    },
    ref
  ) => {
    const { users } = useGlobalState()

    return (
      <SelectSimple
        getRef={ref}
        isMulti={isMulti}
        options={users
          .filter(u => u.enabled && u[idKey] && filterCallback(u))
          .map(({ [idKey]: id, name }) => ({ label: name, value: id }))}
        formatOptionLabel={
          ({ label, value }) => label || getById(users, value, 'name') // if user is disabled, they won't show as option, but need to show name there
        }
        onChange={onChange}
        value={value}
        {...props}
      />
    )
  }
)

export default UserSelect

export const VpUserSelect = props => <UserSelect {...props} idKey="vpUserId" />
