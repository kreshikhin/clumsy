
var fs = require('fs');
var path = require('path');

function Clumsy(canvas){
    var self = this;

    self.canvas = canvas;
    self.ctx = self.canvas.getContext('2d');

    self.padding_left = 0;
    self.padding_right = 0;
    self.padding_bottom = 0;
    self.padding_top = 0;

    self.step = 30;
    self.radius = 10;

    function isNumber(n){
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    function isSet(object){
        return (typeof object !== 'undefined');
    }

    self.padding = function(p0, p1, p2, p3){
        if(p1 === undefined){
            self.padding_left = p0;
            self.padding_right = p0;
            self.padding_bottom = p0;
            self.padding_top = p0;
            return
        }

        if(p2 === undefined){
            self.padding_left = p0;
            self.padding_right = p0;
            self.padding_bottom = p1;
            self.padding_top = p1;
            return;
        }

        self.padding_left = p0;
        self.padding_right = p1;
        self.padding_bottom = p2;
        self.padding_top = p3;
    };

    self.range_left = 0;
    self.range_right = self.canvas.width;
    self.range_bottom = 0;
    self.range_top = self.canvas.height;

    self.range_horizontal = function(){
        return self.range_right - self.range_left;
    };

    self.range_vertical = function(){
        return self.range_top - self.range_bottom;
    };

    self.range = function(r0, r1, r2, r3){
        if(r3 === undefined){
            self.range_left = r0;
            self.range_right = r1;
            self.range_bottom = r0;
            self.range_top = r1;
            return;
        }

        self.range_left = r0;
        self.range_right = r1;
        self.range_bottom = r2;
        self.range_top = r3;
    };


    self.scale_horizontal = function(){
        return (self.canvas.width - self.padding_left - self.padding_right) / self.range_horizontal();
    };

    self.scale_vertical = function(){
        return (self.canvas.height - self.padding_bottom - self.padding_top) / self.range_vertical();
    }

    self.save = function(name){
        if(name == undefined) {
            name = path.basename(process.argv[1], '.js') + '.png';
        }

        var out = fs.createWriteStream(path.join(__dirname, name));
        self.canvas.pngStream().pipe(out);
    };

    self.draw = function(line){
        var step = self.step;
        var radius = self.radius;

        var rescaledLine = self.rescale(line);
        console.log(rescaledLine);
        var replottedLine = self.replot(rescaledLine, step, radius);
        console.log(replottedLine);
        //return;

        var ctx = self.ctx;

        ctx.beginPath();
        ctx.moveTo(replottedLine[0].x, replottedLine[0].y);

        for(var i = 1; i < replottedLine.length - 2; i ++){
            var point = replottedLine[i];
            var nextPoint = replottedLine[i+1];

            var xc = (point.x + nextPoint.x) / 2;
            var yc = (point.y + nextPoint.y) / 2;
            ctx.quadraticCurveTo(point.x, point.y, xc, yc);
        }

        // curve through the last two points
        console.log(replottedLine);
        ctx.quadraticCurveTo(replottedLine[i].x, replottedLine[i].y, replottedLine[i+1].x,replottedLine[i+1].y);
        ctx.stroke();

        var last = {x: replottedLine[i+1].x, y:replottedLine[i+1].y};

        console.log(replottedLine.length);
        for(var i = 0; i < replottedLine.length; i++){
            var point = replottedLine[i];

            if(point.mark === undefined) continue;
            var tick_size = point.tick_size || 10;
            ctx.beginPath();
            ctx.moveTo(
                point.x - 0.5 * tick_size * point.normal.x,
                point.y - 0.5 * tick_size * point.normal.y);
            ctx.lineTo(
                point.x + 0.5 * tick_size * point.normal.x,
                point.y + 0.5 * tick_size * point.normal.y);
            ctx.stroke();

            ctx.fillText(point.mark, point.x, point.y);
        }

        return last;
    }

    self.rescale = function(line){
        var result = [];
        var scale_horizontal = self.scale_horizontal();
        var scale_vertical = self.scale_vertical();

        for(var i = 0; i < line.length; i++){
            var point = line[i];

            result.push({
                x: (point.x - self.range_left) * scale_horizontal  + self.padding_left,
                y: self.canvas.height - ((point.y - self.range_bottom) * scale_vertical  + self.padding_bottom),
                mark: point.mark,
                normal: point.normal
            });
        };
        return result;
    };

    self.replot = function(line, step, radius){
        var accuracy = 0.25;

        if(line.length < 2) return [];
        var replottedLine = [];

        var beginning = line[0];
        replottedLine.push(beginning);

        for(var i = 1; i < line.length; i++){
            var point = line[i];
            var dx = point.x - beginning.x;
            var dy = point.y - beginning.y;
            var d = Math.sqrt(dx*dx+dy*dy);

            if(point.mark !== undefined){
                replottedLine.push(point);
                beginning = point;
                continue;
            }

            if(d < step * (1 - accuracy) && (i + 1 < line.length)){
                // too short
                continue;
            }

            if(d > step * (1 + accuracy)){
                // too long
                var n = Math.ceil(d / step);
                for(var j = 1; j < n; j++){
                    replottedLine.push({
                        x: beginning.x + dx * j / n,
                        y: beginning.y + dy * j / n
                    });
                }
            }

            replottedLine.push(point);
            beginning = point;
        };

        for(var i = 1; i < replottedLine.length; i++){
            var point = replottedLine[i];
            replottedLine[i].x = point.x + radius * (Math.random() - 0.5);
            replottedLine[i].y = point.y + radius * (Math.random() - 0.5);
        };

        return replottedLine;
    };

    self.rightArrow = function(x, y, dx, dy){
        var ctx = self.ctx;
        ctx.beginPath();
        ctx.moveTo(x-dx, y+dy);
        ctx.lineTo(x, y);
        ctx.lineTo(x-dx, y-dy);
        ctx.stroke();
    };

    self.topArrow = function(x, y, dx, dy){
        var ctx = self.ctx;
        ctx.beginPath();
        ctx.moveTo(x-dx, y-dy);
        ctx.lineTo(x, y);
        ctx.lineTo(x+dx, y-dy);
        ctx.stroke();
    };

    self.fillTextAtCenter = function(text, x, y){
        var size = self.ctx.measureText(text);
        self.ctx.fillText(text, x - size.width/2, y);
    };

    self.drawAxis = function(axis, t0, t1, options){
        var dir = axis;
        if(axis === 'x') dir = {x: 1, y: 0};
        if(axis === 'y') dir = {x: 0, y: 1};
        if(axis === '-x') dir = {x: -1, y: 0};
        if(axis === '-y') dir = {x: -0, y: 1};
        dir = {
            x: dir.x / Math.sqrt(dir.x*dir.x+dir.y*dir.y),
            y: dir.y / Math.sqrt(dir.x*dir.x+dir.y*dir.y),
        }

        var opts = options || {};
        var line = [];
        var zero = opts.zero || {x: 0, y: 0};
        var limits = opts.limits || [t0, t1];

        var mark = opts.mark || function(t){
            return parseInt(t) + '.' + parseInt(Math.abs(t*10) % 10)
        };

        if(isSet(opts.step)){
            for(var t=limits[0]; t <= limits[1]; t += opts.step){
                line.push({
                    x: zero.x + dir.x*t,
                    y: zero.y + dir.y*t,
                    normal: {x: dir.y, y: -dir.x},
                    mark: mark(t),
                    style: opts.style,
                    tick_size: opts.tick_size || 5
                });
            };
        }

        if(t0 != limits[0]) line.unshift({
            x: zero.x + dir.x*t0,
            y: zero.y + dir.y*t0
        });

        if(t1 != limits[0]) line.push({
            x: zero.x + dir.x*t1,
            y: zero.y + dir.y*t1
        });

        self.draw(line);

    }
};

module.exports = Clumsy;
