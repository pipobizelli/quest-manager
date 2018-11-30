import HeroquestBoard from '../data/heroquest'

export default () => {
  var registerModule = (Store) => {
    return Store.registerModule('Map', {
      namespaced: true,
      state: {
        tiles: {
          columns: 0,
          lines: 0
        },
        config: []
      },
      mutations: {
        set_columns (state, columns) {
          state.tiles.columns = columns
        },
        set_lines (state, lines) {
          state.tiles.lines = lines
        },
        set_config (state, config) {
          state.config = config
        }
      },
      actions: {
        initialize: ({commit, state}, config) => {
          commit('set_columns', HeroquestBoard.columns)
          commit('set_lines', HeroquestBoard.lines)
          commit('set_config', HeroquestBoard.config.slice(0))
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
