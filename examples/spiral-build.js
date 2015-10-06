
var Canvas = require('canvas');
var GIFEncoder = require('gifencoder');
var path = require('path');
var fs = require('fs');

var Clumsy = require('clumsy');
var helpers = require('clumsy/helpers');

var Spiral = require('./spiral.js');

var encoder = new GIFEncoder(600, 600);

var name = path.basename(process.argv[1], '.js').replace('-build', '') + '.gif';
encoder.createReadStream().pipe(fs.createWriteStream(name));

encoder.start();
encoder.setRepeat(0);   // 0 for repeat, -1 for no-repeat
encoder.setDelay(50);  // frame delay in ms
encoder.setQuality(10); // image quality. 10 is default.

var canvas = new Canvas(600, 600);
var clumsy = new Clumsy(canvas);

clumsy.ctx.font = '12px VoronovFont';

var phase = 0;
var n = 10;

for(var i = 0; i < n; i++){
    clumsy.seed(123);

    clumsy.clear('white');
    Spiral(clumsy, phase);

    phase += 2 * Math.PI / n;
    encoder.addFrame(clumsy.ctx);
};

encoder.finish();
