
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/', redirect: '/prices' },
      { path: 'prices', component: () => import('pages/IndexPage.vue') },
      { path: 'generacion', component: () => import('pages/GenerationPage.vue') },
      { path: 'split', component: () => import('pages/SplitGenPage.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
