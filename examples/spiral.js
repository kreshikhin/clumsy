
function Spiral(clumsy, phase){
    //clumsy.ctx.font = '10px Ubuntu Mono';

    clumsy.padding(100);
    clumsy.range(-2, 2, -2, 2);

    clumsy.radius = 7; 

    var spiral = [];

    for(var t=0; t < 5; t += 0.01){
        var r = 0.5 * t;

        var x = r * Math.cos(2 * Math.PI * t + phase);
        var y = r * Math.sin(2 * Math.PI * t + phase);

        spiral.push({x: x, y: y});
    };

    clumsy.draw(spiral);

    clumsy.drawAxis('x', 0, 2 * Math.PI, {
        limits: [0.5, 5.5],
        step: 0.5,
        tick_size: 5
    });

    clumsy.ctx.fillStyle = 'black';

    clumsy.drawAxis('y', -2, 2, {
        limits: [-1.5, 1.5],
        step: 0.5
    });

    clumsy.drawText('Spiral', clumsy.canvas.width/2, 50);
}

if(typeof module != 'undefined' && module.exports){
    module.exports = Sine;
}
