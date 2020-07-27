
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: '/member/adult', component: () => import('pages/membersAdult.vue') },
      { path: '/member/adulttemp', component: () => import('pages/membersAdultTemp.vue') },
      { path: '/member/nonadult', component: () => import('pages/membersNonAdult.vue') },
      { path: '/member/adultnonactive', component: () => import('pages/membersAdultNonActive.vue') },
      { path: '/member/nonadultnonactive', component: () => import('pages/membersNonAdultNonActive.vue') },
      { path: '/member/erased', component: () => import('pages/membersErased.vue') },
      { path: '/member/', component: () => import('pages/member.vue') },
      { path: '/member/addmember', component: () => import('pages/addMember.vue') },
      { path: '/ammolist', component: () => import('pages/ammolist.vue') },
      { path: '/dailyevidence', component: () => import('pages/dailyEvidenceBook.vue') }
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
