<template>
  <div>
    <div class="text-body2 bg-dark text-positive" style="border: 0">
      <div :class="mobile?'col':'row'">
        <q-card-section class="col-3">
          <q-item class="col">
            <q-input class="full-width" color="positive" input-class="text-positive" label-color="positive" dense filled v-model="firstDateAmmo" mask="####-##-##"
                     label="Data początkowa">
              <template v-slot:append>
                <q-icon name="event" color="positive" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                    <q-date @input="memberAmmoTakesInTime ()" v-model="firstDateAmmo" mask="YYYY-MM-DD" class="bg-dark text-positive">
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
            <q-input class="full-width" color="positive" input-class="text-positive" label-color="positive" dense filled v-model="secondDateAmmo" mask="####-##-##"
                     label="Data końcowa">
              <template v-slot:append>
                <q-icon name="event" color="positive" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                    <q-date @input="memberAmmoTakesInTime ()" v-model="secondDateAmmo" mask="YYYY-MM-DD" class="bg-dark text-positive">
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
            <q-btn color="primary" text-color="white" @click="memberAmmoTakesInTime ()">Wyszukaj</q-btn>
          </div>
        </q-card-section>
        <q-card-section class="col">
          <div v-if="quantityAmmo.length <1"
               class="q-pa-md self-center col full-width no-outline text-bold text-center text-h6">^ Brak wyników -
            Wybierz daty ^
          </div>
          <q-virtual-scroll v-if="quantityAmmo.length >0" :items="quantityAmmo" type="table" dense
                            class="row full-width" style="height: 50vh;">
            <template v-slot:before>
              <thead class="thead-sticky text-left">
              <tr>
                <th class="text-left" style="width: 25%">
                  <div>{{ quantityAmmo.length }} Nazwisko i Imię</div>
                </th>
                <th class="text-left" style="width: 15%">
                  <div>Numer</div>
                  <div>Legitymacji</div>
                </th>
                <th class="text-left" style="width: 10%">5,6mm</th>
                <th class="text-left" style="width: 10%">9x19mm</th>
                <th class="text-left" style="width: 10%">12/76</th>
                <th class="text-left" style="width: 10%">.38</th>
                <th class="text-left" style="width: 10%">.357</th>
                <th class="text-left" style="width: 10%">7,62x39mm</th>
              </tr>
              </thead>
            </template>
            <template v-slot="{ item, index }">
              <tr :key="index" style="cursor:pointer"
                  @dblclick="legitimationNumber = item.legitimationNumber; memberDial=true">
                <q-tooltip content-class="text-subtitle2" anchor="top middle">kliknij dwa razy aby wyświetlić podgląd
                </q-tooltip>
                <td class="text-left xyz">
                  <div><b>{{ index + 1 }} </b>{{ item.secondName }} {{ item.firstName }}</div>
                </td>
                <td class="text-left">nr leg. {{ item.legitimationNumber }}</td>
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
    <q-dialog v-model="memberDial" style="min-width: 80vw">
      <q-card class="bg-dark" style="min-width: 80vw">
        <q-card-section class="flex-center">
          <Member :member-number-legitimation="legitimationNumber"></Member>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="zamknij" color="primary" text-color="white" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import App from 'src/App'
import lazyLoadComponent from 'src/utils/lazyLoadComponent'
import SkeletonBox from 'src/utils/SkeletonBox'

export default {
  name: 'MembersAndAmmo.vue',
  data () {
    return {
      memberDial: false,
      legitimationNumber: null,
      firstDateAmmo: null,
      secondDateAmmo: this.createTodayDate(),
      quantityAmmo: [],
      mobile: App.mobile,
      local: App.host
    }
  },
  components: {
    Member: lazyLoadComponent({
      componentFactory: () => import('components/member/Member.vue'),
      loading: SkeletonBox
    })
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
    memberAmmoTakesInTime () {
      fetch('http://' + this.local + '/statistics/memberAmmoTakesInTime?firstDate=' + this.firstDateAmmo.replace(/\//gi, '-') + '&secondDate=' + this.secondDateAmmo.replace(/\//gi, '-'), {
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
