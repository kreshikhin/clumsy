'use strict';

var path = require('path');
var fs = require('fs');

var takeGifName = function(){
    return path.basename(process.argv[1], '.js').replace('-build', '') + '.gif';
};

var takePngName = function(){
    return path.basename(process.argv[1], '.js').replace('-build', '') + '.png';
};

function pngStream(canvas){
    if(canvas.createPNGStream) return canvas.createPNGStream();
    if(canvas.pngStream) return canvas.pngStream();
    throw new Error('Canvas must provide createPNGStream()');
}

module.exports = {
    takeGifName: takeGifName,
    takePngName: takePngName,
    prepareEncoder: function(ctor, canvas, name, repeat, delay, quality){
        if(!ctor || !canvas){
            throw new Error('First and second arguments are required. Pass the GIFEncoder constructor as the first argument and a canvas as the second');
        }

        var encoder = new ctor(canvas.width, canvas.height);
        encoder.createReadStream().pipe(
            fs.createWriteStream(
                name || takeGifName()));

        encoder.setRepeat(repeat || 0);   // 0 for repeat, -1 for no-repeat
        encoder.setDelay(delay || 50);  // frame delay in ms
        encoder.setQuality(quality || 10); // image quality. 10 is default.
        return encoder;
    },
    saveAsPng: function(clumsy, name){
        if(!clumsy){
            throw new Error('First argument is required. It must be an instance of Clumsy');
        }

        var fileName = name || takePngName();
        var filePath = path.isAbsolute(fileName) ? fileName : path.join('./', fileName);
        var out = fs.createWriteStream(filePath);
        pngStream(clumsy.canvas).pipe(out);
        return out;
    }
};
