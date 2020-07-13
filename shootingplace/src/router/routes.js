
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: '/member/adult', component: () => import('pages/membersAdult.vue') },
      { path: '/member/nonadult', component: () => import('pages/membersNonAdult.vue') },
      { path: '/member/nonactive', component: () => import('pages/membersNonActive.vue') },
      { path: '/member/erased', component: () => import('pages/membersErased.vue') },
      { path: '/member/addmember', component: () => import('pages/addMember.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
