<template>
  <div>
    <div class="text-body2 bg-dark text-positive" style="border: 0">
      <div :class="mobile?'col':'row'">
        <q-card-section class="col-3">
          <q-item class="col">
            <q-input class="full-width" bg-color="primary" standout="" rounded input-class="text-positive" label-color="positive" dense v-model="firstDateAmmo" mask="####-##-##"
                     label="Data początkowa">
              <template v-slot:append>
                <q-icon name="event" color="positive" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                    <q-date @input="otherAmmoTakesInTime ()" v-model="firstDateAmmo" mask="YYYY-MM-DD" class="bg-dark text-positive">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Zamknij" color="primary"/>
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </q-item>
          <q-item class="col">
            <q-input class="full-width" bg-color="secondary" standout="" rounded input-class="text-positive" label-color="positive" dense v-model="secondDateAmmo" mask="####-##-##"
                     label="Data końcowa">
              <template v-slot:append>
                <q-icon name="event" color="positive" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                    <q-date @input="otherAmmoTakesInTime ()" v-model="secondDateAmmo" mask="YYYY-MM-DD" class="bg-dark text-positive">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Zamknij" color="primary"/>
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </q-item>
          <div class="q-pa-md">
            <q-btn glossy color="primary" text-color="white" @click="otherAmmoTakesInTime ()">Wyszukaj</q-btn>
          </div>
        </q-card-section>
        <q-card-section class="col">
          <div v-if="quantityAmmo.length <1"
               class="q-pa-md self-center col full-width no-outline text-bold text-center text-h6">Brak wyników -
            Wybierz daty
          </div>
          <q-virtual-scroll v-if="quantityAmmo.length >0" :items="quantityAmmo" type="table" dense
                            class="row full-width bg-dark text-positive" style="height: 50vh;">
            <template v-slot:before>
              <thead class="thead-sticky text-left">
              <tr class="bg-primary text-white text-left">
                <th style="width: 25%">{{ quantityAmmo.length }} Nazwisko i Imię</th>
                <th style="width: 15%">Numer<br/>ID</th>
                <th style="width: 10%">5,6mm</th>
                <th style="width: 10%">9x19mm</th>
                <th style="width: 10%">12/76</th>
                <th style="width: 10%">.38</th>
                <th style="width: 10%">.357</th>
                <th style="width: 10%">7,62x39mm</th>
              </tr>
              </thead>
            </template>
            <template v-slot="{ item, index }">
              <tr :key="index" style="cursor:pointer">
                <td class="text-left xyz">
                  <div><b>{{ index + 1 }} </b>{{ item.secondName }} {{ item.firstName }}</div>
                </td>
                <td class="text-left">ID {{ item.legitimationNumber }}</td>
                <td class="text-left">
                  <div v-for="(caliber,id) in item.caliber" :key="id">
                    <div v-if="caliber.name === '5,6mm'">{{ caliber.quantity }} szt.</div>
                  </div>
                </td>
                <td class="text-left">
                  <div v-for="(caliber,id) in item.caliber" :key="id">
                    <div v-if="caliber.name === '9x19mm'">{{ caliber.quantity }} szt.</div>
                  </div>
                </td>
                <td class="text-left">
                  <div v-for="(caliber,id) in item.caliber" :key="id">
                    <div v-if="caliber.name === '12/76'">{{ caliber.quantity }} szt.</div>
                  </div>
                </td>
                <td class="text-left">
                  <div v-for="(caliber,id) in item.caliber" :key="id">
                    <div v-if="caliber.name === '.38'">{{ caliber.quantity }} szt.</div>
                  </div>
                </td>
                <td class="text-left">
                  <div v-for="(caliber,id) in item.caliber" :key="id">
                    <div v-if="caliber.name === '.357'">{{ caliber.quantity }} szt.</div>
                  </div>
                </td>
                <td class="text-left">
                  <div v-for="(caliber,id) in item.caliber" :key="id">
                    <div v-if="caliber.name === '7,62x39mm'">{{ caliber.quantity }} szt.</div>
                  </div>
                </td>
              </tr>
            </template>
          </q-virtual-scroll>
        </q-card-section>
      </div>
    </div>
  </div>
</template>
<style src="src/style/style.scss" lang="scss">
</style>
<script>
import App from 'src/App'

export default {
  name: 'MembersAndAmmo.vue',
  data () {
    return {
      firstDateAmmo: null,
      secondDateAmmo: this.createTodayDate(),
      quantityAmmo: [],
      mobile: App.mobile,
      local: App.host
    }
  },
  methods: {
    createTodayDate () {
      const date = new Date()
      let month = 0
      let day = 0
      if ((date.getMonth() + 1) < 10) {
        month = '0' + (date.getMonth() + 1)
      } else {
        month = (date.getMonth() + 1)
      }
      if (date.getDate() < 10) {
        day = '0' + (date.getDate())
      } else {
        day = (date.getDate())
      }
      return date.getFullYear() + '/' + month + '/' + day
    },
    otherAmmoTakesInTime () {
      fetch(`${this.local}/statistics/otherAmmoTakesInTime?firstDate=${this.firstDateAmmo.replace(/\//gi, '-')}&secondDate=${this.secondDateAmmo.replace(/\//gi, '-')}`, {
        method: 'GET'
      }).then(response => {
        response.json().then(response => {
          this.quantityAmmo = response
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
