'use strict';

const assert = require('node:assert/strict');
const { describe, it } = require('node:test');
const Clumsy = require('../clumsy');

function createContext() {
    const calls = [];
    const stack = [];
    const ctx = {
        calls,
        lineWidth: 1,
        lineCap: 'butt',
        font: '10px sans-serif',
        strokeStyle: '#000',
        fillStyle: '#000',
        save() {
            stack.push({
                lineWidth: ctx.lineWidth,
                lineCap: ctx.lineCap,
                font: ctx.font,
                strokeStyle: ctx.strokeStyle,
                fillStyle: ctx.fillStyle
            });
            calls.push(['save']);
        },
        restore() {
            const prev = stack.pop();
            ctx.lineWidth = prev.lineWidth;
            ctx.lineCap = prev.lineCap;
            ctx.font = prev.font;
            ctx.strokeStyle = prev.strokeStyle;
            ctx.fillStyle = prev.fillStyle;
            calls.push(['restore']);
        },
        beginPath() {
            calls.push(['beginPath']);
        },
        moveTo(x, y) {
            calls.push(['moveTo', x, y]);
        },
        lineTo(x, y) {
            calls.push(['lineTo', x, y]);
        },
        quadraticCurveTo(cpx, cpy, x, y) {
            calls.push(['quadraticCurveTo', cpx, cpy, x, y]);
        },
        stroke() {
            calls.push(['stroke', ctx.strokeStyle, ctx.lineWidth]);
        },
        fillRect(x, y, w, h) {
            calls.push(['fillRect', x, y, w, h, ctx.fillStyle]);
        },
        fillText(text, x, y) {
            calls.push(['fillText', text, x, y]);
        },
        measureText(text) {
            return { width: String(text).length * 10, actualBoundingBoxAscent: 12 };
        }
    };
    return ctx;
}

function createCanvas(width, height) {
    const ctx = createContext();
    return {
        width: width,
        height: height,
        ctx: ctx,
        getContext() {
            return ctx;
        }
    };
}

function createClumsy(width, height) {
    return new Clumsy(createCanvas(width || 800, height || 600));
}

describe('Clumsy', function() {
    it('requires a canvas', function() {
        assert.throws(
            () => new Clumsy(),
            { message: 'Canvas is required as first argument.' }
        );
    });

    it('configures a round stroke', function() {
        const canvas = createCanvas(800, 600);
        new Clumsy(canvas);
        assert.equal(canvas.ctx.lineCap, 'round');
        assert.equal(canvas.ctx.lineWidth, 1);
    });

    it('sets paddings', function() {
        const clumsy = createClumsy();
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

    it('sets ranges', function() {
        const clumsy = createClumsy();
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

    it('scales horizontally and vertically', function() {
        const clumsy = createClumsy();
        clumsy.padding(50, 100, 150, 200);
        clumsy.range(10, 110, 20, 120);

        assert.equal(clumsy.scale_horizontal(), 6.5);
        assert.equal(clumsy.scale_vertical(), 2.5);
    });

    it('rescales a line and keeps tick metadata', function() {
        const clumsy = createClumsy();
        clumsy.padding(50, 100, 150, 200);
        clumsy.range(10, 110, 20, 120);

        const line = [
            { x: 0, y: 0 },
            { x: 10, y: 20, mark: '1.0', normal: { x: 0, y: 1 }, tick_size: 7 },
            { x: 200, y: 300 }
        ];
        const rescaled = clumsy.rescale(line);

        assert.deepEqual(rescaled, [
            { x: -15, y: 500 },
            { x: 50, y: 450, mark: '1.0', normal: { x: 0, y: 1 }, tick_size: 7 },
            { x: 1285, y: -250 }
        ]);
    });

    it('replots a line in multiple chains', function() {
        const clumsy = createClumsy();
        clumsy.padding(100);
        clumsy.range(-10, 10);
        clumsy.radius(0);
        clumsy.step(20);

        assert.deepEqual(
            clumsy.replot([{ x: -10, y: -10 }, { x: 10, y: 10 }]),
            [{ x: -10, y: -10 }, { x: 0, y: 0 }, { x: 10, y: 10 }]
        );

        clumsy.step(10);
        assert.deepEqual(
            clumsy.replot([{ x: -10, y: -10 }, { x: 0, y: 0 }, { x: 10, y: 10 }]),
            [
                { x: -10, y: -10 },
                { x: -5, y: -5 },
                { x: 0, y: 0 },
                { x: 5, y: 5 },
                { x: 10, y: 10 }
            ]
        );
    });

    it('stops replotting an empty line', function() {
        const clumsy = createClumsy();
        assert.deepEqual(clumsy.replot([]), []);
        assert.deepEqual(clumsy.replot([{ x: 0, y: 0 }]), []);
    });

    it('does not mutate the curve passed to replot', function() {
        const clumsy = createClumsy();
        clumsy.radius(8);
        clumsy.step(20);
        clumsy.seed(7);
        const line = [{ x: 0, y: 0 }, { x: 100, y: 0 }];
        const snapshot = [{ x: 0, y: 0 }, { x: 100, y: 0 }];

        clumsy.replot(line);
        clumsy.replot(line);

        assert.deepEqual(line, snapshot);
    });

    it('repeats a seeded replot', function() {
        function plot(seed) {
            const clumsy = createClumsy();
            clumsy.radius(5);
            clumsy.step(30);
            clumsy.seed(seed);
            return clumsy.replot([{ x: 0, y: 0 }, { x: 100, y: 40 }, { x: 200, y: 10 }]);
        }

        assert.deepEqual(plot(1), plot(1));
        assert.notDeepEqual(plot(1), plot(2));
    });

    it('seeds random numbers in the unit interval', function() {
        const clumsy = createClumsy();
        clumsy.seed(1);
        const first = clumsy.random();
        clumsy.seed(1);
        assert.equal(clumsy.random(), first);

        clumsy.seed(1);
        const samples = [];
        for (let i = 0; i < 40; i++) samples.push(clumsy.random());

        assert.notEqual(samples[0], samples[1]);
        assert.ok(samples.every((value) => value >= 0 && value < 1));
        assert.ok(samples.some((value) => value < 0.5));
        assert.ok(samples.some((value) => value >= 0.5));
    });

    it('returns the current seed', function() {
        const clumsy = createClumsy();
        clumsy.seed(123456);
        assert.equal(clumsy.seed(), 123456);
    });

    it('adjusts limits', function() {
        const clumsy = createClumsy();
        const result = clumsy.adjustLimits(-0.9, 1.7);
        assert.deepEqual(result.limits, [-0.8, 1.6]);
        assert.equal(result.step, 0.1);

        const result2 = clumsy.adjustLimits(-8, 17);
        assert.deepEqual(result2.limits, [-7, 16]);
        assert.equal(result2.step, 1);

        const flat = clumsy.adjustLimits(2, 2);
        assert.deepEqual(flat, { limits: [2, 2], step: 1 });
    });

    it('tabulates functions and point objects', function() {
        const clumsy = createClumsy();
        assert.deepEqual(
            clumsy.tabulate(0, 1, 1, Math.exp),
            [{ x: 0, y: 1 }, { x: 1, y: Math.E }]
        );
        assert.deepEqual(
            clumsy.tabulate(0, 2, 1, (t) => (t === 1 ? null : { x: t, y: t + 1 })),
            [{ x: 0, y: 1 }, { x: 2, y: 3 }]
        );
    });

    it('reads and writes drawing properties', function() {
        const clumsy = createClumsy();

        clumsy.step(11);
        assert.equal(clumsy.step(), 11);

        clumsy.radius(12);
        assert.equal(clumsy.radius(), 12);

        clumsy.color('black');
        assert.equal(clumsy.color(), 'black');

        clumsy.background('white');
        assert.equal(clumsy.background(), 'white');

        clumsy.font('24px Arial');
        assert.equal(clumsy.font(), '24px Arial');

        clumsy.lineWidth(3);
        assert.equal(clumsy.lineWidth(), 3);

        clumsy.defaultBoxAscent(18);
        assert.equal(clumsy.defaultBoxAscent(), 18);
    });

    it('clears the canvas and keeps the background', function() {
        const canvas = createCanvas(80, 40);
        const clumsy = new Clumsy(canvas);

        clumsy.clean('ivory');
        clumsy.clear();

        assert.equal(clumsy.clear, clumsy.clean);
        assert.equal(clumsy.background(), 'ivory');
        assert.deepEqual(
            canvas.ctx.calls.filter((call) => call[0] === 'fillRect'),
            [
                ['fillRect', 0, 0, 80, 40, 'ivory'],
                ['fillRect', 0, 0, 80, 40, 'ivory']
            ]
        );
    });

    it('draws a straight segment and centers text', function() {
        const canvas = createCanvas(100, 100);
        const clumsy = new Clumsy(canvas);
        clumsy.padding(0);
        clumsy.range(0, 100);
        clumsy.step(1000);
        clumsy.radius(0);

        const last = clumsy.draw([{ x: 0, y: 0 }, { x: 10, y: 0 }]);
        clumsy.fillTextAtCenter('Hi', 50, 20);

        assert.deepEqual(last.direction, { x: 1, y: 0 });
        assert.deepEqual(
            canvas.ctx.calls.filter((call) => call[0] === 'moveTo' || call[0] === 'lineTo'),
            [
                ['moveTo', 0, 100],
                ['lineTo', 10, 100]
            ]
        );
        assert.deepEqual(
            canvas.ctx.calls.filter((call) => call[0] === 'fillText'),
            [['fillText', 'Hi', 40, 20]]
        );
        assert.equal(global.dir_length, undefined);
    });

    it('returns early when there is nothing to draw', function() {
        const clumsy = createClumsy();
        assert.deepEqual(clumsy.draw([]), []);
        assert.deepEqual(clumsy.draw([{ x: 0, y: 0 }]), []);
    });

    it('smooths a curve and draws tick labels', function() {
        const canvas = createCanvas(100, 100);
        const clumsy = new Clumsy(canvas);
        clumsy.padding(0);
        clumsy.range(0, 100);
        clumsy.step(1000);
        clumsy.radius(0);

        clumsy.draw([
            { x: 0, y: 0 },
            { x: 1, y: 0, mark: 'a', normal: { x: 0, y: 1 }, tick_size: 4 },
            { x: 2, y: 0, mark: 'b', normal: { x: 0, y: 1 } },
            { x: 3, y: 0 }
        ]);

        assert.ok(canvas.ctx.calls.some((call) => call[0] === 'quadraticCurveTo'));
        assert.deepEqual(
            canvas.ctx.calls.filter((call) => call[0] === 'fillText').map((call) => call[1]),
            ['a', 'b']
        );
    });

    it('overdraws the same curve without changing the input', function() {
        const canvas = createCanvas(100, 100);
        const clumsy = new Clumsy(canvas);
        clumsy.padding(0);
        clumsy.range(0, 100);
        clumsy.step(1000);
        clumsy.radius(6);
        clumsy.seed(4);
        clumsy.background('white');
        clumsy.color('red');
        clumsy.lineWidth(2);

        const line = [{ x: 0, y: 0 }, { x: 10, y: 0 }];
        clumsy.overdraw(line);

        const strokes = canvas.ctx.calls.filter((call) => call[0] === 'stroke');
        assert.deepEqual(strokes[0], ['stroke', 'white', 6]);
        assert.equal(strokes.at(-1)[1], 'red');
        assert.equal(strokes.at(-1)[2], 2);
        assert.deepEqual(line, [{ x: 0, y: 0 }, { x: 10, y: 0 }]);
    });

    it('points a negative y axis downward in canvas space', function() {
        const canvas = createCanvas(100, 100);
        const clumsy = new Clumsy(canvas);
        clumsy.padding(0);
        clumsy.range(-10, 10);
        clumsy.step(1000);
        clumsy.radius(0);

        clumsy.axis('-y', 0, 10);

        const moves = canvas.ctx.calls.filter((call) => call[0] === 'moveTo' || call[0] === 'lineTo');
        assert.deepEqual(moves[0], ['moveTo', 50, 50]);
        assert.deepEqual(moves[1], ['lineTo', 50, 100]);
    });

    it('places text from an alignment vector', function() {
        const canvas = createCanvas(100, 100);
        const clumsy = new Clumsy(canvas);
        clumsy.drawText('Hi', 50, 20, 'center');
        clumsy.drawText('Hi', 50, 20, { x: 0, y: 1 });

        canvas.ctx.measureText = () => ({ width: 10 });
        clumsy.defaultBoxAscent(16);
        clumsy.drawText('A', 0, 0, { x: 1, y: 0 });

        assert.deepEqual(
            canvas.ctx.calls.filter((call) => call[0] === 'fillText'),
            [
                ['fillText', 'Hi', 40, 20],
                ['fillText', 'Hi', 40, 32],
                ['fillText', 'A', 0, 8]
            ]
        );
    });
});
