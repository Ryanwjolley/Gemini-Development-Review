import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useGlobalState } from '../globalState'
import { getFormById, createForm, updateForm } from '../fire/forms'
import Button from './Button'
import Input from './Input'
import TextArea from './TextArea'
import PageHeader from './PageHeader'
import LoadingSpinner from './LoadingSpinner'
import toast from './Toast'
import { ArrowLeft, Save, Plus, Trash2, GripVertical } from 'lucide-react'
import { SelectSimple as Select } from './Select'

const fieldTypes = [
  { value: 'text', label: 'Text Input' },
  { value: 'textarea', label: 'Text Area' },
  { value: 'number', label: 'Number' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'date', label: 'Date' },
  { value: 'select', label: 'Dropdown' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'radio', label: 'Radio Group' },
  { value: 'file', label: 'File Upload' },
]

const FormBuilder = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useGlobalState()
  const [loading, setLoading] = useState(!!id)
  const [saving, setSaving] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    city: user?.city || '',
    version: 1,
    isActive: true,
    fields: [],
  })

  useEffect(() => {
    if (id) {
      const loadForm = async () => {
        try {
          const form = await getFormById(id)
          if (form) {
            setFormData(form)
          } else {
            toast.error('Form not found')
            navigate('/dashboard/forms')
          }
        } catch (error) {
          console.error('Error loading form:', error)
          toast.error('Failed to load form')
        } finally {
          setLoading(false)
        }
      }
      loadForm()
    }
  }, [id, navigate])

  const handleAddField = () => {
    setFormData(prev => ({
      ...prev,
      fields: [
        ...prev.fields,
        {
          id: `field_${Date.now()}`,
          label: '',
          type: 'text',
          required: false,
          placeholder: '',
          options: [], // for select/radio
        }
      ]
    }))
  }

  const handleUpdateField = (index, updates) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map((field, i) => 
        i === index ? { ...field, ...updates } : field
      )
    }))
  }

  const handleRemoveField = (index) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.filter((_, i) => i !== index)
    }))
  }

  const handleMoveField = (index, direction) => {
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= formData.fields.length) return

    setFormData(prev => {
      const newFields = [...prev.fields]
      const temp = newFields[index]
      newFields[index] = newFields[newIndex]
      newFields[newIndex] = temp
      return { ...prev, fields: newFields }
    })
  }

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error('Please enter a form name')
      return
    }

    if (formData.fields.length === 0) {
      toast.error('Please add at least one field')
      return
    }

    try {
      setSaving(true)
      
      if (id) {
        await updateForm(id, formData, user.id)
        toast.success('Form updated successfully')
      } else {
        await createForm(formData, user.id)
        toast.success('Form created successfully')
      }
      
      navigate('/dashboard/forms')
    } catch (error) {
      console.error('Error saving form:', error)
      toast.error('Failed to save form')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <LoadingSpinner text="Loading form..." />
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard/forms')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Forms
          </Button>
          <PageHeader
            title={id ? 'Edit Form' : 'Create New Form'}
            description={id ? 'Modify the form structure and settings.' : 'Build a new form from scratch.'}
          />
        </div>
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={saving}
        >
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Saving...' : 'Save Form'}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Form Settings */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-900">Form Settings</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Form Name *
                </label>
                <Input
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Building Permit Application"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Description
                </label>
                <TextArea
                  value={formData.description}
                  onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of this form"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  City
                </label>
                <Input
                  value={formData.city}
                  onChange={e => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  placeholder="e.g., Springfield"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Version
                </label>
                <Input
                  type="number"
                  value={formData.version}
                  onChange={e => setFormData(prev => ({ ...prev, version: parseInt(e.target.value) || 1 }))}
                  min="1"
                />
              </div>

              <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={e => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-900 cursor-pointer">
                  Active (available for use)
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Form Fields</h2>
              <Button
                variant="outline"
                onClick={handleAddField}
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Field
              </Button>
            </div>

            {formData.fields.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-500 mb-4">No fields added yet</p>
                <Button variant="primary" onClick={handleAddField}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Field
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {formData.fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col gap-1 pt-2">
                        <button
                          onClick={() => handleMoveField(index, 'up')}
                          disabled={index === 0}
                          className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                        >
                          <GripVertical className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="flex-1 space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium mb-1 text-gray-600">
                              Field Label *
                            </label>
                            <Input
                              value={field.label}
                              onChange={e => handleUpdateField(index, { label: e.target.value })}
                              placeholder="e.g., Full Name"
                              size="sm"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium mb-1 text-gray-600">
                              Field Type
                            </label>
                            <Select
                              value={field.type}
                              onChange={value => handleUpdateField(index, { type: value })}
                              options={fieldTypes}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-medium mb-1 text-gray-600">
                            Placeholder
                          </label>
                          <Input
                            value={field.placeholder}
                            onChange={e => handleUpdateField(index, { placeholder: e.target.value })}
                            placeholder="Optional helper text"
                            size="sm"
                          />
                        </div>

                        {(field.type === 'select' || field.type === 'radio') && (
                          <div>
                            <label className="block text-xs font-medium mb-1 text-gray-600">
                              Options (comma-separated)
                            </label>
                            <Input
                              value={(field.options || []).join(', ')}
                              onChange={e => handleUpdateField(index, { 
                                options: e.target.value.split(',').map(o => o.trim()).filter(Boolean)
                              })}
                              placeholder="Option 1, Option 2, Option 3"
                              size="sm"
                            />
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id={`required_${field.id}`}
                            checked={field.required}
                            onChange={e => handleUpdateField(index, { required: e.target.checked })}
                            className="h-3 w-3 text-blue-600 rounded"
                          />
                          <label htmlFor={`required_${field.id}`} className="text-xs text-gray-600">
                            Required field
                          </label>
                        </div>
                      </div>

                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleRemoveField(index)}
                        title="Remove field"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FormBuilder

