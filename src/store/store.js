import Vue from 'vue'
import Vuex from 'vuex'
import menus from './modules/menus'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: '',
    userType: ''
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
      localStorage.setItem('token', token)
    },
    SET_USERTYPE: (state, userType) => {
      state.userType = userType
      localStorage.setItem('userType', userType)
    }
  },
  actions: {},
  modules: {
    menus
  }
})
