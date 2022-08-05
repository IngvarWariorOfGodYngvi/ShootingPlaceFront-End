<template>
  <div>
    <q-dialog :position="'top'" v-show="$props.failure">
        <q-card>
          <q-card-section>
            <div v-if="$props.message!=null" class="text-h6">{{$props.message}}</div>
          </q-card-section>

        </q-card>
    </q-dialog>
    <q-dialog :position="'top'" v-show="$props.success">
        <q-card>
          <q-card-section>
            <div v-if="$props.message!=null" class="text-h6">{{$props.message}}</div>
          </q-card-section>

        </q-card>
    </q-dialog>
    <q-dialog :position="'top'" v-model="$props.forbidden">
        <q-card class="bg-warning">
          <q-card-section>
            <div class="text-h6">Niewłaściwy kod. Spróbuj ponownie.</div>
          </q-card-section>
        </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  name: 'Dialogs',
  props: {
    success: {
      type: Boolean,
      default: false
    },
    forbidden: {
      type: Boolean,
      default: false
    },
    failure: {
      type: Boolean,
      default: false
    },
    message: {
      type: String,
      default: ''
    }
  },
  successM (response) {
    this.props.message = response
    this.props.success = true
    console.log(this.props.success)
    console.log(this.props.message)
    // console.log(this.props.message)
  }
}
</script>
