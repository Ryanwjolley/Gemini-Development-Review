import { permissions } from '@shared/shared'
import Login from './components/Login'
import PasswordResetFromEmail from './components/PasswordResetFromEmail'
import Users from './components/Users'
import AuthTokenLogin from './components/AuthTokenLogin'
import Logout from './components/Logout'
import ExportRender from './components/ExportRender'
import Demo from './components/Demo'

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
    path: '/users',
    component: Users,
    pageTitle: 'Users',
    allowedPermissions: [permissions.admin],
    sidebarGroup: 'resources',
  },
]

export default routes
