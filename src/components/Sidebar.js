import { cn } from '../utils'
import _ from 'lodash'
import { Link, useLocation } from 'react-router'
import { signOut } from '../fire'
import { permissions } from '@shared'
import { hasPermission } from './Permission'
import { useGlobalState } from '../globalState'
import Tooltip from './Tooltip'
import Button from './Button'
// import ErrorManagerBtn from './ErrorManagerBtn'
import toast from './Toast'
import { useState } from 'react'
import Dropdown from './Dropdown'
import { useWindowDimensions } from '../utils'
import { Construction, Users, MoreVertical, User, LogOut, LayoutDashboard, FileText, FolderOpen, Settings as SettingsIcon } from 'lucide-react'
// import routes from '../routes'

const Icon = ({ className, isCollapsed }) => (
  <i className={className} style={{ minWidth: isCollapsed ? 0 : 15 }} />
)

const Sidebar = ({ isCollapsed, sidebarWidth, toggleSidebar }) => {
  const { smallScreen } = useWindowDimensions()
  const location = useLocation()
  const { user, isAdmin } = useGlobalState()

  const [openGroups, setOpenGroups] = useState({
    // dashboards: false,
  })

  // Update openGroups based on the current location
  // useEffect(() => {
  //   const activeGroup = routes.find(route =>
  //     matchPath(location.pathname, { path: route.path, exact: false })
  //   )?.sidebarGroup

  //   setOpenGroups(prevGroups =>
  //     Object.keys(prevGroups).reduce((acc, group) => {
  //       acc[group] = group === activeGroup
  //       return acc
  //     }, {})
  //   )
  // }, [location.pathname])

  // const toggleGroup = groupName => {
  //   setOpenGroups(prevGroups => ({
  //     ...prevGroups,
  //     [groupName]: !prevGroups[groupName],
  //   }))
  // }

  return (
    <div
      className={`border-r border-gray-200 flex flex-col bg-white ${
        isCollapsed ? 'collapsed' : ''
      } `}
      style={{
        width: sidebarWidth,
        transition: 'width 0.3s ease',
        height: '100dvh',
        position: 'fixed',
        zIndex: 1000,
      }}
    >
      {import.meta.env.VITE_JDE_ENV === 'dev' && (
        <div className="p-0 text-center bg-yellow-400 text-sm mb-2 flex items-center justify-center gap-1">
          <Construction size={16} />
          {!isCollapsed && <> FYI, this is Dev</>}
        </div>
      )}
      <div className="px-1 py-2 text-center">
        <Tooltip
          placement="bottomLeft"
          mouseEnterDelay={0.7}
          title={`UI Version: ${import.meta.env.VITE_UI_VERSION}, API: ${
            user.appVersion
          }`}
        >
          <img
            src="/img/logo192.png"
            alt="Logo"
            style={{
              width: isCollapsed ? '60px' : '150px',
              transition: 'width 0.3s ease',
            }}
          />
        </Tooltip>
      </div>
      <div className="flex-grow mt-4 px-2 overflow-auto">
        <div className="navbar-nav">
          {/* <button
            className={cn(
              'group-heading w-full block py-2 px-3 rounded transition-colors hover:bg-gray-100 text-gray-900 no-underline mt-1 bg-transparent border-0 outline-0 text-left flex items-center ',
              isCollapsed ? 'justify-center' : 'justify-between'
            )}
            style={{
              minHeight: isCollapsed ? '30px' : 'auto',
            }}
            onClick={() => toggleGroup('dashboards')}
          >
            <span
              className={cn({
                'py-1 flex items-center justify-center':
                  isCollapsed,
              })}
            >
              <Icon
                className={cn('fas fa-house mx-2')}
                style={{
                  width: isCollapsed ? '0' : '20px',
                }}
              />
              {!isCollapsed && <span>Dashboards</span>}
            </span>
            {!isCollapsed && (
              <Icon
                className={cn(
                  'fa fa-sm mx-1',
                  openGroups['dashboards']
                    ? 'fa-chevron-down'
                    : 'fa-chevron-right'
                )}
              />
            )}
          </button> */}
          {!isCollapsed && (
            <div
              className="nav flex-col mt-1 ml-3 border-l"
              style={{
                display: openGroups['dashboards'] ? 'block' : 'none',
              }}
            >
              <Link
                className={cn(
                  'block py-2 px-3 rounded transition-colors hover:bg-gray-100 text-gray-900 no-underline ml-3',
                  {
                    activeChild: _.isEqual(location.pathname, '/dashboard'),
                  }
                )}
                to="/dashboard"
              >
                {!isCollapsed && <span>Company Dashboard</span>}
              </Link>
            </div>
          )}
          <Link
            className={cn(
              'flex items-center gap-2 py-2 px-3 rounded transition-colors hover:bg-gray-100 text-gray-900 no-underline',
              {
                'bg-blue-50 text-blue-600': location.pathname === '/dashboard' || location.pathname === '/',
              }
            )}
            to="/dashboard"
          >
            <LayoutDashboard size={20} />
            {!isCollapsed && <span>Dashboard</span>}
          </Link>
          
          <Link
            className={cn(
              'flex items-center gap-2 py-2 px-3 rounded transition-colors hover:bg-gray-100 text-gray-900 no-underline',
              {
                'bg-blue-50 text-blue-600': location.pathname.startsWith('/dashboard/applications'),
              }
            )}
            to="/dashboard/applications"
          >
            <FileText size={20} />
            {!isCollapsed && <span>Applications</span>}
          </Link>
          
          <Link
            className={cn(
              'flex items-center gap-2 py-2 px-3 rounded transition-colors hover:bg-gray-100 text-gray-900 no-underline',
              {
                'bg-blue-50 text-blue-600': location.pathname.startsWith('/dashboard/forms'),
              }
            )}
            to="/dashboard/forms"
          >
            <FolderOpen size={20} />
            {!isCollapsed && <span>Forms</span>}
          </Link>
          
          <Link
            className={cn(
              'flex items-center gap-2 py-2 px-3 rounded transition-colors hover:bg-gray-100 text-gray-900 no-underline',
              {
                'bg-blue-50 text-blue-600': location.pathname === '/dashboard/settings',
              }
            )}
            to="/dashboard/settings"
          >
            <SettingsIcon size={20} />
            {!isCollapsed && <span>Settings</span>}
          </Link>

          {hasPermission([permissions.admin]) && (
            <Link
              className={cn(
                'flex items-center gap-2 py-2 px-3 rounded transition-colors hover:bg-gray-100 text-gray-900 no-underline mt-4',
                {
                  'bg-blue-50 text-blue-600': _.isEqual(location.pathname, '/users'),
                }
              )}
              to="/users"
            >
              <Users size={20} />
              {!isCollapsed && <span>Users</span>}
            </Link>
          )}
        </div>
      </div>

      <div className="mt-auto mb-2 px-2">
        {/* {isAdmin && !isCollapsed && <ErrorManagerBtn />} */}
        <Dropdown
          containerClassName="w-full"
          align="right"
          dropup={true}
          trigger={toggleDropdown => (
            <Button
              className={cn('w-full flex items-center', {
                'justify-center': isCollapsed,
                'justify-between': !isCollapsed,
              })}
              onClick={toggleDropdown}
            >
              {!isCollapsed ? (
                <>
                  {user.name}
                  <MoreVertical size={16} />
                </>
              ) : (
                <User size={20} />
              )}
            </Button>
          )}
        >
          <button
            className="flex items-center gap-2 w-full text-left text-sm px-4 py-2 hover:bg-gray-100"
            onClick={async () => {
              try {
                await signOut()
                window.location.reload()
              } catch (e) {
                toast.error(`${e}`)
              }
            }}
          >
            <LogOut size={16} /> Sign Out
          </button>
        </Dropdown>
      </div>
    </div>
  )
}

export default Sidebar
