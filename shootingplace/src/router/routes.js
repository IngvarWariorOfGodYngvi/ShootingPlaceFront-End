import App from 'src/App.vue'
const licenseEnd = {
  isEnd: false,
  endDate: Date()
}
getLicence()
function getLicence () {
  fetch(`${App.host}/settings/termsAndLicense`, {
    method: 'GET'
  }).then(response => {
    response.json().then(response => {
      licenseEnd.isEnd = response.isEnd
      licenseEnd.endDate = response.endDate
      window.localStorage.setItem('licenseDate', response.endDate)
    })
  })
}
let routes = []
if (App.main) {
  if (licenseEnd.isEnd) {
    routes = [
      {
        path: '/',
        component: () => import(/* webpackChunkName: "layoutGłówny" */'layouts/MainLayout.vue'),
        children: [
          {
            path: '',
            component: () => import(/* webpackChunkName: "Index" */'pages/Index.vue')
          },
          {
            path: '/licenceEnd',
            name: 'Koniec Licencji',
            component: () => import(/* webpackChunkName: "Rejestr Pobytu na Strzelnicy" */'src/pages/LicenseEnd.vue')
          },
          {
            path: '/member',
            name: 'Lista Klubowiczów',
            component: () => import(/* webpackChunkName: "Lista Klubowiczów" */'pages/membersList.vue')
          },
          {
            path: '/statistics',
            name: 'statystyki',
            component: () => import(/* webpackChunkName: "Statystyki" */'pages/statistics.vue')
          }
        ]
      },

      // Always leave this as last one,
      // but you can also remove it
      {
        path: '*',
        component: () => import('pages/LicenseEnd.vue')
      }
    ]
  } else {
    routes = [
      {
        path: '/',
        component: () => import(/* webpackChunkName: "layoutGłówny" */'layouts/MainLayout.vue'),
        children: [
          {
            path: '',
            component: () => import(/* webpackChunkName: "Index" */'pages/Index.vue')
          },
          {
            path: '/evidenceBook',
            name: 'Książka',
            component: () => import(/* webpackChunkName: "Rejestr Pobytu na Strzelnicy" */'src/pages/EvidenceBookPage.vue')
          },
          {
            path: '/member/adding',
            name: 'dodawanie Klubowicza',
            component: () => import(/* webpackChunkName: "Dodawanie Klubowicza" */'pages/addMember.vue')
          },
          {
            path: '/ammolist',
            name: 'amunicja',
            component: () => import(/* webpackChunkName: "Lista Amunicyjna" */'pages/ammolist.vue')
          },
          {
            path: '/competition',
            name: 'zawody',
            component: () => import(/* webpackChunkName: "Zawody" */'pages/tournamentList.vue')
          },
          {
            path: '/member',
            component: () => import(/* webpackChunkName: "Lista Klubowiczów" */'pages/membersList.vue')
          },
          {
            path: '/license',
            name: 'licencje',
            component: () => import(/* webpackChunkName: "Licencje" */'pages/license.vue')
          },
          {
            path: '/licenseend',
            name: 'koniec licencji',
            component: () => import(/* webpackChunkName: "Koniec Licencji" */'pages/LicenseEnd.vue')
          },
          {
            path: '/statistics',
            name: 'statystyki',
            component: () => import(/* webpackChunkName: "Statystyki" */'pages/statistics.vue')
          },
          {
            path: '/otherFunctions',
            name: 'pozostałe funkcje',
            component: () => import(/* webpackChunkName: "Pozostałe funkcje" */'pages/otherFunctions.vue')
          },
          {
            path: '/files',
            component: () => import(/* webpackChunkName: "Pliki" */'pages/file.vue')
          },
          {
            path: '/armory',
            name: 'zbrojownia',
            component: () => import(/* webpackChunkName: "Zbrojownia" */'pages/armory.vue')
          },
          {
            path: '/juryPanel',
            name: 'panel sędziego',
            component: () => import(/* webpackChunkName: "Panel Sędziego" */'pages/juryPanel.vue')
          },
          {
            path: '/firstStart',
            name: 'Pierwszy Start',
            component: () => import(/* webpackChunkName: "Panel Sędziego" */'pages/FirstStart.vue')
          },
          {
            path: '/settings',
            component: () => import(/* webpackChunkName: "Ustawienia" */'pages/settings.vue')
          }
        ]
      },

      // Always leave this as last one,
      // but you can also remove it
      {
        path: '*',
        component: () => import('pages/Error404.vue')
      }
    ]
  }
} else if (App.main === false) {
  routes = [
    {
      path: '/',
      component: () => import(/* webpackChunkName: "layoutGłówny" */'layouts/MainLayout.vue'),
      children: [
        {
          path: '',
          component: () => import(/* webpackChunkName: "Index" */'pages/Index.vue')
        },
        {
          path: '/evidenceBook',
          name: 'Książka',
          component: () => import(/* webpackChunkName: "Rejestr Pobytu" */'src/pages/EvidenceBookPage.vue')
        },
        {
          path: '/member',
          component: () => import(/* webpackChunkName: "Lista Klubowiczów" */'pages/membersList.vue')
        },
        {
          path: '/ammolist',
          name: 'amunicja',
          component: () => import(/* webpackChunkName: "Lista Amunicyjna" */'pages/ammolist.vue')
        },
        {
          path: '/armory',
          name: 'zbrojownia',
          component: () => import(/* webpackChunkName: "Zbrojownia" */'pages/armory.vue')
        },
        {
          path: '/juryPanel',
          name: 'panel sędziego',
          component: () => import(/* webpackChunkName: "Panel Sędziego" */'pages/juryPanel.vue')
        },
        {
          path: '/settings',
          component: () => import(/* webpackChunkName: "Ustawienia" */'pages/settings.vue')
        }
      ]
    },

    // Always leave this as last one,
    // but you can also remove it
    {
      path: '*',
      component: () => import('pages/Error404.vue')
    }
  ]
} else {
  routes = [
    {
      path: '/',
      component: () => import(/* webpackChunkName: "layoutGłówny" */'layouts/MainLayout.vue'),
      children: [
        {
          path: '',
          component: () => import(/* webpackChunkName: "Index" */'pages/Index.vue')
        },
        {
          path: '/settings',
          component: () => import(/* webpackChunkName: "Ustawienia" */'pages/settings.vue')
        },
        {
          path: '/evidenceBook',
          name: 'Książka',
          component: () => import('src/pages/EvidenceBookPage.vue')
        }
      ]
    },

    // Always leave this as last one,
    // but you can also remove it
    {
      path: '*',
      component: () => import('pages/Error404.vue')
    }
  ]
}
export default routes
