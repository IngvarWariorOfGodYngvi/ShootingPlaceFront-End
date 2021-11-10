<template>
  <q-page>
    <div class="row">
    <div class="q-pa-md col-5">
      <div class="q-pa-xs">
        <q-item class="flex flex-center q-pa-none" clickable tag="a" target="_self" :href="app + 'member'" width="max">
          <q-field class="col" standout="bg-accent text-black" stack-label>
            <template v-slot:prepend>
              <q-icon class="row" name="perm_identity" />
            </template>
            <div class="self-center row full-width no-outline text-left text-black" tabindex="1">Lista Klubowiczów</div>
          </q-field>
        </q-item>
      </div>
      <div class="q-pa-xs">
        <q-item class="flex flex-center q-pa-none" clickable tag="a" target="_self" :href="app + 'license'" width="max">
          <q-field class="col" standout="bg-accent text-black" stack-label>
            <template v-slot:prepend>
            <q-icon name="perm_identity" />
          </template>
              <div class="self-center col full-width no-outline text-left text-black" tabindex="1">Licencje</div>
          </q-field>
        </q-item>
      </div>
      <div class="q-pa-xs">
        <q-item class="flex flex-center q-pa-none" clickable tag="a" target="_self" :href="app + 'member/adding'" width="max">
          <q-field class="col" standout="bg-accent text-black" stack-label>
            <template v-slot:prepend>
            <q-icon name="add" />
          </template>
              <div class="self-center col full-width no-outline text-left text-black" tabindex="1">Dodaj Nowego Klubowicza</div>
          </q-field>
        </q-item>
      </div>
      <div class="q-pa-xs">
        <q-item class="flex flex-center q-pa-none" clickable tag="a" target="_self" :href="app + 'ammolist'" width="max">
          <q-field class="col" standout="bg-accent text-black" stack-label>
            <template v-slot:prepend>
            <q-icon name="book" />
          </template>
              <div class="self-center col full-width no-outline text-left text-black" tabindex="1">Lista Amunicyjna</div>
          </q-field>
        </q-item>
      </div>
      <div class="q-pa-xs">
        <q-item class="flex flex-center q-pa-none" clickable tag="a" target="_self" :href="app + 'competition'" width="max">
          <q-field class="col" standout="bg-accent text-black" stack-label>
            <template v-slot:prepend>
            <q-icon name="book" />
          </template>
              <div class="self-center col full-width no-outline text-left text-black" tabindex="1">Zawody</div>
          </q-field>
        </q-item>
      </div>
      <div class="q-pa-xs">
        <q-item class="flex flex-center q-pa-none" clickable tag="a" target="_self" :href="app + 'memberwithpermission'" width="max">
          <q-field class="col" standout="bg-accent text-black" stack-label>
            <template v-slot:prepend>
            <q-icon name="book" />
          </template>
              <div class="self-center col full-width no-outline text-left text-black" tabindex="1">Lista Osób z Uprawnieniami</div>
          </q-field>
        </q-item>
      </div>
      <div class="q-pa-xs">
         <q-item class="flex flex-center q-pa-none" clickable tag="a" target="_self" :href="app + 'armory'" width="max">
          <q-field class="col" standout="bg-accent text-black" stack-label>
            <template v-slot:prepend>
            <q-icon name="book" />
          </template>
              <div class="self-center col full-width no-outline text-left text-black" tabindex="1">Magazyn Broni i Amunicji</div>
          </q-field>
        </q-item>
      </div>
      <div class="q-pa-xs">
        <q-item class="flex flex-center q-pa-none" clickable tag="a" target="_self" :href="app + 'statistics'" width="max">
          <q-field class="col" standout="bg-accent text-black" stack-label>
            <template v-slot:prepend>
            <q-icon name="book" />
          </template>
              <div class="self-center col full-width no-outline text-left text-black" tabindex="1">Statystyki i Wyliczenia</div>
          </q-field>
        </q-item>
      </div>
      <div class="q-pa-xs">
        <q-item class="flex flex-center q-pa-none" clickable tag="a" target="_self" :href="app + 'otherFunctions'" width="max">
          <q-field class="col" standout="bg-accent text-black" stack-label>
            <template v-slot:prepend>
            <q-icon name="book" />
          </template>
              <div class="self-center col full-width no-outline text-left text-black" tabindex="1">Pozstałe Funkcje</div>
          </q-field>
        </q-item>
      </div>
      <div class="q-pa-xs q-pt-xl">
        <q-item class="flex flex-center q-pa-none" clickable tag="a" target="_self" :href="app + 'settings'" width="max">
          <q-field class="col" standout="bg-accent text-black" stack-label>
            <template v-slot:prepend>
            <q-icon name="settings" />
          </template>
              <div class="self-center col full-width no-outline text-left text-black" tabindex="1">Ustawienia</div>
          </q-field>
        </q-item>
      </div>
    </div>
    <div class="col flex flex-center full-width q-pa-xl">
    <img
      alt="logo"
      src="~assets/logo.jpg"
    >
    </div>
    </div>
  </q-page>
</template>

<script>
import App from 'src/App.vue'
export default {
  name: 'PageIndex',
  data () {
    return {
      app: 'http://' + App.prod
    }
  }
}
</script>
