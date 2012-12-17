// Grids under the header "How the preprocessing works"

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

        // Used as a 'current block or step'
        infoColor: 'blue',

        checkWallColor: 'yellow',

        noConnectionColor: 'red'
    };

    var my = {},
        grids = {},
        options = $.extend(true, {}, defaultOptions, options),
        defaultGridOptions = {
            columns: 5,
            rows: 3,
            boxSize: options.boxSize
        };


    // Starts explanation canvases
    my.start = function() {
        for (var key in grids) {
            grids[key]();
        }
    };

    // Adds the default scene to the grid, which is one block in the center
    function newExplanationGrid(canvas) {
        var gridOptions = $.extend(true, {}, defaultGridOptions, {canvas: canvas}),
            grid = new Grid(gridOptions);


        grid.setAllColor(options.emptyColor);
        grid.setBoxesColor([[2, 1]], options.wallColor);
        return grid;
    }

    // Start searching corners from the first block
    grids.cornerSearch1 = function() {
        var grid = newExplanationGrid($('#corner-search1')[0]);

        grid.setBoxColor(0, 0, options.infoColor);
        grid.connectBoxes(0, 0, 1, 1, options.infoColor);
        grid.draw();
    };

    // Move one block to right, there's a corner
    grids.cornerSearch2 = function() {
        var grid = newExplanationGrid($('#corner-search2')[0]);

        grid.setBoxColor(1, 0, options.infoColor);

        grid.connectBoxes(1, 0, 2, 1, options.infoColor);
        grid.connectBoxes(1, 0, 0, 1, options.infoColor);

        grid.setBoxColor(2, 0, options.checkWallColor);
        grid.setBoxColor(1, 1, options.checkWallColor);
        grid.draw();
    };

    // Move to the right, abote the wall
    grids.cornerSearch3 = function() {
        var grid = newExplanationGrid($('#corner-search3')[0]);

        grid.setBoxColor(2, 0, options.infoColor);

        grid.connectBoxes(2, 0, 3, 1, options.infoColor);
        grid.connectBoxes(2, 0, 1, 1, options.infoColor);

        grid.setBoxColor(1, 0, options.cornerColor);
        grid.draw();
    };

    // One to right, there's second corner
    grids.cornerSearch4 = function() {
        var grid = newExplanationGrid($('#corner-search4')[0]);

        grid.setBoxColor(3, 0, options.infoColor);

        grid.connectBoxes(3, 0, 4, 1, options.infoColor);
        grid.connectBoxes(3, 0, 2, 1, options.infoColor);

        grid.setBoxColor(2, 0, options.checkWallColor);
        grid.setBoxColor(3, 1, options.checkWallColor);

        grid.setBoxColor(1, 0, options.cornerColor);
        grid.draw();
    };

    // All found corners
    grids.cornerSearch5 = function() {
        var grid = newExplanationGrid($('#all-found-corners')[0]);

        grid.setBoxColor(1, 0, options.cornerColor);
        grid.setBoxColor(1, 2, options.cornerColor);
        grid.setBoxColor(3, 0, options.cornerColor);
        grid.setBoxColor(3, 2, options.cornerColor);
        grid.draw();
    };

    // Connections from top left corner
    grids.connectCorners1 = function() {
        var grid = newExplanationGrid($('#top-left-connections')[0]);

        grid.setBoxColor(1, 0, options.cornerColor);
        grid.setBoxColor(1, 2, options.cornerColor);
        grid.setBoxColor(3, 0, options.cornerColor);
        grid.setBoxColor(3, 2, options.cornerColor);

        grid.connectBoxes(1, 0, 1, 2, options.connectColor);
        grid.connectBoxes(1, 0, 3, 0, options.connectColor);
        grid.connectBoxes(1, 0, 3, 2, options.noConnectionColor);

        grid.draw();
    };

    // Connections from bottom left corner
    grids.connectCorners2 = function() {
        var grid = newExplanationGrid($('#bottom-left-connections')[0]);

        grid.setBoxColor(1, 0, options.cornerColor);
        grid.setBoxColor(1, 2, options.cornerColor);
        grid.setBoxColor(3, 0, options.cornerColor);
        grid.setBoxColor(3, 2, options.cornerColor);

        grid.connectBoxes(1, 2, 1, 0, options.connectColor);
        grid.connectBoxes(1, 2, 3, 0, options.noConnectionColor);
        grid.connectBoxes(1, 2, 3, 2, options.connectColor);

        grid.draw();
    };

    // Connections from bottom right corner
    grids.connectCorners3 = function() {
        var grid = newExplanationGrid($('#bottom-right-connections')[0]);

        grid.setBoxColor(1, 0, options.cornerColor);
        grid.setBoxColor(1, 2, options.cornerColor);
        grid.setBoxColor(3, 0, options.cornerColor);
        grid.setBoxColor(3, 2, options.cornerColor);

        grid.connectBoxes(3, 2, 1, 0, options.noConnectionColor);
        grid.connectBoxes(3, 2, 3, 0, options.connectColor);
        grid.connectBoxes(3, 2, 1, 2, options.connectColor);

        grid.draw();
    };

    // Connections from top right corner
    grids.connectCorners4 = function() {
        var grid = newExplanationGrid($('#top-right-connections')[0]);

        grid.setBoxColor(1, 0, options.cornerColor);
        grid.setBoxColor(1, 2, options.cornerColor);
        grid.setBoxColor(3, 0, options.cornerColor);
        grid.setBoxColor(3, 2, options.cornerColor);

        grid.connectBoxes(3, 0, 1, 0, options.connectColor);
        grid.connectBoxes(3, 0, 3, 2, options.connectColor);
        grid.connectBoxes(3, 0, 1, 2, options.noConnectionColor);

        grid.draw();
    };

    // Example of clear route with blue rectangle
    grids.connectCorners5 = function() {
        var grid = newExplanationGrid($('#clear-route-example')[0]);

        grid.setBoxColor(1, 0, options.cornerColor);
        grid.setBoxColor(3, 2, options.cornerColor);

        grid.connectBoxes(3, 0, 1, 0, options.infoColor);
        grid.connectBoxes(3, 0, 3, 2, options.infoColor);
        grid.connectBoxes(1, 0, 1, 2, options.infoColor);
        grid.connectBoxes(3, 2, 1, 2, options.infoColor);

        grid.draw();
    };

    // Example of the final product, all corners found and connected.
    grids.done = function() {
        var grid = newExplanationGrid($('#corners-done')[0]);

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
