<template>
  <article class="board">
    <section class="tiles_wrapper">
      <template v-for="(line, l) in map.tiles.lines">
        <div v-for="(column, c) in map.tiles.columns"
          :class="[{
              'tile--larger': (c+1)%3 === 0
            },{
              'tile--disabled': !is_active(l, c)
            },{
              'tile--pathconfig': showPathConfig
            }, `tileconfig-${get_tile_config({l,c})}`, 'tile']"
          :data-tile="`${l}:${c}`"
          @click="get_tile_config({l,c})"
          @contextmenu.prevent="handler($event, {l,c})">
          <p v-show="showNum">
            {{l}}:{{c}}
          </p>
          <!-- <input v-show="showPathConfig" type="text" name="config" v-model="map.config[(map.tiles.columns * l) + c]" maxlength="10"> -->
        </div>
      </template>
      <!-- <div v-show="!showPathConfig" class="draggable"></div>
      <div v-show="!showPathConfig" class="draggable red"></div> -->
    </section>
    <img src="../../images/board.jpg" alt="board">
  </article>
</template>

<script>
import $ from 'jquery'
import { EventHub } from '../event_hub'
import interact from 'interactjs'
import { Store } from '../store'
import MapConfig from '../modules/map'
// import HeroquestBoard from '../data/heroquest'
import Quest from '../modules/quest'

export default {
  data () {
    return {
      quest: {
        components: Store.state.Quest.components,
        active_actor: Store.state.Quest.active_actor
      },
      showNum: true,
      showPathConfig: false,
      gridWidth: 0,
      gridHeight: 0,
      map: {
        tiles: {
          lines: Store.state.Map.lines,
          columns: Store.state.Map.columns
        },
        config: Store.state.Map.config
      },
      deactivatedTiles: []
    }
  },
  // watch: {
  //   'map.config': (val, oldVal) => {
  //     // Store.dispatch('Map/set_tiles_config', val)
  //     EventHub.$emit('Board/changeConfig', val)
  //   }
  // },
  methods: {
    set_target_position (payload) {
      var target = payload.target
      var x = $(`[data-tile='${payload.r}:${payload.c}']`)[0].offsetLeft
      var y = $(`[data-tile='${payload.r}:${payload.c}']`)[0].offsetTop

      target.style.webkitTransform = target.style.transform = `translate(${x}px, ${y}px)`
    },
    is_active (l, c) {
      return this.deactivatedTiles.indexOf(`${l}:${c}`) < 0
    },
    disable_tile (tile) {
      this.deactivatedTiles.push(tile)
    },
    handler (e, tile) {
      console.log('clique direito:', tile)
      // this.disable_tile(`${tile.l}:${tile.c}`)
      e.preventDefault()
    },
    get_tile_config (tile) {
      var n = (this.map.tiles.columns * tile.l) + tile.c
      return this.map.config[n]
    },
    tile_config (tile) {
      return $(`[data-tile='${tile.r}:${tile.c}']`).data('config') || '0000'
    }
  },
  beforeCreate () {
    MapConfig().registerModule(Store)
    Quest().registerModule(Store)
    Store.dispatch('Map/initialize')
  },
  created () {
    EventHub.$on('Config/togglePathConfig', () => {
      this.showPathConfig = !this.showPathConfig
    })

    EventHub.$on('Config/toggleTileNumbers', () => {
      this.showNum = !this.showNum
    })
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

        this.set_target_position({
          r,
          c,
          target: event.target
        })
      })
    })
  }
}
</script>
