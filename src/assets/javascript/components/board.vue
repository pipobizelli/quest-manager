<template>
  <article class="board">
    <section class="tiles_wrapper">
      <template v-for="(line, l) in board.tiles.lines">
        <div v-for="(column, c) in board.tiles.columns"
          :class="[{
              'tile--larger': (c+1)%3 === 0
            },{
              'tile--pathconfig': showPathConfig
            }, `tileconfig-${get_tile_config(`${l}:${c}`)}`, 'tile']"
          :data-tile="`${l}:${c}`"
          @click="get_tile_config(`${l}:${c}`)"
          @contextmenu.prevent="handler($event, `${l}:${c}`)">
          <p v-show="showNum">
            {{l}}:{{c}}
          </p>
          <!-- <input v-show="showPathConfig" type="text" name="config"
          v-model="board.config[(board.tiles.columns * l) + c]" maxlength="10"> -->
        </div>
      </template>
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
import HeroquestBoard from '../data/heroquest.json'
import Actor from '../components/actor.vue'
import Tile from '../helpers/tile'
import Pathfinder from '../helpers/pathfinder'

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
  computed: {
    quest () { return Store.state.Quest }
  },
  components: {
    Actor
  },
  methods: {
    set_board_config (val) {
      this.board.config = val
    },
    set_door (tiles) {
      var t1 = tiles[0]
      var t2 = tiles[1]
      var rot = 0

      this.board.config[t1].hasDoor = true
      this.board.config[t2].hasDoor = true

      if (Tile(this.board).isTileInColumn(t1, t2)) {
        rot = 90
      }

      this.set_actor({
        handle: 'door',
        type: 'door',
        rotation: rot,
        position: Tile(this.board).getTileOffset(t1)
      })
    },
    open_door (t1) {
      this.board.config[t1].hasDoor = false

      var arr = [Tile(this.board).getTile(t1, 'up'),
        Tile(this.board).getTile(t1, 'down'),
        Tile(this.board).getTile(t1, 'left'),
        Tile(this.board).getTile(t1, 'right')]

      for (var t in arr) {
        var handle = `${arr[t].l}:${arr[t].c}`
        if (arr[t] && this.board.config[handle].hasDoor) {
          this.board.config[handle].hasDoor = false
          var t2 = handle
        }
      }

      if (Tile(this.board).isTileInLine(t1, t2)) {
        if (t1 < t2) {
          this.change_tile_config(t1, 1, '0')
          this.change_tile_config(t2, 3, '0')
        } else {
          this.change_tile_config(t1, 3, '0')
          this.change_tile_config(t2, 1, '0')
        }
      }

      if (Tile(this.board).isTileInColumn(t1, t2)) {
        if (t1 < t2) {
          this.change_tile_config(t1, 2, '0')
          this.change_tile_config(t2, 0, '0')
        } else {
          this.change_tile_config(t1, 0, '0')
          this.change_tile_config(t2, 2, '0')
        }
      }
    },
    set_blocks (tiles) {
      for (var t in tiles) {
        var tileUp = Tile(this.board).getUpTile(tiles[t])
        var tileDown = Tile(this.board).getDownTile(tiles[t])
        var tileLeft = Tile(this.board).getPrevTile(tiles[t])
        var tileRight = Tile(this.board).getNextTile(tiles[t])

        if (tileUp) {
          this.change_tile_config(`${tileUp.l}:${tileUp.c}`, 2, '1')
        }

        if (tileDown) {
          this.change_tile_config(`${tileDown.l}:${tileDown.c}`, 0, '1')
        }

        if (tileLeft) {
          this.change_tile_config(`${tileLeft.l}:${tileLeft.c}`, 1, '1')
        }

        if (tileRight) {
          this.change_tile_config(`${tileRight.l}:${tileRight.c}`, 3, '1')
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
          tiles: actor.tiles,
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

      let objectives = Object.values(quest.objective)
      for (var o in objectives) {
        this.set_actor({
          handle: objectives[o].label,
          type: objectives[o].type,
          rotation: objectives[o].attributes.rotation,
          position: Tile(this.board).getTileOffset(objectives[o].attributes.tiles[0]),
          tiles: objectives[o].attributes.tiles
        })
      }

      let comps = Object.values(quest.components)
      for (var c in comps) {
        this.set_actor({
          handle: comps[c].label,
          type: comps[c].type,
          rotation: comps[c].attributes.rotation,
          position: Tile(this.board).getTileOffset(comps[c].attributes.tiles[0]),
          tiles: comps[c].attributes.tiles
        })
      }
    },
    get_tile_config (tile) {
      return this.board.config[tile].config
    },
    change_tile_config (tile, index, state) {
      var tileConfig = this.get_tile_config(tile).split('') // Tile(this.board).getTileConfig(tile).split('')
      tileConfig[index] = state
      this.board.config[tile].config = tileConfig.join('')
    },
    exec_next_turn () {
      // var action = 0
      var active = this.quest.active_actor
      var actorObject = this.quest.components[active]
      var start = actorObject.attributes.tiles[0]
      var objective = Object.values(this.quest.objective)[0]
      var objectiveTile = objective.attributes.tiles[0]
      var pathArr = Pathfinder(this.board).getAllPaths(start)

      // var path = Pathfinder(this.board).getPath(start, objectiveTile, [start])
      var end = start

      console.log('is objective in sight?')
      if (pathArr.indexOf(objectiveTile) >= 0) {
        console.log('yeah!')
        end = objectiveTile
      } else {
        console.log('no...')
        // is any door?
        console.log('is any door?')
        for (var t in pathArr) {
          var tile = pathArr[t]
          if (this.board.config[tile].hasDoor) {
            console.log('yeah!')
            end = tile
            break
          }
        }
      }

      var path = Pathfinder(this.board).getPath(start, end, [start])
      for (var p in path) {
        EventHub.$emit('Actor/move', {
          handle: active,
          x: Tile(this.board).getTileOffset(path[p]).x,
          y: Tile(this.board).getTileOffset(path[p]).y,
          i: p
        })
      }

      // TODO ====>
      // is enemy in sight?
        // is possible attack an enemy?
      // is any door?
        // which door is closest to the objective tile?
        // get the short path to this door
    },
    handler (e, tile) {
      // Pathfinder(this.board).getAllPaths(tile)
      // console.log(tile)
      this.open_door(tile)
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
    EventHub.$on('Config/play', () => {
      // console.log(Store.state.Quest.active_actor)
      this.exec_next_turn()
    })
    window.Tile = Tile(this.board)
    window.Pathfinder = Pathfinder(this.board)
    window.EventHub = EventHub
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
