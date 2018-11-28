import Vue from 'vue'
import { Store } from './store'
import Tiles from './components/tiles.vue'

window.Store = Store

var VueConfiguration = {
  el: '#PageContainer',
  components: {
    Tiles
  }
}

var AppVue = new Vue(VueConfiguration)

window.AppVueConfigurationn = VueConfiguration
window.AppVue = AppVue
window.Vue = Vue
