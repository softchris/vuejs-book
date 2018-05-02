# Routing

There is a reason a SPA is called a SPA. The term itself means Single Page Application. Our app can be logically divided into many sections or pages. A router can help us to just that. What changes isn't the exact URL but something called the hashban, #.

## Set up

The set up for the router is quite easy, you can either:

* install it using NPM:
* add a script tag that points to an unpkg link

### Install

Install it via NPM

```
npm install vue-router
```

We can also just add a script tag, like so:

```
<script src="https://unpkg.com/vue-router/dist/vue-router.js"></script>
```

### Define routes

At this point we are ready to go but we need to define the routes we need to support. What we need is a list of objects containing the `path` to match and what `component` that should handle it. A routing list can therefore look like this:

```
const routes = [
  { path: '/products', component: Products },
  { path: '/about', component: About },
  { path: '/', component: Home }
]
```

There are two ways for us to create a component:

* Vue.component
* shorthand version

Let's show the `Vue.component()` version first:

```
const Products = Vue.component('products', {
  template : `
  <div>products</div>
  `
});
```

Above is what we are used to, but there is an even shorter version:

```
const Products = {
  template: `
  <div>Products</div>
  `
}
```

### Inject router
At this point we have set up our router list so we support `/products`, `/about` and `/`. Last step is to instantiate the router and inject it into our main Vue object.

Instantation of the router looks like this:

```
const routes = [
  { path: '/products', component: Products },
  { path: '/about', component: About },
  { path: '/', component: Home }
]

const router = new VueRouter({
  routes
})
```

Last step is injecting it to the main Vue object:

```
const app = new Vue({
  router
}).$mount('#app')
```

### creating navigation routes

We want to be able to actually get to the routes we set up so therefore we need to add those in the markup in `index.html`:

```
<div id="app">
    <h1>Hello App!</h1>
    <p>
      <router-link to="/products">Products</router-link>
      <router-link to="/about">About</router-link>
    </p>
  </div>
```

As you can see above we use the component `router-link` to create navigation links and we set its `to` attribute to the path we want to navigate to.

### route outlet
The route outlet is the part of your page that should be switched out when you navigate. Remember you are still on the same page you just replace part of your page when you router from one page to the next. In Vue we use a component called `router-view` to do this, like so:

```
<router-view></router-view>
```

The full code for setting up our links and route outlet therefore looks like this:

```
<div id="app">
    <h1>Hello App!</h1>
    <p>
      <router-link to="/products">Products</router-link>
      <router-link to="/about">About</router-link>
    </p>
    <router-view></router-view>
  </div>
```

## Router parameters

To use router parameters you need to set up your route to support wild card matching. Let's say you start with the router `/products/` then you need to change it `/products/:id`. The `id` here is the wildcard, the value that may change depending on what product you are looking at. This route will match routes like `/products/1` or `/products/11`. When we register our route in code it should now look like the following:

```
const routes = [
  { path: '/products', component: Products },
  { path: '/products/:id', component: ProductDetail }
]
```

How do we access this parameter? Well, we can talk to a built in `$route`. You will find you parameter under `$router.params.id`. Let's show this in an example:

```
const ProductDetail = {
  template: `
  <div>
    Your product is: {{$route.params.id}}
    Product {{ product.name }}
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
  }
};
```

The example above sohw how we access the router param value like this:

```
Your product is: {{$route.params.id}}
```

But we also show another interesting thing, namely how we can access the value and use it to find the data we need and assign the found data as a property in our `data()` method:

```
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
  }
```

## Programmatic navigation
So far we have been using the component `router-link` to navigate but we can also do so programmatically. To do so we use the built in `$router` and call `$router.push(newUrl)`, like so:

```
// literal string path
$router.push('home')

// object
$router.push({ path: 'home' })

// named route
$router.push({ name: 'user', params: { userId: 123 }})
```

As can be seen above there exists different versions that we can use to perform navigation. One where we just give it a literal string `products`, one wgere give it an object `{ path: 'products' }` and the third where we give it an object with the keys `name` and `params`, `{ name: 'user', params: { userId: 123 }}`.

### Named routes

The third version of routing programmatically `{ name: 'user', params: { userId: 123 }}` uses something called named routing. Named routing is us creating a `name` association to the route rather than using the `path`. You can do so when you declare the route by typing the following:

```
routes: [
    {
      path: '/products/:id',
      name: 'product',
      component: ProductDetail
    }
  ]
```

## Query parameters

Query parameters are something we add to our url to filter our resource and is something that may be interesting to keep when we save the url as a bookmark. Example of query parameters is:

```
/products?pageSize=10&page=2
```

Here we convey that we want a part of the dataset, a page size of 10 and the results from page 2. How do we retrieve this parameter in Vue? Simple, we access the `$route.query` object. This object contains our parameters if we have any. In the example url above `/products?pageSize=10&page=2` we would access the parameters by typing:

```
$route.query.pageSize
$router.query.page
```

If we want to build up our url by using programmatic navigation we can easily do so by using the `$route.push()` method and specifying an object where the `query` property is set, like so:

```
this.$route.push({ path: '/products', query: { pageSize:  } })
```

## Named views

So far we settled on having one `router-view` component, that is one place where our routed content would render, also called a viewport. It is possible for us to have several viewports. You might need this in your application as you might for example have the following visual set up of your app:

```
body
footer
```

`body` this is where your page content normally is rendered

`footer` this is an area that much like the `header` could look different depending on what page you are on

So how would you set this up? Simple, we use the `router-view` component but we need to use so called `named views` so we can identify each viewport we mean to use. The above suggested visual page set up could therefore look like this:

```
<div>
  <router-view class="body"></router-view>
</div>
<div>
<router-view class="footer" name="footer"></router-view>
</div>
```

## Passing props to components
Sometimes we want our route to have some pre knowledge of what it shoud render, a common thing you want to pass it is the `title` of the page or maybe the contents of a menu `menu`. We can easily do this by adding a `props` in our route declaration, like so:

```
{ path: '/',
    component: Home,
    props: { title: 'My Home' }
}
```

Then we can easily let our component know about this `props` and render it out in the template, like so:

```
const Home = {
  template : `
  <h2>{{title}}</h2>
  `,
  props: ['title']
};
```

## Lazy loading

TODO
