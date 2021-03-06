
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: '/member/adding', component: () => import('pages/addMember.vue') },
      { path: '/ammolist', component: () => import('pages/ammolist.vue') },
      { path: '/competition', component: () => import('pages/tournamentList.vue') },
      { path: '/memberwithpermission', component: () => import('pages/memberWithPermission.vue') },
      { path: '/member', component: () => import('pages/member.vue') },
      { path: '/license', component: () => import('pages/license.vue') },
      { path: '/patentWilling', component: () => import('pages/patentWilling.vue') },
      { path: '/statistics', component: () => import('pages/statistics.vue') },
      { path: '/otherFunctions', component: () => import('pages/otherFunctions.vue') },
      { path: '/settings', component: () => import('pages/settings.vue') },
      { path: '/armory', component: () => import('pages/armory.vue') },
      { path: '/armory/galery', component: () => import('pages/galery.vue') }
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
