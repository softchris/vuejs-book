const Products = Vue.component('Products', {
  template : `
    <div>
    Products <br />
    a : {{ $route.query.a }}
    b : {{ $route.query.b }}
    </div>

  `,
  data() {
    console.log(this.$route.query);
    return {

    };
  }
});

const Home = {
  template : `
  <div>Home</div>
  `
};

const About = Vue.component('About', {
  template : `
    <div>About</div>
  `
})

const products = [{
  id: "1",
  name: 'tomato'
},
{
  id: "2",
  name: 'paprika'
}];

const ProductDetail = {
  template: `
  <div>
    Your product is: {{$route.params.id}}
    Product {{ product.name }}

    <button v-on:click="back()">Back</button>
    <button v-on:click="backName()">Back name</button>
  </div>
  `,
  data() {
    let product = products.find(p => this.$route.params.id);
    if(!product) {
      product = { name: 'unknown product' };
    }

    console.log(this.$route.params.id);
    return {
      a: 'a',
      product
    };
  },
  methods: {
    back() {
      this.$router.push('/products?a=1&b=2');
    },
    backName() {
      this.$router.push({ name: 'products' });
    }
  }
};

const routes = [
  { path: '/products', component: Products, name: 'products' },
  { path: '/about', component: About },
  { path: '/', component: Home },
  { path: '/products/:id', name: 'product', component: ProductDetail }
]

const router = new VueRouter({
  routes // short for `routes: routes`
})

const app = new Vue({
  router
}).$mount('#app')
