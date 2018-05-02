
const Home = {
  template : `
  <h2>{{title}}</h2>
  `,
  props: ['title']
};

const Products = {
  template : `
  <h2>Products</h2>
  `
};

const Menu = {
  template : `
  <div>
    <h2>{{title}}</h2>
  </div>
  `,
  props: ['menu', 'title']
};

const Footer = {
  template : `
  <h2>Footer products</h2>
  `
};


const routes = [
  { path: '/',
    component: Home,
    props: { title: 'My Home' }
  },
  { path: '/products',
    components: {
      default: Products,
      footer: Footer
    },
  },
]

const router = new VueRouter({
  routes // short for `routes: routes`
})

const app = new Vue({
  router
}).$mount('#app')
