<template>
  <q-item v-if="visible"
    clickable
    tag="a"
    :href="link"
    dense
    @click="refresh()"
    class="bg-secondary text-white xyz1"
  >
    <q-item-section
      v-if="icon"
      avatar
    >
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label caption>
        {{ caption }}
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
export default {
  name: 'EssentialLink',
  props: {
    title: {
      type: String,
      required: true
    },

    caption: {
      type: String,
      default: ''
    },

    link: {
      type: String,
      default: '#'
    },

    icon: {
      type: String,
      default: ''
    },
    visible: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    refresh () {
      document.title = 'Strzelnica - ' + this.title
      window.localStorage.setItem('SiteName', this.title)
      if (window.location.href === this.link) {
        window.location.reload()
      }
    }
  }
}
</script>
