introducing {}

`data` property is what we can show

```
var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!'
  }
})

{{message}}
```

This makes `message` available to template.
Add another property like so:

```
var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!',
    secondmessage : 'Hello again'
  }
})

{{secondmessage}}
```
