import HeroquestBoard from '../data/heroquest'

export default () => {
  var registerModule = (Store) => {
    return Store.registerModule('Map', {
      namespaced: true,
      state: {
        columns: 0,
        lines: 0,
        config: []
      },
      mutations: {
        set_columns (state, columns) {
          state.columns = columns
        },
        set_lines (state, lines) {
          state.lines = lines
        },
        set_config (state, config) {
          state.config = config
        }
      },
      actions: {
        initialize: ({commit, state}, config) => {
          commit('set_columns', HeroquestBoard.columns)
          commit('set_lines', HeroquestBoard.lines)
          commit('set_config', HeroquestBoard.config)
        },
        set_tiles_config: ({commit}, config) => {
          commit('set_config', config)
        }
      }
    })
  }

  return {
    registerModule
  }
}
