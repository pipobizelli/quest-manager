<template>
  <div :class="[{
    'draggable': isDraggable(type)
    }, `${handle}--${rotation}`,
     handle, 'actor']"
    :data-tiles="tiles"
    :data-x="position.x"
    :data-y="position.y"
    :style="styles"></div>
</template>

<script>
import { EventHub } from '../event_hub'
export default {
  data () {
    return {
      styles: {
        transform: `translate(${this.position.x}px, ${this.position.y}px) rotate(${this.rotation}deg)`
      }
    }
  },
  props: ['handle', 'type', 'rotation', 'position', 'tiles'],
  methods: {
    isDraggable (type) {
      return type === 'hero' || type === 'monster'
    },
    move_actor (data) {
      this.position.x = data.x
      this.position.y = data.y
      // this.rotation = data.rotation
      this.styles.transform = `translate(${this.position.x}px, ${this.position.y}px)`
    }
  },
  created () {
    EventHub.$on('Actor/move', (data) => {
      if (data.handle === this.handle) {
        setTimeout(() => {
          this.move_actor(data)
        }, 200 * data.i)
      }
    })
  }
}
</script>
