<template>
  <article class="board">
    <section class="tiles_wrapper">
      <template v-for="(line, l) in board.tiles.lines">
        <div v-for="(column, c) in board.tiles.columns"
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
          <!-- <input v-show="showPathConfig" type="text" name="config"
          v-model="board.config[(board.tiles.columns * l) + c]" maxlength="10"> -->
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

export default {
  data () {
    return {
      gridWidth: 0,
      gridHeight: 0,
      showPathConfig: Store.state.Board.path_config,
      showNum: Store.state.Board.show_numbers,
      board: {
        tiles: {
          lines: HeroquestBoard.lines,
          columns: HeroquestBoard.columns
        },
        config: HeroquestBoard.config
      }
    }
  },
  watch: {
    'board.config' (val, oldVal) {
      this.set_board_config(val)
      EventHub.$emit('Board/changeConfig', val)
    }
  },
  components: {
    Actor
  },
  methods: {
    set_board_config (val) {
      this.board.config = val
    },
    set_door (tiles) {
      var t1 = Tile(this.board).getTile(tiles[0])
      var t2 = Tile(this.board).getTile(tiles[1])
      var rot = 0

      if (Tile(this.board).tileInLine(t1, t2)) {
        this.change_tile_config(t1, 1, '0')
        this.change_tile_config(t2, 3, '0')
      }

      if (Tile(this.board).tileInColumn(t1, t2)) {
        this.change_tile_config(t1, 2, '0')
        this.change_tile_config(t2, 0, '0')
        rot = 90
      }

      this.set_actor({
        handle: 'door',
        type: 'door',
        rotation: rot,
        position: Tile(this.board).getTileOffset(t1)
      })
    },
    set_blocks (tiles) {
      for (var t in tiles) {
        var tileUp = Tile(this.board).getUpTile(tiles[t])
        var tileDown = Tile(this.board).getDownTile(tiles[t])
        var tileLeft = Tile(this.board).getPrevTile(tiles[t])
        var tileRight = Tile(this.board).getNextTile(tiles[t])

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

      this.set_actor({
        handle: tiles.length > 1 ? 'doubleblock' : 'block',
        type: 'block',
        rotation: 0,
        position: Tile(this.board).getTileOffset(tiles[0])
      })
    },
    set_actor (actor) {
      var ComponentClass = Vue.extend(Actor)
      var instance = new ComponentClass({
        propsData: {
          handle: actor.handle,
          type: actor.type,
          rotation: actor.rotation,
          position: actor.position
        }
      })
      instance.$mount()
      this.$refs.container.appendChild(instance.$el)
    },
    set_target_position (payload) {
      console.log(payload)
      var target = payload.target
      var x = $(`[data-tile='${payload.r}:${payload.c}']`)[0].offsetLeft
      var y = $(`[data-tile='${payload.r}:${payload.c}']`)[0].offsetTop
      target.style.webkitTransform = target.style.transform = `translate(${x}px, ${y}px)`
    },
    set_quest (quest) {
      let blocks = quest.map.blocks
      for (var b in blocks) {
        this.set_blocks(blocks[b].tiles)
      }

      let doors = quest.map.doors
      for (var d in doors) {
        this.set_door(doors[d].tiles)
      }

      let comps = Object.values(quest.components)
      for (var c in comps) {
        this.set_actor({
          handle: comps[c].label,
          type: comps[c].type,
          rotation: comps[c].attributes.rotation,
          position: Tile(this.board).getTileOffset(comps[c].attributes.tiles[0])
        })
      }
    },
    get_tile_config (tile) {
      return Tile(this.board).getTileConfig(tile)
    },
    change_tile_config (tile, index, state) {
      var tileConfig = Tile(this.board).getTileConfig(tile).split('')
      var config = this.board.config.slice(0)
      tileConfig[index] = state
      config[(this.board.tiles.columns * tile.l) + tile.c] = tileConfig.join('')
      this.set_board_config(config)
    },
    handler (e, tile) {
      // console.log('clique direito:', tile)
      // this.set_door([`${tile.l}:${tile.c}`, `${tile.l}:${tile.c + 1}`])
      e.preventDefault()
    }
  },
  created () {
    EventHub.$on('Config/togglePathConfig', () => {
      this.showPathConfig = !this.showPathConfig
    })
    EventHub.$on('Config/toggleTileNumbers', () => {
      this.showNum = !this.showNum
    })
    EventHub.$on('Config/questLoaded', () => {
      this.set_quest(Store.state.Quest)
    })
  },
  mounted () {
    this.$nextTick(function () {
      interact('.draggable').draggable({
        inertia: false,
        restrict: {
          restriction: 'parent',
          endOnly: false
          // elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
        },
        autoScroll: false
      }).on('dragmove', (event) => {
        let target = event.target
        let x = parseFloat(target.getAttribute('data-x')) + event.dx
        let y = parseFloat(target.getAttribute('data-y')) + event.dy

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
