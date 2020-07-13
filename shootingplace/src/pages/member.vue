<template>
  <q-page>
      <q-spinner
      v-if="loading"
      color="primary"
      size="4em"/>
      <q-list v-else bordered>
        <q-item clickable y-ripple v-for="members in members" :key="members.uuid">
          <q-item-section top avatar>
            <q-avatar color="primary" text-color="white" icon="school" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{members.firstName}} {{members.secondName}}</q-item-label>
            <q-item-label caption lines="2">Składka ważna do {{members.contribution.contribution}}</q-item-label>
          </q-item-section>
          <q-item-section side top>
            <q-btn color="primary"
            label="Przedłuż składkę"
            @click="showloading(),prolongContribution(members.uuid),reload()
            "/>
          </q-item-section>
        </q-item>
      </q-list></q-page>
</template>

<script>
export default {
  data () {
    return {
      member: []
    }
  },
  created () {
    this.getMember()
  },
  methods: {
    prolongContribution (uuid) {
      fetch('http://localhost:8080/contribution/' + uuid, {
        method: 'PATCH'
      }).then(response => response.json())
        .then(members => {
          this.members = members
        })
    },
    getMember (uuid) {
      fetch('http://localhost:8080/member/' + uuid, {
        method: 'GET'
      }).then(response => response.json())
        .then(members => {
          this.members = members
        })
    },
    reload () {
      window.location.reload()
    }
  },
  name: 'member'
}
</script>
