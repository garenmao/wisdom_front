import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default {
  state: {
    menuInfo: '',
    menuActive: ''
  },
  mutations: {
    setMenuList (state, menus) {
      state.menuInfo = menus
      localStorage.setItem('menuInfo', menus)
    },
    setMenuActive (state, active) {
      state.menuActive = active
      localStorage.setItem('menuActive', active)
    }
  },
  actions: {}

}
