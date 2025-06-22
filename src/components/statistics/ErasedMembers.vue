<template>
<div>
  <div class="text-body2 bg-dark text-positive" style="border: 0">
    <div :class="mobile?'col':'row'">
      <q-card-section class="col-3">
        <q-item class="col">
          <q-input class="full-width" color="positive" input-class="text-positive" label-color="positive" dense filled v-model="firstDateErased" mask="####-##-##" label="Data początkowa">
            <template v-slot:append>
              <q-icon name="event" color="positive" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date @input="getSumErased ()" v-model="firstDateErased" mask="YYYY-MM-DD" class="bg-dark text-positive">
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
          <q-input class="full-width" color="positive" input-class="text-positive" label-color="positive" dense filled v-model="secondDateErased" mask="####-##-##" label="Data końcowa">
            <template v-slot:append>
              <q-icon name="event" color="positive" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date @input="getSumErased ()" v-model="secondDateErased" mask="YYYY-MM-DD" class="bg-dark text-positive">
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
          <q-btn color="primary" text-color="positive" @click="getSumErased ()">Wyszukaj</q-btn>
          <p></p>
          <q-btn v-if="firstDateErased!=null&&secondDateErased!=null" @click="getSumErasedXLSXFile()" label="pobierz plik xlsx" color="green-3" text-color="black"></q-btn>
          <q-btn v-else label="pobierz plik xlsx" color="green-3" disabled text-color="black"></q-btn>
        </div>
      </q-card-section>
      <q-card-section class="col">
        <div v-if="quantitySumErased.length <1" class="q-pa-md self-center col full-width no-outline text-bold text-center text-h6">Brak wyników skreślonych - Wybierz daty</div>
        <div v-if="quantitySumErased.length >0" class="q-pa-md self-center col full-width no-outline text-bold text-center text-h6">ilość skreślonych : {{quantitySumErased.length}}</div>
        <q-virtual-scroll v-if="quantitySumErased.length >0" :items="quantitySumErased" type="table" dense class="row full-width bg-dark text-positive" style="height: 50vh;">
          <template v-slot:before>
            <thead class="thead-sticky text-left">
            <tr class="bg-primary text-white">
              <th class="text-left">{{quantitySumErased.length}} Nazwisko i Imię</th>
              <th class="text-left" style="width:10%;">Powód</th>
              <th class="text-left" style="width:10%;">Numer<br/>Legitymacji</th>
              <th class="text-left" style="width:30%;">Informacje<br/>Dodatkowe</th>
            </tr>
            </thead>
          </template>
          <template v-slot="{ item, index }">
            <tr :key="index" style="cursor:pointer"  @dblclick="legitimationNumber = item.legitimationNumber; memberDial=true">
              <Tooltip2clickToShow></Tooltip2clickToShow>
              <td class="text-left xyz"><b>{{index+1}} </b> {{item.secondName}} {{item.firstName}}</td>
              <td class="text-left"><div>{{item.erasedEntity.date}}</div><div>{{item.erasedEntity.erasedType}}</div></td>
              <td class="text-left">nr leg. {{item.legitimationNumber}}</td>
              <td v-if="item.erasedEntity.additionalDescription==null" class="text-left">Brak dodatkowych informacj</td>
              <td v-if="item.erasedEntity.additionalDescription!=null" class="bg-warning self-center text-center text-black">{{item.erasedEntity.additionalDescription}}</td>
            </tr>
          </template>
        </q-virtual-scroll>
      </q-card-section>
    </div>
  </div>
  <q-dialog v-model="memberDial">
    <q-card style="min-width: 80vw" class="bg-dark">
      <q-card-section class="flex-center">
        <Member :member-number-legitimation="legitimationNumber"></Member>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn text-color="white" label="zamknij" color="primary" v-close-popup/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</div>
</template>
<style src="src/style/style.scss" lang="scss">
</style>
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
      firstDateErased: null,
      secondDateErased: this.createTodayDate(),
      quantitySumErased: [],
      legitimationNumber: null,
      success: false,
      message: null,
      mobile: App.mobile,
      local: App.host
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
      fetch(`${this.local}/statistics/erasedSum?firstDate=${this.firstDateErased.replace(/\//gi, '-')}&secondDate=${this.secondDateErased.replace(/\//gi, '-')}`, {
        method: 'GET'
      }).then(response => {
        response.json().then(response => {
          this.quantitySumErased = response
        })
      })
    },
    getSumErasedXLSXFile () {
      axios({
        url: `${this.local}/files/erasedSum?firstDate=${this.firstDateErased.replace(/\//gi, '-')}&secondDate=${this.secondDateErased.replace(/\//gi, '-')}`,
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))
        const fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', 'lista skreślonych.xlsx')
        document.body.appendChild(fileLink)
        fileLink.click()
        this.listDownload = true
        this.autoClose()
      })
    },
    autoClose () {
      setTimeout(() => {
        this.success = false
        this.message = null
      }, 2000)
    }
  }
}
</script>

<style scoped>

</style>
