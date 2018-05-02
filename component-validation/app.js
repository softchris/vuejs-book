Vue.component('validate-test', {
  template: `
    <div style="border: solid 1px black; padding: 30px">
      <p>
      Year {{ year }}
      </p>
      <p>
      Title {{ title }}
      </p>
      <p>
      Product {{ product.name }}
      </p>
      <p>
      Age: {{ age }}
      </p>
    </div>
  `,

  props : {
    year: Number,
    title : {
      type: String,
      required: true
    },
    product : {
      type: Object,
      default: function() {
        return {
          name: 'Unknown product'
        };
      }
    },
    age : {
      type: Number,
      validator: function(value){
        return value >=18;
      }

    }
  }
});


var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!',
    year: 1990,
    title: 'a title',
    age: 3
  },
  methods : {
    // points to window this
    showDetail : (product) => {
      alert('detail ' + product.name);
    },
    // points to window this
    save: (person) => {
      alert('called from component');
    },
    // points to correct this, no =>
    changeTitle() {
      this.title = "new title";
    }
  }
})
