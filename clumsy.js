
var fs = require('fs');
var _ = require('lodash');
var path = require('path');

function Clumsy(canvas){
    var self = this;

    self.canvas = canvas;
    self.ctx = self.canvas.getContext('2d');

    self.range = function(left, right, bottom, top){

        ctx.transform(
            self.range_right - self.range_left, 0.5, -0.5,1,30,10);
    }

    self.save = function(name){
        if(!name) {
            name = path.basename(process.argv[1], '.js') + '.png';
        }

        var out = fs.createWriteStream(path.join(__dirname, name));
        self.canvas.pngStream().pipe(out);
    };

    self.draw = function(line, step, radius){
        var rLine = self.replot(line, step, radius);
        var ctx = self.ctx;

        ctx.beginPath();
        ctx.moveTo(rLine[0].x, rLine[0].y);
        for (i = 1; i < rLine.length - 2; i ++){
            var xc = (rLine[i].x + rLine[i + 1].x) / 2;
            var yc = (rLine[i].y + rLine[i + 1].y) / 2;
            ctx.quadraticCurveTo(rLine[i].x, rLine[i].y, xc, yc);
        }
        // curve through the last two points
        ctx.quadraticCurveTo(rLine[i].x, rLine[i].y, rLine[i+1].x,rLine[i+1].y);
        ctx.stroke();

        return {x: rLine[i+1].x, y:rLine[i+1].y};
    }

    self.replot = function(line, step, radius){
        var accuracy = 0.25;

        if(line.length < 2) return;
        var replottedLine = [];

        var beginning = line[0];
        replottedLine.push(beginning);
        _.each(line.slice(1), function(point){
            var dx = point.x - beginning.x;
            var dy = point.y - beginning.y;
            var d = Math.sqrt(dx*dx+dy*dy);

            if(d < step * (1 - accuracy)){ // too short
                return;
            }

            if(d > step * (1 + accuracy)){ // too long
                var n = Math.ceil(d / step);
                for(i = 1; i < n; i++){
                    replottedLine.push({
                        x: beginning.x + dx * i / n,
                        y: beginning.y + dy * i / n
                    });
                }
            }

            replottedLine.push(point);
            beginning = point;
        });

        _.each(replottedLine, function(point, index){
            replottedLine[index] = {
                x: point.x + radius * (Math.random() - 0.5),
                y: point.y + radius * (Math.random() - 0.5)
            };

        });

        return replottedLine;
    }

    self.rightArrow = function(x, y, dx, dy){
        var ctx = self.ctx;
        ctx.beginPath();
        ctx.moveTo(x-dx, y+dy);
        ctx.lineTo(x, y);
        ctx.lineTo(x-dx, y-dy);
        ctx.stroke();
    }

    self.topArrow = function(x, y, dx, dy){
        var ctx = self.ctx;
        ctx.beginPath();
        ctx.moveTo(x-dx, y-dy);
        ctx.lineTo(x, y);
        ctx.lineTo(x+dx, y-dy);
        ctx.stroke();
    }

    self.fillTextAtCenter = function(text, x, y){
        var size = self.ctx.measureText(text);
        self.ctx.fillText(text, x - size.width/2, y);
    }
};

module.exports = Clumsy;
