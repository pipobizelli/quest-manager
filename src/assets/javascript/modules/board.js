export default () => {
  var registerModule = (Store) => {
    return Store.registerModule('Board', {
      namespaced: true,
      state: {
        show_numbers: false,
        path_config: false
      },
      mutations: {
        toggle_numbers (state) {
          state.show_numbers = !state.show_numbers
        },
        toggle_path (state) {
          state.show_path_config = !state.show_path_config
        }
      },
      actions: {
        toggle_numbers: ({commit}) => {
          commit('toggle_numbers')
        },
        toggle_path: ({commit}, config) => {
          commit('toggle_path')
        }
      }
    })
  }

  return {
    registerModule
  }
}
