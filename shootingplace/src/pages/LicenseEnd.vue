<template>
  <div class="fullscreen bg-red text-white text-center q-pa-md flex flex-center">
    <div>
      <div style="font-size: 10vh">
        Skończyła Ci się licencja na użytkowanie programu
      </div>

      <div class="text-h2">
        Aby przedłużyć licencję na program skontaktuj się z twórcą programu.
      </div>

      <q-btn
        class="q-mt-xl"
        color="white"
        text-color="blue"
        unelevated
        to="/"
        label="Powrót do strony głównej"
        no-caps
      />
    </div>
  </div>
</template>

<script >
import App from 'src/App.vue'
export default {
  name: 'LicenseEnd',
  data () {
    return {
      local: App.host
    }
  }
}
</script>
