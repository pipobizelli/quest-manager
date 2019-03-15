<template>
  <section class="config">
    <label>
      <input type="checkbox" name="show_path_config" id="show_path_config" @click="toggle_config">
      Show Path Config
    </label>
    <label>
      <input type="checkbox" id="show_tile_numbers" name="show_tile_numbers" @click="toggle_numbers">
      Show Tile Numbers
    </label>

    <label>
      <input type="checkbox" id="show_tile_numbers" name="show_tile_numbers" v-model="autoPlay">
      Auto Play
    </label>
    <!-- <button type="button" name="load" @click="load_quest">Load Demo Quest</button> -->
    <button v-show="autoPlay" type="button" name="play" @click="play">PLAY!</button>
    <!-- <label for="tile_config">Tiles Config:</label>
    <textarea disabled name="tile_config" id="tile_config" rows="10" cols="120"></textarea> -->
  </section>
</template>

<script>
import { EventHub } from '../event_hub'
import { Store } from '../store'
import Quest from '../data/the_maze'
export default {
  data () {
    return {
      autoPlay: false
    }
  },
  computed: {
    path_config () {
      return Store.state.Board.path_config
    },
    show_numbers () {
      return Store.state.Board.show_numbers
    }
  },
  methods: {
    toggle_config () {
      EventHub.$emit('Config/togglePathConfig')
      Store.dispatch('Board/toggle_path')
    },
    toggle_numbers () {
      EventHub.$emit('Config/toggleTileNumbers')
      Store.dispatch('Board/toggle_numbers')
    },
    toggle_auto_play () {
      EventHub.$emit('Config/toggleAutoPlay')
    },
    load_quest () {
      Store.dispatch('Quest/set_objective', Quest.objective)
      Store.dispatch('Quest/set_map', Quest.map)
      Store.dispatch('Quest/set_components', Quest.components).then(() => {
        Store.dispatch('Quest/set_current_turn')
        EventHub.$emit('Config/questLoaded')
      })
    },
    play () {
      EventHub.$emit('Config/play')
    //   EventHub.$emit('Actor/move', {
    //     handle: 'barbarian',
    //     x: 103,
    //     y: 69
    //   })
    }
  },
  created () {
    EventHub.$on('Board/loadQuest', (config) => {
      this.load_quest()
    })

    setTimeout(() => {
      this.load_quest()
    }, 50)
  }
}
</script>
