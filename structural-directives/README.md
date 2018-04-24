# Structural directives

## v-if

Wether to show something or not

```
<div v-if"property" >
Show me if property is truthy
</div>
```

## v-for

Loop out a list of items

```
<div v-for="product in products">
{{ product.name }}
</div>
```

## v:on

This how we attach methods to events.

To attach to a specific event we need to use a syntax like this:

```
v-on:eventName
```

Listening to a click would therefore look like the following:

```
<div v-on:click="handleClick"></div>
```

In the component we need to declare a `methods` property and add our `handleClicked` to it, like so:

```
var app = new Vue({
  el: '#app',
  data: {},
  methods : {
    handleClicked : () => {
      alert('something clicked me');
    }
  }
})
```

### passing data to code

How would pass the data from the markup to the js code? Simple, invoke the method with the data, like so:

```
<div v-for="product in products">
  <div v-on:click="handleClick(product)"></div>
</div>
```

and the result js code now needs to look like this:

```
var app = new Vue({
  el: '#app',
  data: {},
  methods : {
    handleClicked : (product) => {
      alert(`show product data ${product.name}`);
    }
  }
})
```

## v-model

This is how we change values, this creates a double binding. Use it like so:

```
{{ person.name }}
<input v-model="person.name" />
```

and in the js code we just type like so:

```
var app = new Vue({
  el: '#app',
  data: {
    person : {
      name : 'chris'
    }
  }
})
```
