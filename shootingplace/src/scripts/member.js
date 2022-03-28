import { scroll } from 'quasar'
const { getScrollTarget, setScrollPosition } = scroll
const stringOptions = []
import Vue from 'vue'
import axios from 'axios'
import App from 'src/App.vue'
Vue.prototype.$axios = axios
Vue.directive('temp', function (el) {
  el.focus()
})

export default {
  data () {
    return {
      picture: false,
      socialWork: true,
      editLicense: false,
      editLicenseDate: null,
      editLicenseNumber: null,
      editLicenseCode: false,
      editLicensePayment: false,
      editLicensePaymentDate: null,
      editLicensePaymentYear: null,
      editLicensePaymentCode: false,
      deleteLicensePaymentCode: false,
      editContribution: false,
      editContributionPaymentDate: null,
      editContributionValidThruDate: null,
      editContributionCode: false,
      togglePaymentAlert: false,
      toggleHistoryPaymentCode: false,
      paymentUUID: null,
      member: null,
      filters: [],
      certificateChoices: ['ZAŚWIADCZENIE ZWYKŁE', 'ZAŚWIADCZENIE DO POLICJI'],
      certificateChoice: null,
      options: stringOptions,
      memberName: null,
      memberWord: null,
      name: null,
      name2: null,
      active: null,
      adult: null,
      erase: false,
      value: false,
      value1: false,
      value2: false,
      value3: false,
      value4: false,
      changeAdultConfirm: false,
      changeAdultCode: false,
      eraseAlert: false,
      backAlert: false,
      eraseConfirm: false,
      eraseBackConfirm: false,
      eraseCode: false,
      resurrectCode: false,
      backConfirm: false,
      activeCode: false,
      contributionRecord: '',
      contributionUUID: null,
      basicDataConfirm: false,
      basicDataConfirm1: false,
      contributionAlert: false,
      contributionDownloadConfirm: false,
      contributionConfirmDownloadAlert: false,
      personalCardDownloadConfirm: false,
      addressConfirm: false,
      addressConfirm1: false,
      historyContributionRecord: Date.now,
      contributionRecordConfirm: false,
      contributionRecordConfirm1: false,
      contributionRemoveRecordQuerry: false,
      contributionRemoveRecordQuerryCode: false,
      code: null,
      addAmmoConfirm: false,
      alert: false,
      patentConfirm: false,
      patentConfirm1: false,
      patentConfirm2: false,
      contribution: false,
      certificates: false,
      contributionCode: false,
      contributionHistoryCode: false,
      deactivate: false,
      eraseWeapon: false,
      eraseAssest: false,
      licenseConfirm: false,
      licensePayment: false,
      instructorConfirm: false,
      shootingLeaderConfirm: false,
      arbiterConfirm: false,
      arbiterProlongConfirm: false,
      arbiterUpdateClassConfirm: false,
      failure: false,
      success: false,
      message: null,
      barcode: null,
      number: '',
      legNumber: null,
      patentNumber: '',
      licenseNumber: '',
      validThru: '',
      memberDTOArg: [],
      calibers: [],
      quantities: [],
      erasedTypes: [],
      erasedType: null,
      patentDate: null,
      patentPistolPermission: false,
      patentRiflePermission: false,
      patentShotgunPermission: false,
      patentPistolPermission1: false,
      patentRiflePermission1: false,
      patentShotgunPermission1: false,
      licensePistolPermission: false,
      licenseRiflePermission: false,
      licenseShotgunPermission: false,
      licensePistolPermission1: false,
      licenseRiflePermission1: false,
      licenseShotgunPermission1: false,
      updateLicenseConfirm: false,
      prolongLicenseConfirm: false,
      noDomesticStarts: false,
      downloaded: false,
      permissionsInstructorNumber: '',
      permissionsShootingLeaderNumber: '',
      permissionsArbiterNumber: '',
      permissionsArbiterPermissionValidThru: '',
      ordinal: '',
      reason: null,
      erasedReasontype: null,
      erasedDate: null,
      weaponPermissionNumber: null,
      isExist: true,
      admissionToPossess: null,
      admissionToPossessIsExist: true,
      admission: false,
      permission: false,
      secondName: '',
      memberEmail: '',
      memberPhoneNumber: '',
      memberIdcard: '',
      memberSecondName: '',
      memberFirstName: '',
      memberPostOfficeCity: '',
      memberZipCode: '',
      memberStreet: '',
      memberStreetNumber: '',
      memberFlatNumber: '',
      memberAdultConfirm: null,
      search: '',
      memberUUID: null,
      caliberUUID: null,
      quantity: '',
      dateVar: /\//gi,
      allMember: true,
      certificateDownload: false,
      pzssPortal: false,
      forbidden: false,
      selected_file: '',
      local: App.host
    }
  },
  created () {
    this.getMembersNames()
    this.getListCalibers()
    this.getMembersQuantity()
    this.getAllMemberDTO()
    this.getListErasedType()
  },
  methods: {
    showloading () {
      this.$q.loading.show({ message: 'Dzieje się coś ważnego... Poczekaj' })
      this.timer = setTimeout(() => {
        this.$q.loading.hide()
        this.timer = 0
      }, 1000)
    },
    handleScroll (search) {
      const word = search.split(' ')
      const ele = document.getElementById(word[0])
      const target = getScrollTarget(ele)
      const offset = ele.offsetTop - ele.scrollHeight
      const duration = 500
      setScrollPosition(target, offset, duration)
    },
    addHistoryContributionRecord (uuid, date) {
      fetch('http://' + this.local + '/contribution/history/' + uuid + '?date=' + date.replace(/\//gi, '-') + '&pinCode=' + this.code, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.json().then(
            response => {
              this.success = true
              this.message = response
              this.code = null
              this.getMembersNames()
              this.showloading()
              this.getMemberByUUID(this.memberUUID)
              this.autoClose()
            })
        }
        if (response.status === 403) {
          this.forbidden = true
          this.code = null
          this.autoClose()
        }
        if (response.status === 400) {
          response.json().then(
            response => {
              this.message = response
              this.failure = true
              this.code = null
              this.autoClose()
            })
        }
      })
    },
    getMemberByLegitimationNumber () {
      const memberNameWord = this.memberName.split(' ')
      const legNumber = memberNameWord.length
      const memberNameLegitimation = memberNameWord[legNumber - 1]
      fetch('http://' + this.local + '/member/' + memberNameLegitimation, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => response.json()).then(response => {
        this.showloading()
        this.member = response
      })
    },
    getMemberByUUID (uuid) {
      fetch('http://' + this.local + '/member/uuid/' + uuid, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => response.json()).then(response => {
        this.showloading()
        this.member = response
      })
    },
    getMemberFromList (leg) {
      fetch('http://' + this.local + '/member/' + leg, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => response.json()).then(response => {
        this.showloading()
        this.member = response
      })
    },
    getMembersQuantity () {
      fetch('http://' + this.local + '/member/membersQuantity', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => response.json())
        .then(response => {
          this.quantities = response
        })
    },
    editContributionRecord () {
      fetch('http://' + this.local + '/contribution/edit?memberUUID=' + this.memberUUID + '&contributionUUID=' + this.contributionUUID + '&paymentDay=' + this.editContributionPaymentDate.replace(/\//gi, '-') + '&validThru=' + this.editContributionValidThruDate.replace(/\//gi, '-') + '&pinCode=' + this.code, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.json().then(
            response => {
              this.success = true
              this.message = response
              this.code = null
              this.getMembersNames()
              this.showloading()
              this.getMemberByUUID(this.memberUUID)
              this.autoClose()
            })
        }
        if (response.status === 403) {
          this.forbidden = true
          this.code = null
          this.autoClose()
        }
        if (response.status === 400) {
          response.json().then(
            response => {
              this.message = response
              this.failure = true
              this.code = null
              this.autoClose()
            })
        }
      })
    },
    removeContributionRecord () {
      fetch('http://' + this.local + '/contribution/remove/' + this.memberUUID + '?contributionUUID=' + this.contributionUUID + '&pinCode=' + this.code, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.json().then(
            response => {
              this.success = true
              this.message = response
              this.code = null
              this.getMembersNames()
              this.showloading()
              this.getMemberByUUID(this.memberUUID)
              this.autoClose()
            })
        }
        if (response.status === 403) {
          this.forbidden = true
          this.code = null
          this.autoClose()
        }
        if (response.status === 400) {
          response.json().then(
            response => {
              this.message = response
              this.failure = true
              this.code = null
              this.autoClose()
            })
        }
      })
    },
    prolongContribution (uuid) {
      fetch('http://' + this.local + '/contribution/' + uuid + '?pinCode=' + this.code, {
        method: 'PATCH'
      }).then(response => {
        if (response.status === 200) {
          response.json().then(
            response => {
              this.success = true
              this.message = response
              this.contributionAlert = true
              this.showloading()
              this.getMemberByUUID(this.memberUUID)
              this.autoClose()
              this.code = null
            })
        }
        if (response.status === 403) {
          this.forbidden = true
          this.code = null
          this.autoClose()
        }
        if (response.status === 400) {
          response.json().then(
            response => {
              this.message = response
              this.failure = true
              this.code = null
              this.autoClose()
            })
        }
      })
    },
    updateMember (uuid, email, phoneNumber) {
      const phone = String(phoneNumber)
      phone.replace('+48', '')
      const data = {
        email: email,
        phoneNumber: phone.replace('+48', '')
      }
      fetch('http://' + this.local + '/member/' + uuid, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.json().then(
            response => {
              this.success = true
              this.message = response
              this.memberEmail = ''
              this.memberPhoneNumber = ''
              this.showloading()
              this.getMemberByUUID(this.memberUUID)
              this.autoClose()
            })
        } else {
          response.json().then(
            response => {
              this.message = response
              this.failure = true
              this.autoClose()
            })
        }
      })
    },
    updateIDCardAndName (uuid, idcard, firstName, secondName) {
      const data = {
        idcard: idcard,
        firstName: firstName,
        secondName: secondName
      }
      fetch('http://' + this.local + '/member/' + uuid, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.json().then(
            response => {
              this.success = true
              this.message = response
              this.memberIdcard = ''
              this.memberSecondName = ''
              this.memberFirstName = ''
              this.showloading()
              this.getMemberByUUID(this.memberUUID)
              this.autoClose()
            })
        } else {
          response.json().then(
            response => {
              this.message = response
              this.failure = true
              this.autoClose()
            })
        }
      })
    },
    updateAddress (uuid, memberZipCode, memberPostOfficeCity, memberStreet, memberStreetNumber, memberFlatNumber) {
      const data = {
        zipCode: memberZipCode,
        postOfficeCity: memberPostOfficeCity,
        street: memberStreet,
        streetNumber: memberStreetNumber,
        flatNumber: memberFlatNumber
      }
      fetch('http://' + this.local + '/address/' + uuid, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.json().then(
            response => {
              this.success = true
              this.message = response
              this.memberZipCode = ''
              this.memberPostOfficeCity = ''
              this.memberStreet = ''
              this.memberStreetNumber = ''
              this.memberFlatNumber = ''
              this.showloading()
              this.getMemberByUUID(this.memberUUID)
              this.autoClose()
            })
        } else {
          response.json().then(
            response => {
              this.failure = true
              this.message = response
              this.autoClose()
            })
        }
      })
    },
    getMembersNames () {
      fetch('http://' + this.local + '/member/getAllNames', {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.filters = response
        })
    },
    getAllMemberDTOWithArgs () {
      const active = this.active
      const adult = this.adult
      const erase = this.erase
      fetch('http://' + this.local + '/member/getAllMemberDTOWithArgs?active=' + active + '&adult=' + adult + '&erase=' + erase, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.memberDTOArg = response.sort()
        })
    },
    getAllMemberDTO () {
      fetch('http://' + this.local + '/member/getAllMemberDTO', {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.memberDTOArg = response
        })
    },
    getListCalibers () {
      fetch('http://' + this.local + '/armory/calibers', {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.calibers = response
        })
    },
    getListErasedType () {
      fetch('http://' + this.local + '/member/erasedType', {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.erasedTypes = response
        })
    },
    addMemberAndAmmoToCaliber () {
      fetch('http://' + this.local + '/ammoEvidence/ammo?caliberUUID=' + this.caliberUUID + '&legitimationNumber=' + this.legNumber + '&counter=' + this.quantity + '&otherID=0', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.json().then(response => {
            this.message = response
            this.success = true
            this.getListCalibers()
            this.showloading()
            this.getMemberByUUID(this.memberUUID)
            this.autoClose()
          })
        }
        if (response.status === 400) {
          response.json().then(response => {
            this.message = response
            this.failure = true
            this.quantity = null
            this.autoClose()
          })
        }
        if (response.status === 406) {
          this.failure = true
          this.quantity = null
          this.autoClose()
        }
      })
    },
    getContributionPDF (memberUUID, contributionUUID) {
      axios({
        url: 'http://' + this.local + '/files/downloadContribution/' + this.memberUUID + '?contributionUUID=' + this.contributionUUID,
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))
        const fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', 'Składka_' + this.name + '_' + this.name2 + '.pdf')
        document.body.appendChild(fileLink)
        fileLink.click()
        this.contributionUUID = null
        this.downloaded = true
        this.autoClose()
      })
    },
    getPersonalCardPDF (memberUUID) {
      axios({
        url: 'http://' + this.local + '/files/downloadPersonalCard/' + this.memberUUID,
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))
        const fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', 'Karta_Członkowska_' + this.name + '_' + this.name2 + '.pdf')
        document.body.appendChild(fileLink)
        fileLink.click()
        this.downloaded = true
        this.autoClose()
      })
    },
    getApplicationForExtensionOfTheCompetitorsLicense () {
      axios({
        url: 'http://' + this.local + '/files/downloadApplication/' + this.memberUUID,
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))
        const fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', 'Wniosek_' + this.name + '_' + this.name2 + '.pdf')
        document.body.appendChild(fileLink)
        fileLink.click()
        this.downloaded = true
        this.autoClose()
      })
    },
    getdownloadCertificateOfClubMembership () {
      axios({
        url: 'http://' + this.local + '/files/downloadCertificateOfClubMembership/' + this.memberUUID + '?reason=' + this.certificateChoice,
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))
        const fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', 'Zaświadczenie_' + this.name + '_' + this.name2 + '.pdf')
        document.body.appendChild(fileLink)
        fileLink.click()
        this.certificateChoice = null
        this.downloaded = true
        this.autoClose()
      })
    },
    getCSVFile () {
      axios({
        url: 'http://' + this.local + '/files/downloadCSVFile/' + this.memberUUID,
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))
        const fileLink = document.createElement('a')
        console.log(response.data)
        fileLink.href = fileURL
        fileLink.setAttribute('download', response.data.type)
        document.body.appendChild(fileLink)
        fileLink.click()
        this.downloaded = true
        this.autoClose()
      })
    },
    addPatent (uuid, patentNumber, patentPistolPermission, patentRiflePermission, patentShotgunPermission, patentDate) {
      const data = {
        patentNumber: patentNumber,
        pistolPermission: patentPistolPermission,
        riflePermission: patentRiflePermission,
        shotgunPermission: patentShotgunPermission,
        dateOfPosting: patentDate.replace(this.dateVar, '-')
      }
      fetch('http://' + this.local + '/patent/' + uuid, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.json().then(
            response => {
              this.message = response
              this.success = true
              this.patentNumber = null
              this.patentPistolPermission = false
              this.patentRiflePermission = false
              this.patentShotgunPermission = false
              this.patentDate = null
              this.showloading()
              this.getMemberByUUID(this.memberUUID)
              this.autoClose()
            })
        } else {
          response.json().then(
            response => {
              this.message = response
              this.failure = true
              this.autoClose()
            })
        }
      })
    },
    addLicense (uuid, licenseNumber, licensePistolPermission, licenseRiflePermission, licenseShotgunPermission) {
      const data1 = {
        number: licenseNumber,
        pistolPermission: licensePistolPermission,
        riflePermission: licenseRiflePermission,
        shotgunPermission: licenseShotgunPermission
      }
      fetch('http://' + this.local + '/license/' + this.memberUUID, {
        method: 'PUT',
        body: JSON.stringify(data1),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.json().then(
            response => {
              this.success = true
              this.message = response
              this.licenseNumber = ''
              this.licensePistolPermission = false
              this.licenseRiflePermission = false
              this.licenseShotgunPermission = false
              this.showloading()
              this.getMemberByUUID(this.memberUUID)
              this.autoClose()
            })
        } else {
          response.json().then(
            response => {
              this.message = response
              this.failure = true
              this.autoClose()
            }
          )
        }
      })
    },
    prolongLicense (uuid, licensePistolPermission, licenseRiflePermission, licenseShotgunPermission) {
      const data = {
        pistolPermission: licensePistolPermission,
        riflePermission: licenseRiflePermission,
        shotgunPermission: licenseShotgunPermission
      }
      fetch('http://' + this.local + '/license/' + uuid, {
        method: 'PATCH',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.json().then(
            response => {
              this.success = true
              this.message = response
              this.licensePistolPermission = false
              this.licenseRiflePermission = false
              this.licenseShotgunPermission = false
              this.showloading()
              this.getMemberByUUID(this.memberUUID)
              this.autoClose()
            }
          )
        } else {
          response.json().then(
            response => {
              this.message = response
              this.failure = true
              this.autoClose()
            }
          )
        }
      })
    },
    editLicenseHistoryPayment () {
      fetch('http://' + this.local + '/license/editPayment?memberUUID=' + this.memberUUID + '&paymentUUID=' + this.paymentUUID + '&paymentDate=' + this.editLicensePaymentDate.replace(/\//gi, '-') + '&year=' + this.editLicensePaymentYear + '&pinCode=' + this.code, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.json().then(
            response => {
              this.message = response
              this.success = true
              this.code = null
              this.showloading()
              this.getMemberByUUID(this.memberUUID)
              this.autoClose()
            })
        } else {
          response.json().then(
            response => {
              this.message = response
              this.failure = true
              this.code = null
              this.autoClose()
            })
        }
      })
    },
    deleteLicenseHistoryPayment () {
      fetch('http://' + this.local + '/license/removePayment?paymentUUID=' + this.paymentUUID + '&pinCode=' + this.code, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.json().then(
            response => {
              this.message = response
              this.success = true
              this.code = null
              this.showloading()
              this.getMemberByUUID(this.memberUUID)
              this.autoClose()
            })
        } else {
          response.json().then(
            response => {
              this.message = response
              this.failure = true
              this.code = null
              this.autoClose()
            })
        }
      })
    },
    addLicenseHistoryPayment (uuid) {
      fetch('http://' + this.local + '/license/history/' + uuid, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.json().then(
            response => {
              this.message = response
              this.success = true
              this.showloading()
              this.getMemberByUUID(this.memberUUID)
              this.autoClose()
            })
        } else {
          response.json().then(
            response => {
              this.message = response
              this.failure = true
              this.autoClose()
            })
        }
      })
    },
    toggleHistoryPayment (uuid) {
      fetch('http://' + this.local + '/license/paymentToggle?paymentUUID=' + uuid + '&pinCode=' + this.code, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.json().then(
            response => {
              this.message = response
              this.success = true
              this.showloading()
              this.getMemberByUUID(this.memberUUID)
              this.autoClose()
            })
        } if (response.status === 403) {
          this.forbidden = true
          this.autoClose()
        } if (response.status === 400) {
          response.json().then(
            response => {
              this.message = response
              this.failure = true
              this.autoClose()
            })
        }
      })
    },
    forceUpdateLicence () {
      fetch('http://' + this.local + '/license/forceUpdate?memberUUID=' + this.memberUUID + '&number=' + this.editLicenseNumber + '&date=' + this.editLicenseDate.replace(/\//gi, '-') + '&pinCode=' + this.code, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.json().then(
            response => {
              this.message = response
              this.success = true
              this.editLicenseNumber = null
              this.editLicenseDate = null
              this.code = null
              this.showloading()
              this.getMemberByUUID(this.memberUUID)
              this.autoClose()
            })
        }
        if (response.status === 403) {
          this.forbidden = true
          this.autoClose()
        }
        if (response.status === 400) {
          response.json().then(
            response => {
              this.message = response
              this.failure = true
              this.code = null
              this.autoClose()
            })
        }
      })
    },
    changeWeaponPermission (uuid, weaponPermissionNumber, isExist) {
      const data = {
        number: weaponPermissionNumber,
        exist: isExist
      }
      fetch('http://' + this.local + '/weapon/weapon/' + uuid, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.json().then(
            response => {
              this.message = response
              this.success = true
              this.weaponPermissionNumber = null
              this.showloading()
              this.getMemberByUUID(this.memberUUID)
              this.autoClose()
            })
        } else {
          response.json().then(
            response => {
              this.message = response
              this.failure = true
              this.autoClose()
            })
        }
      })
    },
    changeWeaponAdmission (uuid, admissionToPossess, admissionToPossessIsExist) {
      const data = {
        admissionToPossessAWeapon: admissionToPossess,
        admissionToPossessAWeaponIsExist: admissionToPossessIsExist
      }
      fetch('http://' + this.local + '/weapon/weapon/' + uuid, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.json().then(
            response => {
              this.message = response
              this.success = true
              this.admissionToPossess = null
              this.showloading()
              this.getMemberByUUID(this.memberUUID)
              this.autoClose()
            })
        } else {
          response.json().then(
            response => {
              this.message = response
              this.failure = true
              this.autoClose()
            })
        }
      })
    },
    removeWeaponPermissionOrAdmission () {
      fetch('http://' + this.local + '/weapon/weapon/' + this.memberUUID + '?admission=' + this.admission + '&permission=' + this.permission, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.json().then(
            response => {
              this.message = response
              this.success = true
              this.admission = false
              this.permission = false
              this.showloading()
              this.getMemberByUUID(this.memberUUID)
              this.autoClose()
            })
        } else {
          response.json().then(
            response => {
              this.message = response
              this.failure = true
              this.autoClose()
            })
        }
      })
    },
    changeActive (uuid) {
      fetch('http://' + this.local + '/member/' + uuid + '?pinCode=' + this.code, {
        method: 'PATCH'
      }).then(response => {
        if (response.status === 200) {
          response.json().then(
            response => {
              this.message = response
              this.success = true
              this.code = null
              this.showloading()
              this.getMemberByUUID(this.memberUUID)
              this.autoClose()
            })
        }
        if (response.status === 403) {
          this.forbidden = true
          this.code = null
          this.autoClose()
        }
        if (response.status === 400) {
          response.json().then(
            response => {
              this.message = response
              this.failure = true
              this.autoClose()
            })
        }
      })
    },
    updateMemberPermissions (uuid, permissionsShootingLeaderNumber, permissionsInstructorNumber, permissionsArbiterNumber, permissionsArbiterPermissionValidThru) {
      const data = {
        shootingLeaderNumber: this.permissionsShootingLeaderNumber,
        instructorNumber: this.permissionsInstructorNumber,
        arbiterNumber: this.permissionsArbiterNumber,
        arbiterPermissionValidThru: this.permissionsArbiterPermissionValidThru.replace(this.dateVar, '-')
      }
      fetch('http://' + this.local + '/permissions/' + uuid + '?ordinal=' + this.ordinal, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }).then(response => {
        if (response.status === 200) {
          response.json().then(
            response => {
              this.message = response
              this.success = true
              this.permissionsShootingLeaderNumber = ''
              this.permissionsInstructorNumber = ''
              this.permissionsArbiterNumber = ''
              this.permissionsArbiterPermissionValidThru = ''
              this.ordinal = ''
              this.showloading()
              this.getMemberByUUID(this.memberUUID)
              this.autoClose()
            })
        } else {
          response.json().then(
            response => {
              this.message = response
              this.failure = true
              this.autoClose()
            })
        }
      })
    },
    updateMemberArbiterClass (uuid) {
      fetch('http://' + this.local + '/permissions/arbiter/' + uuid, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.json().then(
            response => {
              this.message = response
              this.success = true
              this.showloading()
              this.getMemberByUUID(this.memberUUID)
              this.autoClose()
            })
        } else {
          response.json().then(
            response => {
              this.message = response
              this.failure = true
              this.autoClose()
            })
        }
      })
    },
    eraseMember (uuid) {
      fetch('http://' + this.local + '/member/erase/' + uuid + '?additionalDescription=' + this.reason + '&erasedDate=' + this.erasedDate.replace(/\//gi, '-') + '&erasedType=' + this.erasedReasontype + '&pinCode=' + this.code, {
        method: 'PATCH'
      }).then(response => {
        if (response.status === 200) {
          response.json().then(
            response => {
              this.message = response
              this.success = true
              this.reason = null
              this.code = null
              this.showloading()
              this.getMemberByUUID(this.memberUUID)
              this.autoClose()
            })
        } else {
          response.json().then(
            response => {
              this.message = response
              this.failure = true
              this.code = null
              this.autoClose()
            })
        }
      })
    },
    changeAdult (uuid) {
      fetch('http://' + this.local + '/member/adult/' + uuid + '?pinCode=' + this.code, {
        method: 'PATCH'
      }).then(response => {
        if (response.status === 200) {
          response.json().then(
            response => {
              this.message = response
              this.success = true
              this.code = null
              this.getMembersNames()
              this.showloading()
              this.getMemberByUUID(this.memberUUID)
              this.autoClose()
            })
        } else {
          response.json().then(
            response => {
              this.message = response
              this.failure = true
              this.code = null
              this.autoClose()
            })
        }
      })
    },
    changePzss (uuid) {
      fetch('http://' + this.local + '/member/pzss/' + uuid, {
        method: 'PATCH'
      }).then(response => {
        if (response.status === 200) {
          response.json().then(
            response => {
              this.success = true
              this.message = response
              this.getMembersNames()
              this.showloading()
              this.getMemberByUUID(this.memberUUID)
              this.autoClose()
            }
          )
        } else {
          response.json().then(
            response => {
              this.message = response
              this.failure = true
              this.autoClose()
            }
          )
        }
      })
    },
    addBarcodeToMember (uuid, barcode) {
      fetch('http://' + this.local + '/member/addBarCode?uuid=' + uuid + '&barcode=' + barcode, {
        method: 'PUT'
      }).then(response => {
        if (response.status === 200) {
          response.json().then(
            response => {
              this.success = true
              this.message = response
              this.getMembersNames()
              this.showloading()
              this.getMemberByUUID(uuid)
              this.autoClose()
            }
          )
        } else {
          response.json().then(
            response => {
              this.message = response
              this.failure = true
              this.autoClose()
            }
          )
        }
      })
    },
    findMemberByBarCode () {
      fetch('http://' + this.local + '/member/findByBarCode?barcode=' + this.barcode, {
        method: 'GET'
      }).then(response => {
        if (response.status === 200) {
          response.json().then(
            response => {
              this.member = response
              this.showloading()
              this.barcode = null
              this.memberUUID = response.uuid
            }
          )
        } else {
          response.json().then(
            response => {
              this.message = response
              this.failure = true
              this.autoClose()
            }
          )
        }
      })
    },
    filter (val, update) {
      if (val === '') {
        update(() => {
          const needle = val.toLowerCase()
          this.options = this.filters.filter(v => v.toLowerCase().indexOf(needle) > -1)
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        this.options = this.filters.filter(v => v.toLowerCase().indexOf(needle) > -1)
      })
    },
    reload () {
      window.location.reload()
    },
    onRejected () {
      this.failure = true
      this.message = 'Nie można dodać, sprawdź rozmiar pliku i jego typ'
      this.autoClose()
    },
    file_selected (file) {
      this.selected_file = file[0]
    },
    autoClose () {
      setTimeout(() => {
        this.failure = false
        this.success = false
        this.forbidden = false
        this.downloaded = false
        this.message = null
        this.barcode = null
        this.code = null
      }, 2000)
    }
  },
  name: 'member'
}
