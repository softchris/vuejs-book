# Modules
Modules is a way to split up your store state in different parts. Why do we want to this? Well declaring everything in one store might clutter visibility. You may also want to load in partial states as you lazy load routes and components.

## Set up

Getting started with modules is pretty straight forward. What you need is to add the `modules` property to your store defintion, like so:

```
const store = new Vuex.Store({
  state: {
    count: 0
  },
  modules : {
    moduleA,
    moduleB
  }
})
```

`modules` is an object and contains properties. Each property represents a module and its definition. Each definition looks like a normal store object, like so:

```
const moduleB = {
  state: {
    b: 'bbbb'
  },
  mutations: {...},
  actions: {...},
  getters: { ... }
}
```

## Accessing module values
Accessing a value in a module can be done by referring to the `state` and drill down to the module name and eventually the property. Let's have a look at how in the below  app component:

```
var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!',
    input: ''
  },
  computed: {
    a() {
      return this.$store.state.moduleA.a;
    },
    b() {
      return this.$store.state.moduleB.b;
    }
  },
  store
})
```

Note especially above how we register the computed properties `a` and `b` and how we return the state property for each:

```
a() {
  return this.$store.state.moduleA.a;
}
```
Here we are drilling into our `$store.state` and we find our property by referring to our module name so the full way we access a state in another module is by typing `$store.state.moduleName.statePropertyName`, which in this case is `$store.state.moduleA.a`. Ok, so we learned to access state in module, next up let's look at how to change a value.


## Change value in a module store
We have learned before how we can change the state in the store by using either `commit()` or by calling `dispatch()` and thereby use an action to change the state. Let's register some `mutations` functions on each store module, like so:

```
const moduleA = {
  namespaced: true,
  state: {
    a: 'aaaa'
  },
  mutations: {
    change(state, val) {
      this.state.moduleA.a = val;
    }
  }
}
```

and for `moduleB` we do:

```
const moduleB = {
  state: {
    b: 'bbbb'
  },
  mutations: {
    change(state, val) {
      this.state.moduleB.b = val;
    }
  }
}
```

NOTE, we can access the state in a bit better way, we don't have to use the fully qualified name `this.state.moduleB.b` we can instead use the input parameter `state`, which is the state bound to our module. If we use that instead we can type `state.b` which looks way better.

### Calling commit() from component

Ok, we are all set up and ready for our component to call `commit()`. Let's add that bit to our app component, like so:

```
var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!',
    input: ''
  },
  methods : {
    save() {
      this.$store.commit('change', this.input);
    }
  },
  computed: {
    a() {
      return this.$store.state.moduleA.a;
    },
    b() {
      return this.$store.state.moduleB.b;
    }
  },
  store
})
```

Invoking our method `save()` will trigger a call to `this.$store.commit('change', this.input)`. What will happen, what mutation function will react to this? The answer is all of them will react, both the one in `moduleA` as well as the one in `moduleB`. This may or may not be what we intended. If we me mean for only one of them to be called we will either need to make sure the mutation method name is unique or use something called namespaced modules. Let's look at namespaced modules next.

## Namespaced modules
So far everything has been accessible in the global context which is the reason why when we do a `commit()` both `change()` functions were called. We can isolate ourselves a bit by using namespaced modules. We just need to add the property `namespaced` to our module definition and give it the value `true`, like so:

```
const moduleB = {
  namespaced: true
  state: {
    b: 'bbbb'
  },
  mutations: {
    change(state, val) {
      this.state.moduleB.b = val;
    }
  }
}
```

Trying invoke our `save()` method again will not call the `change()` method for this module anymore, we have isolated ourselves. Any module missing the `namespaced` property will still be part of the global context. So how do we call the `change()` method on this module? We can still call it if we specify its fully qualified name namely `commit('moduleB/change')`. The rule here is `moduleName/mutationFunctionName` as the full name.

This will also affect other things like getters. Let'start off my adding a getter to `moduleB`, like so:

```
const moduleB = {
  namespaced: true
  state: {
    b: 'bbbb'
  },
  getter: {
    b(state) {
      return state.b;
    }
  },
  mutations: {
    change(state, val) {
      this.state.moduleB.b = val;
    }
  }
}
```

We follow this up by creating a new computed property `bGet()` where we make a call to our getter:

```
var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!',
    input: ''
  },
  methods : {
    save() {
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
    bGet() {
      return this.$store.getter['moduleB/b']
    }
  },
  store
})
```

NOTE, how we call our getter with its fully qualified name `moduleB/b`, like so:

```
bGet() {
  return this.$store.getter['moduleB/b']
}
```

## Dynamic registration

What does it mean to dynamically register a module? It means that we are able to add said module after the store has been created. This is often the case when dealing with plugins or if you want to add store state on a lazy load for example.

You add the module by calling `store.registerModule('moduleName', {
  ... module definition object
})`

There might also be situations where you want to deregister your module, you do that by calling `store.unregisterModule('moduleName')`
