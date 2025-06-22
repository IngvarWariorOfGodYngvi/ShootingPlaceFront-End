import { changesInfo } from 'src/scripts/ChangesInfo.js'
export function scripts () {
  if (window.localStorage.getItem('main') == null) {
    window.localStorage.setItem('main', null)
  }
  if (window.localStorage.getItem('mailingList') == null) {
    window.localStorage.setItem('mailingList', JSON.stringify([]))
  }
  if (window.localStorage.getItem('arbiter') == null) {
    window.localStorage.setItem('arbiter', '000')
  }
  if (window.localStorage.getItem('AddShootingPacket') == null) {
    window.localStorage.setItem('AddShootingPacket', true)
  }
  if (window.localStorage.getItem('AddSingleAmmo') == null) {
    window.localStorage.setItem('AddSingleAmmo', false)
  }
  if (window.localStorage.getItem('BackgroundDark') == null) {
    window.localStorage.setItem('BackgroundDark', true)
  }
  if (window.localStorage.getItem('ClosedCompetitionTab') == null) {
    window.localStorage.setItem('ClosedCompetitionTab', true)
  }
  if (window.localStorage.getItem('DialogWindowAfterAddPlayer') == null) {
    window.localStorage.setItem('DialogWindowAfterAddPlayer', true)
  }
  if (window.localStorage.getItem('GunList') == null) {
    window.localStorage.setItem('GunList', false)
  }
  if (window.localStorage.getItem('AddGroupAmmo') == null) {
    window.localStorage.setItem('AddGroupAmmo', true)
  }
  if (window.localStorage.getItem('JuryPanelCompetitionInExpansionItem') == null) {
    window.localStorage.setItem('JuryPanelCompetitionInExpansionItem', true)
  }
  if (window.localStorage.getItem('TopTenTab') == null) {
    window.localStorage.setItem('TopTenTab', true)
  }
  if (window.localStorage.getItem('MembersBirthday') == null) {
    window.localStorage.setItem('MembersBirthday', true)
  }
  if (window.localStorage.getItem('MembersCounter') == null) {
    window.localStorage.setItem('MembersCounter', true)
  }
  changesInfo()
}
