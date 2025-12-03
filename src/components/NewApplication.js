import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useGlobalState } from '../globalState'
import { getForms } from '../fire/forms'
import { createApplication } from '../fire/applications'
import Button from './Button'
import Input from './Input'
import TextArea from './TextArea'
import PageHeader from './PageHeader'
import LoadingSpinner from './LoadingSpinner'
import toast from './Toast'
import { ArrowLeft, Send } from 'lucide-react'
import { SelectSimple as Select } from './Select'

const NewApplication = () => {
  const navigate = useNavigate()
  const { user } = useGlobalState()
  const [forms, setForms] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  
  const [applicationData, setApplicationData] = useState({
    formId: '',
    applicantName: user?.name || '',
    applicantEmail: user?.email || '',
    city: '',
    type: '',
    additionalNotes: '',
  })

  useEffect(() => {
    const loadForms = async () => {
      try {
        // Load forms - if city user, show their city's forms, otherwise show all
        const activeForms = await getForms()
        // Only show active forms, and filter by user's city if they have one
        const filteredForms = activeForms.filter(f => {
          if (!f.isActive) return false
          // If user has a city (city users), only show forms for their city
          if (user?.city) {
            return f.city === user.city
          }
          // Public users see all active forms
          return true
        })
        setForms(filteredForms)
      } catch (error) {
        console.error('Error loading forms:', error)
        toast.error('Failed to load forms')
      } finally {
        setLoading(false)
      }
    }
    loadForms()
  }, [user])

  const handleFormSelect = (formId) => {
    const selectedForm = forms.find(f => f.id === formId)
    if (selectedForm) {
      setApplicationData(prev => ({
        ...prev,
        formId,
        city: selectedForm.city || prev.city,
        type: selectedForm.name || prev.type,
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!applicationData.formId) {
      toast.error('Please select a form type')
      return
    }

    if (!applicationData.applicantName.trim()) {
      toast.error('Please enter your name')
      return
    }

    if (!applicationData.city.trim()) {
      toast.error('Please select a city')
      return
    }

    try {
      setSubmitting(true)
      
      // Generate application ID
      const appId = `APP-${String(Date.now()).slice(-6)}`
      
      await createApplication({
        id: appId,
        ...applicationData,
        applicantId: user.id,
        status: 'Pending',
        version: 1,
        submissionDate: new Date(),
        formData: {},
        documents: [],
        assignedReviewers: [],
      }, user.id)
      
      toast.success('Application submitted successfully!')
      navigate(`/dashboard/applications/${appId}`)
    } catch (error) {
      console.error('Error submitting application:', error)
      toast.error('Failed to submit application')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <LoadingSpinner text="Loading forms..." />
  }

  const cities = [...new Set(forms.map(f => f.city).filter(Boolean))]
  const formOptions = forms.map(f => ({
    value: f.id,
    label: `${f.name} - ${f.city || 'All Cities'}`,
  }))

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
            title="New Application"
            description="Submit a new application for review."
          />
        </div>
      </div>

      <div className="max-w-3xl">
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-900">Application Details</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Application Type *
                </label>
                <Select
                  value={applicationData.formId}
                  onChange={handleFormSelect}
                  options={formOptions}
                  placeholder="Select application type..."
                />
                {formOptions.length === 0 && (
                  <p className="mt-2 text-sm text-amber-600">
                    No active forms available. Please contact your city administrator.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Your Name *
                  </label>
                  <Input
                    value={applicationData.applicantName}
                    onChange={e => setApplicationData(prev => ({ 
                      ...prev, 
                      applicantName: e.target.value 
                    }))}
                    placeholder="Full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Email *
                  </label>
                  <Input
                    type="email"
                    value={applicationData.applicantEmail}
                    onChange={e => setApplicationData(prev => ({ 
                      ...prev, 
                      applicantEmail: e.target.value 
                    }))}
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  City *
                </label>
                <Select
                  value={applicationData.city}
                  onChange={value => setApplicationData(prev => ({ ...prev, city: value }))}
                  options={cities.map(c => ({ value: c, label: c }))}
                  placeholder="Select city..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Additional Notes
                </label>
                <TextArea
                  value={applicationData.additionalNotes}
                  onChange={e => setApplicationData(prev => ({ 
                    ...prev, 
                    additionalNotes: e.target.value 
                  }))}
                  placeholder="Any additional information or special requests..."
                  rows={4}
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>Note:</strong> After submitting, your application will be reviewed by the appropriate city department. 
                  You will be able to track its status and receive updates in your Applications list.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/dashboard/applications')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={submitting || formOptions.length === 0}
            >
              <Send className="h-4 w-4 mr-2" />
              {submitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default NewApplication

