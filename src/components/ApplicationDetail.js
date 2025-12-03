import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useGlobalState } from '../globalState'
import _ from 'lodash'
import { getApplicationById, getReviewsByApplicationId, addReview, assignReviewers, updateApplication } from '../fire/applications'
import { getUsersByRole } from '../fire/users'
import Button from './Button'
import PageHeader from './PageHeader'
import PageTabs from './PageTabs'
import Input from './Input'
import TextArea from './TextArea'
import { SelectSimple as Select } from './Select'
import LoadingSpinner from './LoadingSpinner'
import toast from './Toast'
import { ArrowLeft, Download, Paperclip, UserPlus, Send, AlertCircle } from 'lucide-react'
import { tabs } from '@shared'

const ApplicationDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isCityUser, isReviewer, isPublicUser, isAdmin } = useGlobalState()
  const [application, setApplication] = useState(null)
  const [reviews, setReviews] = useState([])
  const [reviewers, setReviewers] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState(tabs.details)
  
  // Review form state
  const [newNote, setNewNote] = useState('')
  const [selectedReviewer, setSelectedReviewer] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [app, revs, revList] = await Promise.all([
          getApplicationById(id),
          getReviewsByApplicationId(id),
          getUsersByRole('Reviewer'),
        ])
        setApplication(app)
        setReviews(revs)
        setReviewers(revList)
      } catch (error) {
        console.error('Error loading application:', error)
        toast.error('Failed to load application')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [id])

  const handleAddReview = async () => {
    if (!newNote.trim()) {
      toast.error('Please enter a review note')
      return
    }

    try {
      setSaving(true)
      await addReview({
        applicationId: id,
        reviewerId: user.id,
        reviewerName: user.name,
        reviewerRole: user.role,
        comment: newNote,
        attachments: [],
      }, user.id)
      
      const updatedReviews = await getReviewsByApplicationId(id)
      setReviews(updatedReviews)
      setNewNote('')
      toast.success('Review note added')
    } catch (error) {
      console.error('Error adding review:', error)
      toast.error('Failed to add review note')
    } finally {
      setSaving(false)
    }
  }

  const handleAssignReviewer = async () => {
    if (!selectedReviewer) {
      toast.error('Please select a reviewer')
      return
    }

    if (application.assignedReviewers?.includes(selectedReviewer)) {
      toast.error('This reviewer is already assigned')
      return
    }

    try {
      setSaving(true)
      await assignReviewers(id, [selectedReviewer], user.id)
      const updatedApp = await getApplicationById(id)
      setApplication(updatedApp)
      setSelectedReviewer('')
      toast.success('Reviewer assigned')
    } catch (error) {
      console.error('Error assigning reviewer:', error)
      toast.error('Failed to assign reviewer')
    } finally {
      setSaving(false)
    }
  }

  const handleStatusChange = async (newStatus) => {
    try {
      setSaving(true)
      await updateApplication(id, { status: newStatus }, user.id)
      const updatedApp = await getApplicationById(id)
      setApplication(updatedApp)
      toast.success(`Application ${newStatus.toLowerCase()}`)
    } catch (error) {
      console.error('Error updating status:', error)
      toast.error('Failed to update status')
    } finally {
      setSaving(false)
    }
  }

  const canManageReviews = isCityUser || isAdmin
  const canPerformActions = isCityUser || isReviewer || isAdmin
  
  // Debug logging
  useEffect(() => {
    console.log('ApplicationDetail - User roles:', { 
      isCityUser, 
      isAdmin, 
      isReviewer, 
      isPublicUser,
      canManageReviews,
      userRole: user?.role 
    })
  }, [isCityUser, isAdmin, isReviewer, isPublicUser, canManageReviews, user])

  const assignedReviewersList = _.compact(
    application?.assignedReviewers?.map(rid => 
      reviewers.find(r => r.id === rid)
    )
  )

  const tabOptions = [
    { value: tabs.details, label: 'Details' },
    { value: tabs.documents, label: 'Documents' },
    { value: tabs.reviews, label: 'Reviews' },
  ]

  if (loading) {
    return <LoadingSpinner text="Loading application details..." />
  }

  if (!application) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <AlertCircle className="h-16 w-16 text-gray-400" />
        <div className="text-gray-900 font-semibold text-lg">Application not found</div>
        <Button variant="primary" onClick={() => navigate('/dashboard/applications')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Applications
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard/applications')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Applications
          </Button>
          <PageHeader
            title={`Application ${application.id}`}
            description={
              <div className="flex items-center gap-3 mt-2">
                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  application.status === 'Approved' ? 'bg-green-100 text-green-800' :
                  application.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                  application.status === 'In Review' ? 'bg-blue-100 text-blue-800' :
                  application.status === 'Needs Information' ? 'bg-amber-100 text-amber-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {application.status}
                </span>
                <span className="text-gray-600">{application.type} • {application.applicantName}</span>
              </div>
            }
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <PageTabs options={tabOptions} value={activeTab} onChange={setActiveTab} />

          {activeTab === tabs.details && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-4">
              <h2 className="text-xl font-semibold mb-6 text-gray-900">Application Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <div className="text-sm font-medium text-gray-500">Application ID</div>
                  <div className="text-base font-semibold text-gray-900">{application.id}</div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-sm font-medium text-gray-500">Applicant</div>
                  <div className="text-base font-semibold text-gray-900">{application.applicantName}</div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-sm font-medium text-gray-500">Application Type</div>
                  <div className="text-base text-gray-900">{application.type}</div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-sm font-medium text-gray-500">City</div>
                  <div className="text-base text-gray-900">{application.city}</div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-sm font-medium text-gray-500">Submitted</div>
                  <div className="text-base text-gray-900">
                    {application.submissionDate instanceof Date 
                      ? application.submissionDate.toLocaleDateString() 
                      : application.submissionDate?.toDate?.().toLocaleDateString() || 'N/A'}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-sm font-medium text-gray-500">Current Version</div>
                  <div className="text-base text-gray-900">v{application.version}</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === tabs.documents && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-4">
              <h2 className="text-xl font-semibold mb-6 text-gray-900">Attached Documents</h2>
              <div className="space-y-3">
                {application.documents?.length > 0 ? (
                  application.documents.map((doc, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg border border-gray-200 p-4 hover:border-blue-300 hover:bg-blue-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                          <Paperclip className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{doc.name}</p>
                          <p className="text-sm text-gray-500">{doc.size} • {doc.date}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Paperclip className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-gray-500 font-medium">No documents attached</p>
                    <p className="text-sm text-gray-400">Documents will appear here once uploaded</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === tabs.reviews && (
            <div className="space-y-4 mt-4">
              {canPerformActions && !isPublicUser && (
                <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-sm border border-blue-100 p-6">
                  <h2 className="text-xl font-semibold mb-4 text-gray-900">Add a Review Note</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">Your Note</label>
                      <TextArea
                        value={newNote}
                        onChange={e => setNewNote(e.target.value)}
                        placeholder="Type your review note here..."
                        rows={4}
                        className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                      />
                    </div>
                    <Button
                      variant="primary"
                      onClick={handleAddReview}
                      disabled={saving || !newNote.trim()}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      {saving ? 'Adding...' : 'Add Note'}
                    </Button>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold mb-6 text-gray-900">Review History</h2>
                <div className="space-y-6">
                  {reviews.length > 0 ? (
                    reviews.map((review, i) => (
                      <div key={i} className="flex gap-4 pb-6 border-b last:border-b-0 last:pb-0">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold shadow-sm">
                          {review.reviewerName.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-baseline justify-between mb-2">
                            <div>
                              <p className="font-semibold text-gray-900">{review.reviewerName}</p>
                              <p className="text-sm text-gray-500">{review.reviewerRole}</p>
                            </div>
                            <p className="text-xs text-gray-400">
                              {review.dateCreated instanceof Date 
                                ? review.dateCreated.toLocaleDateString() 
                                : review.dateCreated?.toDate?.().toLocaleDateString() || 'N/A'}
                            </p>
                          </div>
                          <div className="mt-2 rounded-lg bg-gray-50 border border-gray-200 p-4 text-sm text-gray-700">
                            {review.comment}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Send className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-gray-500 font-medium">No reviews yet</p>
                      <p className="text-sm text-gray-400">Review notes will appear here</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {canManageReviews && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-900">Review Management</h2>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm mb-3 text-gray-700">Assigned Reviewers</h4>
                  <div className="space-y-2">
                    {assignedReviewersList.length > 0 ? (
                      assignedReviewersList.map(r => (
                        <div key={r.id} className="flex items-center gap-3 p-2 rounded-lg bg-blue-50 border border-blue-100">
                          <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-semibold">
                            {r.name.charAt(0)}
                          </div>
                          <span className="text-sm font-medium text-gray-900">{r.name}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 italic">No reviewers assigned yet</p>
                    )}
                  </div>
                </div>
                <div className="pt-2 border-t border-gray-200">
                  <label className="block text-sm font-medium mb-2 text-gray-700">Assign a new reviewer</label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Select
                        value={selectedReviewer}
                        onChange={value => setSelectedReviewer(value)}
                        options={reviewers.map(r => ({ value: r.id, label: r.name }))}
                        placeholder="Select reviewer..."
                      />
                    </div>
                    <Button
                      onClick={handleAssignReviewer}
                      disabled={saving || !selectedReviewer}
                      variant="primary"
                      title="Assign Reviewer"
                    >
                      <UserPlus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {canPerformActions && !isPublicUser && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-900">Application Actions</h2>
              <div className="flex flex-col gap-3">
                <Button
                  variant="primary"
                  onClick={() => handleStatusChange('Approved')}
                  disabled={saving}
                  className="justify-center"
                >
                  ✓ Approve Application
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleStatusChange('Rejected')}
                  disabled={saving}
                  className="justify-center"
                >
                  ✗ Reject Application
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleStatusChange('Needs Information')}
                  disabled={saving}
                  className="justify-center"
                >
                  Request Information
                </Button>
                <div className="border-t border-gray-200 my-2"></div>
                <Button
                  variant="outline"
                  onClick={() => toast.info('PDF export coming soon')}
                  className="justify-center"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export as PDF
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ApplicationDetail

