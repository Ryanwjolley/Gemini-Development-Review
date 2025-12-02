import _ from 'lodash'
import React from 'react'

const UserPermissions = ({ permissionList, permissionGroups }) => {
  const prettyPerm = _.invert(permissionList)

  return (
    <div>
      {_.map(permissionGroups, (perms, groupName) => (
        <div key={groupName}>
          <h5>{_.startCase(groupName)}</h5>
          <ul>
            {_(perms)
              .map(p => prettyPerm[p])
              .uniq()
              .sortBy()
              .value()
              .map(p => (
                <li key={p}>{_.startCase(p)}</li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export default UserPermissions
