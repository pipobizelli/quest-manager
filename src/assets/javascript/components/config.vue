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

    <!-- <label for="tile_config">Tiles Config:</label>
    <textarea disabled name="tile_config" id="tile_config" rows="10" cols="120" v-model="tile_config"></textarea> -->
  </section>
</template>

<script>
import { EventHub } from '../event_hub'
import { Store } from '../store'
export default {
  data () {
    return {
      path_config: false,
      show_numbers: false
      // tile_config
    }
  },
  watch: {
    path_config () {
      EventHub.$emit('Config/togglePathConfig')
      Store.dispatch('Board/toggle_path')
    },
    show_numbers () {
      EventHub.$emit('Config/toggleTileNumbers')
      Store.dispatch('Board/show_numbers')
    }
  },
  created () {
    EventHub.$on('Board/changeConfig', (config) => {
      this.tile_config = config
    })
  }
}
</script>
