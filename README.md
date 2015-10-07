
# Clumsy

Clumsy.js is a library for creating math figures on HTMLCanvas in XKCD style.

This library can be used with Node.js libraries `canvas` and `gifencoder`:

```shell
$ npm install canvas gifencoder
```

## Preparing for drawing

Before drawing it needs to create Canvas and pass this canvas to constructor of object Clumsy. By default clumsy object have padding in 100px and ranges [-1, 1] in both directions. This can be changed by special methods:

```
var canvas = new Canvas(800, 600)
var clumsy = new Clumsy(canvas);

clumsy.padding(150);
clumsy.range(0, 2*Math.PI, -1.5, 1.5);
```

## Drawing a figure

Pass arrays with points to method draw. Each point must consider x and y field, e.g. {x: 0, y: 0} - begin coordinate system.

```javascript
var sinus = [];

for(var t=0; t < 2*Math.PI; t += 0.01){
    sinus.push({x: t, y: Math.sin(t) });
};

clumsy.draw(sinus);
```

## Drawing with axis

```javascript
clumsy.drawAxis('x', 0, 2 * Math.PI);
clumsy.drawAxis('y', -1, 1);
```

## Drawing axis with scale

## Using a custom font

## Animation
