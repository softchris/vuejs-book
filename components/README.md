# Components

We declare a component by using the `Vue` object and calling its component method with two arguments:

* component name
* component definition object

```
Vue.component('person-detail', {
  template: `<div>a component</div>`
})
```

Declaring the above means we can start adding this component wherever we need it, like so:

```
<person-detail>
```

## Adding input property

We are going to want to add an input property to the component so we can pass data for it to render. We do that by doing the following:

* adding v-bind directive when creating the component
* adding a `props` property to component definition

```
Vue.component('person-detail', {
  template: `<div>{{person.name}}</div>`,
  props: ['person']
})
```

We did two things above, we added the `props` to our component definition object. We also updated the template to render our property like so:

```
template: `<div>{{person.name}}</div>`
```

At this point we need to creating the binding in the markup. We create this binding by using the structural directive `v-bind`, like so:

```
<div v-bind:nameOfProperty="property">
```

For our component it means we change it to the following:

```
<person-detail v-bind:person="person">
```

This of course means that the context this component lives in knows about `person`, like so:

```
var app = new Vue({
  el: '#app',
  data: {
    person: {
      name: 'chris'
    }
  }
})
```

### Naming

So far we have been using the `v-bind:propertyInComponent` binding syntax, but it is a bit verbose. We can shorten this to `:propertyInComponent`. There is another naming convention that we need to know about. When we name things in our props of our component like so:

```
Vue.component('component', {
  props : ['title','longTitle']
});
```

The casing we use matter. When we create our component in markup, we need to name it correctly

* title becomes title
  BUT
* longTitle becomes long-title when used in the markup

```
<component long-title="someProp">
```

### More on binding

We can bind anything to a component, a primitive like a string, number or boolean or a list and even an object. However there is a difference in how different types behave. Primitives are being one-time binded so binding against the following primitives, would be one-time:

```
<component :show="show" :title="title" :counter="counter" >
```

Binding to an object would be another thing though:

```
<component :person="person" >
```

The above shows how we bind towards the property `person` and binds it to an object that may look like this:

```
{
  name: 'chris'
}
```

Changing the property inside of the component with a `v-model`, like so:

```
<input v-model="person.name">
```

would lead to even the parent object being affected.

### fixing the double binding

What you usually want when you bind in a list or object is to change things in the component first and when you are happy with it you invoke an action so the parent knows all about this updated list or object. You usually don't want the parent to be alerted about every change that you do. You can fix this by using the `data()` method with the component like so:

```
data() {
  const copyObject = Object.assign({}, this.object);

  const copyList = this.list.map(item => Object.assign(item));

  return {
    copyObject,
    copyList
  };

}
```

## Output

How do we communicate with upwards, i.e how do we invoke a method, simple, we can just bind a method to it like so:

```
<component v-on:customEventName="method" v-bind:prop="prop">
```

The above tells us that we can call the event whatever we want, as indicated by the name `customEVentName`.

And of course our parent component needs updating, like so:

```
var app = new Vue({
  el: '#app',
  data: {
    person: {
      name: 'chris'
    }
  },
  methods: {
    method: () => {
      alert('called from component')
    }
  }
})
```

The interesting part happens when we invoke the method from the component itself, then it looks like this:

```
Vue.component('person-detail',{
  template: `
  <div style="border: solid 1px blue">
    <button v-on:click="$emit('save', person)">Save</button>
  </div>`,
  props: ['person'],
  methods: {
    increment() {
      this.counter += 1 ;
    }
  }
})
```

### Actual example

Not how we below call our custom event `save`. We will soon see how this matches up in our component.

```
<person-detail v-on:save="method" >
```

Let's now turn to our component and look at how we can invoke the event we just set up:

```
<button v-on:click="$emit('save', person)">Save</button>
```

Zooming in we see `v-on:click` and that it invokes `$emit`.
