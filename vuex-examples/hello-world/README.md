# Vuex

Vuex is about state management.

To use it we essentially need to do the following:

* create and configure our store
* create mutators
* create getters ( optional )
* read from the store
* write to the store

# Set up the store

To set up the store we need to first install it. There are two options here:

* install it via npm
* add script tag with unpkg url

The first is achieved by typing:

```
npm install vuex
```

The second version is achieved by typing:

```
<script src="https://unpkg.com/vuex"></script>
```

## Creating the store

We create the store by creating a new instance of `Vuex.Store`, in the process we provide it with an object. The object takes many properties like:

* state, our stores state, just a simple object
* mutators, a property that points to an object that contains methods that can change our state
* getters, a property that points to an object that reads from our state, this is used to create sub queries based on what it is in the store.

Below is the code needed to create the store:

```
const store = new Vuex.Store({
  state: {
    count: 0,
  }
}
```

Above we have declare the store to hold the property `state` which contains one property `count`. `count` is a property that we can now display in a UI if we want.

## Reading from the store

To access the store we need to either:

* access the store instance we created
* inject the store in our application object

### Refer to the store instance
In this case we need to have access to our store instance and pass that around. We first off create the store instance like so:

```
const store = new Vuex.Store({
  state: {
    count: 0,
  }
}
```

Then we need to refer to that store instance inside of component when we need to read from stores state. We read from the state by setting up a computed property and return the slice of state we need, like so:

```
Vue.component('counter', {
  template : `
  <div>{{count}}</div>
  `,
  computed: {
    count() {
      return store.state.count;
    }
  }
})
```

### Injecting the store

The first case is accomplished by doing the following:

```
const store = new Vuex.Store({
  state: {
    count: 0,
  }
}

var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!'
  },
  store
})
```

Reading from the state at this point looks very similar to when we are dealing with a store instance but there is a suttle difference, we know refer to the store on `this`. So instead of writing `store.state.someProperty`, we can write `this.$store.state.someProperty`, note the use of the `$`. Our code now becomes:

```
Vue.component('counter', {
  template : `
  <div>{{count}}</div>
  `,
  computed: {
    count() {
      return this.$store.state.count;
    }
  }
})
```

## Writing to the store

Ok, so we learned how we can read from the the store, so how can we write to the store? The answer is that we can use a method called `commit()` on the `store` object. `commit()` takes two parameters:

* first parameter is a string, which is the name of mutators function on the store object
* second parameter is an object, which is the payload, the data that you wish change the state with

We introduced a concept called `mutators` which is a property on the store, that we set up like so:

```
const store = new Vuex.Store({
  state: {
    count: 0,
  },
  mutators: {
    increment(state) {
      this.state.count++;
    }
  }
}
```

We can see above how we define the method `increment()` which increments the value of the property `count` in our state.

### Adding a payload

So far we have shown how we can add a mutator function to our store and thereby a way to change the state of the store. The example we looked at was very simple, what if we wanted to do something more complex like adding an item to a list? That's almost as simple, we need to do the following to make that happen:

* extends our state with a list property
* write a mutators function to allow for us to add an item to a list

Starting with the first bullet we first extends our state, like so:

```
const store = new Vuex.Store({
  state: {
    count: 0,
    list : []
  },
  mutators: {
    increment(state) {
      this.state.count++;
    }
  }
}
```

We initialise our property `list` to an empty array. Then it's time to write our mutator function like so:

```
const store = new Vuex.Store({
  state: {
    count: 0,
    list : []
  },
  mutators: {
    increment(state) {
      this.state.count++;
    },
    add(state, item) {
      this.state.list.push(item);
    }
  }
}
```

## Creating a CRUD example for a list

Now it's time to put things in practice. Let's create a component `products` that supports the adding and removal of items. We start off with the component:

```
Vue.component('products', {
  template : `
  <div v-for="item in items" >
  {{ item.title }}
  </div>
  `,
  computed() {
    items() {
      return this.$store.state.list;
    }
  }
})
```

### Add an item

Above we read the state from the store and we render out our list by using the `v-for` directive and creating the computed property `items`.

Next up let's add some support for adding an item, so we extend our component with some markup and method for talking to our store:

```
Vue.component('products', {
  template : `
  <div>
    <input v-model="newItem" />
    <div v-for="item in items" >
    {{ item.title }}
    </div>
  </div>
  `,
  data() {
    return {
      newItem: ''
    }
  },
  methods: {
    add() {
      this.$store.commit('add', { title: this.newItem });
    }
  },
  computed() {
    items() {
      return this.$store.state.list;
    }
  }
})
```

We have done the following additions:

* added an input element that captures our new item
* added a data property `newItem`
* added the method `add()` that commited the new item to the store. We can see that the string `add` matches the method under `mutators` in our store.

### Remove an item

To remove an item we need to do the following:

* add a remove button per item
* add a `remove()` method under methods
* extend our store with another mutators method `remove()`

Let's do the necessary changes to the component first:

```
Vue.component('products', {
  template : `
  <div>
    <input v-model="newItem" />
    <div v-for="item in items" >
    {{ item.title }} <button v-on:click="remove" >Remove</button>
    </div>
  </div>
  `,
  data() {
    return {
      newItem: ''
    }
  },
  methods: {
    add() {
      this.$store.commit('add', { title: this.newItem, id: idCounter++ });
    },
    remove() {
      this.$store.commit('remove', { id });
    }
  },
  computed() {
    items() {
      return this.$store.state.list;
    }
  }
})
```

Now let's turn to our store and update that:

```
const store = new Vuex.Store({
  state: {
    count: 0,
    list : []
  },
  mutators: {
    increment(state) {
      this.state.count++;
    },
    add(state, item) {
      this.state.list.push(item);
    },
    remove(state, item) {
      this.state.list = this.state.list.filter( i=> i.id !== item.id);
    }
  }
}
```

### Edit an item

Now this is slightly more complicated but still fairly easy. We need the following:

* A component in which we can edit our item
* a state property in our store that will hold the current item we are editing
* a mutators function that edits the correct item when we decide to save our changes

Let's start by building our edit component

```
Vue.component('product-edit', {
  template: `
  <div>
    <input v-model="localProduct.title" />
    <button v-on:click="save" >Save changes</button>
  </div>
  `,
  methods : {
    save() {
      this.$store.commit('updateProduct', this.item);
    }
  },
  data() {
    return {
      localProduct: Object.assign({}, this.$store.state.selectedProduct)
    };
  },
  props: ['product']
})
```

Ok, so let's now support this by altering `products` component. What we need to add is the ability to select a product from our list of products. The component should therefore now look like this:

```
Vue.component('products', {
  template : `
  <div>
    <input v-model="newItem" />
    <div v-for="item in items" >
    {{ item.title }}
    <button v-on:click="remove" >Remove</button>
    <button v-on:click="select" >Select</button>
    </div>
  </div>
  `,
  data() {
    return {
      newItem: ''
    }
  },
  methods: {
    add() {
      this.$store.commit('add', { title: this.newItem, id: idCounter++ });
    },
    remove() {
      this.$store.commit('remove', { id });
    },
    select(id) {
      this.$store.commit('selectProduct', { id });
    }
  },
  computed() {
    items() {
      return this.$store.state.list;
    }
  }
})
```

What we did above was adding a new method `select()` to the `methods` property, like so:

```
select(id) {
  this.$store.commit('selectProduct', { id });
}
```

Now we need to update our store so we support the `selectProduct()` method, like so:

```
const store = new Vuex.Store({
  state: {
    count: 0,
    list : [],
    selectedProduct
  },
  mutators: {
    increment(state) {
      this.state.count++;
    },
    add(state, item) {
      this.state.list.push(item);
    },
    remove(state, item) {
      this.state.list = this.state.list.filter( i=> i.id !== item.id);
    },
    selectProduct(state, item) {
      this.state.selectedProduct = this.state.list.find( i => i.id === item.id )
    }
  }
}
```

At this point you notice everything works well and fine when you select a product in the list, once. As soon as you select another item in the list your `product-detail` component is NOT updated. Why is that? Well we don't listen to prop changes in our `product-edit` component. Let's do so by introducing the `watch` property. The `watch` property will allow us to listen to prop changes and reset our `localProduct` to our new selection. Let's add that to the component:

```
Vue.component('product-edit', {
  template: `
  <div>
    <input v-model="localProduct.title" />
    <button v-on:click="save" >Save changes</button>
  </div>
  `,
  methods : {
    save() {
      this.$store.commit('updateProduct', this.item);
    }
  },
  data() {
    return {
      localProduct: Object.assign({}, this.$store.state.selectedProduct)
    };
  },
  watch: {
    product(newVal, oldVal) {
      this.localProduct = Object.assign({}, newVal);
    }
  }
  props: ['product']
})
```

Now everything should be working fine.
