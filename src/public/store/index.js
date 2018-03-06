export const app = {
  namespaced: true,
  state: {
    transitionName: '',
    alive: []
  },
  mutations: {
    setTransition: (state, transition) => {
      state.transitionName = transition;
    },
    setAlive: (state, alive) => {
      state.alive = alive;
    }
  }
};
