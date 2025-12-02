import { useState, useEffect } from 'react'
import _ from 'lodash'
import { deleteError, watchErrors } from '../fire'
import toast from './Toast'
import Table from './Table'
import Modal from './Modal'
import Button from './Button'
import Badge from './Badge'
import { format } from '@shared/shared'

const ErrorManagerBtn = () => {
  const [deletingId, setDeletingId] = useState(null)
  const [errors, setErrors] = useState([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const unsubscribe = watchErrors(errors => {
      setErrors(errors)
      setReady(true)
    })
    return unsubscribe
  }, [])

  if (!ready || _.isEmpty(errors)) {
    return null
  }

  return (
    <Modal
      maxWidth="95%"
      title="Errors"
      trigger={openModal => (
        <Button variant="danger" size="sm" onClick={openModal}>
          Errors <Badge variant="light" className="ml-1">{errors.length}</Badge>
        </Button>
      )}
      body={() => (
        <div>
          <Table
            containerClassName="pt-3"
            data={errors}
            columns={[
              {
                header: 'Type',
                render: ({ errorType }) => _.toUpper(errorType),
              },
              {
                header: 'Date',
                className: 'text-nowrap',
                render: ({ dateCreated }) => format.prettyDateTime(dateCreated),
              },
              {
                header: 'User Email',
                render: ({ user }) => user.email || 'Not logged in',
              },
              {
                header: 'Location',
                key: 'location',
              },
              {
                header: 'Info',
                render: ({ info }) => (
                  <pre
                    style={{
                      whiteSpace: 'pre-line',
                      overflow: 'auto',
                      maxHeight: '150px',
                    }}
                  >
                    {JSON.stringify(info, null, 2).replace(/\\n/g, '\n')}
                  </pre>
                ),
              },
              {
                header: 'Stack',
                render: ({ stack }) => (
                  <pre
                    style={{
                      whiteSpace: 'pre-line',
                      overflow: 'auto',
                      maxHeight: '150px',
                    }}
                  >
                    {stack.replace(/\\n/g, '\n')}
                  </pre>
                ),
              },
              {
                header: 'Options',
                render: ({ id }) => (
                  <Button
                    variant="danger"
                    size="sm"
                    disabled={deletingId === id}
                    onClick={async () => {
                      try {
                        setDeletingId(id)
                        await deleteError(id)
                        setDeletingId(null)
                      } catch (e) {
                        toast.error(`Error: ${e}`)
                      }
                    }}
                  >
                    Delete
                  </Button>
                ),
              },
            ]}
          />
        </div>
      )}
    />
  )
}

export default ErrorManagerBtn
