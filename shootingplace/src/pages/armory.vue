<template>
  <q-page padding>
    <q-expansion-item
      v-if="!mobile || (mobile && usrPermissions != null && (usrPermissions.Permissions.includes('Admin') || usrPermissions.Permissions.includes('Zarząd') || usrPermissions.Permissions.includes('Pracownik')) || usrPermission.Permissions.includes('Magazynier'))"
      label="Ewidencja Broni - Stany Magazynowe" header-class="text-bold text-h6" dense
      class="text-left  bg-grey-3 q-mb-md" @click="load1 = !load1" group="list">
      <GunEvidenceStockLevels :load="!load1" />
    </q-expansion-item>
    <q-expansion-item
      v-if="!mobile || (mobile && usrPermissions != null && (usrPermissions.Permissions.includes('Admin') || usrPermissions.Permissions.includes('Zarząd') || usrPermissions.Permissions.includes('Magazynier')))"
      label="Ewidencja Broni - Historia Wpisów" header-class="text-bold text-h6" dense
      class="text-left  bg-grey-3 q-mb-md" @click="load2 = !load2" group="list">
      <GunEvidenceUsedHistory :load="!load2" />
    </q-expansion-item>
    <q-expansion-item
      v-if="!mobile || (mobile && usrPermissions != null && (usrPermissions.Permissions.includes('Admin') || usrPermissions.Permissions.includes('Zarząd') || usrPermissions.Permissions.includes('Magazynier')))"
      label="Ewidencja Broni - Przyjmowanie" header-class="text-bold text-h6" dense class="text-left  bg-grey-3 q-mb-md"
      @click="load3 = !load3" group="list">
      <GunEvidenceAcceptance :load="!load3" />
    </q-expansion-item>
    <q-expansion-item
      v-if="!mobile || (mobile && usrPermissions != null && (usrPermissions.Permissions.includes('Admin') || usrPermissions.Permissions.includes('Zarząd') || usrPermissions.Permissions.includes('Magazynier')))"
      label="Ewidencja Broni - Wydawanie" header-class="text-bold text-h6" dense class="text-left  bg-grey-3 q-mb-md"
      @click="load4 = !load4" group="list">
      <GunEvidenceIssuance :load="!load4" />
    </q-expansion-item>
    <hr />
    <q-expansion-item
      v-if="!mobile || (mobile && usrPermissions != null && (usrPermissions.Permissions.includes('Admin') || usrPermissions.Permissions.includes('Zarząd') || usrPermissions.Permissions.includes('Pracownik')))"
      label="Ewidencja Amunicji - Stany Magazynowe" header-class="text-bold text-h6" dense
      @click="load5 = !load5" class="text-left  bg-grey-3 q-mb-md" group="list">
      <AmmunitionEvidenceStockLevels />
    </q-expansion-item>
    <q-expansion-item
      v-if="!mobile || (mobile && usrPermissions != null && (usrPermissions.Permissions.includes('Admin') || usrPermissions.Permissions.includes('Zarząd') || usrPermissions.Permissions.includes('Magazynier')))"
      label="Ewidencja Amunicji - Przyjmowanie" header-class="text-bold text-h6" dense
      @click="load6 = !load6" class="text-left  bg-grey-3 q-mb-md" group="list">
      <AmmunitionEvidenceIncome />
    </q-expansion-item>
    <q-expansion-item
      v-if="!mobile || (mobile && usrPermissions != null && (usrPermissions.Permissions.includes('Admin') || usrPermissions.Permissions.includes('Zarząd') || usrPermissions.Permissions.includes('Magazynier')))"
      label="Ewidencja Amunicji - Wydawanie" header-class="text-bold text-h6" dense class="text-left bg-grey-3 q-mb-md"
      @click="load7 = !load7" group="list">
      <AmmunitionEvidenceUpcome />
    </q-expansion-item>
    <hr />
    <q-expansion-item label="Zużycie amunicji" dense class="text-left text-h6 text-bold bg-grey-3 q-mb-md" group="list">
      <AmmoUsed />
    </q-expansion-item>
  </q-page>
</template>
<style src="../style/style.scss" lang="scss"></style>
<script>

import Vue from 'vue'
import axios from 'axios'
import App from 'src/App.vue'
import lazyLoadComponent from 'src/utils/lazyLoadComponent'
import SkeletonBox from 'src/utils/SkeletonBox.vue'
Vue.prototype.$axios = axios

export default {
  components: {
    GunEvidenceStockLevels: lazyLoadComponent({
      componentFactory: () => import('components/armory/GunEvidenceStockLevels.vue'),
      loading: SkeletonBox
    }),
    GunEvidenceIssuance: lazyLoadComponent({
      componentFactory: () => import('components/armory/GunEvidenceIssuance.vue'),
      loading: SkeletonBox
    }),
    GunEvidenceAcceptance: lazyLoadComponent({
      componentFactory: () => import('components/armory/GunEvidenceAcceptance.vue'),
      loading: SkeletonBox
    }),
    GunEvidenceUsedHistory: lazyLoadComponent({
      componentFactory: () => import('components/armory/GunEvidenceUsedHistory.vue'),
      loading: SkeletonBox
    }),
    AmmoUsed: lazyLoadComponent({
      componentFactory: () => import('components/armory/AmmoUsed.vue'),
      loading: SkeletonBox
    }),
    AmmunitionEvidenceStockLevels: lazyLoadComponent({
      componentFactory: () => import('components/armory/AmmunitionEvidenceStockLevels.vue'),
      loading: SkeletonBox
    }),
    AmmunitionEvidenceIncome: lazyLoadComponent({
      componentFactory: () => import('components/armory/AmmunitionEvidenceIncome.vue'),
      loading: SkeletonBox
    }),
    AmmunitionEvidenceUpcome: lazyLoadComponent({
      componentFactory: () => import('components/armory/AmmunitionEvidenceUpcome.vue'),
      loading: SkeletonBox
    })
  },
  data () {
    return {
      load1: false,
      load2: false,
      load3: false,
      load4: false,
      load5: false,
      load6: false,
      load7: false,
      mobile: App.mobile,
      usrPermissions: JSON.parse(window.localStorage.getItem('usrPerm'))
    }
  },
  name: 'armory'
}
</script>
