<template>
  <div>
    <q-btn color="secondary" label="Kreator konkurencji" @click="createNewCompetiton = true"></q-btn>
    <q-dialog v-model="createNewCompetiton">
      <q-card class="bg-dark">
        <q-card-section class="items-center">
          <q-item-section v-if="!notUsed">
            <q-item-label class="text-h4 text-bold text-positive">Kreator Konkurencji</q-item-label>
            <q-item-label class="text-positive">Utworzenie nowej konkurencji da możliwość wybrania jej podczas zawodów
            </q-item-label>
            <div class="row bg-grey-1">
              <q-radio class="col" color="orange" @input="meters = false" v-model="meter" :val="'10'"
                label="10m"></q-radio>
              <q-radio class="col" color="orange" @input="meters = false" v-model="meter" :val="'25'"
                label="25m"></q-radio>
              <q-radio class="col" color="orange" @input="meters = false" v-model="meter" :val="'50'"
                label="50m"></q-radio>
              <q-checkbox class="col" color="orange" @input="meter = ''" v-model="meters" :val="false"
                label="inne"></q-checkbox>
              <q-item class="col">
                <q-input onkeypress="return (event.charCode > 44 && event.charCode < 58)" class="bg-grey-4 center justify"
                  filled v-if="meters" style="width: 100px" v-model="meter" stack-label label="ilość metrów"></q-input>
              </q-item>
            </div>
            <div class="row bg-grey-2">
              <q-checkbox v-model="dynamic" label="konkurencja dynamiczna"></q-checkbox>
              <div v-if="!dynamic">
                <q-radio class="col" color="orange"
                  @input="machinegun = ''; dynamic = ''; choice4 = ''; choice5 = ''; choice6 = ''; choice7 = ''; choice8 = ''; choice9 = '' "
                  v-model="discipline" :val="'Pistolet'" label="Pistolet"></q-radio>
                <q-radio class="col" color="orange"
                  @input="machinegun = ''; dynamic = ''; choice4 = ''; choice5 = ''; choice6 = ''; choice7 = ''; choice8 = ''; choice9 = '' "
                  v-model="discipline" :val="'Karabin'" label="Karabin"></q-radio>
                <q-radio class="col" color="orange"
                  @input="machinegun = ''; dynamic = ''; choice4 = ''; choice5 = ''; choice6 = ''; choice7 = ''; choice8 = ''; choice9 = ''; meters = false; meter = '' "
                  v-model="discipline" :val="'Strzelba'" label="Strzelba"></q-radio>
              </div>
              <div v-else>
                <q-checkbox class="col" color="orange"
                  @input="machinegun = ''; dynamic = ''; choice4 = ''; choice5 = ''; choice6 = ''; choice7 = ''; choice8 = ''; choice9 = '' "
                  v-model="dynamicChoice" :val="'Pistolet'" label="Pistolet"></q-checkbox>
                <q-checkbox class="col" color="orange"
                  @input="machinegun = ''; dynamic = ''; choice4 = ''; choice5 = ''; choice6 = ''; choice7 = ''; choice8 = ''; choice9 = '' "
                  v-model="dynamicChoice" :val="'Karabin'" label="Karabin"></q-checkbox>
                <q-checkbox class="col" color="orange"
                  @input="machinegun = ''; dynamic = ''; choice4 = ''; choice5 = ''; choice6 = ''; choice7 = ''; choice8 = ''; choice9 = ''; meters = false; meter = '' "
                  v-model="dynamicChoice" :val="'Strzelba'" label="Strzelba"></q-checkbox>
              </div>
            </div>
            <div class="col bg-grey-2">
              <q-checkbox class="row" v-if="discipline === 'Strzelba'" :val="''" true-value=" maszynowa" false-value=""
                color="orange" v-model="machinegun" label="maszynowa"></q-checkbox>
              <q-checkbox class="row" v-else :val="''" true-value=" maszynowy" false-value="" color="orange"
                v-model="machinegun" label="maszynowy"></q-checkbox>
              <q-checkbox class="row" v-if="discipline === 'Strzelba'" :val="''" true-value=" dynamiczna" false-value=""
                color="orange" v-model="dynamic" label="dynamiczna"></q-checkbox>
              <q-checkbox class="row" v-else :val="''" true-value=" dynamiczny" false-value="" color="orange"
                v-model="dynamic" label="dynamiczny"></q-checkbox>
              <q-checkbox class="row" @input="choice9 = ''" v-if="discipline === 'Strzelba'" :val="''"
                true-value=" sportowa" false-value="" color="orange" v-model="choice5" label="sportowa"></q-checkbox>
              <q-checkbox class="row" @input="choice9 = ''" v-else :val="''" true-value=" sportowy" false-value=""
                color="orange" v-model="choice5" label="sportowy"></q-checkbox>
              <q-checkbox class="row" v-if="discipline === 'Strzelba'" :val="''" true-value=" dowolna" false-value=""
                color="orange" v-model="choice6" label="dowolna"></q-checkbox>
              <q-checkbox class="row" v-else :val="''" true-value=" dowolny" false-value="" color="orange"
                v-model="choice6" label="dowolny"></q-checkbox>
              <q-checkbox class="row" @input="choice9 = ''" v-if="discipline === 'Strzelba'" :val="''"
                true-value=" pneumatyczna" false-value="" color="orange" v-model="choice7"
                label="pneumatyczna"></q-checkbox>
              <q-checkbox class="row" @input="choice9 = ''" v-else :val="''" true-value=" pneumatyczny" false-value=""
                color="orange" v-model="choice7" label="pneumatyczny"></q-checkbox>
              <q-checkbox class="row" v-if="discipline === 'Strzelba'" :val="''" true-value=" statyczna" false-value=""
                color="orange" v-model="choice8" label="statyczna"></q-checkbox>
              <q-checkbox class="row" v-else :val="''" true-value=" statyczny" false-value="" color="orange"
                v-model="choice8" label="statyczny"></q-checkbox>
            </div>
            <div class="row bg-grey-3">
              <q-radio class="col" v-if="!choice7 && discipline !== 'Strzelba' && !choice5" color="orange" v-model="choice9"
                :val="' centralnego zapłonu'" label="centralnego zapłonu"></q-radio>
              <q-radio class="col" v-if="!choice7 && discipline !== 'Strzelba'" color="orange" v-model="choice9"
                :val="' bocznego zapłonu'" label="bocznego zapłonu"></q-radio>
            </div>
            <div class="row bg-grey-4">
              <q-radio class="row" color="orange" @input="quantity = false" v-model="choice10" :val="'5'"
                label="5 strzałów"></q-radio>
              <q-radio class="row" color="orange" @input="quantity = false" v-model="choice10" :val="'7'"
                label="7 strzałów"></q-radio>
              <q-radio class="row" color="orange" @input="quantity = false" v-model="choice10" :val="'10'"
                label="10 strzałów"></q-radio>
              <q-radio class="row" color="orange" @input="quantity = false" v-model="choice10" :val="'13'"
                label="13 strzałów"></q-radio>
              <q-radio class="row" color="orange" @input="quantity = false" v-model="choice10" :val="'15'"
                label="15 strzałów"></q-radio>
              <q-radio class="row" color="orange" @input="quantity = false" v-model="choice10" :val="'20'"
                label="20 strzałów"></q-radio>
              <q-checkbox class="row" color="orange" @input="choice10 = []" v-model="quantity" :val="false"
                label="inne"></q-checkbox>
              <q-item class="row">
                <q-input @focus="choice10 = []" onkeypress="return (event.charCode > 44 && event.charCode < 58)"
                  class="full-width bg-grey-4 center justify" filled v-if="quantity" style="width: 100px"
                  v-model="choice10" stack-label label="Ilość strzałów"></q-input>
              </q-item>
            </div>
            <div class="row bg-grey-5">
              <q-radio color="orange" v-model="choice11" :val="' OPEN'" label="OPEN"></q-radio>
              <q-radio color="orange" v-model="choice11" :val="' Młodzieżowa'" label="Młodzieżowa"></q-radio>
            </div>
            <div class="row bg-grey-6">
              <q-item class="items-center">Metoda Liczenia :</q-item>
              <q-radio class="col" color="primary" v-model="choice12" :val="'NORMAL'" label="Normalnie"></q-radio>
              <q-radio class="col" color="primary" v-model="choice12" :val="'COMSTOCK'" label="Comstock"></q-radio>
            </div>
            <div class="row bg-grey-7">
              <q-item dense class="row justify-around">Kaliber :</q-item>
              <q-radio dense class="row justify-around q-pl-md" v-model="choice13" v-for="(calibers, uuid) in calibers"
                :key="uuid" :val="calibers.uuid" :label="calibers.name">
              </q-radio>
            </div>
            <div class="row bg-grey-8">
              <q-item class="items-center">Ilość Strzałów próbnych :</q-item>
              <q-input onkeypress="return (event.charCode > 44 && event.charCode < 58)"
                class="full-width col center justify" filled v-model="choice14" stack-label></q-input>
            </div>
            <div class="row text-h6 text-positive">
              <q-item-label>Nazwa konkurencji :</q-item-label>
              <q-item-label v-if="meter"> {{ meter + 'm' }} {{ ' ' + discipline }} {{ ' ' + machinegun }}
                {{ ' ' + dynamic }} {{ ' ' + choice4 }} {{ ' ' + choice5 }} {{ ' ' + choice6 }} {{ ' ' + choice7 }}
                {{ ' ' + choice8 }} {{ ' ' + choice9 }} {{ ' ' + choice10 + ' strzałów' }} {{ ' ' + choice11 }}
              </q-item-label>
              <q-item-label v-else> {{ meter }} {{ ' ' + discipline }} {{ ' ' + machinegun }}
                {{ ' ' + dynamic }}
                {{ ' ' + choice4 }} {{ ' ' + choice5 }} {{ ' ' + choice6 }} {{ ' ' + choice7 }} {{ ' ' + choice8 }}
                {{ ' ' + choice9 }} {{ ' ' + choice10 + ' strzałów' }} {{ ' ' + choice11 }}
              </q-item-label>
            </div>
          </q-item-section>
          <q-item-section v-if="notUsed">
            <q-item>
              <q-item-label class="text-h6 text-bold text-justify text-positive">Można nadać własną nazwę zawodów bez używania
                kreatora
              </q-item-label>
            </q-item>
            <div class="row bg-grey-2">
              <q-checkbox v-model="dynamic" @input="choice12 = 'COMSTOCK'" label="konkurencja dynamiczna"></q-checkbox>
              <div v-if="!dynamic">
                <q-radio class="col" color="orange"
                  @input="machinegun = ''; dynamic = ''; choice4 = ''; choice5 = ''; choice6 = ''; choice7 = ''; choice8 = ''; choice9 = '' "
                  v-model="discipline" :val="'Pistolet'" label="Pistolet"></q-radio>
                <q-radio class="col" color="orange"
                  @input="machinegun = ''; dynamic = ''; choice4 = ''; choice5 = ''; choice6 = ''; choice7 = ''; choice8 = ''; choice9 = '' "
                  v-model="discipline" :val="'Karabin'" label="Karabin"></q-radio>
                <q-radio class="col" color="orange"
                  @input="machinegun = ''; dynamic = ''; choice4 = ''; choice5 = ''; choice6 = ''; choice7 = ''; choice8 = ''; choice9 = ''; meters = false; meter = '' "
                  v-model="discipline" :val="'Strzelba'" label="Strzelba"></q-radio>
              </div>
              <div v-else class="row bg-grey-3">
                <q-checkbox class="col" color="orange"
                  @input="machinegun = ''; dynamic = ''; choice4 = ''; choice5 = ''; choice6 = ''; choice7 = ''; choice8 = ''; choice9 = '' "
                  v-model="dynamicChoice" :val="'Pistolet'" label="Pistolet"></q-checkbox>
                <q-checkbox class="col" color="orange"
                  @input="machinegun = ''; dynamic = ''; choice4 = ''; choice5 = ''; choice6 = ''; choice7 = ''; choice8 = ''; choice9 = '' "
                  v-model="dynamicChoice" :val="'Karabin'" label="Karabin"></q-checkbox>
                <q-checkbox class="col" color="orange"
                  @input="machinegun = ''; dynamic = ''; choice4 = ''; choice5 = ''; choice6 = ''; choice7 = ''; choice8 = ''; choice9 = ''; meters = false; meter = '' "
                  v-model="dynamicChoice" :val="'Strzelba'" label="Strzelba"></q-checkbox>
              </div>
              <q-input v-if="!dynamic" @focus="choice10 = []"
                onkeypress="return (event.charCode > 44 && event.charCode < 58)" class="full-width col center justify"
                filled style="width: 100px" v-model="choice10" stack-label label="Ilość strzałów pistolet"></q-input>
              <div v-if="dynamic" class="row">
                <q-input v-if="dynamicChoice.includes('Pistolet')"
                  onkeypress="return (event.charCode > 44 && event.charCode < 58)" class="full-width col center justify"
                  filled v-model="dynamicChoice1" stack-label label="Ilość strzałów pistolet"></q-input>
                <q-input v-if="dynamicChoice.includes('Karabin')"
                  onkeypress="return (event.charCode > 44 && event.charCode < 58)" class="full-width col center justify"
                  filled v-model="dynamicChoice2" stack-label label="Ilość strzałów karabin"></q-input>
                <q-input v-if="dynamicChoice.includes('Strzelba')"
                  onkeypress="return (event.charCode > 44 && event.charCode < 58)" class="full-width col center justify"
                  filled v-model="dynamicChoice3" stack-label label="Ilość strzałów strzelba"></q-input>
                {{ dynamicChoice1 }}
                {{ dynamicChoice2 }}
                {{ dynamicChoice3 }}
              </div>
            </div>
            <div class="row bg-grey-3">
              <q-item class="items-center">Metoda Liczenia :</q-item>
              <q-radio v-if="!dynamic" class="col" color="black" v-model="choice12" :val="'NORMAL'"
                label="Normalnie"></q-radio>
              <q-radio class="col" color="black" v-model="choice12" :val="'COMSTOCK'" label="Comstock"></q-radio>
            </div>
            <q-input class="full-width bg-grey-4 center justify" filled v-model="competitionName" stack-label
              label="wprowadź własną nazwę"></q-input>
          </q-item-section>
        </q-card-section>
        <div class="row">
          <q-card-actions class="col" align="left">
            <q-checkbox @input="competitionName = null" class="row text-dark" keep-color color="dark"
              v-model="notUsed" :val="false" label="nie używaj kreatora"></q-checkbox>
          </q-card-actions>
          <q-card-actions class="row" align="right">
            <q-btn label="zamknij" color="secondary" v-close-popup />
            <q-btn label="utwórz" color="primary" v-close-popup @click="createCompetition()" />
          </q-card-actions>
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>
<style></style>
<script>
import App from 'src/App.vue'

export default {
  data () {
    return {
      createNewCompetiton: false,
      meters: false,
      quantity: false,
      notUsed: false,
      dynamicChoice: [],
      dynamicChoice1: '',
      dynamicChoice2: '',
      dynamicChoice3: '',
      meter: '',
      discipline: '',
      machinegun: '',
      dynamic: '',
      choice4: '',
      choice5: '',
      choice6: '',
      choice7: '',
      choice8: '',
      choice9: '',
      choice10: [],
      choice11: '',
      choice12: '',
      choice13: '',
      choice14: '',
      local: App.host
    }
  }
}
</script>
