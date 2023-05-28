# EffML

EffML is a lightweight and efficient data format for working with structured documents. The structure of a sample HTML document look like this:

```
doctype 'html'
head {
  title 'Page\'s Title'
  meta { charset 'UTF-8' }
  meta { viewport 'width=device-width, initial-scale=1.0' }
  link { rel 'stylesheet' href 'styles.css' }
  link { rel 'icon' href 'favicon.ico' }
}
body {
  h1 { 'Hello, World!' }
  p {
    'This is an example EffML document.'
    'It\'s awesome!'
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

## Syntax

The syntax of EffML is very simple. It consists of just two types of entities: _attributes_ and _nodes_. Attributes are key-value pairs like this:

```
src 'image.jpg'
alt 'Sample Image'
```

The values can be only _strings_ enclosed in single quotes. The keys have to be valid names.

_Node_ is either _string_ or _element_. _Element_ is a pair of a _name_ and a _content_ enclosed in curly braces. The _content_ is a list of _attributes_ and _nodes_.

```
div {
  some 'attribute'
  'Some text inside a div.'
}
```

The _name_ has to be a valid name. The _content_ can be empty.

### Names and strings

Strings can contain any Unicode characters except for single quotes. Single quotes can be escaped with a backslash.

Names can contain any ASCII character defined by the following regular expression:

```
/^[:A-Z_a-z\xc0-\xd6\xd8-\xff]([:A-Z_a-z\xc0-\xd6\xd8-\xff]|[-.0-9\xb7])*$/
```
