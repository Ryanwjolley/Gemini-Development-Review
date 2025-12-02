import _ from 'lodash'
import { UserX, Check, X, Edit } from 'lucide-react'
import UserEditor from './UserEditor'
import PageHeader from './PageHeader'
import Table from './Table'
import Modal from './Modal'
import Button from './Button'
import { useGlobalState } from '../globalState'

const Users = () => {
  const { users } = useGlobalState()

  return (
    <div>
      <PageHeader>Users</PageHeader>
      <Table
        fileExport={{ filename: () => 'Users.csv' }}
        showSearchBar
        searchPlaceholder="Search by Name, Email, or Permission"
        searchKeys={['name', 'email', 'permissionsStr']}
        data={users.map(u => ({
          ...u,
          permissionsStr: _.map(_.sortBy(u.permissions), _.startCase).join(
            ', '
          ),
        }))}
        columns={[
          {
            header: 'Name',
            className: 'whitespace-nowrap',
            render: user => (
              <div className="flex items-center gap-2">
                {user.name}
                {!user.enabled && (
                  <UserX size={16} className="text-[var(--danger)]" />
                )}
              </div>
            ),
            renderExport: ({ name }) => name,
          },
          { header: 'Email', key: 'email' },
          { header: 'Permission', key: 'permissionsStr', showFilter: true },
          {
            key: 'enabled',
            header: 'Enabled',
            render: u =>
              u.enabled ? (
                <Check size={16} className="text-[var(--success)]" />
              ) : (
                <X size={16} className="text-[var(--danger)]" />
              ),
          },
          {
            header: 'Options',
            dontExport: true,
            render: user => (
              <div className="inline-flex">
                <Modal
                  maxWidth={1200}
                  title="Edit User"
                  trigger={openModal => (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={openModal}
                    >
                      <Edit size={16} />
                    </Button>
                  )}
                  body={closeModal => (
                    <UserEditor onClose={closeModal} {...{ user }} />
                  )}
                />
              </div>
            ),
            showSort: false,
          },
        ]}
      />
    </div>
  )
}

export default Users
