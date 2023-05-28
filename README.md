# EffML

EffML is a lightweight and efficient data format for working with structured documents. The structure of a sample HTML document look like this:

```
doctype 'html'
head {
  title 'Page Title'
  meta { charset 'UTF-8' }
  meta { viewport 'width=device-width, initial-scale=1.0' }
  link { rel 'stylesheet' href 'styles.css' }
  link { rel 'icon' href 'favicon.ico' }
}
body {
  h1 { 'Hello, World!' }
  p {
    'This is an example HTML document.'
    'Another paragraph line.'
    div {
      'Some text inside a div.'
    }
  }
  img {
    src 'image.jpg'
    alt 'Sample Image'
  }
}
```

## Design concepts

Key points of the language design:

* Extremely **simple and straightforward** with just a few syntax rules without any exceptions.
* Does not use any unnecessary characters such as equal signs for attributes etc.
* Does not rely on whitespace in any way. 
* Super simple parsing.
