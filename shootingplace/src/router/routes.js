
const routes = [
  {
    path: '/',
    component: () => import(/* webpackChunkName: "layoutGłówny" */'layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import(/* webpackChunkName: "Index" */'pages/Index.vue') },
      { path: '/member/adding', name: 'dodawanie Klubowicza', component: () => import(/* webpackChunkName: "Dodawanie Klubowicza" */'pages/addMember.vue') },
      { path: '/ammolist', name: 'amunicja', component: () => import(/* webpackChunkName: "Lista Amunicyjna" */'pages/ammolist.vue') },
      { path: '/competition', name: 'zawody', component: () => import(/* webpackChunkName: "Zawody" */'pages/tournamentList.vue') },
      { path: '/memberwithpermission', component: () => import(/* webpackChunkName: "Uprawnienia " */'pages/memberWithPermission.vue') },
      { path: '/member', component: () => import(/* webpackChunkName: "Lista Klubowiczów" */'pages/membersList.vue') },
      { path: '/license', name: 'licencje', component: () => import(/* webpackChunkName: "Licencje" */'pages/license.vue') },
      { path: '/licenseend', component: () => import(/* webpackChunkName: "Koniec Licencji" */'pages/licenseEnd.vue') },
      { path: '/patentWilling', component: () => import(/* webpackChunkName: "Patentowicze" */'pages/patentWilling.vue') },
      { path: '/statistics', name: 'statystyki', component: () => import(/* webpackChunkName: "Statystyki" */'pages/statistics.vue') },
      { path: '/otherFunctions', name: 'pozostałe funkcje', component: () => import(/* webpackChunkName: "Pozostałe funkcje" */'pages/otherFunctions.vue') },
      { path: '/settings', component: () => import(/* webpackChunkName: "Ustawienia" */'pages/settings.vue') },
      { path: '/files', component: () => import(/* webpackChunkName: "Pliki" */'pages/file.vue') },
      { path: '/armory', name: 'zbrojownia', component: () => import(/* webpackChunkName: "Zbrojownia" */'pages/armory.vue') },
      { path: '/juryPanel', name: 'panel sędziego', component: () => import(/* webpackChunkName: "Panel Sędziego" */'pages/juryPanel.vue') },
      { path: '/armory/galery', component: () => import(/* webpackChunkName: "Galeria" */'pages/galery.vue') },
      { path: '/test', component: () => import(/* webpackChunkName: "Galeria" */'pages/test.vue') }
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
