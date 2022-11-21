<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          class="q-pa-none text-h6"
          icon="menu"
          aria-label="Menu"
          label="PROGRAM"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

       <!-- <q-toolbar-title>
          <div class="row">
            <div class="col" id="title">{{$keycloak.keycloak.clientId}} </div>
            <div class="row reverse text-caption full-width">
              <a v-if="distance<1200000" class="text-caption text-red text-bold" style="padding-left: 10px; margin: 0px;cursor: pointer;" color="red" @click="clear()"> Odśwież sesję</a>
              <div id="timer"></div>
            </div>
          </div>
        </q-toolbar-title> -->

       <!-- <div><q-avatar v-ripple color="secondary" text-color="white" icon="perm_identity" />
        <q-menu>
        <div class="col q-pa-md">
            <q-btn
              color="primary"
              label="Wyloguj"
              push
              size="s"
              v-close-popup
              @click="logout()"
            />
        </div>
      </q-menu>
        </div> -->
      </q-toolbar>
    </q-header>
    <q-drawer
      v-model="leftDrawerOpen"
      bordered
      show-if-above
      content-style="height:100vh;"
      style="width: 50px;"
    >
    <div class="full-height bg-secondary">
      <q-list class="bg-secondary">
          <q-item @click="showloading(),clear()" class="flex flex-center q-pa-md bg-primary text-white xyz1" clickable tag="a" target="_self" :href="hrefTarget" width="max">
            <div class="text-h6 text-bold text-center"><div>PROGRAM</div> STRONA GŁÓWNA</div>
          </q-item>
          <div @click="showloading(),clear()">
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
          class="bg-secondary text-white xyz"
        />
        </div>
      </q-list>
      <members-quantities class="bg-secondary">
      </members-quantities>
      <WorkTimeList style="margin: auto,height:auto">
      </WorkTimeList>
      </div>
    </q-drawer>

    <q-page-container>
      <q-page>
        <router-view/>
        <q-page-sticky :position="'top-right'" :offset="[30, 30]">
          <q-fab
            v-if="color!='primary'||tournamentCheck"
            :color="color"
            glossy
            icon="keyboard_arrow_left"
            direction="left"
          >
            <q-fab-action v-if="color!='primary'" external-label :label-position="'top'" color="primary" icon="book" @click="redirectToAmmoList()"><q-tooltip anchor="top middle" self="top middle" content-class="text-h6">Otwarta lista amunicyjna</q-tooltip></q-fab-action>
            <q-fab-action v-if="tournamentCheck" external-label :label-position="'top'" color="secondary" icon="people" @click="redirectToCompetitionList()"><q-tooltip anchor="top middle" self="top middle" content-class="text-h6">Otwarte zawody</q-tooltip></q-fab-action>
            <!-- <q-fab-action square external-label label-:position="'top'" color="orange" icon="airplay" label="Airplay" /> -->
            <!-- <q-fab-action square external-label label-:position="'top'" color="accent" icon="room" label="Map" /> -->
          </q-fab>
        </q-page-sticky>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
<style src="../style/style.scss" lang="scss">
</style>

<script src="../scripts/mainLayout.js">

</script>
