# Vuex - Using actions

Actions commit mutations rather than mutating state.

In this section we will explore `actions` what they are and how to use them.

In Vuex we have gotten used to using `store.commit()` to persist changes to our store and its state. There is another way to do things though and that is using actions. An actions is simply an intention that can be asynchronous where `store.commit()` is synchronous.

## Creating a simple action
An action is just a method on the `actions` property in your store, like so:

```
const store = new Vuex.Store({
  state: {
    count: 0
  },
  actions: {
    increment(context) {
      context.commit('increment')
    }
  }
})
```

Above we have added the following method:

```
increment(context) {}
```
This method internally calls

```
context.commit('name of mutations function')
```

The above will invoke a method in the `mutatations` object.

### Adding a mutations function

We need to create function that matches what we write in `context.commit('mutationsName')`, so we update our store to look like this:

```
const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    // called 2nd
    mutations() {
      this.state.count++;
    }
  },
  actions: {
    // called 1st on dispatch()
    increment(context) {
      context.commit('increment')
    }
  }
})
```

### Have component call the action

For the component to use this action we need to use the method `dispatch('actionName')`

We therefore create a component to look like the following:

```
Vue.component('product', {
  template: `
    <div>
    {{ count }}
    <button v-on:click="increment">Increment</button>
    </div>
  `,
  methods: {
    increment() {
      this.$store.dispatch('increment');
    }
  }
})
```

## Creating asynchronous action

So to make an action pay for itself we need to use its asynchronous nature. The whole point of using an action is to have it carry out a bunch of asynchronous things so that when done we can call `commit()` on it.

A synchronous scenario can look in the following way:

- fetch some data
- update the store with the fetched data

Of course to have the best possible user experience we would probably revise the above list a bit to read:

- set loading spinner to indicate we are fetching data
- fetch some data
-  if successful, update the store with the fetched data
- if error, update the store with error message
- hide loading spinner

We would implement the above list of actions with the below code:

```
state: {
  loading: false;
  products: [],
  error: ''
},
mutations: {
  products(state, products) {
    this.state.products = products;
  },
  loading(state, isLoading) {
    this.loading = isLoading;
  },
  error(state, error) {
    this.error = error;
  }
}
actions: {
  loadProducts({ commit, state }) {
    commit('loading');
    try{
      const products = await api.getProducts();
      commit('products', products);
    } catch (err) {
      commit('error', err);
    }
  }
}
```

Not especially how the `loadProducts()` calls `commit('loading')` and then calls `api.getProducts()` to fetch the data and depending on how we fare we either call `commit('products')` or `commit('error')`.

## Calling multiple actions
So far we have only dispatched one action from a component but we can dispatch several. Most likely we want to do this because we care about loading data in a specific order.

### Returning a Promise
Actions helps us with this by allowing us to return a Promise from an action. This means we can carry out a `dispatch()` and we would know when it is done. This is demonstrated in the below code:

```
actions : {
  loadProduct({ state, commit }) {
    return new Promise((resolve, reject) => {
      setTimeout(()=> {
        resolve('data')
      }, 3000)
    })
  }
}
```

And to use that in a component

Vue.component('data', {
  template: ``,
  methods: {
    load() {
      this.$store.dispatch('loadProduct').then( data => {
      console.log('data has arrived', data);
    })
   }
  }
})

We can also of course use that inside of another action, like so:

```
actions: {
  async action1() {
    commit('data', await api.getData())
  },
  async action2() {
    await dispatch('action1');
    commit('moredata', await, api.getMoreData);
  }
}
```

Above we can see that we are clearly waiting for `dispatch('action1`) to finish. Internally the method `action1()` fetches data by calling `api.getData()`.
Once that is done we continue in method `action2()` and call `commit()` where to a call to `api.getMoreData()`;

