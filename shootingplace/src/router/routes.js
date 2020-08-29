
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: '/member/lista', component: () => import('pages/membersList.vue') },
      { path: '/member/usunieci', component: () => import('pages/membersErased.vue') },
      { path: '/member/dodawanie', component: () => import('pages/addMember.vue') },
      { path: '/ammolist', component: () => import('pages/ammolist.vue') },
      { path: '/dailyevidence', component: () => import('pages/dailyEvidenceBook.vue') },
      { path: '/competition', component: () => import('pages/tournamentList.vue') },
      { path: '/newcompetition', component: () => import('pages/addTournament.vue') }
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
