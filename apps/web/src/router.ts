import { createRouter, createWebHistory } from 'vue-router'
import { detectLanguage, setLanguage } from './i18n/i18n-setup'
import MapView from '@/components/MapView.vue'

const NewCandidate = () => import('@/components/forms/NewCandidateOld.vue')
const ReportLocation = () => import('@/components/forms/ReportLocation.vue')

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/location/add',
      name: 'add_location',
      redirect: '?modal=crypto-map_add-location',
    },
    {
      path: '/location/report',
      name: 'report_location',
      redirect: '?modal=report-location',
    },
    {
      path: '/@:lat(-?\\d+.?\\d+?),:lng(-?\\d+.?\\d+?),:zoom(\\d+)z',
      component: MapView,
      name: 'coords',
    },
    {
      // Old route for location. We redirect to the new route with UUIDs as query params.
      path: '/establishment/:uuid',
      component: MapView,
      name: 'old_location_detail',
    },
    {
      path: '/',
      component: MapView,
      name: 'map',
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

// This router navigation guard is to prevent switching to the new route before the language file finished loading.
// If there are any routes which do not require translations, they can be skipped here.
router.beforeResolve((to, from, next) => {
  setLanguage(detectLanguage()).then(() => next())
})

// Validate UUIDs in route params
router.beforeEach((to, from, next) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  const uuidQueryParam = to.query.uuid
  if (uuidQueryParam && typeof uuidQueryParam === 'string' && !uuidRegex.test(uuidQueryParam))
    next('/')
  else
    next(true)
})

// Redirect old location detail route to new route which uses UUIDs as query params
router.beforeEach((to, from, next) => {
  if (to.name === 'old_location_detail' && to.params.uuid)
    next({ name: 'map', query: { uuid: to.params.uuid } })
  else
    next(true)
})

router.beforeEach((to, from) => {
  const mapViews = ['map', 'coords', 'location_detail']
  const formViews = ['add_location', 'report_location']
  if (to.name && typeof to.name === 'string' && mapViews.includes(to.name)
    && from.name && typeof from.name === 'string' && formViews.includes(from.name))
    to.meta.transition = 'slide-right'
})
