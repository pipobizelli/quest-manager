<template>
  <section class="config">
    <label>
      <input type="checkbox" name="show_path_config" id="show_path_config" v-model="path_config">
      Show Path Config
    </label>
    <label>
      <input type="checkbox" id="show_tile_numbers" name="show_tile_numbers" v-model="show_numbers">
      Show Tile Numbers
    </label>
    <button type="button" name="load" @click="load_quest">Load Demo Quest</button>
    <button type="button" name="play" @click="play">PLAY!</button>
    <!-- <label for="tile_config">Tiles Config:</label>
    <textarea disabled name="tile_config" id="tile_config" rows="10" cols="120"></textarea> -->
  </section>
</template>

<script>
import { EventHub } from '../event_hub'
import { Store } from '../store'
import Quest from '../data/quest_basic'
export default {
  data () {
    return {
      path_config: false,
      show_numbers: false
    }
  },
  watch: {
    path_config () {
      EventHub.$emit('Config/togglePathConfig')
      Store.dispatch('Board/toggle_path')
    },
    show_numbers () {
      EventHub.$emit('Config/toggleTileNumbers')
      Store.dispatch('Board/toggle_numbers')
    }
  },
  methods: {
    load_quest () {
      Store.dispatch('Quest/set_map', Quest.map)
      Store.dispatch('Quest/set_components', Quest.components).then(() => {
        Store.dispatch('Quest/set_current_turn')
        EventHub.$emit('Config/questLoaded')
      })
    },
    play () {
      EventHub.$emit('Config/play')
    }
  },
  created () {
    EventHub.$on('Board/changeConfig', (config) => {
      this.tile_config = config
    })

    EventHub.$on('Board/loadQuest', (config) => {
      this.load_quest()
    })
  }
}
</script>
