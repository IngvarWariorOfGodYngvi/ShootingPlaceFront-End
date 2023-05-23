<template>
  <div class="q-pa-sm">
    <q-item-label v-if="quantities[8]>0" class="text-bold text-white self-center text-center" dense caption> <q-icon name="warning" color="warning" size="1.5em"></q-icon>Nieopłaconych licencji :
      {{ quantities[8] }} <q-icon name="warning" color="warning" size="1.5em"></q-icon>
    </q-item-label>
    <q-item-label class="text-bold text-white" dense caption>Najwyższy numer legitymacji : {{ number }}
    </q-item-label>
    <q-item-label class="text-bold text-white" dense caption>Licencje ważne : {{ quantities[1] }}
    </q-item-label>
    <q-item-label class="text-bold text-white" dense caption>Licencje nieważne : {{ quantities[2] }}
    </q-item-label>
    <q-item-label class="text-bold text-white" dense caption>Klubowiczów ogółem :
      {{ quantities[0] + quantities[3] }} ({{ quantities[0] }} + {{ quantities[3] }})
    </q-item-label>
    <q-item-label class="text-bold text-white" dense caption>Zapisów w aktualnym roku : {{ members }}
    </q-item-label>
    <q-item-label class="text-bold text-white" dense caption>Nowych licencji w aktualnym roku :
      {{ quantities[9] }}
    </q-item-label>
  </div>
</template>

<script>
import App from 'src/App.vue'
export default {
  name: 'membersQuantities',

  created () {
    this.check()
  },
  data () {
    return {
      quantities: [],
      members: '',
      number: '',
      local: App.host
    }
  },
  methods: {
    getNumber () {
      fetch('http://' + this.local + '/statistics/maxLegNumber', {
        method: 'GET'
      }).then(response => response.json()).then(response => {
        this.number = response
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
    getActualYearMemberCounts () {
      fetch('http://' + this.local + '/statistics/actualYearMemberCounts', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => response.json())
        .then(response => {
          this.members = response
        })
    },
    check () {
      this.getMembersQuantity()
      this.getActualYearMemberCounts()
      this.getNumber()
      setInterval(() => {
        this.getNumber()
        this.getMembersQuantity()
        this.getActualYearMemberCounts()
      }, 300000)
    }
  }
}

</script>
