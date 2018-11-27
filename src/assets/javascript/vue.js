import Vue from 'vue'
import { Store } from './store'

window.Store = Store

var VueConfiguration = {
  el: '#PageContainer',
  data () {
    return {}
  },
  computed: {
  },
  components: {
  },
  methods: {
  }
}

var AppVue = new Vue(VueConfiguration)

window.AppVueConfigurationn = VueConfiguration
window.AppVue = AppVue
window.Vue = Vue
