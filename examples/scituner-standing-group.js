
function StandingGroup(clumsy, f, dt){
    var self = this;
    var canvas = clumsy.canvas;

    clumsy.lineWidth(2);

    clumsy.color('black');
    clumsy.axis('x', 0, 1.1);
    clumsy.axis('y', -1, 1);

    var wave = clumsy.tabulate(0, 1, 0.01, function(t0){
        var t = t0 + dt;
        return 0.5 * Math.sin(2*Math.PI*f*t) * Math.exp(-15*(t0-0.5)*(t0-0.5));
    });

    clumsy.color('red');
    clumsy.draw(wave);

    clumsy.fillTextAtCenter("Стоячая волна, Vгр = 0", canvas.width/2, 50);
}

if(typeof module != 'undefined' && module.exports){
    module.exports = StandingGroup;
}
