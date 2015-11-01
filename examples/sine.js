
function Sine(clumsy){
    clumsy.ctx.font = '24px VoronovFont';
    clumsy.padding(100);
    clumsy.range(0, 7, -2, 2);

    var sine = clumsy.tabulate(0, 2*Math.PI, 0.01, Math.sin);
    clumsy.draw(sine);

    clumsy.axis('x', 0, 7, 0.5);
    clumsy.axis('y', -2, 2, 0.5);

    clumsy.fillTextAtCenter('Синус', clumsy.canvas.width/2, 50);
}

if(typeof module != 'undefined' && module.exports){
    module.exports = Sine;
}
