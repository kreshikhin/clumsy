
# Clumsy

  [![NPM Version][npm-image]][npm-url]
  [![NPM Downloads][downloads-image]][downloads-url]
  [![Build Status][travis-image]][travis-url]


Clumsy.js is a library for creating math figures on HTMLCanvas in XKCD style.

This library can be used with Node.js libraries `canvas` and `gifencoder`:

```shell
$ npm install canvas gifencoder
```

## Preparing for drawing

Before drawing it needs to create Canvas and pass this canvas to constructor of object Clumsy. By default clumsy object have padding in 100px and ranges [-1, 1] in both directions. This can be changed by special methods:

```js
// Adds canvas module from npm repository for example
var Canvas = require('canvas');

// Adds this module
var clumsy = require('clumsy');

// And some helpers for interaction with canvas and gifencoder modules
var helpers = require('clumsy/helpers');

// Inits objects
var canvas = new Canvas(800, 600)
var clumsy = new Clumsy(canvas);

// Sets padding and ranges before drawing
clumsy.padding(150);
clumsy.range(0, 2*Math.PI, -1.5, 1.5);
```

## Drawing a figure

Pass arrays with points to method draw. Each point must consider x and y field, e.g. {x: 0, y: 0} - begin coordinate system.

```js
var Canvas = require('canvas');
var clumsy = require('clumsy');
var helpers = require('clumsy/helpers');

var canvas = new Canvas(800, 600)
var clumsy = new Clumsy(canvas);

clumsy.padding(150);
clumsy.range(0, 2*Math.PI, -1.5, 1.5);

var sine = [];

for(var t=0; t < 2*Math.PI; t += 0.01){
    sine.push({
        x: t,
        y: Math.sin(t)
    });
};

clumsy.draw(sine);

helpers.saveAsPng(clumsy); // save as png of same name
```

Result:

![sine](https://raw.github.com/kreshikhin/clumsy/master/examples/readme-sine.png)


## Drawing a figure with scaled axis and title

```javascript
var Canvas = require('canvas');
var Clumsy = require('clumsy');
var helpers = require('clumsy/helpers');

var canvas = new Canvas(800, 600)
var clumsy = new Clumsy(canvas);

clumsy.ctx.font = '24px VoronovFont';
clumsy.padding(100);
clumsy.range(0, 7, -1.5, 1.5);

var sine = [];

for(var t=0; t < 2*Math.PI; t += 0.01){
    sine.push({
        x: t,
        y: Math.sin(t)
    });
};

clumsy.draw(sine);

clumsy.drawAxis('x', 0, 7, {
    limits: [0.5, 6.5],
    step: 0.5,
    tick_size: 5
});

clumsy.drawAxis('y', -2, 2, {
    limits: [-1.5, 1.5],
    step: 0.5
});

clumsy.fillTextAtCenter('Синус', clumsy.canvas.width/2, 50);

helpers.saveAsPng(clumsy);

```

Result:

![axis](https://raw.github.com/kreshikhin/clumsy/master/examples/readme-axis.png)

## Animation

This module also can be used for animation of figure. The best way is prepare a separate script with drawing function.
The function must receive two arguments: a clumsy object and an animation param. So without any other dependencies this script can be used for rendering by both ways in a browser or  node.js

Drawing script:

```js

function Spiral(clumsy, phase){
    clumsy.padding(100);
    clumsy.range(-2, 2, -2, 2);

    clumsy.radius = 3;

    var spiral = [];

    for(var t=0; t < 3; t += 0.01){
        var r = 0.5 * t;

        var x = r * Math.cos(2 * Math.PI * t + phase);
        var y = r * Math.sin(2 * Math.PI * t + phase);

        spiral.push({x: x, y: y});
    };

    clumsy.draw(spiral);

    clumsy.drawAxis('x', -2, 2, {
        limits: [-1.5, 1.5],
        step: 0.5,
        tick_size: 5
    });

    clumsy.drawAxis('y', -2, 2, {
        limits: [-1.5, 1.5],
        step: 0.5
    });

    clumsy.fillTextAtCenter('Спираль', clumsy.canvas.width/2, 50);
}

if(typeof module != 'undefined' && module.exports){
    module.exports = Spiral;
}

```

Preview sript for browser:
```html
<!DOCTYPE html>
<meta charset="utf-8">
<title>spiral</title>
<script src="https://rawgit.com/kreshikhin/clumsy/master/clumsy.js"></script>
<link rel="stylesheet" href="http://webfonts.ru/import/voronov.css"></link>
<canvas id="canvas" width=600 height=600>
<script type="text/javascript" src="spiral.js"></script>
<script type="text/javascript">
    var canvas = document.getElementById('canvas');
    var clumsy = new Clumsy(canvas);
    clumsy.ctx.font = '12px VoronovFont';

    var phase = 0;
    setInterval(function(){
        clumsy.seed(123);

        clumsy.clear('white');
        Spiral(clumsy, phase);

        phase += Math.PI / 10;
    }, 50);
</script>
```

Building script for node.js:

```js

var Canvas = require('canvas');
var GIFEncoder = require('gifencoder');
var path = require('path');
var fs = require('fs');

var Clumsy = require('clumsy');
var helpers = require('clumsy/helpers');

var Spiral = require('./spiral.js');

var canvas = new Canvas(600, 600);
var clumsy = new Clumsy(canvas);
clumsy.ctx.font = '24px VoronovFont';

var encoder = helpers.prepareEncoder(GIFEncoder, canvas);
var phase = 0;
var n = 10;

encoder.start();
for(var i = 0; i < n; i++){
    clumsy.seed(123);

    clumsy.clear('white');
    Spiral(clumsy, phase);

    phase += 2 * Math.PI / n;
    encoder.addFrame(clumsy.ctx);
};

encoder.finish();
```

Result:

![spiral](https://raw.github.com/kreshikhin/clumsy/master/examples/spiral.gif)

## License

  [MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/clumsy.svg
[npm-url]: https://npmjs.org/package/clumsy
[downloads-image]: https://img.shields.io/npm/dm/clumsy.svg
[downloads-url]: https://npmjs.org/package/clumsy
[travis-image]: https://img.shields.io/travis/kreshikhin/clumsy/master.svg
[travis-url]: https://travis-ci.org/kreshikhin/clumsy
