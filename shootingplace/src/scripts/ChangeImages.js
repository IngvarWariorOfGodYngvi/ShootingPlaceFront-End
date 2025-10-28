export function changeImage (shootingPlace) {
  switch (shootingPlace) {
    case 'test': {
      return require('src/assets/logo.jpg')
    }
    case 'prod': {
      return require('src/assets/logo1.jpg')
    }
    case 'rcs': {
      return require('src/assets/logo2.jpg')
    }
    case 'uks': {
      return require('src/assets/logo3.jpg')
    }
  }
}
export function changeImageLong (shootingPlace) {
  switch (shootingPlace) {
    case 'test': {
      return require('src/assets/logo_long.jpg')
    }
    case 'prod': {
      return require('src/assets/logo1_long.jpg')
    }
    case 'rcs': {
      return require('src/assets/logo2_long.jpg')
    }
    case 'uks': {
      return require('src/assets/logo3_long.jpg')
    }
  }
}
