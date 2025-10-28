import { colors } from 'quasar'

export function changeColor (backgroundDark, shootingPlace) {
  if (backgroundDark) {
    window.localStorage.setItem('BackgroundDark', 'true')
    colors.setBrand('dark-separator', '$grey-6')
    switch (shootingPlace) {
      case 'test': {
        colors.setBrand('primary', '#FD4D21')
        colors.setBrand('secondary', '#091123')
        colors.setBrand('dark', '#1D1D1D')
        break
      }
      case 'prod': {
        colors.setBrand('primary', '#871421')
        colors.setBrand('secondary', '#374550')
        colors.setBrand('dark', '#1D1D1D')
        break
      }
      case 'rcs': {
        colors.setBrand('primary', '#008000')
        colors.setBrand('secondary', '#A00000')
        colors.setBrand('dark', '#1D1D1D')
        break
      }
      case 'uks': {
        colors.setBrand('primary', '#134084')
        colors.setBrand('secondary', '#4E607F')
        colors.setBrand('dark', '#1D1D1D')
        break
      }
    }
    colors.setBrand('positive', '#FFFFFF')
    colors.setBrand('accent', '#A0A0A0')
  } else {
    window.localStorage.setItem('BackgroundDark', 'false')
    colors.setBrand('dark-separator', '$grey-2')
    switch (shootingPlace) {
      case 'test': {
        colors.setBrand('primary', '#FD4D21')
        colors.setBrand('secondary', '#091123')
        colors.setBrand('dark', '#F2F1E6')
        break
      }
      case 'prod': {
        colors.setBrand('primary', '#871421')
        colors.setBrand('secondary', '#374550')
        colors.setBrand('dark', '#FFFFFF')
        break
      }
      case 'rcs': {
        colors.setBrand('primary', '#008000')
        colors.setBrand('secondary', '#A00000')
        colors.setBrand('dark', '#FFFFFF')
        break
      }
      case 'uks': {
        colors.setBrand('primary', '#134084')
        colors.setBrand('secondary', '#4E607F')
        colors.setBrand('dark', '#F3F2F2')
        break
      }
    }
    colors.setBrand('positive', '#000000')
    colors.setBrand('accent', '#f3f3f3')
  }
}
