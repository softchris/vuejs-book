const moduleA = {
  namespaced: true,
  state: {
    a: 'aaaa'
  },
  getters: {
    a(state) {
      return state.a;
    }
  },
  mutations: {
    change(state, val) {
      this.state.moduleA.a = val;
    }
  }
}

const moduleB = {
  state: {
    b: 'bbbb'
  },
  mutations: {
    change(state, val) {
      console.log('local state', state.b);
      console.log('global state', this.state.moduleB.b);
      this.state.moduleB.b = val;
    }
  }
}

const store = new Vuex.Store({
  state: {
    count: 0
  },
  modules : {
    moduleA,
    moduleB
  }
})

var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!',
    input: ''
  },
  methods : {
    save() {
      this.$store.commit('moduleA/change', this.input);
      this.$store.commit('change', this.input);
    }
  },
  computed: {
    a() {
      return this.$store.state.moduleA.a;
    },
    b() {
      return this.$store.state.moduleB.b;
    },
    aget() {
      return this.$store.getters['moduleA/a'];
    }
  },
  store
})
