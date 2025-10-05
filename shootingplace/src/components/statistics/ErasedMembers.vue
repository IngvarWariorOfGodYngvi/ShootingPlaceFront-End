<template>
  <div>
    <div class="text-body2 bg-dark text-positive" style="border: 0">
      <div Class="col">
        <q-card-section class="col-3">
          <q-item class="col">
            <q-input class="full-width" bg-color="primary" standout="" rounded input-class="text-positive"
              label-color="positive" dense v-model="firstDate" mask="####-##-##" label="Data początkowa">
              <template v-slot:append>
                <q-icon name="event" color="positive" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                    <q-date @input="getSumErased()" v-model="firstDate" mask="YYYY-MM-DD" class="bg-dark text-positive">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Zamknij" color="primary" />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </q-item>
          <q-item class="col">
            <q-input class="full-width" bg-color="secondary" standout="" rounded input-class="text-positive"
              label-color="positive" dense v-model="secondDate" mask="####-##-##" label="Data końcowa">
              <template v-slot:append>
                <q-icon name="event" color="positive" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                    <q-date @input="getSumErased()" v-model="secondDate" mask="YYYY-MM-DD"
                      class="bg-dark text-positive">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Zamknij" color="primary" />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </q-item>
          <q-btn glossy color="primary" text-color="positive" @click="getSumErased()">Wyszukaj</q-btn>
          <p></p>
          <q-btn glossy :loading="loading[0]" :disable="dis || firstDate == null || secondDate == null"
            @click="dis = true; simulateProgress()" label="pobierz plik .xlsx" color="green" text-color="white"></q-btn>
        </q-card-section>
        <q-inner-loading :showing="visible" label="Przetwarzanie..." color="primary" />
        <q-card-section class="col">
          <div v-if="list.length < 1"
            class="q-pa-md self-center col full-width no-outline text-bold text-center text-h6">Brak
            wyników skreślonych
            -
            Wybierz daty</div>
          <div v-if="list.length > 0"
            class="q-pa-md self-center col full-width no-outline text-bold text-center text-h6">ilość
            skreślonych :
            {{ list.length }}</div>
          <div class="row text-caption" style="cursor: pointer">
            <div class="col-3" @click="sortF('name')">lp <q-icon size="2em"
                :name="sortName ? 'arrow_drop_up' : 'arrow_drop_down'" />Nazwisko i imię</div>
            <div class="col-2" @click="sortF('couse')"><q-icon size="2em"
                :name="sortCouse ? 'arrow_drop_up' : 'arrow_drop_down'" />Powód</div>
            <div class="col-2 text-center" @click="sortF('legitimation')"><q-icon size="2em"
                :name="sortLegitimation ? 'arrow_drop_up' : 'arrow_drop_down'" />Numer<br> Legitymacji</div>
            <div class="col-2" @click="sortF('additional')"><q-icon size="2em"
                :name="sortAdditional ? 'arrow_drop_up' : 'arrow_drop_down'" />Informacje<br />Dodatkowe</div>
          </div>
          <q-scroll-area style="height: 50vh">
            <div v-for="(item, index) in list" :key="index" class="row hover1 items-center"
              @dblclick="legitimationNumber = item.legitimationNumber; memberDial = true">
              <Tooltip2clickToShow></Tooltip2clickToShow>
              <div class="col-3">{{ index + 1 }}&nbsp;
                {{ item.secondName }} {{ item.firstName }}
              </div>
              <div class="col-2text-left">
                <div>{{ item.erasedEntity.date }}</div>
                <div>{{ item.erasedEntity.erasedType }}</div>
              </div>
              <div class="col-2 text-center">
                {{ item.erasedEntity.additionalDescription }}
              </div>
            </div>
          </q-scroll-area>
          <!-- <q-virtual-scroll v-if="quantitySumErased.length > 0" :items="quantitySumErased" type="table" dense
            class="row full-width bg-dark text-positive" style="height: 50vh;">
            <template v-slot:before>
              <thead class="thead-sticky text-left">
                <tr class="bg-primary text-white">
                  <th class="text-left">{{ quantitySumErased.length }} Nazwisko i Imię</th>
                  <th class="text-left" style="width:10%;">Powód</th>
                  <th class="text-left" style="width:10%;">Numer<br />Legitymacji</th>
                  <th class="text-left" style="width:30%;">Informacje<br />Dodatkowe</th>
                </tr>
              </thead>
            </template>
            <template v-slot="{ item, index }">
              <tr :key="index" style="cursor:pointer"
                @dblclick="legitimationNumber = item.legitimationNumber; memberDial = true">
                <Tooltip2clickToShow></Tooltip2clickToShow>
                <td class="text-left xyz"><b>{{ index + 1 }} </b> {{ item.secondName }} {{ item.firstName }}</td>
                <td class="text-left">
                  <div>{{ item.erasedEntity.date }}</div>
                  <div>{{ item.erasedEntity.erasedType }}</div>
                </td>
                <td class="text-left">nr leg. {{ item.legitimationNumber }}</td>
                <td v-if="item.erasedEntity.additionalDescription == null" class="text-left">Brak dodatkowych informacj
                </td>
                <td v-if="item.erasedEntity.additionalDescription != null"
                  class="bg-warning self-center text-center text-black">{{ item.erasedEntity.additionalDescription }}</td>
              </tr>
            </template>
          </q-virtual-scroll> -->
        </q-card-section>
      </div>
    </div>
    <q-dialog v-model="memberDial">
      <q-card style="min-width: 80vw" class="bg-dark">
        <q-card-section class="flex-center">
          <Member :member-number-legitimation="legitimationNumber"></Member>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn text-color="white" label="zamknij" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog position="top" v-model="success">
      <q-card>
        <q-card-section>
          <div v-if="message != null" class="text-h6">{{ message }}</div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog position="standard" v-model="failure">
      <q-card class="bg-warning">
        <q-card-section>
          <div v-if="message != null" class="text-h6">{{ message }}</div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
<style src="src/style/style.scss" lang="scss"></style>
<script>
import App from 'src/App'
import lazyLoadComponent from 'src/utils/lazyLoadComponent'
import SkeletonBox from 'src/utils/SkeletonBox'
import axios from 'axios'

export default {
  name: 'ErasedMembers.vue',
  data () {
    return {
      memberDial: false,
      firstDate: null,
      secondDate: this.createTodayDate(),
      list: [],
      legitimationNumber: null,
      loading: [false],
      sortName: false,
      sortCouse: false,
      sortLegitimation: false,
      sortAdditional: false,
      dis: false,
      visible: false,
      success: false,
      failure: false,
      message: null,
      mobile: App.mobile,
      local: App.host
    }
  },
  setup () {
    function simulateProgress () {
      this.loading[0] = true
      if (this.dis) {
        this.getSumErasedXLSXFile()
      }
      setTimeout(() => {
        this.loading[0] = false
      }, 0)
    }
    return {
      simulateProgress
    }
  },
  components: {
    Member: lazyLoadComponent({
      componentFactory: () => import('components/member/Member.vue'),
      loading: SkeletonBox
    }),
    Tooltip2clickToShow: lazyLoadComponent({
      componentFactory: () => import('src/utils/Tooltip2clickToShow.vue'),
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
    getSumErased () {
      fetch(`${this.local}/statistics/erasedSum?firstDate=${this.firstDate.replace(/\//gi, '-')}&secondDate=${this.secondDate.replace(/\//gi, '-')}`, {
        method: 'GET'
      }).then(response => {
        response.json().then(response => {
          this.list = response
        }).then(() => {
          this.visible = false
        })
      }).catch(() => {
        this.visible = false
      })
    },
    sortF (type) {
      if (type === 'name') {
        if (!this.sortName) {
          this.list.sort((a, b) => ('' + b.secondName).localeCompare(a.secondName))
          this.sortName = !this.sortName
        } else {
          this.list.sort((a, b) => ('' + a.secondName).localeCompare(b.secondName))
          this.sortName = !this.sortName
        }
      }
      if (type === 'couse') {
        if (!this.sortCouse) {
          this.list.sort((a, b) => b.erasedEntity.erasedType.localeCompare(a.erasedEntity.erasedType))
          this.sortCouse = !this.sortCouse
        } else {
          this.list.sort((a, b) => a.erasedEntity.erasedType.localeCompare(b.erasedEntity.erasedType))
          this.sortCouse = !this.sortCouse
        }
      }
      if (type === 'legitimation') {
        if (!this.sortLegitimation) {
          this.list.sort((a, b) => b.legitimationNumber - a.legitimationNumber)
          this.sortLegitimation = !this.sortLegitimation
        } else {
          this.list.sort((a, b) => a.legitimationNumber - b.legitimationNumber)
          this.sortLegitimation = !this.sortLegitimation
        }
      }
      if (type === 'additional') {
        if (!this.sortAdditional) {
          this.list.sort((a, b) => b.erasedEntity.additionalDescription - a.erasedEntity.additionalDescription)
          this.sortAdditional = !this.sortAdditional
        } else {
          this.list.sort((a, b) => a.erasedEntity.additionalDescription - b.erasedEntity.additionalDescription)
          this.sortAdditional = !this.sortAdditional
        }
      }
      if (type === 'date') {
        if (!this.sortDate) {
          this.list.sort((a, b) => new Date(b.join_date) - new Date(a.join_date))
          this.sortDate = !this.sortDate
        } else {
          this.list.sort((a, b) => new Date(a.join_date) - new Date(b.join_date))
          this.sortDate = !this.sortDate
        }
      }
    },
    getSumErasedXLSXFile () {
      axios({
        url: `${this.local}/files/erasedSum?firstDate=${this.firstDate.replace(/\//gi, '-')}&secondDate=${this.secondDate.replace(/\//gi, '-')}`,
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))
        const fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', `lista skreślonych od ${this.firstDate.replace(/\//gi, '-')} do ${this.secondDate.replace(/\//gi, '-')}.xlsx`)
        document.body.appendChild(fileLink)
        fileLink.click()
        this.message = 'Pobrano plik'
        this.success = true
        this.autoClose()
      }).catch(() => {
        this.message = 'Coś poszło nie tak'
        this.failure = true
        this.autoClose()
      })
    },
    autoClose () {
      setTimeout(() => {
        this.dis = false
        this.success = false
        this.failure = false
        this.message = null
      }, 2000)
    }
  }
}
</script>

<style scoped></style>
