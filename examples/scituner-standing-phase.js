
function StandingPhase(clumsy, shift){
    var canvas = clumsy.canvas;

    clumsy.clean('white');

    clumsy.font('24px VoronovFont');
    clumsy.lineWidth(2);
    clumsy.padding(100);
    clumsy.range(0, 1.1, -2, 2);
    clumsy.radius(3);
    clumsy.step(10);

    clumsy.color('black');
    clumsy.axis('x', 0, 1.1);
    clumsy.axis('y', -2, 2);

    var f = 5;

    var wave = clumsy.tabulate(0, 1.01, 0.01, function(t0){
        var t = t0 + shift;
        return Math.sin(2*Math.PI*f*t0) * Math.exp(-15*(t-0.5)*(t-0.5));
    });

    clumsy.color('red');
    clumsy.draw(wave);

    clumsy.fillTextAtCenter("Стоячая волна, Vф = 0", canvas.width/2, 50);
    clumsy.fillText("x(t)", 110, 110);
    clumsy.fillText("t", 690, 330);
}

if(typeof module != 'undefined' && module.exports){
    module.exports = StandingPhase;
}
