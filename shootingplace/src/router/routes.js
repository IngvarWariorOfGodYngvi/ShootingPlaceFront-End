
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: '/member/adding', name: 'dodawanie', component: () => import('pages/addMember.vue') },
      { path: '/ammolist', name: 'amunicja', component: () => import('pages/ammolist.vue') },
      { path: '/competition', name: 'zawody', component: () => import('pages/tournamentList.vue') },
      { path: '/memberwithpermission', component: () => import('pages/memberWithPermission.vue') },
      { path: '/member', component: () => import('pages/membersList.vue') },
      { path: '/license', name: 'licencje', component: () => import('pages/license.vue') },
      { path: '/licenseend', component: () => import('pages/licenseEnd.vue') },
      { path: '/patentWilling', component: () => import('pages/patentWilling.vue') },
      { path: '/statistics', name: 'statystyki', component: () => import('pages/statistics.vue') },
      { path: '/otherFunctions', name: 'pozostałe funkcje', component: () => import('pages/otherFunctions.vue') },
      { path: '/settings', component: () => import('pages/settings.vue') },
      { path: '/armory', name: 'zbrojownia', component: () => import('pages/armory.vue') },
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
