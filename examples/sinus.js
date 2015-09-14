var Canvas = require('canvas');
var Clumsy = require('../clumsy');

var canvas = new Canvas(800, 600)
var clumsy = new Clumsy(canvas);

clumsy.padding(100);

clumsy.range(0, 10, -2, 2);

//clumsy.addStyle('axis', {color: black, line: [5 15]})

clumsy.draw([{x: 0, y:0}, {x:10, y:0}], 10, 5);
clumsy.draw([{x: 0, y:0}, {x:10, y:0}], 10, 5);

//clumsy.drawText(100, 200, 'Hello World');

//clumsy.draw('axis', '0 0; 100 100; 20 200');
//clumsy.draw('axis', '0 0; 100 100');


clumsy.save();
