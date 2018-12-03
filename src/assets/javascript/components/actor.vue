<template>
  <div :class="[{'draggable': isDraggable}, handle, 'actor']" :style="`transform: rotate(${rotation}deg);`"></div>
</template>

<script>
export default {
  props: ['handle', 'isDraggable', 'rotation']
}
</script>
