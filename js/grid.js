// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller
// fixes from Paul Irish and Tino Zijdel
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());


// Depends from jQuery, because of $.extend. That's senseless.

// Todo: use require.js
var Grid = (function(options) {
    /*
            Grid

     Rows
            -- --
        0  |  |  |
            -- --
        1  |  |  |
            -- --
        2  |  |  |
            -- --

            0   1   Columns

    This grid has 6 boxes. Inner size of the box means its size without
    borders. The grid has 2 columns and 3 rows.

    Grid's width and height = boxCount * boxSize + (boxCount + 1) * borderSize
    */

    var defaultOptions = {
        // Box's inner size in pixels. Box is a square.
        boxSize: 40,

        // Box's border in pixels
        borderSize: 1,
        borderColor: 'black',

        columns: 10,
        rows: 10
    };

    var my = {},
        options = $.extend(true, {}, defaultOptions, options),
        canvas = options.canvas,
        ctx = canvas.getContext("2d"),
        width = canvas.width,
        height = canvas.height,

        // [ [[row,column], color], ... ]
        boxColors = [],

        // [ [x1, y1, x2, y2, color] .. ]
        additionalLines = [];

    function init() {
        var size = my.getGridSize(),
            widthPixels = size[0],
            heightPixels = size[1];
        canvas.width = widthPixels;
        canvas.height = heightPixels;
    }

    //
    // Public methods
    //

    // If you want canvas to be instantly drawn, set it to true
    my.draw = function() {
        window.requestAnimationFrame(draw);
    };

    // Returns grid's size in pixels
    my.getGridSize = function() {
        var width = options.columns * options.boxSize + (options.columns + 1) *
                    options.borderSize,
            height = options.rows * options.boxSize + (options.rows + 1) *
                     options.borderSize;
        return [width, height];
    };

    // column and row indexing start from 0.
    // color is the color of the box.
    // render is optional, by default canvas is re-rendered.
    my.setBoxColor = function(column, row, color, render) {
        if (typeof render === 'undefined') {
            var render = true;
        }

        boxColors.push([[column, row], color]);

        if (render) {
            my.draw();
        }
    };

    my.clearBoxColors = function(render) {
        if (typeof render === 'undefined') {
            var render = true;
        }

        boxColors = [];

        if (render) {
            my.draw();
        }
    };

    // Returns [[x1, y1], [x2, y2]] coordinates of box's position.
    // They are topleft and bottomright coordinates.
    my.getBoxCoordinates = function(column, row) {
        var x1Position = options.borderSize + column *
                        (options.boxSize + options.borderSize),
            y1Position = options.borderSize + row *
                        (options.boxSize + options.borderSize),
            x2Position = x1Position + options.boxSize - 1,
            y2Position = y1Position + options.boxSize - 1;

        return [[x1Position, y1Position], [x2Position, y2Position]];
    };

    // Draws a line from box1 to box2
    my.connectBoxes = function(column1, row1, column2, row2, color) {
        var coord1 = my.getBoxCoordinates(column1, row1),
            coord2 = my.getBoxCoordinates(column2, row2),
            x1 = coord1[0][0] + options.boxSize / 2,
            y1 = coord1[0][1] + options.boxSize / 2,
            x2 = coord2[0][0] + options.boxSize / 2,
            y2 = coord2[0][1] + options.boxSize / 2;
        additionalLines.push([x1, y1, x2, y2, color]);
    };

    my.clearBoxConnections = function() {
        additionalLines = [];
        my.draw();
    };

    //
    // Private methods
    //

    // Draws everything again.
    function draw() {
        clearCanvas();
        drawBorders();
        colorBoxes();
        drawAdditionalLines();
    }

    function drawBorders() {
        var size = my.getGridSize(),
            gridWidth = size[0],
            gridHeight = size[1];

        ctx.lineWidth = options.borderSize;
        ctx.beginPath();
        // There are n + 1 borders in n boxes
        for (var row = 0; row < options.rows + 1; ++row) {
            var yPosition = row * (options.boxSize + options.borderSize );
            ctx.moveTo(0, yPosition + options.borderSize / 2);
            ctx.lineTo(gridHeight, yPosition + options.borderSize / 2);
        }

        // There are n + 1 borders in n boxes
        for (var column = 0; column < options.columns + 1; ++column) {
            var xPosition = column * (options.boxSize + options.borderSize);
            ctx.moveTo(xPosition + options.borderSize / 2, 0);
            ctx.lineTo(xPosition + options.borderSize / 2, gridWidth);
        }

        ctx.strokeStyle = options.borderColor;
        ctx.stroke();
    }

    function drawLine(line) {
        var x1 = line[0],
            y1 = line[1],
            x2 = line[2],
            y2 = line[3],
            color = line[4];
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = color;
        ctx.stroke();
    }

    function colorBoxes() {
        for (var i = 0; i < boxColors.length; ++i) {
            var column = boxColors[i][0][0],
                row = boxColors[i][0][1],
                color = boxColors[i][1],
                coordinates = my.getBoxCoordinates(column, row),
                x1 = coordinates[0][0],
                y1 = coordinates[0][1],
                x2 = coordinates[1][0],
                y2 = coordinates[1][1];
            ctx.fillStyle = color;
            ctx.fillRect(x1, y1, options.boxSize, options.boxSize);
        }
    }

    function drawAdditionalLines() {
        for (var i = 0; i < additionalLines.length; ++i) {
            ctx.beginPath();
            drawLine(additionalLines[i]);
        }
    }

    function clearCanvas() {
        // http://stackoverflow.com/questions/2142535/how-to-clear-the-canvas-for-redrawing
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
    }

    init();
    return my;
});