<template>
  <div :class="[{'draggable': isDraggable(type)}, `${handle}--${rotation}`, handle]" :data-tiles="tiles" :data-x="position.x" :data-y="position.y" :style="`transform: translate(${position.x}px, ${position.y}px) rotate(${rotation}deg);`"></div>
</template>

<script>
export default {
  props: ['handle', 'type', 'rotation', 'position', 'tiles'],
  methods: {
    isDraggable (type) {
      return type === 'hero' || type === 'monster'
    }
  }
}
</script>
