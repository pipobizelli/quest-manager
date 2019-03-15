<template>
  <div :class="[{
    'draggable': isDraggable(type)
    }, `${handle}--${rotation}`,
     handle, 'actor']"
    :data-actor="handle"
    :data-tiles="tiles"
    :data-x="position.x"
    :data-y="position.y"
    :style="styles"></div>
</template>

<script>
import Tile from '../helpers/tile'
export default {
  data () {
    return {
      position: {
        x: 0,
        y: 0
      }
    }
  },
  computed: {
    styles () {
      return {
        transform: `translate(${this.position.x}px, ${this.position.y}px) rotate(${this.rotation}deg)`
      }
    }
  },
  props: ['handle', 'type', 'rotation', 'tiles', 'board'],
  methods: {
    isDraggable (type) {
      return type === 'hero' || type === 'monster'
    },
    move_actor (data) {
      this.position.x = data.x
      this.position.y = data.y
      // this.rotation = data.rotation
      this.styles.transform = `translate(${this.position.x}px, ${this.position.y}px)`
    },
    get_pos () {
      this.position = Tile(this.board).getTileOffset(this.tiles[0])
    }
  },
  mounted () {
    window.addEventListener('load', (event) => {
      this.get_pos()
    })
  }
}
</script>
