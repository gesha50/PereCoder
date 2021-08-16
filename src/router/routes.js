
const routes = [
  { path: '/', component: () => import('layouts/MainLayouts'),
    children: [
      { path: '', component: () => import('pages/site/index') },
      { path: 'new', component: () => import('pages/site/newGame') },
      { path: 'join', component: () => import('pages/site/joinToGame') },
      { path: 'setting', component: () => import('pages/site/setting') },
      { path: 'rules', component: () => import('pages/site/rules') },
      { path: '/register-game', component: () => import('pages/site/registerGame.vue') },
    ]
  },

  { path: '/login', component: () => import('pages/login.vue') },
  { path: '/register', component: () => import('pages/register.vue') },
  {
    path: '/dashboard',
    meta: {
      auth: true
    },
    component: () => import('layouts/MainDashboardLayout'),
    children: [
      { path: 'dashboard_v2', component: () => import('pages/admin/dashboard_v2.vue') },
      { path: 'v3', component: () => import('pages/admin/dashboard_v3.vue') },
      { path: 'customer_management', component: () => import('pages/admin/customer_management.vue') },
      { path: 'change_request', component: () => import('pages/admin/change_request.vue') },
      { path: 'my_profile', component: () => import('pages/admin/my_profile.vue') },
      { path: 'sales_invoices', component: () => import('pages/admin/sales_invoices.vue') },
      { path: 'quotes', component: () => import('pages/admin/quotes.vue') },
      { path: 'transactions', component: () => import('pages/admin/transactions.vue') },
      { path: 'employee_salary_list', component: () => import('pages/admin/employee_salary_list.vue') },
      { path: 'calendar', component: () => import('pages/admin/calendar.vue') },
      { path: 'department', component: () => import('pages/admin/department.vue') },
      { path: '', component: () => import('pages/admin/dashboard.vue')},
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
