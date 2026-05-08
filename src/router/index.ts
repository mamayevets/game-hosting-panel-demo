import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../pages/Login.vue'),
      meta: { layout: 'auth' },
    },
    {
      path: '/',
      redirect: '/servers',
    },
    {
      path: '/servers',
      name: 'servers',
      component: () => import('../pages/ServerList.vue'),
    },
    {
      path: '/servers/:id',
      name: 'server-detail',
      component: () => import('../pages/ServerDetail.vue'),
      props: true,
    },
    {
      path: '/billing',
      name: 'billing',
      component: () => import('../pages/Billing.vue'),
    },
    {
      path: '/account',
      name: 'account',
      component: () => import('../pages/Account.vue'),
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
