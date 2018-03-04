export const app = {
  namespaced: true,
  state: {
    transition: ['turn-on', 'turn-off'],
    transitionName: '',
    alive: []
  },
  mutations: {
    setTransitionName: (state, name) => {
      state.transition = name;
    },
    setTransition: (state, transition) => {
      state.transitionName = transition;
    },
    setAlive: (state, alive) => {
      state.alive = alive;
    }
  }
};
