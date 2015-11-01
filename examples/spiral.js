
function Spiral(clumsy, phase){
    clumsy.font('24px VoronovFont');
    clumsy.clean('white');

    clumsy.padding(50);
    clumsy.range(-2, 2, -2, 2);
    clumsy.lineWidth(2);
    clumsy.radius(5);

    clumsy.color('black');
    clumsy.axis('x', -2, 2, 0.5);
    clumsy.axis('y', -2, 2, 0.5);

    var spiral = clumsy.tabulate(0, 3, 0.01, function(t){
        var r = 0.5 * t;
        return {
            x: r * Math.cos(2 * Math.PI * t + phase),
            y: r * Math.sin(2 * Math.PI * t + phase)
        };
    })

    clumsy.color('red');
    clumsy.draw(spiral);

    clumsy.fillTextAtCenter('Спираль', clumsy.canvas.width/2, 30);
}

if(typeof module != 'undefined' && module.exports){
    module.exports = Spiral;
}
