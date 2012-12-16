// This is very repetitive code, but it's better still than to
// hava outdated screenshots

var Explanations = (function(options) {

    var defaultOptions = {
        boxSize: 25,

        // XXX: These were just copied from map.js

        wallColor: "#613D2D",

        // Walkable, empty space
        emptyColor: "#D9CCB9",

        // Found route's color
        routeColor: "#E95D22",

        // Color of the actual corner that is on route
        cornerRouteColor: "#639E59",

        // Used to connect the network of nodes
        connectColor: "#999",

        // Blocks that are marked as a corner
        cornerColor: "#BED9B9",

        // Map's border
        borderColor: '#999',

        infoColor: 'blue',

        checkWallColor: 'yellow',

        noConnectionColor: 'red'
    };

    var my = {},
        grids = {},
        options = $.extend(true, {}, defaultOptions, options);


    // Starts explanation canvases
    my.start = function() {
        for (var key in grids) {
            grids[key]();
        }
    };

    grids.cornerSearch1 = function() {
        var columns = 5,
            rows = 3;

        grid = new Grid({
            columns: columns,
            rows: rows,
            boxSize: options.boxSize,
            canvas: $('#corner-search1')[0]
        });

        grid.setAllColor(options.emptyColor);

        grid.setBoxesColor([[2, 1]], options.wallColor);

        grid.setBoxColor(0, 0, options.infoColor);

        grid.connectBoxes(0, 0, 1, 1, options.infoColor);
        grid.draw();
    };

    grids.cornerSearch2 = function() {
        var columns = 5,
            rows = 3;

        grid = new Grid({
            columns: columns,
            rows: rows,
            boxSize: options.boxSize,
            canvas: $('#corner-search2')[0]
        });

        grid.setAllColor(options.emptyColor);
        grid.setBoxesColor([[2, 1]], options.wallColor);

        grid.setBoxColor(1, 0, options.infoColor);

        grid.connectBoxes(1, 0, 2, 1, options.infoColor);
        grid.connectBoxes(1, 0, 0, 1, options.infoColor);

        grid.setBoxColor(2, 0, options.checkWallColor);
        grid.setBoxColor(1, 1, options.checkWallColor);
        grid.draw();
    };

    grids.cornerSearch3 = function() {
        var columns = 5,
            rows = 3;

        grid = new Grid({
            columns: columns,
            rows: rows,
            boxSize: options.boxSize,
            canvas: $('#corner-search3')[0]
        });

        grid.setAllColor(options.emptyColor);
        grid.setBoxesColor([[2, 1]], options.wallColor);

        grid.setBoxColor(2, 0, options.infoColor);

        grid.connectBoxes(2, 0, 3, 1, options.infoColor);
        grid.connectBoxes(2, 0, 1, 1, options.infoColor);

        grid.setBoxColor(1, 0, options.cornerColor);
        grid.draw();
    };

    grids.cornerSearch4 = function() {
        var columns = 5,
            rows = 3;

        grid = new Grid({
            columns: columns,
            rows: rows,
            boxSize: options.boxSize,
            canvas: $('#corner-search4')[0]
        });

        grid.setAllColor(options.emptyColor);
        grid.setBoxesColor([[2, 1]], options.wallColor);

        grid.setBoxColor(3, 0, options.infoColor);

        grid.connectBoxes(3, 0, 4, 1, options.infoColor);
        grid.connectBoxes(3, 0, 2, 1, options.infoColor);

        grid.setBoxColor(2, 0, options.checkWallColor);
        grid.setBoxColor(3, 1, options.checkWallColor);

        grid.setBoxColor(1, 0, options.cornerColor);
        grid.draw();
    };

    grids.cornerSearch5 = function() {
        var columns = 5,
            rows = 3;

        grid = new Grid({
            columns: columns,
            rows: rows,
            boxSize: options.boxSize,
            canvas: $('#corner-search5')[0]
        });

        grid.setAllColor(options.emptyColor);
        grid.setBoxesColor([[2, 1]], options.wallColor);

        grid.setBoxColor(1, 0, options.cornerColor);
        grid.setBoxColor(1, 2, options.cornerColor);
        grid.setBoxColor(3, 0, options.cornerColor);
        grid.setBoxColor(3, 2, options.cornerColor);
        grid.draw();
    };


    grids.connectCorners1 = function() {
        var columns = 5,
            rows = 3;

        grid = new Grid({
            columns: columns,
            rows: rows,
            boxSize: options.boxSize,
            canvas: $('#connect-corners1')[0]
        });

        grid.setAllColor(options.emptyColor);
        grid.setBoxesColor([[2, 1]], options.wallColor);

        grid.setBoxColor(1, 0, options.cornerColor);
        grid.setBoxColor(1, 2, options.cornerColor);
        grid.setBoxColor(3, 0, options.cornerColor);
        grid.setBoxColor(3, 2, options.cornerColor);

        grid.connectBoxes(1, 0, 1, 2, options.connectColor);
        grid.connectBoxes(1, 0, 3, 0, options.connectColor);
        grid.connectBoxes(1, 0, 3, 2, options.noConnectionColor);

        grid.draw();
    };

    grids.connectCorners2 = function() {
        var columns = 5,
            rows = 3;

        grid = new Grid({
            columns: columns,
            rows: rows,
            boxSize: options.boxSize,
            canvas: $('#connect-corners2')[0]
        });

        grid.setAllColor(options.emptyColor);
        grid.setBoxesColor([[2, 1]], options.wallColor);

        grid.setBoxColor(1, 0, options.cornerColor);
        grid.setBoxColor(1, 2, options.cornerColor);
        grid.setBoxColor(3, 0, options.cornerColor);
        grid.setBoxColor(3, 2, options.cornerColor);

        grid.connectBoxes(1, 2, 1, 0, options.connectColor);
        grid.connectBoxes(1, 2, 3, 0, options.noConnectionColor);
        grid.connectBoxes(1, 2, 3, 2, options.connectColor);

        grid.draw();
    };

    grids.connectCorners3 = function() {
        var columns = 5,
            rows = 3;

        grid = new Grid({
            columns: columns,
            rows: rows,
            boxSize: options.boxSize,
            canvas: $('#connect-corners3')[0]
        });

        grid.setAllColor(options.emptyColor);
        grid.setBoxesColor([[2, 1]], options.wallColor);

        grid.setBoxColor(1, 0, options.cornerColor);
        grid.setBoxColor(1, 2, options.cornerColor);
        grid.setBoxColor(3, 0, options.cornerColor);
        grid.setBoxColor(3, 2, options.cornerColor);

        grid.connectBoxes(3, 2, 1, 0, options.noConnectionColor);
        grid.connectBoxes(3, 2, 3, 0, options.connectColor);
        grid.connectBoxes(3, 2, 1, 2, options.connectColor);

        grid.draw();
    };

    grids.connectCorners4 = function() {
        var columns = 5,
            rows = 3;

        grid = new Grid({
            columns: columns,
            rows: rows,
            boxSize: options.boxSize,
            canvas: $('#connect-corners4')[0]
        });

        grid.setAllColor(options.emptyColor);
        grid.setBoxesColor([[2, 1]], options.wallColor);

        grid.setBoxColor(1, 0, options.cornerColor);
        grid.setBoxColor(1, 2, options.cornerColor);
        grid.setBoxColor(3, 0, options.cornerColor);
        grid.setBoxColor(3, 2, options.cornerColor);

        grid.connectBoxes(3, 0, 1, 0, options.connectColor);
        grid.connectBoxes(3, 0, 3, 2, options.connectColor);
        grid.connectBoxes(3, 0, 1, 2, options.noConnectionColor);

        grid.draw();
    };

    grids.connectCorners5 = function() {
        var columns = 5,
            rows = 3;

        grid = new Grid({
            columns: columns,
            rows: rows,
            boxSize: options.boxSize,
            canvas: $('#connect-corners5')[0]
        });

        grid.setAllColor(options.emptyColor);
        grid.setBoxesColor([[2, 1]], options.wallColor);

        grid.setBoxColor(1, 0, options.cornerColor);
        grid.setBoxColor(3, 2, options.cornerColor);

        grid.connectBoxes(3, 0, 1, 0, options.infoColor);
        grid.connectBoxes(3, 0, 3, 2, options.infoColor);
        grid.connectBoxes(1, 0, 1, 2, options.infoColor);
        grid.connectBoxes(3, 2, 1, 2, options.infoColor);

        grid.draw();
    };

    grids.done = function() {
        var columns = 5,
            rows = 3;

        grid = new Grid({
            columns: columns,
            rows: rows,
            boxSize: options.boxSize,
            canvas: $('#done')[0]
        });

        grid.setAllColor(options.emptyColor);
        grid.setBoxesColor([[2, 1]], options.wallColor);

        grid.setBoxColor(1, 0, options.cornerColor);
        grid.setBoxColor(1, 2, options.cornerColor);
        grid.setBoxColor(3, 0, options.cornerColor);
        grid.setBoxColor(3, 2, options.cornerColor);

        grid.connectBoxes(3, 0, 1, 0, options.connectColor);
        grid.connectBoxes(3, 0, 3, 2, options.connectColor);
        grid.connectBoxes(1, 0, 1, 2, options.connectColor);
        grid.connectBoxes(3, 2, 1, 2, options.connectColor);

        grid.draw();
    };


    return my;
});
