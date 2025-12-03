import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useGlobalState } from '../globalState'
import _ from 'lodash'
import { getApplications } from '../fire/applications'
import { FileCheck, FileClock, FileQuestion, FileX, ArrowRight, TrendingUp } from 'lucide-react'
import LoadingSpinner from './LoadingSpinner'
import Button from './Button'

const Dashboard = () => {
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

  const stats = {
    pending: _.filter(applications, { status: 'Pending' }).length,
    needsInfo: _.filter(applications, { status: 'Needs Information' }).length,
    approved: _.filter(applications, { status: 'Approved' }).length,
    rejected: _.filter(applications, { status: 'Rejected' }).length,
  }

  const StatCard = ({ icon: Icon, title, value, description, color = 'blue', bgColor = 'bg-blue-50' }) => (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6 border border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">{value}</h3>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
        <div className={`${bgColor} rounded-full p-3`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  )

  const navigate = useNavigate()

  if (loading) {
    return <LoadingSpinner text="Loading dashboard..." />
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name} 👋
          </h1>
          <p className="text-gray-600 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Here's a summary of your recent activity.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={FileClock}
          title="Pending Review"
          value={stats.pending}
          description="Awaiting assignment"
          color="blue"
          bgColor="bg-blue-50"
        />
        <StatCard
          icon={FileQuestion}
          title="Needs Information"
          value={stats.needsInfo}
          description="Awaiting response"
          color="amber"
          bgColor="bg-amber-50"
        />
        <StatCard
          icon={FileCheck}
          title="Approved"
          value={stats.approved}
          description="Last 30 days"
          color="green"
          bgColor="bg-green-50"
        />
        <StatCard
          icon={FileX}
          title="Rejected"
          value={stats.rejected}
          description="Last 30 days"
          color="red"
          bgColor="bg-red-50"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Recent Applications</h2>
            <p className="text-sm text-gray-500 mt-1">Latest {Math.min(5, applications.length)} applications</p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard/applications')}
          >
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
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
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {_.take(applications, 5).map(app => (
                <tr 
                  key={app.id} 
                  className="hover:bg-blue-50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/dashboard/applications/${app.id}`)}
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
                </tr>
              ))}
            </tbody>
          </table>
          {applications.length === 0 && (
            <div className="text-center py-12">
              <FileCheck className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No applications</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new application.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard

