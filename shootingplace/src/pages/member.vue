<template>
  <q-page>
    <q-item><q-item-label>wyszukaj</q-item-label></q-item>
  </q-page>
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
        .then(member => {
          this.member = member
        })
    },
    getMember (uuid) {
      fetch('http://localhost:8080/member/' + uuid, {
        method: 'GET'
      }).then(response => response.json())
        .then(member => {
          this.member = member
        })
    },
    reload () {
      window.location.reload()
    }
  },
  name: 'member'
}
</script>
