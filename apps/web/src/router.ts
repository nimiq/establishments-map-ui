import { createRouter, createWebHistory } from 'vue-router'
import { detectLanguage, setLanguage } from './i18n/i18n-setup'
import MapView from '@/components/MapView.vue'
// import { ModalName } from './components/Modal.vue'


export const router = createRouter({
  history: createWebHistory(),
  routes: [
    // Legacy URLs
    // {
    //   path: '/location/add',
    //   redirect: `?modal=${ModalName.CryptoMap}&nested=${ModalName.Candidate}`,
    // },
    // {
    //   path: '/location/report?uuid=:uuid',
    //   redirect: `?uuid=:uuid&modal=${ModalName.Report}`,
    // },
    // {
    //   path: '/establishment/:uuid',
    //   redirect: '/?uuid=:uuid',
    // },

    // Map URLs
    {
      path: '/@:lat(-?\\d+.?\\d+?),:lng(-?\\d+.?\\d+?),:zoom(\\d+)z',
      component: MapView,
      name: 'coords'
    },
    {
      path: '/',
      component: MapView
    },

    // There is no 404 page, so redirect to the map
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

// This router navigation guard is to prevent switching to the new route before the language file finished loading.
// If there are any routes which do not require translations, they can be skipped here.
router.beforeResolve(async (_to, _from, next) => {
  await setLanguage(detectLanguage())
  next()
})

// Validate UUIDs in route params
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
router.beforeEach((to, _from, next) => {
  const uuidQueryParam = to.query.uuid
  if (uuidQueryParam && typeof uuidQueryParam === 'string' && !uuidRegex.test(uuidQueryParam))
    next('/')
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
