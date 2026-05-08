import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior() {
    return { top: 0 }
  },
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/Login.vue'),
      meta: { layout: 'auth' },
    },
    { path: '/', redirect: '/servers' },
    {
      path: '/servers',
      name: 'servers',
      component: () => import('@/pages/ServerList.vue'),
    },
    {
      path: '/servers/:id',
      name: 'server-detail',
      component: () => import('@/pages/ServerDetail.vue'),
      props: true,
    },
    {
      path: '/billing',
      name: 'billing',
      component: () => import('@/pages/Billing.vue'),
    },
    {
      path: '/subscription',
      name: 'subscription',
      component: () => import('@/pages/Subscription.vue'),
    },
    {
      path: '/account',
      name: 'account',
      component: () => import('@/pages/Account.vue'),
    },
    {
      path: '/activity',
      name: 'activity',
      component: () => import('@/pages/ActivityLog.vue'),
    },
    {
      path: '/backups',
      name: 'backups',
      component: () => import('@/pages/Backups.vue'),
    },
    {
      path: '/api-reference',
      name: 'api-reference',
      component: () => import('@/pages/ApiReference.vue'),
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/pages/Settings.vue'),
    },
    {
      path: '/help',
      name: 'help',
      component: () => import('@/pages/Help.vue'),
    },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.name !== 'login' && !auth.isAuthenticated) {
    return { name: 'login' }
  }
  if (to.name === 'login' && auth.isAuthenticated) {
    return { name: 'servers' }
  }
})

export default router
