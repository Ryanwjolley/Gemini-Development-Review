import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useGlobalState } from '../globalState'
import _ from 'lodash'
import { getApplications } from '../fire/applications'
import Table from './Table'
import Button from './Button'
import PageHeader from './PageHeader'
import LoadingSpinner from './LoadingSpinner'
import { Plus } from 'lucide-react'

const Applications = () => {
  const navigate = useNavigate()
  const { user, isCityUser, isReviewer, isPublicUser } = useGlobalState()
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadApplications = async () => {
      try {
        let apps = []
        if (isReviewer) {
          apps = await getApplications({ assignedReviewerId: user.id })
        } else if (isCityUser && user.city) {
          apps = await getApplications({ city: user.city })
        } else if (isPublicUser) {
          apps = await getApplications({ applicantId: user.id })
        } else {
          apps = await getApplications()
        }
        setApplications(apps)
      } catch (error) {
        console.error('Error loading applications:', error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      loadApplications()
    }
  }, [user, isCityUser, isReviewer, isPublicUser])

  const pageTitle = isReviewer 
    ? 'My Review Queue' 
    : (isPublicUser 
      ? 'My Applications' 
      : (isCityUser ? `Applications for ${user?.city}` : 'All Applications'))
      
  const pageDescription = isReviewer 
    ? 'Applications assigned to you for review.' 
    : (isPublicUser 
      ? 'Applications you have submitted.' 
      : (isCityUser ? `View, manage, and track all applications for ${user?.city}.` : 'View, manage, and track all applications.'))

  const columns = [
    {
      key: 'id',
      label: 'ID',
      width: '120px',
    },
    {
      key: 'type',
      label: 'Type',
      width: '180px',
    },
    {
      key: 'applicantName',
      label: 'Applicant',
      width: '180px',
    },
    {
      key: 'city',
      label: 'City',
      width: '120px',
    },
    {
      key: 'status',
      label: 'Status',
      width: '150px',
      render: (row) => {
        const { status } = row;
        return (
          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
            status === 'Approved' ? 'bg-green-100 text-green-800' :
            status === 'Rejected' ? 'bg-red-100 text-red-800' :
            status === 'In Review' ? 'bg-blue-100 text-blue-800' :
            status === 'Needs Information' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {status}
          </span>
        );
      },
    },
    {
      key: 'submissionDate',
      label: 'Submitted',
      width: '120px',
      render: (row) => {
        const { submissionDate } = row;
        if (!submissionDate) return 'N/A';
        if (submissionDate.toDate) return submissionDate.toDate().toLocaleDateString();
        if (submissionDate instanceof Date) return submissionDate.toLocaleDateString();
        return String(submissionDate);
      },
    },
    {
      key: 'version',
      label: 'Version',
      width: '80px',
      align: 'center',
    },
  ]

  const handleRowClick = (row) => {
    navigate(`/dashboard/applications/${row.id}`)
  }

  if (loading) {
    return <LoadingSpinner text="Loading applications..." />
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={pageTitle}
        description={pageDescription}
        actions={
          isPublicUser && (
            <Button
              variant="primary"
              onClick={() => navigate('/dashboard/applications/new')}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Application
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
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applicant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  City
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Version
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications.map(app => (
                <tr 
                  key={app.id} 
                  className="hover:bg-blue-50 transition-colors cursor-pointer"
                  onClick={() => handleRowClick(app)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">
                    {app.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {app.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {app.applicantName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {app.city}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      app.status === 'Approved' ? 'bg-green-100 text-green-800' :
                      app.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                      app.status === 'In Review' ? 'bg-blue-100 text-blue-800' :
                      app.status === 'Needs Information' ? 'bg-amber-100 text-amber-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {app.submissionDate instanceof Date 
                      ? app.submissionDate.toLocaleDateString() 
                      : app.submissionDate?.toDate?.().toLocaleDateString() || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                    {app.version}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {applications.length === 0 && (
            <div className="text-center py-12">
              <h3 className="mt-2 text-sm font-medium text-gray-900">No applications</h3>
              <p className="mt-1 text-sm text-gray-500">Applications will appear here once submitted.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Applications

