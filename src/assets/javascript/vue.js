import Vue from 'vue'
import { Store } from './store'
// components -----------------------------------
import Board from './components/board.vue'
import Config from './components/config.vue'
// modules --------------------------------------
import Quest from './modules/quest'
import BoardModule from './modules/board'

window.Store = Store

var VueConfiguration = {
  el: '#PageContainer',
  components: {
    Board,
    Config
  },
  beforeCreate () {
    Quest().registerModule(Store)
    BoardModule().registerModule(Store)
  }
}

var AppVue = new Vue(VueConfiguration)

window.AppVueConfigurationn = VueConfiguration
window.AppVue = AppVue
window.Vue = Vue
