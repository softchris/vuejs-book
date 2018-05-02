const api = {
  getData: () => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve('data');
      }, 3000);
    });
  },
  getOtherData: () => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve('other data');
      }, 3000);
    });
  }
}

const store = new Vuex.Store({
  state: {
    count: 0,
    data: void 0,
    otherdata: void 0,
    loading: false
  },
  mutations: {
    increment() {
      this.state.count++;
    },
    data(state, data) {
      this.state.data = data;
    },
    otherdata(state, data) {
      this.state.otherdata = data;
    },
    loading(state, isLoading) {
      this.state.loading = isLoading;
    }
  },
  actions: {
    async loadData({ dispatch, commit }) {
      commit('loading', true);
      commit('data', await api.getData());
      commit('loading', false);
    },
    async loadOtherData({ dispatch, commit }) {
      await dispatch('loadData');
      commit('loading', true);
      commit('otherdata', await api.getOtherData());
      commit('loading', false);
    },
    increment (context) {
      setTimeout(() => {
        context.commit('increment')
      }, 2000);
    }
  }
})

Vue.component('test', {
  template: `
  <div>
    <div v-if="loading">
      Loading...
    </div>
    <div>
    {{ count }}
    </div>
    <div>
    data: {{ data }}
    </div>
    <div>
    other data: {{ otherdata }}
    </div>
    <button v-on:click="increment">Increment</button>
    <button v-on:click="load">Load</button>
  </div>
  `,
  computed: {
    count() {
      return this.$store.state.count;
    },
    data() {
      return this.$store.state.data;
    },
    otherdata() {
      return this.$store.state.otherdata;
    },
    loading() {
      return this.$store.state.loading;
    }
  },
  methods: {
    increment() {
      this.$store.dispatch('increment');
    },
    load() {
      this.$store.dispatch('loadOtherData');
    }
  }
})

var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!'
  },
  store
})
