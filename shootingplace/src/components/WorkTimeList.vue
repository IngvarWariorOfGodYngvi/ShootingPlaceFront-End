<template>
  <div class="q-pa-sm text-white">
    <div>
        <q-input v-model="number" class="text-white" type="password" dense label-color="white" label="Czas pracy - zeskanuj swoją kartę tutaj" filled @keypress.enter="goToWork(number)" ></q-input>
    <q-virtual-scroll :items="usersInWork" visible class="full-width" style="height: auto">
          <template v-slot="{ item, index }">
            <q-item :key="index" dense style="padding:0% 0% 0% 5%;font-size:small;font-weight: 500;">
              {{item}}
            </q-item>
          </template>
    </q-virtual-scroll>
    </div>
    <div>
    <q-dialog :position="'top'" v-model="failure">
        <q-card>
          <q-card-section>
            <div v-if="message!=null" class="text-h6">{{message}}</div>
          </q-card-section>

        </q-card>
    </q-dialog>
    <q-dialog :position="'top'" v-model="success">
        <q-card>
          <q-card-section>
            <div v-if="message!=null" class="text-h6">{{message}}</div>
          </q-card-section>

        </q-card>
    </q-dialog>
    <q-dialog :position="'top'" v-model="forbidden">
        <q-card class="bg-warning">
          <q-card-section>
            <div class="text-h6">Niewłaściwy kod. Spróbuj ponownie.</div>
          </q-card-section>
        </q-card>
    </q-dialog>
  </div>
  </div>
</template>

<script src="../scripts/workTime.js">

</script>
