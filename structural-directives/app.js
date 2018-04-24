var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!',
    show: true,
    products: [{
      id: 1,
      name: 'tomato'
    },
    {
      id: 2,
      name: 'paprika'
    }]
  },
  methods : {
    showDetail : (product) => {
      alert('detail ' + product.name);
    }
  }
})
