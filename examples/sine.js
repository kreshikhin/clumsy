
function Sine(clumsy){
    clumsy.ctx.font = '24px VoronovFont';
    clumsy.padding(100);
    clumsy.range(0, 2*Math.PI, -1.5, 1.5);

    var sine = clumsy.tabulate(0, 2*Math.PI, 0.01, Math.sin);

    console.log(sine);

    clumsy.draw(sine);

    clumsy.drawAxis('x', 0, 7, 0.5);
    clumsy.drawAxis('y', -2, 2, 0.5);

    clumsy.fillTextAtCenter('Синус', clumsy.canvas.width/2, 50);
}

if(typeof module != 'undefined' && module.exports){
    module.exports = Sine;
}
