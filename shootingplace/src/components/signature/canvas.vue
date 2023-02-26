<template>
  <canvas ref="canvas"
          @mousemove="draw"
          @mousedown="setPosition"
          @mouseenter="setPosition"
          v-touch-pan="draw"
          @resize="resize"
          id="canvas"></canvas>
</template>

<script>
import Vue from 'vue'
import Vue2TouchEvents from 'vue2-touch-events'

Vue.use(Vue2TouchEvents)
export default {
  name: 'canvas.vue',
  mounted () {
    this.resize()
  },
  data () {
    return {
      pos: {}
    }
  },
  methods: {
    setPosition (e) {
      // console.log(e.clientX)
      // console.log(e.clientY)
      // console.log('screenX' + e.screenX)
      // console.log('screenY' + e.screenY)
      const { canvas } = this.$refs
      // console.log(canvas.getBoundingClientRect().x)
      // console.log(canvas.getBoundingClientRect().y)
      const left = canvas.getBoundingClientRect().x
      const bottom = canvas.getBoundingClientRect().y
      this.pos.x = e.clientX - left
      this.pos.y = e.clientY - bottom
    },
    resize () {
      const { canvas } = this.$refs
      const ctx = canvas.getContext('2d')
      // const width = canvas.getBoundingClientRect().x
      // const height = canvas.getBoundingClientRect().y
      // console.log(width)
      // console.log(height)
      console.log(canvas)
      const maxWidth = canvas.style.width > 500 ? window.outerWidth : canvas.getBoundingClientRect().width * 2
      const maxHeight = canvas.style.height > 500 ? window.outerHeight : canvas.getBoundingClientRect().height * 2
      ctx.canvas.width = maxWidth / 2
      ctx.canvas.height = maxHeight / 2
    },
    draw (e) {
      if (e.buttons !== 1) {
        return
      }
      const { canvas } = this.$refs
      const ctx = canvas.getContext('2d')
      const { pos } = this
      ctx.beginPath()
      ctx.lineWidth = 5
      ctx.lineCap = 'round'
      ctx.strokeStyle = 'black'
      ctx.moveTo(pos.x, pos.y)
      this.setPosition(e)
      ctx.lineTo(pos.x, pos.y)
      ctx.stroke()
    }
  }
}
</script>

<style>

#canvas {
  border: 1px solid black;
}
</style>
