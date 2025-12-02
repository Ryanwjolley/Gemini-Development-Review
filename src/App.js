import _ from 'lodash'
import { cn } from './utils'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  BrowserRouter as Router,
  Navigate,
  Routes,
  Route,
  useLocation,
} from 'react-router'
import { ToastContainer } from 'react-toastify'
import { Ban } from 'lucide-react'
import routes from './routes'
import { hasPermission } from './components/Permission'
import { initApp, setRemoveGlobalListeners, watchUsers } from './fire'
import { useGlobalState, setGlobalState } from './globalState'
import Sidebar from './components/Sidebar'
import AppHeader from './components/AppHeader'
import { useWindowDimensions } from './utils'

const Main = ({ loggedIn, sidebarWidth, toggleSidebar }) => {
  const location = useLocation()

  return (
    <div className="flex-grow flex flex-col">
      <div
        className={cn('flex-grow bg-gray-100', {
          'bg-gray-200 pb-3': location.pathname.startsWith('/dashboard'), // bleh what a hack. but works for now
        })}
        style={{
          minHeight: '100vh',
          width: `calc(100% - ${sidebarWidth}px)`,
          marginLeft: sidebarWidth,
          transition: 'margin 0.3s ease',
        }}
      >
        <Routes>
          {routes
            .filter(({ publicOnly }) => !publicOnly)
            .map(route => {
              const { allowedPermissions, pageTitle } = route

              if (allowedPermissions && !hasPermission(allowedPermissions)) {
                return (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={
                      <>
                        {pageTitle && (
                          <AppHeader
                            {...{ toggleSidebar }}
                            title={pageTitle}
                          />
                        )}
                        <div
                          style={{
                            padding: '1rem',
                            paddingTop: pageTitle ? 'calc(1rem + 64px)' : '1rem',
                          }}
                        >
                          <h4 className="text-center text-[var(--danger)] mt-5 flex items-center justify-center gap-2">
                            <Ban size={20} /> You are not authorized to
                            view this page
                          </h4>
                        </div>
                      </>
                    }
                  />
                )
              }

              return (
                <Route
                  key={route.path}
                  path={route.path}
                  element={
                    <>
                      {pageTitle && (
                        <AppHeader
                          {...{ toggleSidebar }}
                          title={pageTitle}
                        />
                      )}
                      <div
                        style={{
                          padding: '1rem',
                          paddingTop: pageTitle ? 'calc(1rem + 64px)' : '1rem',
                        }}
                      >
                        <route.component
                          {...route}
                          {...{ loggedIn, sidebarWidth }}
                        />
                      </div>
                    </>
                  }
                />
              )
            })}
          <Route path="*" element={<Navigate to="/users" replace />} />
        </Routes>
      </div>
    </div>
  )
}

const App = () => {
  const { smallScreen } = useWindowDimensions()
  // Initialize isCollapsed to true on small screens
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth < 768)
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }
  // if viewport is small, collapse sidebar,
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  const sidebarWidth = useMemo(
    () => (smallScreen ? 0 : isCollapsed ? 80 : 250),
    [smallScreen, isCollapsed]
  )
  useEffect(() => {
    setGlobalState({ sidebarWidth })
  }, [sidebarWidth])
  const { user, appInitialized, globalInitDone } = useGlobalState()
  useEffect(() => {
    initApp(vals => {
      setGlobalState({ user: vals.user, appInitialized: true })
    })
  }, [])

  const loggedIn = !!user
  const listenerRemove = useRef({
    users: _.noop,
  })
  const removeListenersRef = useRef()
  removeListenersRef.current = () => {
    _.forEach(listenerRemove.current, remove => remove())
  }
  useEffect(() => {
    if (user) {
      listenerRemove.current.users = watchUsers(users =>
        setGlobalState({ users, usersInitialized: true })
      )
      setRemoveGlobalListeners(removeListenersRef.current)
    }
    return () => {
      removeListenersRef.current()
    }
  }, [user])

  if (!appInitialized || (!globalInitDone && loggedIn))
    return (
      <div
        className="w-screen h-screen flex flex-col items-center justify-center text-white"
        style={{ backgroundColor: 'rgba(69,109,160, 0.3)' }}
      >
        ... TODO - prettier loading page
      </div>
    )

  return (
    <Router>
      <ToastContainer hideProgressBar draggable={false} />
      {loggedIn ? (
        <>
          {/* TODO responsive design */}
          <div className={`flex ${smallScreen ? 'flex-col' : ''}`}>
            {smallScreen ? (
              <>
                {!isCollapsed && (
                  <>
                    {/* Mobile sidebar backdrop */}
                    <div
                      className="fixed inset-0 bg-black/50 z-[999]"
                      onClick={toggleSidebar}
                    />
                    <Sidebar
                      {...{ toggleSidebar, isCollapsed, sidebarWidth: 250 }}
                    />
                  </>
                )}
              </>
            ) : (
              <Sidebar {...{ toggleSidebar, isCollapsed, sidebarWidth }} />
            )}
            <Main {...{ loggedIn, sidebarWidth, toggleSidebar }} />
          </div>
        </>
      ) : (
        <>
          <div>what is this</div>
          <Routes>
            {routes
              .filter(({ isPublic }) => isPublic)
              .map(route => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={<route.component {...route} {...{ sidebarWidth }} />}
                />
              ))}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </>
      )}
    </Router>
  )
}

export default App
