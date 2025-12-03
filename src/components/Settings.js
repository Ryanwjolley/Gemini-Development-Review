import { useState } from 'react'
import { useGlobalState } from '../globalState'
import { switchMockUser, mockUsers, useMockAuth } from '../fire/mockAuth'
import Button from './Button'
import { SelectSimple as Select } from './Select'
import PageHeader from './PageHeader'
import toast from './Toast'

const Settings = () => {
  const { user } = useGlobalState()
  const [selectedUser, setSelectedUser] = useState('')
  const isMockAuth = useMockAuth()

  const handleSwitchUser = () => {
    if (!selectedUser) return
    
    try {
      switchMockUser(selectedUser)
      toast.success('User switched successfully')
      window.location.reload()
    } catch (error) {
      toast.error('Failed to switch user')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Settings"
        description="Manage your account settings and preferences."
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-900">Profile Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Name</p>
            <p className="text-base font-semibold text-gray-900">{user?.name}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Email</p>
            <p className="text-base text-gray-900">{user?.email}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Role</p>
            <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
              {user?.role}
            </span>
          </div>
          
          {user?.city && (
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">City</p>
              <p className="text-base text-gray-900">{user.city}</p>
            </div>
          )}
        </div>
      </div>

      {isMockAuth && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-2 text-blue-900">🧪 Testing Mode</h2>
          <p className="text-sm text-blue-700 mb-6">
            Mock authentication is enabled. You can switch between test users without logging out.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2 text-blue-900">
                Switch to Test User
              </label>
              <Select
                value={selectedUser}
                onChange={value => setSelectedUser(value)}
                options={mockUsers.map(u => ({ 
                  value: u.id, 
                  label: `${u.name} (${u.role}${u.city ? ` - ${u.city}` : ''})` 
                }))}
                placeholder="Choose a user..."
              />
            </div>
            <div className="sm:pt-7">
              <Button
                variant="primary"
                onClick={handleSwitchUser}
                disabled={!selectedUser}
                className="w-full sm:w-auto"
              >
                Switch User
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-900">Application Preferences</h2>
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex-1">
              <p className="font-medium text-gray-900">Email Notifications</p>
              <p className="text-sm text-gray-500 mt-1">Receive email updates on application status changes</p>
            </div>
            <input 
              type="checkbox" 
              className="h-5 w-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer" 
              defaultChecked 
            />
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex-1">
              <p className="font-medium text-gray-900">Review Reminders</p>
              <p className="text-sm text-gray-500 mt-1">Get reminded about pending reviews</p>
            </div>
            <input 
              type="checkbox" 
              className="h-5 w-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer" 
              defaultChecked 
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings

