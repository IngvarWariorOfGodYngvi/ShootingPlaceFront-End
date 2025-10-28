import EventBus from 'src/event-bus.js'

export function pushOrRemoveEmailFromList (email) {
  const parse = JSON.parse(window.localStorage.getItem('mailingList'))
  if (!parse.includes(email)) {
    parse.push(email)
  } else {
    const number1 = parse.indexOf(email)
    parse.splice(number1, 1)
  }
  window.localStorage.setItem('mailingList', JSON.stringify(parse))
  EventBus.$emit('emailUpdate')
}
