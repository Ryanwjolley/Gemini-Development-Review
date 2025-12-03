import { permissions } from '@shared'
import Login from './components/Login'
import PasswordResetFromEmail from './components/PasswordResetFromEmail'
import Users from './components/Users'
import AuthTokenLogin from './components/AuthTokenLogin'
import Logout from './components/Logout'
import ExportRender from './components/ExportRender'
import Demo from './components/Demo'
import Dashboard from './components/Dashboard'
import Applications from './components/Applications'
import NewApplication from './components/NewApplication'
import ApplicationDetail from './components/ApplicationDetail'
import Forms from './components/Forms'
import FormBuilder from './components/FormBuilder'
import Settings from './components/Settings'

const routes = [
  {
    path: '/login',
    component: Login,
    isPublic: true,
    publicOnly: true,
  },
  {
    path: '/logout',
    component: Logout,
    isPublic: true,
  },
  {
    path: '/auth-token-login',
    component: AuthTokenLogin,
    isPublic: true,
  },
  {
    path: '/reset-password',
    component: PasswordResetFromEmail,
    isPublic: true,
  },
  {
    path: '/export-render',
    component: ExportRender,
    isPublic: true,
  },
  {
    path: '/demo',
    component: Demo,
    pageTitle: 'Demo',
    isPublic: true,
  },
  {
    path: '/',
    component: Dashboard,
    pageTitle: 'Dashboard',
    sidebarGroup: 'main',
  },
  {
    path: '/dashboard',
    component: Dashboard,
    pageTitle: 'Dashboard',
    sidebarGroup: 'main',
  },
  {
    path: '/dashboard/applications',
    component: Applications,
    pageTitle: 'Applications',
    sidebarGroup: 'main',
  },
  {
    path: '/dashboard/applications/new',
    component: NewApplication,
    pageTitle: 'New Application',
  },
  {
    path: '/dashboard/applications/:id',
    component: ApplicationDetail,
    pageTitle: 'Application Details',
  },
  {
    path: '/dashboard/forms',
    component: Forms,
    pageTitle: 'Forms',
    sidebarGroup: 'main',
  },
  {
    path: '/dashboard/form-builder/new',
    component: FormBuilder,
    pageTitle: 'Create Form',
  },
  {
    path: '/dashboard/form-builder/:id',
    component: FormBuilder,
    pageTitle: 'Edit Form',
  },
  {
    path: '/dashboard/settings',
    component: Settings,
    pageTitle: 'Settings',
    sidebarGroup: 'main',
  },
  {
    path: '/users',
    component: Users,
    pageTitle: 'Users',
    allowedPermissions: [permissions.admin],
    sidebarGroup: 'resources',
  },
]

export default routes
