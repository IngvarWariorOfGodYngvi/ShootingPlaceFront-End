<template>
  <div v-if="competition!=null" class="col">
    <div
      class="full-width text-h5 text-bold text-center q-pa-none q-ma-none text-positive">{{
        competition.countingMethod === 'COMSTOCK' ? competition.name + ' ' + competition.countingMethod : competition.name
      }}
    </div>
    <div class="row q-pa-none q-ma-none">
      <div class="row fit q-pa-sm self-center text-positive">
        <div class="col-3 self-center no-outline text-left text-positive">Zawodnik</div>
        <div class="col-2 self-center no-outline text-left text-positive">Klub</div>
        <div class="col-1 self-center no-outline text-left text-positive">Numer Startowy</div>
        <div v-if="competition.countingMethod !== 'COMSTOCK'" class="col row">
          <div v-for="(item1,index1) in competition.scoreList[0].series" :key="index1"
               class="col self-center text-center text-caption text-positive">
            <div class="col">Seria {{ arabicToRomanNumberConverter(index1+1) }}</div>
          </div>
        </div>
        <div class="col-1 self-center no-outline text-center text-positive">
          {{ competition.countingMethod === 'COMSTOCK' ? 'trafienia' : '10/' }}
        </div>
        <div class="col-1 self-center no-outline text-center text-positive">
          {{ competition.countingMethod === 'COMSTOCK' ? 'czas' : '10X' }}
        </div>
        <div v-if="competition.countingMethod === 'COMSTOCK'"
             class="col-1 self-center no-outline text-center text-positive">
          procedury
        </div>
        <div v-if="competition.countingMethod === 'COMSTOCK'" class="col"></div>
        <div class="col-2 self-center no-outline text-positive">
          <div v-if="competition.countingMethod === 'COMSTOCK'" class="text-center">
            <div>
              Wynik / HF
            </div>
          </div>
          <div v-if="competition.countingMethod !== 'COMSTOCK'" class="text-center">
            <div> Wynik</div>
          </div>
        </div>
      </div>
    </div>
    <div v-for="(item,index) in competition.scoreList" :key="index" class="full-width q-pa-none q-ma-none">
      <div class="q-pl-xs q-pr-xs">
        <div class="row text-body2 full-width" :class="index%2===0?'bg-grey-3 text-black':'text-positive'">
          <!-- name & club -->
            <div class="col row q-pa-none q-pl-xs q-pr-xs self-center text-positive">
              <div class="col-3 self-center no-outline text-left text-caption text-bold"
                   :class="index%2===0?'text-black':'text-positive'">
                <div class="q-pa-none">
                  {{index+1}}
                  {{ item.member != null ? item.member.secondName : item.otherPersonEntity.secondName }}
                  {{ item.member != null ? item.member.firstName : item.otherPersonEntity.firstName }}
                </div>
              </div>
              <div class="col-2 self-center no-outline text-left text-caption "
                   :class="index%2===0?'text-black':'text-positive'">
                {{ item.member != null ? item.member.club.name : item.otherPersonEntity.club.name }}
              </div>
              <div class="col-1 self-center no-outline text-center text-caption"
                   :class="index%2===0?'text-black':'text-positive'">{{ item.metricNumber }}
              </div>
              <div v-if="competition.countingMethod !== 'COMSTOCK'" class="col row">
                <div v-for="(item1,index1) in item.series" :key="index1"
                     class="col self-center text-center text-caption" :class="index%2===0?'text-black':'text-positive'">
                  <div class="col">{{ item1 }}</div>
                </div>
              </div>
              <div class="col-1 self-center no-outline text-center text-caption"
                   :class="index%2===0?'text-black':'text-positive'">{{ item.outerTen !== 0 && item.innerTen !== 0 ? item.outerTen: '' }}
              </div>
              <div class="col-1 self-center no-outline text-center text-caption"
                   :class="index%2===0?'text-black':'text-positive'">{{ item.outerTen !== 0 && item.innerTen !== 0 ? competition.countingMethod === 'COMSTOCK' ? (item.innerTen + ' s') : item.innerTen : '' }}
              </div>
              <div v-if="competition.countingMethod === 'COMSTOCK'"
                   class="col-1 self-center no-outline text-center text-caption"
                   :class="index%2===0?'text-black':'text-positive'">{{ item.outerTen !== 0 && item.innerTen !== 0 ? item.procedures: '' }}
              </div>
              <div v-if="competition.countingMethod === 'COMSTOCK'" class="col"></div>
              <div class="col-2 self-center text-center">
                <div v-if="item.dnf||item.dsq||item.pk" :class="index%2===0?'text-black':'text-positive'"
                     class="self-center full-width no-outline text-center">
                  <div v-if="item.dnf">DNF</div>
                  <div v-if="item.dsq">DSQ</div>
                  <div v-if="item.pk">PK</div>
                </div>
                <div v-else class="self-center no-outline text-caption text-center text-bold q-pa-none q-ma-none">
                  <div v-if="competition.countingMethod === 'COMSTOCK'" class="q-pa-none q-ma-none"
                       :class="index%2===0?'text-black':'text-positive'">
                    <div class="q-pa-none q-ma-none">{{ item.outerTen !== 0 && item.innerTen !== 0 ? (item.score + ' / ' + item.hf) : ''}}</div>
                  </div>
                  <div v-else class="text-center self-center text-caption text-bold"
                       :class="index%2===0?'text-black':'text-positive'">
                    {{ item.score }}
                  </div>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import App from 'src/App'

export default {
  name: 'SingleCompetitionJuryPanelPresentationModeComponent.vue',
  props: {
    uuid: {
      type: String,
      required: true
    }
  },
  watch: {
    uuid (newValue, oldValue) {
      if (newValue !== oldValue) {
        this.getCompetitionByID(this.uuid)
      }
    }
  },
  data () {
    return {
      competition: null,
      local: App.host
    }
  },
  methods: {
    getCompetitionByID (uuid) {
      fetch('http://' + App.host + '/competitionMembersList/getByID/?uuid=' + uuid, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        response.json().then(response => {
          this.competition = response
          this.compName = response.name
        })
      })
    },
    arabicToRomanNumberConverter (arabicNumber) {
      let romanNumber
      switch (arabicNumber) {
        case 0:
          romanNumber = ''
          break
        case 1:
          romanNumber = 'I'
          break
        case 2:
          romanNumber = 'II'
          break
        case 3:
          romanNumber = 'III'
          break
        case 4:
          romanNumber = 'IV'
          break
        case 5:
          romanNumber = 'V'
          break
        case 6:
          romanNumber = 'VI'
          break
        case 7:
          romanNumber = 'VII'
          break
        case 8:
          romanNumber = 'VIII'
          break
        case 9:
          romanNumber = 'IX'
          break
        case 10:
          romanNumber = 'X'
          break
        default:
          romanNumber = 'error'
          break
      }
      return romanNumber
    }
  }
}
</script>

<style scoped>

</style>
