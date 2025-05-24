<template>
  <q-page>
    <q-stepper header-nav v-model="step" ref="stepper" active-color="secondary" class="bg-dark" animated>
      <q-step :name="1" title="Tworzenie Klubu Macierzystego " caption="Wymagane" icon="settings" :done="step > 1" :disable="clubCount > 0">
        <div v-if="main" class="q-pa-md text-bold text-center text-h6 text-positive bg-dark">TWORZENIE KLUBU
          MACIERZYSTEGO
        </div>
        <q-card v-if="main" class="row bg-dark text-positive">
          <q-card-section class="col">
            <q-item>
              <q-input v-model="clubName" dense class="full-width" input-class="text-positive" label-color="positive"
                filled label="Nazwa" />
            </q-item>
            <q-item>
              <q-input v-model="clubFullName" dense class="full-width" input-class="text-positive"
                label-color="positive" filled label="Pełna nazwa do dokumentów" />
            </q-item>
            <q-item>
              <q-input v-model="clubLicenseNumber" dense class="full-width" input-class="text-positive"
                label-color="positive" filled label="Numer licencji Klubowej" />
            </q-item>
            <q-item>
              <q-input v-model="clubPhoneNumber" dense type="tel" class="full-width" input-class="text-positive"
                label-color="positive" mask="### ### ###" filled label="Telefon" />
            </q-item>
            <q-item>
              <q-input v-model="clubEmail" dense type="email" class="full-width" input-class="text-positive"
                label-color="positive" filled label="email" />
            </q-item>
            <q-item>
              <q-input v-model="clubAddress" dense type="address" class="full-width" input-class="text-positive"
                label-color="positive" filled label="Adres" />
            </q-item>
            <q-item>
              <q-input v-model="clubURL" dense type="url" class="full-width" input-class="text-positive"
                label-color="positive" filled label="Strona internetowa" />
            </q-item>
            <q-item>
              <q-btn @click="createMotherClub()" label="Dodaj i przejdź dalej" color="secondary" />
            </q-item>
          </q-card-section>
        </q-card>
      </q-step>
      <q-step :name="2" title="Tworzenie Super Użytkownika" caption="Wymagane" icon="settings" :done="step > 2">
        <SuperUser v-if="main"></SuperUser>
      </q-step>
      <q-step :name="3" title="Tworzenie Użytkowników" caption="Wymagane" icon="settings" :done="step > 3">
        <Users v-if="main"></Users>
      </q-step>
    </q-stepper>
    <q-dialog position="top" v-model="success">
      <q-card>
        <q-card-section>
          <div class="text-h6">{{ message }}</div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog position="standard" v-model="failure">
      <q-card class="bg-warning">
        <q-card-section>
          <div class="text-h6">{{ message }}</div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import App from 'src/App.vue'
import lazyLoadComponent from 'src/utils/lazyLoadComponent'
import SkeletonBox from 'src/utils/SkeletonBox.vue'
export default {
  data () {
    return {
      step: 1,
      clubCount: null,
      city: null,
      clubName: null,
      clubFullName: null,
      clubLicenseNumber: null,
      clubPhoneNumber: null,
      clubEmail: null,
      clubAddress: null,
      clubURL: null,
      failure: false,
      success: false,
      message: null,
      shootingPlace: App.shootingPlace,
      allMember: true,
      main: App.main,
      local: App.host
    }
  },
  created () {
    this.getClubsCount()
  },
  components: {
    SuperUser: lazyLoadComponent({
      componentFactory: () => import('components/settings/SuperUser.vue'),
      loading: SkeletonBox
    }),
    Users: lazyLoadComponent({
      componentFactory: () => import('components/settings/Users.vue'),
      loading: SkeletonBox
    })
  },
  methods: {
    createMotherClub () {
      const data = {
        name: this.clubName,
        fullName: this.clubFullName,
        licenseNumber: this.clubLicenseNumber,
        phoneNumber: this.clubPhoneNumber,
        email: this.clubEmail,
        address: this.clubAddress,
        url: this.clubURL
      }
      fetch(`${this.local}/settings/createMotherClub`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.text().then(
            response => {
              this.message = response
              this.success = true
              this.autoClose()
              this.step++
            }
          )
        } else {
          response.text().then(
            response => {
              this.message = response
              this.failure = true
              this.autoClose()
            }
          )
        }
      })
    },
    getClubsCount () {
      fetch(`${this.local}/club/count`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => response.text())
        .then(response => {
          this.clubCount = response
          response > 0 ? this.step = 2 : this.step = 1
        })
    },
    autoClose () {
      setTimeout(() => {
        this.message = null
        this.failure = false
        this.success = false
        this.code = null
        this.master = false
        this.acceptCodeUser1 = false
        this.accept = false
      }, 1500)
    },
    showloading () {
      this.$q.loading.show({ message: 'Dzieje się coś ważnego... Poczekaj' })
      this.timer = setTimeout(() => {
        this.$q.loading.hide()
        this.timer = 0
      }, 1000)
    }
  },
  name: 'member'
}
</script>
