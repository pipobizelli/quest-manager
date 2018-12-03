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

    <label for="tile_config">Tiles Config:</label>
    <textarea disabled name="tile_config" id="tile_config" rows="10" cols="120" v-model="tile_config"></textarea>
  </section>
</template>

<script>
import { EventHub } from '../event_hub'
import { Store } from '../store'
import MapConfig from '../modules/map'
MapConfig().registerModule(Store)
export default {
  data () {
    return {
      tile_config: Store.state.Map.config,
      path_config: true,
      show_numbers: false
    }
  },
  watch: {
    path_config () {
      EventHub.$emit('Config/togglePathConfig')
    },
    show_numbers () {
      EventHub.$emit('Config/toggleTileNumbers')
    }
  },
  created () {
    EventHub.$on('Board/changeConfig', (config) => {
      this.tile_config = config
    })
  }
}
</script>
