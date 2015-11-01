
var assert = require('assert');

var Clumsy = require('../clumsy');

describe('Clumsy', function(){
    var clumsy = new Clumsy({
        width: 800, height: 600,
        getContext: function(){
            return {};
        }
    });

    it('should set paddings', function(){
        clumsy.padding(50);

        assert.equal(clumsy.padding_left, 50);
        assert.equal(clumsy.padding_right, 50);
        assert.equal(clumsy.padding_bottom, 50);
        assert.equal(clumsy.padding_top, 50);

        clumsy.padding(100, 150);

        assert.equal(clumsy.padding_left, 100);
        assert.equal(clumsy.padding_right, 100);
        assert.equal(clumsy.padding_bottom, 150);
        assert.equal(clumsy.padding_top, 150);

        clumsy.padding(200, 250, 300, 350);

        assert.equal(clumsy.padding_left, 200);
        assert.equal(clumsy.padding_right, 250);
        assert.equal(clumsy.padding_bottom, 300);
        assert.equal(clumsy.padding_top, 350);
    });

    it('should set ranges', function(){
        clumsy.range(10, 100);

        assert.equal(clumsy.range_left, 10);
        assert.equal(clumsy.range_right, 100);
        assert.equal(clumsy.range_bottom, 10);
        assert.equal(clumsy.range_top, 100);

        clumsy.range(20, 200, 30, 300);

        assert.equal(clumsy.range_left, 20);
        assert.equal(clumsy.range_right, 200);
        assert.equal(clumsy.range_bottom, 30);
        assert.equal(clumsy.range_top, 300);
    });

    it('should scale in horizontal', function(){
        clumsy.padding(50, 100, 150, 200);
        clumsy.range(10, 110, 20, 120);

        assert.equal(clumsy.scale_horizontal(), 6.5);
    });

    it('should scale in vertical', function(){
        clumsy.padding(50, 100, 150, 200);
        clumsy.range(10, 110, 20, 120);

        assert.equal(clumsy.scale_vertical(), 2.5);
    });

    it('should rescale a line', function(){
        clumsy.padding(50, 100, 150, 200);
        clumsy.range(10, 110, 20, 120);

        var line = [{x: 0,y: 0}, {x: 10,y: 20}, {x: 200,y: 300}];
        var rescaled = clumsy.rescale(line);

        assert.equal(
            JSON.stringify(rescaled),
            JSON.stringify([{ x: -15, y: 500}, { x: 50, y: 450}, { x: 1285, y: -250}]));
    });

    it('should replot a line in multiple chains', function(){
        clumsy.padding(100);
        clumsy.range(-10, 10);

        clumsy.radius(0);
        clumsy.step(20);

        var line = [{x: -10, y: -10}, {x: 10, y: 10}];
        var replotted = clumsy.replot(line);

        assert.equal(
            JSON.stringify(replotted),
            JSON.stringify([{"x":-10,"y":-10},{"x":0,"y":0},{"x":10,"y":10}])
        )

        clumsy.step(10);
        var line = [{x: -10, y: -10}, {x: 0, y: 0}, {x: 10, y: 10}];
        var replotted = clumsy.replot(line);

        assert.equal(
            JSON.stringify(replotted),
            JSON.stringify([{"x":-10,"y":-10},{"x":-5,"y":-5},{"x":0,"y":0},{"x":5,"y":5},{"x":10,"y":10}])
        )
    });

    it('should break of replotting an empty line', function(){
        assert.equal(
            JSON.stringify(clumsy.replot([])), JSON.stringify([]))
        assert.equal(
            JSON.stringify(clumsy.replot([{x: 0, y: 0}])), JSON.stringify([]))
    });

    it('should seed random numbers', function(){
        assert.notEqual(clumsy.random(), clumsy.random());

        clumsy.seed(1);
        var r0 = clumsy.random();
        clumsy.seed(1);
        var r1 = clumsy.random();
        assert.equal(r0, r1);
    });

    it('should adjust limits', function(){
        var result = clumsy.adjustLimits(-0.9, 1.7);
        assert.equal(JSON.stringify(result.limits), JSON.stringify([ -0.8, 1.6 ]));
        assert.equal(result.step, 0.1);

        var result2 = clumsy.adjustLimits(-8, 17);
        assert.equal(JSON.stringify(result2.limits), JSON.stringify([ -7, 16]));
        assert.equal(result2.step, 1);
    });

    it('should allow to tabulate functions', function(){
        var sine = clumsy.tabulate(0, 1, 1, Math.exp);
        assert.equal(JSON.stringify(sine), JSON.stringify([{x: 0, y: 1}, {x:1, y:Math.E}]));
    });

    it('should has getters and setters for all properties', function(){
        clumsy.step(11);
        assert(clumsy.step(), 11, 'a step sets incorrectly');

        clumsy.radius(12);
        assert(clumsy.radius(), 12, 'a radius sets incorrectly');

        clumsy.color('black');
        assert(clumsy.color(), 'black', 'a color sets incorrectly');

        clumsy.background('white');
        assert(clumsy.background(), 'white', 'a background sets incorrectly');

        clumsy.font('24px Arial');
        assert(clumsy.font(), '24px Arial', 'a font sets incorrectly');

        clumsy.step(11);
        assert(clumsy.step(), 11, 'a step sets incorrectly');
    });
});
