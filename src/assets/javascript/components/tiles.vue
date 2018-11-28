<template>
  <article class="board">
    <section class="tiles_wrapper">
      <template v-for="(line, l) in tiles.lines">
        <div v-for="(column, c) in tiles.columns"
          :class="[{'tile--first': c===0}, {'tile--larger': (c+1)%3 === 0}, 'tile']"
          :data-tile="l+':'+c">
          <p v-show="showNum">
            {{l}}:{{c}}
          </p>
        </div>
      </template>
      <div class="draggable"></div>
      <div class="draggable red"></div>
    </section>
    <img src="../../images/board.jpg" alt="board">
  </article>
</template>

<script>
import $ from 'jquery'
import interact from 'interactjs'
// import Draggable from 'gsap/Draggable'
window.interact = interact
export default {
  data () {
    return {
      showNum: true,
      gridX: 0,
      gridY: 0,
      tiles: {
        columns: 26,
        lines: 19
      }
    }
  },
  mounted () {
    this.$nextTick(function () {
      interact('.draggable').draggable({
        inertia: false,
        restrict: {
          restriction: 'parent',
          endOnly: false,
          elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
        },
        autoScroll: false
      }).on('dragmove', (event) => {
        var target = event.target
        var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
        var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy
        target.style.webkitTransform =
        target.style.transform = `translate(${x}px, ${y}px)`
        // target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'

        // update the posiion attributes
        target.setAttribute('data-x', x)
        target.setAttribute('data-y', y)
      }).on('dragend', (event) => {
        var tile = $('.tile').first()
        var gridWidth = Math.round(tile.width())
        var gridHeight = Math.round(tile.height())
        var dataX = Math.round(event.target.getAttribute('data-x'))
        var dataY = Math.round(event.target.getAttribute('data-y'))
        var c = Math.round(dataX / gridWidth)
        var r = Math.round(dataY / gridHeight)
        var x = $(`[data-tile='${r}:${c}']`)[0].offsetLeft
        var y = $(`[data-tile='${r}:${c}']`)[0].offsetTop

        console.log(Math.round(dataY / gridHeight), Math.round(dataX / gridWidth))

        event.target.style.webkitTransform = event.target.style.transform = `translate(${x}px, ${y}px)`
      })
    })
  }
}
</script>
