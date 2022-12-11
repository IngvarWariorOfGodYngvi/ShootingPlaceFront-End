<template>
      <div class="q-pa-sm text-white">
      <q-item-label v-if="quantities[8]>0" class="text-bold text-red" dense caption lines="3">Nieopłaconych licencji : {{quantities[8]}}</q-item-label>
      <q-item-label class="text-bold text-white" dense caption lines="3">Najwyższy numer legitymacji : {{number}}</q-item-label>
      <q-item-label class="text-bold text-white" dense caption lines="3">Licencje ważne : {{quantities[1]}}</q-item-label>
      <q-item-label class="text-bold text-white" dense caption lines="3">Licencje nieważne : {{quantities[2]}}</q-item-label>
      <q-item-label class="text-bold text-white" dense caption lines="3">Klubowiczów ogółem : {{quantities[0] + quantities[3]}} ({{quantities[0]}} + {{quantities[3]}})</q-item-label>
      <q-item-label class="text-bold text-white" dense caption lines="3">Zapisów w aktualnym roku : {{members}}</q-item-label>
      <q-item-label class="text-bold text-white" dense caption lines="3">Nowych licencji w aktualnym roku : {{quantities[9]}}</q-item-label>
      </div>
</template>

<script src="../scripts/membersQuantities.js">

</script>
