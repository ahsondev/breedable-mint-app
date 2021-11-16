import Dashboard from 'pages/Admin/Dashboard'
import Login from 'pages/Admin/Login'
import Home from 'pages/Home'
import Mint from 'pages/Mint'

const routes: any[] = [
  {
    path: '/home',
    component: Home
  },
  {
    path: '/mint',
    component: Mint
  },
  {
    path: '/admin/login',
    component: Login
  },
  {
    path: '/admin/dashboard',
    component: Dashboard
  }
]

export default routes
