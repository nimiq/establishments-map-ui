import { createRouter, createWebHistory } from 'vue-router'
import MapView from '@/components/MapView.vue'
import './index.css'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/location/add',
      name: 'add_location',
      component: () => import('@/components/forms/NewCandidate.vue'),
      meta: { transition: 'slide-left' },
    },
    {
      path: '/location/:uuid/report',
      name: 'report_location',
      component: () => import('@/components/forms/ReportLocation.vue'),
      meta: { transition: 'slide-left' },
    },
    {
      path: '/@:lat(-?\\d+.?\\d+?),:lng(-?\\d+.?\\d+?),:zoom(\\d+)z',
      component: MapView,
      name: 'coords',
    },
    {
      path: '/',
      component: MapView,
      name: 'map',
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

router.afterEach((to, from) => {
  const mapViews = ['map', 'coords', 'location_detail']
  const formViews = ['add_location', 'report_location']
  if (to.name && typeof to.name === 'string' && mapViews.includes(to.name)
    && from.name && typeof from.name === 'string' && formViews.includes(from.name))
    to.meta.transition = 'slide-right'
})
