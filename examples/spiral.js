
function Spiral(clumsy, phase){
    clumsy.padding(100);
    clumsy.range(-2, 2, -2, 2);

    clumsy.radius = 3;

    var spiral = clumsy.tabulate(0, 3, 0.01, function(t){
        var r = 0.5 * t;
        return {
            x: r * Math.cos(2 * Math.PI * t + phase),
            y: r * Math.sin(2 * Math.PI * t + phase)
        };
    })

    clumsy.draw(spiral);

    clumsy.axis('x', -2, 2, 0.5);
    clumsy.axis('y', -2, 2, 0.5);

    clumsy.fillTextAtCenter('Спираль', clumsy.canvas.width/2, 50);
}

if(typeof module != 'undefined' && module.exports){
    module.exports = Spiral;
}
