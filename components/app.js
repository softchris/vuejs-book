Vue.component('person-detail',{
  template: `
  <div style="border: solid 1px blue; padding: 30px; box-shadow: 0px 0px 5px gray">

    Person object
    <input v-model="person.name" /> <br/>

    Name:
    <input v-model="name" />

    Person: {{person.name}}
    Counter: {{counter}}

    <h2>Copy person</h2>
    <input v-model="copyPerson.name" />

    <h2>Copy jedis</h2>
    <div v-for="jedi in copyJedis">
      {{ jedi.name }}
      <input v-model="jedi.name" />
    </div>

    <h2>Jedis</h2>
    <div v-for="jedi in jedis">
      {{ jedi.name }}
      <input v-model="jedi.name" />
    </div>
    <input v-model="newJedi" />
    <button v-on:click="addJedi" >Add</button>

    <h2>List</h2>
    <div v-for="item in list">
      {{ item.name }}
      <input v-model="item.name" />
    </div>
    <input v-model="newItem" />
    <button v-on:click="add" >Add</button>

    <button v-on:click="increment">+</button>
    <button v-on:click="$emit('save', person)">Save</button>
  </div>`,
  props: ['person', 'counter', 'name', 'jedis'],
  methods: {
    increment() {
      this.counter += 1 ;
    },
    add() {
      this.list.push({ name: this.newJedi});
      this.newItem = "";
    },
    addJedi() {
      this.jedis.push({ name: this.newJedi});
      this.newJedi = "";
    }
  },
  data() {
    const copyJedis = this.jedis.map( j => Object.assign({},j));
    const copyPerson = Object.assign({}, this.person);

    return {
      newJedi: '',
      newItem: '',
      list: [],
      copyJedis,
      copyPerson
    };
  }
})

var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!',
    person: {
      name: 'chris'
    },
    counter: 0,
    title: 'Star Wars',
    jedis: [{
      name: 'luke'
    },
    {
      name: 'vader'
    }]
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
