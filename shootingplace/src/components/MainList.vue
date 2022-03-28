<template>
    <div class="q-pa-md col-6">
      <div @click="showloading()" class="q-pa-xs">
        <q-item class="flex flex-center q-pa-none" clickable tag="a" target="_self" :href="app + 'member'" width="max">
          <q-field class="col" standout="bg-accent text-black" stack-label>
            <template v-slot:prepend>
              <q-icon class="row" name="perm_identity" />
            </template>
            <div class="self-center row full-width no-outline text-left text-black" tabindex="1">Lista Klubowiczów</div>
          </q-field>
        </q-item>
      </div>
      <div @click="showloading()" class="q-pa-xs">
        <q-item class="flex flex-center q-pa-none" clickable tag="a" target="_self" :href="app + 'license'" width="max">
          <q-field class="col" standout="bg-accent text-black" stack-label>
            <template v-slot:prepend>
            <q-icon name="perm_identity" />
          </template>
              <div class="self-center col full-width no-outline text-left text-black" tabindex="1">Licencje</div>
          </q-field>
        </q-item>
      </div>
      <div @click="showloading()" class="q-pa-xs">
        <q-item class="flex flex-center q-pa-none" clickable tag="a" target="_self" :href="app + 'member/adding'" width="max">
          <q-field class="col" standout="bg-accent text-black" stack-label>
            <template v-slot:prepend>
            <q-icon name="add" />
          </template>
              <div class="self-center col full-width no-outline text-left text-black" tabindex="1">Dodaj Nowego Klubowicza</div>
          </q-field>
        </q-item>
      </div>
      <div @click="showloading()" class="q-pa-xs">
        <q-item class="flex flex-center q-pa-none" clickable tag="a" target="_self" :href="app + 'ammolist'" width="max">
          <q-field v-if="color!='primary'" class="col bg-warning" standout="bg-accent text-black" stack-label>
            <template v-slot:prepend>
            <q-icon name="book" />
          </template>
              <div class="self-center col full-width no-outline text-left text-black" tabindex="1">Lista Amunicyjna <b>OTWARTA</b></div>
          </q-field>
          <q-field v-else class="col" standout="bg-accent text-black" stack-label>
            <template v-slot:prepend>
            <q-icon name="book" />
          </template>
              <div class="self-center col full-width no-outline text-left text-black" tabindex="1">Lista Amunicyjna</div>
          </q-field>
        </q-item>
      </div>
      <div @click="showloading()" class="q-pa-xs">
        <q-item class="flex flex-center q-pa-none" clickable tag="a" target="_self" :href="app + 'competition'" width="max">
          <q-field v-if="tournamentCheck" class="col bg-warning" standout="bg-accent text-black" stack-label>
            <template v-slot:prepend>
            <q-icon name="book" />
          </template>
              <div class="self-center col full-width no-outline text-left text-black" tabindex="1">Zawody <b>OTWARTE</b></div>
          </q-field>
          <q-field v-else class="col" standout="bg-accent text-black" stack-label>
            <template v-slot:prepend>
            <q-icon name="book" />
          </template>
              <div class="self-center col full-width no-outline text-left text-black" tabindex="1">Zawody</div>
          </q-field>
        </q-item>
      </div>
      <div @click="showloading()" class="q-pa-xs">
        <q-item class="flex flex-center q-pa-none" clickable tag="a" target="_self" :href="app + 'memberwithpermission'" width="max">
          <q-field class="col" standout="bg-accent text-black" stack-label>
            <template v-slot:prepend>
            <q-icon name="book" />
          </template>
              <div class="self-center col full-width no-outline text-left text-black" tabindex="1">Lista Osób z Uprawnieniami</div>
          </q-field>
        </q-item>
      </div>
      <div @click="showloading()" class="q-pa-xs">
         <q-item class="flex flex-center q-pa-none" clickable tag="a" target="_self" :href="app + 'armory'" width="max">
          <q-field class="col" standout="bg-accent text-black" stack-label>
            <template v-slot:prepend>
            <q-icon name="book" />
          </template>
              <div class="self-center col full-width no-outline text-left text-black" tabindex="1">Zbrojownia</div>
          </q-field>
        </q-item>
      </div>
      <div @click="showloading()" class="q-pa-xs">
        <q-item class="flex flex-center q-pa-none" clickable tag="a" target="_self" :href="app + 'statistics'" width="max">
          <q-field class="col" standout="bg-accent text-black" stack-label>
            <template v-slot:prepend>
            <q-icon name="book" />
          </template>
              <div class="self-center col full-width no-outline text-left text-black" tabindex="1">Statystyki</div>
          </q-field>
        </q-item>
      </div>
      <div @click="showloading()" class="q-pa-xs">
        <q-item class="flex flex-center q-pa-none" clickable tag="a" target="_self" :href="app + 'otherFunctions'" width="max">
          <q-field class="col" standout="bg-accent text-black" stack-label>
            <template v-slot:prepend>
            <q-icon name="book" />
          </template>
              <div class="self-center col full-width no-outline text-left text-black" tabindex="1">Pozstałe Funkcje</div>
          </q-field>
        </q-item>
      </div>
      <div @click="showloading()" class="q-pa-xs q-pt-xl">
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
</template>

<script src="../scripts/mainList.js">
</script>
