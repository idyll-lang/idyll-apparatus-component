# idyll-apparatus-component

Component base class to make it easy to integrate [Apparatus](http://aprt.us/) into Idyll projects.

See more about this at https://mathisonian.com/writing/apparatus

## Installation

First, [set up an Idyll project](http://idyll-lang.org/getting-started).

Inside your idyll project:

```
npm install --save idyll-apparatus-component
```

## Usage

```
[Apparatus
  _url:"path to json spec"
  _regionOfInterest:`{ x: [-1, 1], y: [-1, 1] }`
  _width: 300
  _height: 300  /]
```


### Binding variables

Any property passed to the apparatus component that doesn't start with an underscore
will be bound to the apparatus attribute of the same name. For example,
to bind an Idyll variable named `IdyllN` to an Apparatus attribute called `N`:

```
[var name:“IdyllN” value:0 /]

[Apparatus
  _url: ...”
  _regionOfInterest: roi
  _width: 300
  _height: 300
  N:IdyllN /]
```

