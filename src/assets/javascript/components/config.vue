<template>
  <section class="config">
    <button type="button" name="show_path_config" @click="show_path_config">Show Path Config</button>
    <button type="button" name="show_tile_numbers" @click="show_tile_numbers">Show Tile Numbers</button>
    <div>
      <label for="tile_config">Tiles Config:</label>
      <textarea disabled name="tile_config" id="tile_config" rows="10" cols="120" v-model="tile_config"></textarea>
    </div>
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
      tile_config: Store.state.Map.config
    }
  },
  created () {
    EventHub.$on('Board/changeConfig', (config) => {
      this.tile_config = config
    })
  },
  methods: {
    show_path_config () {
      EventHub.$emit('Config/togglePathConfig')
    },
    show_tile_numbers () {
      EventHub.$emit('Config/toggleTileNumbers')
    }
  }
}
</script>
