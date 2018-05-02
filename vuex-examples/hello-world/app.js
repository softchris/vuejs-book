
let productsCounter = 1;

const store = new Vuex.Store({
  state: {
    count: 0,
    products: [],
    selectedProduct: void 0
  },
  mutations: {
    increment (state) {
      state.count++
    },
    productsAdd(state, product) {
      state.products.push(product);
    },
    productsRemove(state, product) {
      state.products = state.products.filter( p => p.id !== product.id );
    },
    productSelect(state, product) {
      state.selectedProduct = state.products.find( p => p.id === product.id);
    },
    productsEdit(state, product) {
      // how do we mutate an object in the list?? find index and rassign whats there
      for(var i=0; i< state.products.length; i++) {
        if(state.products[i].id === product.id) {
          state.products[i].title = product.title;
        }
      }
    }
  }
})

Vue.component('product-detail', {
  template: `
  <div>
    <h2>Product detail</h2>
      <input v-model="p.title">
      <button v-on:click="save">Save changes</button>
    </div>
  `,
  methods: {
    save() {
      console.log('this', this);
      store.commit('productsEdit', this.p);
    }
  },
  data() {
    return {
      p: Object.assign({}, this.product)
    }
  },
  props: ['product'],
  watch : {
    product(newVal, oldVal) {
      console.log('new val',newVal);
      console.log('old val',oldVal);
      this.p = Object.assign({}, newVal);
    }
  }
})

Vue.component('products', {
  template: `
    <div>
    <h2>Products</h2>
      <input v-model="newProduct" placeholder="add product">
      <button v-on:click="add">Add product</button>
      <div v-for="product in products" class="product" v-bind:class="{ selected: selectedProduct === product.id }">
       {{product.id}} {{ product.title }}
       <button v-on:click="remove(product.id)">Remove</button>
       <button v-on:click="select(product.id)">Select</button>
      </div>
    </div>
  `,
  computed: {
    products() {
      return store.state.products;
    },
    selectedProduct() {
      return store.state.selectedProduct ? store.state.selectedProduct.id: 0;
    }
  },
  methods: {
    add() {
      store.commit('productsAdd',{ title: this.newProduct, id: productsCounter++ });
      this.newProduct = '';
    },
    remove(id) {
      store.commit('productsRemove', { id });
    },
    select(id) {
      store.commit('productSelect', { id });
    }
  },
  data() {
    return {
      newProduct: ''
    }
  }
})

Vue.component('counter',{
  template: `
    <div style="border: solid 1px black; padding: 20px">
      <h4>Counter</h4>
      <div>
        Counter value from store: {{ count }}
        <button v-on:click="increment()">Increment</button>
      </div>
      <div>
        Title: {{title}}
      </div>

    </div>
  `,
  props: ['title'],
  computed: {
    count() {
      return store.state.count;
    }
  },
  methods: {
    increment() {
      store.commit('increment');
    }
  }
})

var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!'
  },
  computed: {
    isSelected() {
      return store.state.selectedProduct;
    },
    selectedProduct() {
      return store.state.selectedProduct;
    }
  },
  store
})
