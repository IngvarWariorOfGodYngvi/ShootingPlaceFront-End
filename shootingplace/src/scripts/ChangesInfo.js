export function changesInfo () {
  if (window.localStorage.getItem('ChangesInfo') == null) {
    window.localStorage.setItem('ChangesInfo', JSON.stringify([]))
  }
  const changes = window.localStorage.getItem('ChangesInfo')
  const a = JSON.parse(changes)
  if (a[0] == null || a[0] === !true) {
    a[0] = false // ogólnie sprawdź ustawienia
    window.localStorage.setItem('ChangesInfo', JSON.stringify(a))
  }
  if (a[1] == null || a[1] === !true) {
    a[1] = false // ciemny motyw
    window.localStorage.setItem('ChangesInfo', JSON.stringify(a))
  }
}
export function checking (number) {
  const a = JSON.parse(window.localStorage.getItem('ChangesInfo'))
  a[number] = true
  console.log(a)
  window.localStorage.setItem('ChangesInfo', JSON.stringify(a))
}
