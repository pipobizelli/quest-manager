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
      <article class="actors" ref="container">
        <template v-for="block in quest.map.blocks">
          <actor
            :board="board"
            :tiles="block.tiles"
            :handle="block.tiles.length > 1 ? 'doubleblock' : 'block'"
            type="block"
            :rotation="0">
          </actor>
        </template>
        <template v-for="door in quest.map.doors">
          <actor
            :board="board"
            :tiles="door.tiles"
            handle="door"
            type="door"
            :rotation="get_rot(door)">
          </actor>
        </template>
        <template v-for="objective in Object.values(quest.objectives)">
          <actor
            :board="board"
            :tiles="objective.attributes.tiles"
            :handle="objective.label"
            :type="objective.type"
            :rotation="objective.attributes.rotation">
          </actor>
        </template>
        <template v-for="comp in Object.values(quest.components)">
          <actor
            :board="board"
            :tiles="comp.attributes.tiles"
            :handle="comp.label"
            :type="comp.type"
            :rotation="comp.attributes.rotation">
          </actor>
        </template>
      </article>
    </section>
    <img src="../../images/board.jpg" alt="board">
  </article>
</template>

<script>
import interact from 'interactjs'
import HeroquestBoard from '../data/heroquest.json'
import Actor from '../components/actor.vue'
import Tile from '../helpers/tile'

// TEMP
import Quest from '../data/the_maze'

export default {
  data () {
    return {
      quest: Quest,
      gridWidth: 0,
      gridHeight: 0,
      showPathConfig: false,
      showNum: false,
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
    }
  },
  components: {
    Actor
  },
  methods: {
    set_board_config (val) {
      this.board.config = val
    },
    get_rot (actor) {
      var t1 = actor.tiles[0]
      var t2 = actor.tiles[1]
      var rot = 0

      if (Tile(this.board).isTileInColumn(t1, t2)) {
        rot = 90
      }

      return rot
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
    },
    set_target_position (payload) {
      let target = payload.target
      let tile = document.querySelectorAll(`[data-tile='${payload.r}:${payload.c}']`)[0]
      let x = tile.offsetLeft
      let y = tile.offsetTop
      target.setAttribute('data-x', x)
      target.setAttribute('data-y', y)
      target.style.webkitTransform = target.style.transform = `translate(${x}px, ${y}px)`
    },
    get_tile_config (tile) {
      return this.board.config[tile].config
    },
    change_tile_config (tile, index, state) {
      var tileConfig = this.get_tile_config(tile).split('')
      tileConfig[index] = state
      this.board.config[tile].config = tileConfig.join('')
    },
    handler (e, tile) {
      this.open_door(tile)
      e.preventDefault()
    }
  },
  mounted () {
    let self = this
    this.$nextTick(function () {
      // set blocks passage
      let blocks = this.quest.map.blocks
      for (var b in blocks) {
        this.set_blocks(blocks[b].tiles)
      }

      interact('.draggable').draggable({
        inertia: false,
        autoScroll: false
      }).on('dragmove', (event) => {
        let target = event.target
        let x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
        let y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy
        target.style.webkitTransform = target.style.transform = `translate(${x}px, ${y}px)`
        target.setAttribute('data-x', x)
        target.setAttribute('data-y', y)
      }).on('dragend', (event) => {
        let tile = document.getElementsByClassName('tile')[0]
        let gridWidth = Math.round(tile.offsetWidth)
        let gridHeight = Math.round(tile.offsetHeight)
        let dataX = Math.round(event.target.getAttribute('data-x'))
        let dataY = Math.round(event.target.getAttribute('data-y'))
        let maxC = self.board.tiles.columns - 1
        let maxR = self.board.tiles.lines - 1
        let c = Math.round(dataX / gridWidth) > 0
          ? Math.round(dataX / gridWidth) > maxC ? maxC : Math.round(dataX / gridWidth)
          : 0
        let r = Math.round(dataY / gridHeight) > 0
          ? Math.round(dataY / gridHeight) > maxR ? maxR : Math.round(dataY / gridHeight)
          : 0

        console.log(c, r)

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
