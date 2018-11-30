export default () => {
  var registerModule = (Store) => {
    return Store.registerModule('Quest', {
      namespaced: true,
      state: {
        components: {},
        actions: {},
        current_turn: 0,
        active_actor: ''
      },
      mutations: {
        set_current_turn (state, turn) {
          state.current_turn = turn
        },
        set_active_actor (state, actor) {
          state.active_actor = actor
        },
        set_components (state, component) {
          state.components = Object.assign({}, state.components, {
            [component.label]: component
          })
        },
        set_action (state, action) {
          state.actions = Object.assign({}, state.actions, action)
        }
      },
      actions: {
        set_current_turn ({commit, state}) {
          let actors = Object.values(state.components).filter(c => c.draggable === true)
          let sortedActors = actors.sort((a, b) => {
            return a.type.length - b.type.length
          })

          if (!sortedActors[state.current_turn]) {
            commit('set_current_turn', 0)
          }
          commit('set_active_actor', sortedActors[state.current_turn].label)
          commit('set_current_turn', state.current_turn++)
        },
        set_components ({commit}, components) {
          commit('set_components', components)
        },
        set_action ({commit}, action) {
          commit('set_actions', action)
        }
      }
    })
  }

  return {
    registerModule
  }
}
