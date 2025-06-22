export function changesInfo () {
  if (window.localStorage.getItem('ChangesInfo') == null) {
    window.localStorage.setItem('ChangesInfo', JSON.stringify([]))
  }
  const changes = window.localStorage.getItem('ChangesInfo')
  const a = JSON.parse(changes)

  // 1 ogólnie sprawdź ustawienia
  // 2 ciemny motyw
  // 3 wyszukiwnie ludzi w panelu po numerze
  for (let i = 0; i < 3; i++) {
    if (a[i] == null || a[i] === !true) {
      a[i] = false
      window.localStorage.setItem('ChangesInfo', JSON.stringify(a))
    }
  }
}
export function checking (number) {
  const a = JSON.parse(window.localStorage.getItem('ChangesInfo'))
  a[number] = true
  console.log(a)
  window.localStorage.setItem('ChangesInfo', JSON.stringify(a))
}
