
function Clumsy(canvas){
    if(!canvas){
        throw('Canvas is required as first argument.')
    }

    var self = this;

    self.canvas = canvas;
    self.ctx = self.canvas.getContext('2d');

    self.ctx.lineWidth = 2;

    self.padding_left = 0;
    self.padding_right = 0;
    self.padding_bottom = 0;
    self.padding_top = 0;

    self.step = 30;
    self.radius = 10;

    self.defaultBoxAscent = 16;

    self.background = '';

    function isNumber(n){
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    function isSet(object){
        return (typeof object !== 'undefined');
    }

    self.color = function(color){
        if(color === undefined){
            return self.ctx.strokeColor;
        }

        self.ctx.strokeStyle = color;
    }

    self.lineWidth = function(width){
        if(width === undefined){
            return self.ctx.lineWidth;
        }

        self.ctx.lineWidth = width;
    }

    self.clean = function(color){
        self.ctx.save();
        self.background = color || self.background || 'white';
        self.ctx.fillStyle = self.background;
        self.ctx.fillRect(0, 0, self.canvas.width, self.canvas.height);
        self.ctx.restore();
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

    self.overdraw = function(line){
        self.ctx.save();
        var seed = self.seed();
        self.ctx.strokeStyle = self.background;
        self.ctx.lineWidth *= 3;
        self.seed(seed);
        self.draw(line);
        self.ctx.restore();
        self.seed(seed);
        self.draw(line);
    }

    self.tabulate = function(start, end, step, cb){
        var result = [];
        for(var t = start; t <= end; t+= step){
            var f = cb(t);

            if(isNumber(f)){
                result.push({x: t, y: f});
                continue;
            }

            if(isSet(f) && isSet(f.x) && isSet(f.y)){
                result.push(f);
            }
        }
        return result;
    }

    self.draw = function(line){
        var ctx = self.ctx;

        if(line.length < 2) return [];

        var rescaledLine = self.rescale(line);
        var replottedLine = self.replot(rescaledLine);

        ctx.beginPath();
        ctx.moveTo(replottedLine[0].x, replottedLine[0].y);
        var last = replottedLine[0];

        if(replottedLine.length > 2){
            for(var i = 1; i < replottedLine.length - 2; i ++){
                var point = replottedLine[i];
                var nextPoint = replottedLine[i+1];

                var xc = (point.x + nextPoint.x) / 2;
                var yc = (point.y + nextPoint.y) / 2;
                ctx.quadraticCurveTo(point.x, point.y, xc, yc);
            }

            ctx.quadraticCurveTo(replottedLine[i].x, replottedLine[i].y, replottedLine[i+1].x,replottedLine[i+1].y);
                    var last = {x: replottedLine[i+1].x, y:replottedLine[i+1].y};
            last = replottedLine[i+1];
        }else{
            ctx.lineTo(replottedLine[1].x, replottedLine[1].y);
            last = replottedLine[1];
        }

        ctx.stroke();

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

            self.drawText(point.mark,
                point.x + tick_size * point.normal.x,
                point.y + tick_size * point.normal.y,
                point.normal);
        }

        if(replottedLine.length >= 2){
            var l = replottedLine.length - 1;
            var p0 = replottedLine[l-1];
            var p1 = replottedLine[l];

            var dir = { x: p1.x - p0.x, y: p1.y - p0.y};
            dir_length = Math.sqrt(dir.x*dir.x+dir.y*dir.y);
            last.direction = {x: dir.x / dir_length, y: dir.y / dir_length};
        };


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

    self.replot = function(line){
        var step = self.step;
        var radius = self.radius;

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
            replottedLine[i].x = point.x + radius * (self.random() - 0.5);
            replottedLine[i].y = point.y + radius * (self.random() - 0.5);
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

    self.axis = function(axis, t0, t1, options){
        if(isNumber(options)){
            options = {step: options}
        };

        options = options || {};

        var dir = axis;
        if(axis === 'x' || axis === '+x') dir = {x: 1, y: 0};
        if(axis === 'y' || axis === '+y') dir = {x: 0, y: 1};
        if(axis === '-x') dir = {x: -1, y: 0};
        if(axis === '-y') dir = {x: -0, y: 1};

        dir = {
            x: dir.x / Math.sqrt(dir.x*dir.x+dir.y*dir.y),
            y: dir.y / Math.sqrt(dir.x*dir.x+dir.y*dir.y),
        };

        var adjusted = self.adjustLimits(t0, t1);

        var opts = options || {};
        var line = [];
        var step = options.step || adjusted.step;
        var zero = opts.zero || {x: 0, y: 0};
        var limits = opts.limits || [t0 + step, t1 - step];
        var hide_zero = opts.hide_zero || true;

        var mark = opts.mark || function(t){
            return parseInt(t) + '.' + parseInt(Math.abs(t*10) % 10)
        };

        if(isSet(opts.step)){
            for(var t=limits[0]; t <= limits[1]; t += opts.step){
                if(hide_zero && t === 0){
                    continue;
                };

                line.push({
                    x: zero.x + dir.x*t,
                    y: zero.y + dir.y*t,
                    normal: {x: -dir.y, y: dir.x},
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

        var point = self.draw(line);
        self.drawArrow(point, point.direction);
    };

    self.drawArrow = function(point, direction){
        if(!direction) return;

        var ctx = self.ctx;
        var arrow_length = 10;
        var arrow_width = 5

        var normal = {x: direction.y, y: -direction.x};

        var line = [
            {x: point.x + arrow_width*normal.x - arrow_length*direction.x,
            y: point.y + arrow_width*normal.y - arrow_length*direction.y},
            {x: point.x, y: point.y},
            {x: point.x - arrow_width*normal.x - arrow_length*direction.x,
            y: point.y - arrow_width*normal.y - arrow_length*direction.y}
        ];

        ctx.beginPath();
        ctx.moveTo(line[0].x, line[0].y);
        ctx.lineTo(line[1].x, line[1].y);
        ctx.lineTo(line[2].x, line[2].y);
        ctx.stroke();
    }

    self.drawText = function(text, x, y, align){
        var ctx = self.ctx;
        var m = ctx.measureText(text);
        m.actualBoundingBoxAscent = m.actualBoundingBoxAscent || self.defaultBoxAscent;

        if(align === 'center'){
            ctx.fillText(text, x - m.width / 2, y);
            return;
        }
        if(isSet(align) && isNumber(align.x) && isNumber(align.y)){
            ctx.fillText(text,
                x + (-1 + align.x) * m.width / 2,
                y + (1 + align.y) * m.actualBoundingBoxAscent / 2);
            return;
        }

        ctx.fillText(text, x, y);
    };

    // random numbers
    var m_w = 123456789;
    var m_z = 987654321;
    var mask = 0xffffffff;

    // Takes any integer
    self.seed = function(i){
        if(i === undefined){
            return m_w;
        }
        m_w = i;
        m_z = 987654321;;
    }

    // Returns number between 0 (inclusive) and 1.0 (exclusive),
    // just like Math.random().
    self.random = function(){
        m_z = (36969 * (m_z & 65535) + (m_z >> 16)) & mask;
        m_w = (18000 * (m_w & 65535) + (m_w >> 16)) & mask;
        var result = ((m_z << 16) + m_w) & mask;
        result /= 4294967296;
        return result + 0.5;
    }

    self.adjustLimits = function(start, end){
        if(start === end) { reutrn [0, 0]; };
        var d = Math.abs(end - start) / 10;
        var p = Math.floor(Math.log(d) / Math.log(10));
        var step = Math.pow(10, p);

        var limit_start = start > 0 ?
            Math.floor(start / step - 0.5) * step:
            Math.ceil(start / step + 0.5) * step;
        var limit_end = end > 0 ?
            Math.floor(end / step - 0.5) * step:
            Math.ceil(end / step + 0.5) * step;

        return {limits: [limit_start, limit_end], step: step};
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Clumsy;
}
