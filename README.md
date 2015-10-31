
# Clumsy

  [![NPM Version][npm-image]][npm-url]
  [![NPM Downloads][downloads-image]][downloads-url]
  [![Build Status][travis-image]][travis-url]


Clumsy.js is a library for creating math figures on HTMLCanvas in XKCD style.

This library can be used with Node.js libraries `canvas` and `gifencoder`:

```shell
$ npm install canvas gifencoder
```

## Content

  * [Preparing for drawing](#preparing-for-drawing)
  * [Drawing a figure](#drawing-a-figure)
  * [Drawing a figure with scaled axis and title](#drawing-a-figure-with-scaled-axis-and-title)
  * [Animation](#animation)
  * [API](#api)
    * [new Clumsy(canvas)](#newclumsy)
    * [clean](#local-files)
    * [draw](#remote-files)
    * [drawAxis](#drawAxis)
    * [overdraw](#multiple-files)
    * [padding](#local-files)
    * [range](#local-files)
  * [License](#License)

## Preparing for drawing

 It needs to create Canvas before drawing and pass this canvas to constructor of object Clumsy. By default clumsy object have padding in 100px and ranges [-1, 1] in both directions. This can be changed by special methods:

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

clumsy.padding(100);
clumsy.range(0, 2*Math.PI, -1.5, 1.5);

var sine = clumsy.tabulate(0, 2*Math.PI, 0.01, Math.sin);
clumsy.draw(sine);

helpers.saveAsPng(clumsy); // save as png of same name
```

The result:

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

var sine = clumsy.tabulate(0, 2*Math.PI, 0.01, Math.sin);

clumsy.draw(sine);

clumsy.drawAxis('x', 0, 7, 0.5);
clumsy.drawAxis('y', -2, 2, 0.5);

clumsy.fillTextAtCenter('Синус', clumsy.canvas.width/2, 50);

helpers.saveAsPng(clumsy);

```

The result:

![axis](https://raw.github.com/kreshikhin/clumsy/master/examples/readme-axis.png)

## Animation

This module also can be used for animation of figure. The best way is prepare a separate script with drawing function.
The function must receive two arguments: a clumsy object and an animation param. So without any other dependencies this script can be used for rendering by both ways in a browser or  node.js

Drawing script [spiral.js](examples/spiral.js):

```js

function Spiral(clumsy, phase){
    clumsy.padding(100);
    clumsy.range(-2, 2, -2, 2);
    clumsy.radius = 3;

    var spiral = clumsy.tabualte(0, 3, 0.01, function(t){
        var a = 2 * Math.PI * t + phase;
        return {x: Math.cos(a), y: Math.sin(a) };
    });

    clumsy.draw(spiral);

    clumsy.drawAxis('x', -4, 4, 0.5);
    clumsy.drawAxis('y', -4, 4, 0.5);

    clumsy.fillTextAtCenter('Спираль', clumsy.canvas.width/2, 50);
}

if(typeof module != 'undefined' && module.exports){
    module.exports = Spiral;
}

```

Preview script for browser:

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

The result:

![spiral](https://raw.github.com/kreshikhin/clumsy/master/examples/spiral.gif)


## API
### new Clumsy(canvas)

Creates new clumsy object.

__Arguments__

* `canvas` - an instance of HTMLCanvas

__Example__
```js
var clumsy = new Clumsy(canvas);
```

### padding(size)
### padding(vertical, horizontal)
### padding(left, right, bottom, top)

Sets paddings from the edges of the canvas.

__Arguments__

* `size` - size of all paddings
* `veritcal`, `horizontal` - vertical and horizontal paddings
* `left`, `right`, `bottom`, `top` - vertical and horizontal paddings

__Example__


```js
// Sets all padding in 100px
clumsy.padding(100);
// Sets vertical paddings are 100px and horizontal are 200px
clumsy.padding(100, 200);
// Sets left, right, bottom and top paddings
clumsy.padding(50, 100, 150, 200);
```

### range(start, end)
### range(start0, end0, start1, start2)

```js
// ranges of axis scales
clumsy.range(-10, 10); // sets same range for horizontal and vertical space
clumsy.range(-10, 10, -20, 20); // sets horizontal [-10,10] and vertical [-20,20] ranges
```

```js
// step of chaining
clumsy.step(30); // sets 30px step
clumsy.radius(20); // sets random radius in 20px
clumsy.background('white'); // sets background color

// clean canvas by background color
clumsy.clean();
```

### clumsy.draw([{x: x0, y: y0}, ... {x: xn-1, yn-1}])

Draws line by arrays of point in `{x: x, y: y}` format.

### clumsy.overdraw(line)

Draws line with clearing canvas under the line by background color.

__Arguments__

* `line` is [{x: x0, y: y0}, ... {x: xn-1, yn-1}]

__Example__

Draws line from (0,0) to (1,1).

```js
clumsy.draw([{x: 0, y:0}, {x: 1, y:1}]);
```

### clumsy.drawAxis(axis, start, end, [step | options]);
Draws axis.

__Arguments__
* `axis` may be 'x', 'y', {x: 1, y: 1}
* `start`, `end` - range of axis
* `step` - step of scale
* `options`

__Example__

Draws axis from -1 to 1 without a scale
```js
clumsy.drawAxis('x', -1, 1);
```
Draws axis from -1 to 1 with a scale and step 0.2.
```js
clumsy.drawAxis('x', -1, 1, 0.2);
```

Draws axis with custom options:
```
clumsy.drawAxis('x', -1, 1, {
    zero: {x: 0, y: 0}, // default
    step: 0.1,
    limits: [start + step, end - step],
    hide_zero: true, // hide zero mark
    tick_size: 5, // in px
    mark: function(t){ // default
        return parseInt(t) + '.' + parseInt(Math.abs(t*10) % 10)
    }
});
```

## License

  [MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/clumsy.svg
[npm-url]: https://npmjs.org/package/clumsy
[downloads-image]: https://img.shields.io/npm/dm/clumsy.svg
[downloads-url]: https://npmjs.org/package/clumsy
[travis-image]: https://img.shields.io/travis/kreshikhin/clumsy/master.svg
[travis-url]: https://travis-ci.org/kreshikhin/clumsy
