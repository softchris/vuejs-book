# Components validation

There is a way for us to set some validation on our props. Why would we want that you ask? Well, the main reason is that we want to make sure the consumers of our component use it correctly, so what we can do is to set up a bunch of validation and give out a warning in the console if the validation fails.

## Required

If we don't explicitly set a property as `required` it will be optional. What we do to make it so is to assign an object to our property instead of using the string syntax `['prop']` that we are used to, like the below:

```
Vue.component('validate-test', {
  template: `
    <div style="border: solid 1px black; padding: 30px">
      <p>
      Year {{ year }}
      </p>
      <p>
      Title {{ title }}
    </div>
  `,

  props : {
    year: Number,
    title : {
      type: String,
      required: true
    },
  }
});
```

Let's highlight the interesting code:

```
title : {
  type: String,
  required: true
}
```

Above we give it a type `String` and set the `required` property to `true`.

## Validating an object

Objects are interesting in that they have many different properties to validate. One thing we can do is to rely on a factory function `default()`. If we leave out the property in question then the factory function will be invoked and whatever it returns will take the place of where the bound object should have been. Let's look at some code:

```
Vue.component('validate-test', {
  template: `
    <div style="border: solid 1px black; padding: 30px">
      <p>
      Year: {{ year }}
      </p>
      <p>
      <p>
      Title: {{ title }}
      </p>
      <p>
      Product: {{ product.name }}
      </p>
    </div>
  `,

  props : {
    year: Number,
    title : {
      type: String,
      required: true
    },
    product: {
      type: Object,
      default: function() {
        return {
          name: 'Unknown product'
        }
      }
    }
  }
});
```

And using said component like so:

```
<validate-test :year="year" :title="title" ></validate-test>
```

As you can see above we are clearly omitting the `product` property in our component and this is where the `default()` method kicks in and returns its object instead. Our template therefore renders

```
Product: Unknown product
```

## Validator function

Not only are we able to ensure that the input reaching our prop is of the right data type but we are also ablo to inspect the value and ensure it fulfills the necessary criteria. Let's have a look at what that looks like in code:

```
Vue.component('validate-test', {
  template: `
    <div style="border: solid 1px black; padding: 30px">
      <p>
      Year: {{ year }}
      </p>
      <p>
      <p>
      Title: {{ title }}
      </p>
      <p>
      Product: {{ product.name }}
      </p>
    </div>
  `,

  props : {
    year: Number,
    title : {
      type: String,
      required: true
    },
    product: {
      type: Object,
      default: function() {
        return {
          name: 'Unknown product'
        }
      }
    },
    age: {
      validate: function(value) {
        return value >=18;
      }
    }
  }
});
```

Let's highlight the interesting code:

```
age: {
  validate: function(value) {
    return value >=18;
  }
}
```

Above we can see that we added the function `validate()` and we define a function body where we end up with a response that either evaluates to `true` or `false`. If it returns `false` then a warning will be raised in the console that this value is not valid.
