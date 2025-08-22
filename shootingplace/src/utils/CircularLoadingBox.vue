<template>
  <div class="q-pa-md">
    <q-circular-progress indeterminate rounded :size="size" :color="color" class="q-ma-md" />
    <div>Ładowanie danych...</div>
  </div>
</template>
<script>
export default {
  name: 'CircularProgress',
  props: {
    color: {
      type: String,
      required: false,
      default: 'primary'
    },
    size: {
      type: String,
      required: false,
      default: '3em'
    }
  }
}
</script>
