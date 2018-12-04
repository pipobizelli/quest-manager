<template>
  <div :class="[{'draggable': isDraggable}, handle, 'actor']" :style="`transform: translate(${x}px, ${y}px) rotate(${rotation}deg);`"></div>
</template>

<script>
export default {
  props: ['handle', 'type', 'rotation', 'x', 'y'],
  methods: {
    isDraggable (type) {
      return type === 'hero' || type === 'monster'
    }
  }
}
</script>
