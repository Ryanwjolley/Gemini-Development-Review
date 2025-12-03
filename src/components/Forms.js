import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useGlobalState } from '../globalState'
import { getForms } from '../fire/forms'
import Table from './Table'
import Button from './Button'
import PageHeader from './PageHeader'
import LoadingSpinner from './LoadingSpinner'
import { FilePlus, Eye, Edit } from 'lucide-react'

const Forms = () => {
  const navigate = useNavigate()
  const { user, isCityUser, isAdmin } = useGlobalState()
  const [forms, setForms] = useState([])
  const [loading, setLoading] = useState(true)
  
  const canCreateForms = isCityUser || isAdmin

  useEffect(() => {
    const loadForms = async () => {
      try {
        const formsData = isCityUser && user.city
          ? await getForms({ city: user.city })
          : await getForms()
        setForms(formsData)
      } catch (error) {
        console.error('Error loading forms:', error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      loadForms()
    }
  }, [user, isCityUser])

  const columns = [
    {
      key: 'name',
      label: 'Form Name',
      width: '300px',
    },
    {
      key: 'city',
      label: 'City',
      width: '150px',
    },
    {
      key: 'version',
      label: 'Version',
      width: '100px',
      align: 'center',
    },
    {
      key: 'dateModified',
      label: 'Last Modified',
      width: '150px',
      render: (row) => {
        const { dateModified } = row;
        if (!dateModified) return 'N/A';
        if (dateModified.toDate) return dateModified.toDate().toLocaleDateString();
        if (dateModified instanceof Date) return dateModified.toLocaleDateString();
        return String(dateModified);
      },
    },
    {
      key: 'isActive',
      label: 'Status',
      width: '120px',
      render: (row) => {
        const { isActive } = row;
        return (
          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
            isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {isActive ? 'Active' : 'Inactive'}
          </span>
        );
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '120px',
      align: 'center',
      render: (row) => (
        <div className="flex gap-1 justify-center">
          <Button
            variant="default"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              navigate(`/dashboard/forms/${row.id}/preview`)
            }}
            title="Preview"
          >
            <Eye className="h-4 w-4" />
          </Button>
          {isCityUser && (
            <Button
              variant="default"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                navigate(`/dashboard/form-builder/${row.id}`)
              }}
              title="Edit"
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
        </div>
      ),
    },
  ]

  if (loading) {
    return <LoadingSpinner text="Loading forms..." />
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Forms"
        description="Manage, create, and view all application forms."
        actions={
          canCreateForms && (
            <Button
              variant="primary"
              onClick={() => navigate('/dashboard/form-builder/new')}
            >
              <FilePlus className="h-4 w-4 mr-2" />
              New Form
            </Button>
          )
        }
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Form Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  City
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Version
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Modified
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {forms.map(form => (
                <tr 
                  key={form.id} 
                  className="hover:bg-blue-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {form.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {form.city}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                    {form.version}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {form.dateModified instanceof Date 
                      ? form.dateModified.toLocaleDateString() 
                      : form.dateModified?.toDate?.().toLocaleDateString() || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      form.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {form.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex gap-2 justify-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/dashboard/forms/${form.id}/preview`)
                        }}
                        title="Preview"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {canCreateForms && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            navigate(`/dashboard/form-builder/${form.id}`)
                          }}
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {forms.length === 0 && (
            <div className="text-center py-12">
              <h3 className="mt-2 text-sm font-medium text-gray-900">No forms</h3>
              <p className="mt-1 text-sm text-gray-500">Forms will appear here once created.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Forms

