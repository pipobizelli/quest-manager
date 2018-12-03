<template>
  <article class="board">
    <section class="tiles_wrapper">
      <template v-for="(line, l) in map.tiles.lines">
        <div v-for="(column, c) in map.tiles.columns"
          :class="[{
              'tile--larger': (c+1)%3 === 0
            },{
              'tile--pathconfig': showPathConfig
            }, `tileconfig-${get_tile_config({l,c})}`, 'tile']"
          :data-tile="`${l}:${c}`"
          @click="get_tile_config({l,c})"
          @contextmenu.prevent="handler($event, {l,c})">
          <p v-show="showNum">
            {{l}}:{{c}}
          </p>
          <input v-show="showPathConfig" type="text" name="config"
          v-model="map.config[(map.tiles.columns * l) + c]" maxlength="10">
        </div>
      </template>
      <!-- <div v-show="!showPathConfig" class="draggable"></div>
      <div v-show="!showPathConfig" class="draggable red"></div> -->
      <article class="actors" ref="container"></article>
    </section>
    <img src="../../images/board.jpg" alt="board">
  </article>
</template>

<script>
import $ from 'jquery'
import Vue from 'vue'
import interact from 'interactjs'
import { EventHub } from '../event_hub'
import { Store } from '../store'
import Tile from '../helpers/tile'
import HeroquestBoard from '../data/heroquest'
import Actor from '../components/actor.vue'
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
          lines: HeroquestBoard.lines,
          columns: HeroquestBoard.columns
        },
        config: HeroquestBoard.config
      }
    }
  },
  watch: {
    'map.config' (val, oldVal) {
      this.set_map_config(val)
      EventHub.$emit('Board/changeConfig', val)
    }
  },
  components: {
    Actor
  },
  methods: {
    set_map_config (val) {
      this.map.config = val
    },
    set_door (tiles) {
      console.log(tiles)
      var t1 = Tile(this.map).getTile(tiles[0])
      var t2 = Tile(this.map).getTile(tiles[1])

      if (Tile(this.map).tileInLine(t1, t2)) {
        this.change_tile_config(t1, 1, '0')
        this.change_tile_config(t2, 3, '0')
      }

      if (Tile(this.map).tileInColumn(t1, t2)) {
        this.change_tile_config(t1, 2, '0')
        this.change_tile_config(t2, 0, '0')
      }
    },
    set_block (tiles) {
      for (var t in tiles) {
        var tileUp = Tile(this.map).getUpTile(tiles[t])
        var tileDown = Tile(this.map).getDownTile(tiles[t])
        var tileLeft = Tile(this.map).getPrevTile(tiles[t])
        var tileRight = Tile(this.map).getNextTile(tiles[t])

        if (tileUp) {
          this.change_tile_config(tileUp, 2, '1')
        }

        if (tileDown) {
          this.change_tile_config(tileDown, 0, '1')
        }

        if (tileLeft) {
          this.change_tile_config(tileLeft, 1, '1')
        }

        if (tileRight) {
          this.change_tile_config(tileRight, 3, '1')
        }
      }
    },
    change_tile_config (tile, index, state) {
      var tileConfig = Tile(this.map).getTileConfig(tile).split('') // 0101 -> 0111
      tileConfig[index] = state
      var config = this.map.config.slice(0)
      config[(this.map.tiles.columns * tile.l) + tile.c] = tileConfig.join('')
      this.set_map_config(config)
    },
    set_target_position (payload) {
      var target = payload.target
      var x = $(`[data-tile='${payload.r}:${payload.c}']`)[0].offsetLeft
      var y = $(`[data-tile='${payload.r}:${payload.c}']`)[0].offsetTop
      target.style.webkitTransform = target.style.transform = `translate(${x}px, ${y}px)`
    },
    get_tile_config (tile) {
      return Tile(this.map).getTileConfig(tile)
    },
    handler (e, tile) {
      // console.log('clique direito:', tile)
      this.set_door([`${tile.l}:${tile.c}`, `${tile.l}:${tile.c + 1}`])
      // this.disable_tile(`${tile.l}:${tile.c}`)
      // var ComponentClass = Vue.extend(Actor)
      // var instance = new ComponentClass({
      //   propsData: {
      //     handle: 'door',
      //     isDraggable: false,
      //     rotation: 0
      //   }
      // })
      // instance.$mount()
      // this.$refs.container.appendChild(instance.$el)
      e.preventDefault()
    }
  },
  beforeCreate () {
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
