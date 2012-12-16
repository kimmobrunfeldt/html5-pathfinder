// Depends from jQuery, because of $.extend. That's senseless.

// Todo: use require.js
var Map = (function(options) {

    var defaultOptions = {
        width: 10,
        height: 10,
        connectPathBoxes: false,

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
        borderColor: '#999'
    };

    var my = {},
        options = $.extend(true, {}, defaultOptions, options),
        map = options.map,
        grid;

    // 'Constants'
    var WALL = 0,
        DIAGONAL_WEIGHT = 1.414,
        COORD_MODE_ALL = 0,
        COORD_MODE_STRAIGHT = 1,
        COORD_MODE_DIAGONAL = 2,

        FILTER_MODE_NONE = 0x1,
        FILTER_MODE_NO_WALL = 0x2,
        // Means: You can't move diagonally near wall
        FILTER_MODE_DIAGONAL_NOT_NEAR_WALL = 0x4;


    function init() {
        var gridSettings = {
            borderColor: options.borderBolor,
            canvas: options.canvas,
            columns: options.width,
            rows: options.height,
            boxSize: options.boxSize
        };
        grid = new Grid(gridSettings);
        drawWalls();
    }

    //
    // Public methods
    //

    // Returns a list of coordinates indicating the shortest route from
    // point to point.
    my.route = function(x1, y1, x2, y2, algorithm) {

        if (typeof algorithm === 'undefined') {
            var algorithm = "dijkstra";
        }

        // Todo: Refactor, algorithm parameter could be function's name
        var routeInfo;
        if (algorithm === "dijkstra") {
            routeInfo = dijkstraRoute(x1, y1, x2, y2);
        }
        else if (algorithm === "corner") {
            routeInfo = cornerRoute(x1, y1, x2, y2);
        }

        var distance = routeInfo[0],
            foundRoute = routeInfo[1];

        if (foundRoute.length === 0 || distance === Infinity) {
            return Infinity;
        }

        if (options.connectPathBoxes) {
            // Connect first step
            grid.connectBoxes(x1, y1, foundRoute[0][0], foundRoute[0][1],
                              options.routeColor);

            for (var i = 0; i < foundRoute.length - 1; ++i) {
                var x1 = foundRoute[i][0],
                    y1 = foundRoute[i][1],
                    x2 = foundRoute[i + 1][0],
                    y2 = foundRoute[i + 1][1];
                grid.connectBoxes(x1, y1, x2, y2, options.routeColor);
            }
        }
        return distance;
    };

    //
    // Private methods
    //

    // Returns shortest route between points using box graph
    function dijkstraRoute(x1, y1, x2, y2) {
        var graph = createBoxGraph();
        dijkstra(graph, keyFromCoordinates(x1, y1));

        var foundRoute = [];

        var startNode = getNode(graph, x1, y1),
            endNode = getNode(graph, x2, y2),
            node = endNode,
            distance = node.distance;
        if (startNode === null || endNode === null || distance === Infinity) {
            // Start point is a wall
            return [Infinity, []];
        }

        while (node.predecessor.node !== null) {
            foundRoute.push(node.position);
            node = node.predecessor.node;
        }

        if (!(node.position[0] === x1 && node.position[1] === y1)) {
            // No route found
            return [Infinity, []];
        }

        foundRoute.reverse();
        grid.setBoxColor(x1, y1, options.routeColor);
        colorBoxes(foundRoute, options.routeColor);

        return [distance, foundRoute];
    }

    // Returns shortest route between points using corner graph
    // Finds the shortest route using corner graph and fills the
    // founded nodes with routeBetween() method
    function cornerRoute(x1, y1, x2, y2) {
        var corners = findCorners();
        colorBoxes(corners, options.cornerColor);

        var graph = createCornerGraph(corners, [[x1, y1], [x2, y2]]);
        dijkstra(graph, keyFromCoordinates(x1, y1));

        var foundRoute = [];

        var startNode = getNode(graph, x1, y1),
            endNode = getNode(graph, x2, y2),
            node = endNode,
            distance = node.distance,
            lastNode = null;
        if (startNode === null || endNode === null || distance === Infinity) {
            // Start point is a wall
            return [Infinity, []];
        }

        while (node.predecessor.node !== null) {
            foundRoute.push(node.position);
            node = node.predecessor.node;
        }

        if (!(node.position[0] === x1 && node.position[1] === y1)) {
            // No route found
            return [Infinity, []];
        }

        foundRoute.reverse();


        // Add also the middle blocks to the path
        var lastX = x1,
            lastY = y1,
            newFoundRoute = [[x1, y1]];

        for (var i = 0; i < foundRoute.length; ++i) {
            var x = foundRoute[i][0],
                y = foundRoute[i][1],
                middleBoxes = routeBetween(lastX, lastY, x, y, COORD_MODE_DIAGONAL);

            for (var k = 0; k < middleBoxes.length; ++k) {
                newFoundRoute.push([middleBoxes[k][0], middleBoxes[k][1]]);
            }

            newFoundRoute.push([x, y]);
            lastX = x;
            lastY = y;
        }

        foundRoute.push([x1, y1]);
        colorBoxes(newFoundRoute, options.routeColor);
        colorBoxes(foundRoute, options.cornerRouteColor);
        return [distance, newFoundRoute];
    }

    function drawWalls() {
        for (var y = 0; y < map.length; ++y) {
            for (var x = 0; x < map[y].length; ++x) {

                var color = options.wallColor;
                if (map[y][x] !== 0) {
                    color = options.emptyColor;
                }
                // false = no re-rendering
                grid.setBoxColor(x, y, color, false);
            }
        }
        grid.draw();
    }

    function colorBoxes(boxList, color) {
        for (var i = 0; i < boxList.length; ++i) {
            var x = boxList[i][0],
                y = boxList[i][1];
            grid.setBoxColor(x, y, color, false);
        }
        grid.draw();
    }

    // Creates a graph of all walkable boxes that are connected to each other
    function createBoxGraph() {
        var graph = new Graph();

        for (var y = 0; y < map.length; ++y) {
            for (var x = 0; x < map[y].length; ++x) {
                if (map[y][x] !== WALL) {
                    graph.addNode(keyFromCoordinates(x, y), [x, y]);
                }
            }
        }

        for (var y = 0; y < map.length; ++y) {
            for (var x = 0; x < map[y].length; ++x) {

                if (map[y][x] === WALL) {
                    continue;
                }

                // Add straight boxes as edges with weight 1
                var straightBoxes = nearBoxes(x, y, COORD_MODE_STRAIGHT,
                                              FILTER_MODE_NO_WALL);
                for (var i = 0; i < straightBoxes.length; ++i) {
                    var otherX = straightBoxes[i][0],
                        otherY = straightBoxes[i][1];

                    graph.addEdge(keyFromCoordinates(x, y),
                                  keyFromCoordinates(otherX, otherY), 1);

                    grid.connectBoxes(x, y, otherX, otherY,
                                      options.connectColor);
                }

                var filterMode = FILTER_MODE_NO_WALL |
                                 FILTER_MODE_DIAGONAL_NOT_NEAR_WALL;
                // Diagonal boxes have 1.4 weight.
                var diagonalBoxes = nearBoxes(x, y, COORD_MODE_DIAGONAL,
                                              filterMode);
                for (var i = 0; i < diagonalBoxes.length; ++i) {
                    var otherX = diagonalBoxes[i][0],
                        otherY = diagonalBoxes[i][1];

                    graph.addEdge(keyFromCoordinates(x, y),
                                  keyFromCoordinates(otherX, otherY),
                                  DIAGONAL_WEIGHT);
                    grid.connectBoxes(x, y, otherX, otherY, options.connectColor);
                }
            }
        }
        grid.draw();
        return graph;
    }

    // Finds the corners of walls.
    // This reduces the amount of work that dijkstra has to do
    // for each block in the map:
    //   if a block has neighbor walls in diagonal directions:
    //     for each neighbor in diagonal walls:
    //       if there are no straight walls in the direction where the
    //       diagonal neighbor wall is, mark the block as a corner
    function findCorners() {
        var corners = [];
        for (var y = 0; y < map.length; ++y) {
            for (var x = 0; x < map[y].length; ++x) {
                if (map[y][x] !== WALL) {
                    var diagonalBoxes = nearBoxes(x, y, COORD_MODE_DIAGONAL);
                    for (var i = 0; i < diagonalBoxes.length; ++i) {
                        var dBox = diagonalBoxes[i],
                            dBoxX = dBox[0],
                            dBoxY = dBox[1],
                            xDiff = x - dBoxX,
                            yDiff = y - dBoxY;

                        if (map[dBoxY][dBoxX] === WALL) {
                            var straightBoxes = [[dBoxX + xDiff, dBoxY],
                                                 [dBoxX, dBoxY + yDiff]];
                            if (!containsWall(straightBoxes)) {
                                corners.push([x, y]);
                            }
                        }
                    }
                }
            }
        }
        return corners;
    }

    // Creates a graph where all the nodes that can see each other, are
    // connected.
    function createCornerGraph(corners, additionalCoordinates) {
        var graph = new Graph();

        var coordinates = [];
        for (var i = 0; i < additionalCoordinates.length; ++i) {
            coordinates.push(additionalCoordinates[i]);
        }
        for (var i = 0; i < corners.length; ++i) {
            coordinates.push(corners[i]);
        }

        for (var i = 0; i < coordinates.length; ++i) {
            var x = coordinates[i][0],
                y = coordinates[i][1];
            graph.addNode(keyFromCoordinates(x, y), [x, y]);
        }

        for (var i = 0; i < coordinates.length; ++i) {
            for (var j = 0; j < coordinates.length; ++j) {
                if (i != j) {
                    var x1 = coordinates[i][0],
                        y1 = coordinates[i][1],
                        x2 = coordinates[j][0],
                        y2 = coordinates[j][1];

                    if (isClearRoute(x1, y1, x2, y2)) {
                        var distance = distanceBetween(x1, y1, x2, y2,
                                                       COORD_MODE_DIAGONAL);
                        graph.addEdge(keyFromCoordinates(x1, y1),
                                      keyFromCoordinates(x2, y2), distance);
                        grid.connectBoxes(x1, y1, x2, y2, options.connectColor);
                    }
                }
            }
        }
        grid.draw();
        return graph;
    }

    // Counts the smallest distance between two points in a empty grid.
    // Meaning that there are no walls between the points at any way.
    // Valid modes: COORD_MODE_STRAIGHT, COORD_MODE_DIAGONAL
    function distanceBetween(x1, y1, x2, y2, coordMode) {

        var distance;

        if (coordMode === COORD_MODE_STRAIGHT) {
            distance = Math.abs(x2 - x1) + Math.abs(y2 - y1);
        }
        else if (coordMode === COORD_MODE_DIAGONAL) {
            xDiff = Math.abs(x2 - x1);
            yDiff = Math.abs(y2 - y1);

            if (yDiff < xDiff) {
                distance = yDiff * DIAGONAL_WEIGHT + (xDiff - yDiff);
            } else {
                distance = xDiff * DIAGONAL_WEIGHT + (yDiff - xDiff);
            }
        }
        return distance;
    }

    // Returns the shortest route between two points in a empty grid.
    // Meaning that there are no walls between the points at any way.
    // Valid modes: COORD_MODE_STRAIGHT, COORD_MODE_DIAGONAL
    // Note: returns only the middle blocks between points
    // XXX: This is impossible to read.
    function routeBetween(x1, y1, x2, y2, coordMode) {

        var route = [],
            xDiff = x1 - x2;
            xDirection = -xDiff / Math.abs(xDiff),
            yDiff = y1 - y2,
            yDirection = -yDiff / Math.abs(yDiff);

        if (xDiff === 0 && yDiff === 0) {
            return route;
        }

        if (coordMode === COORD_MODE_STRAIGHT) {
            for (var i = 1; i < Math.abs(xDiff) + 1; ++i) {
                route.push([x1 + i * xDirection, y1]);
            }
            console.log('route' + JSON.stringify(route));
            var lastX = (route.length !== 0) ? route[route.length - 1][0] : x1;
            for (var i = 1; i < Math.abs(yDiff); ++i) {
                route.push([lastX, y1 + i * yDirection]);
            }
        }
        else if (coordMode === COORD_MODE_DIAGONAL) {
            xDiff = Math.abs(x2 - x1);
            yDiff = Math.abs(y2 - y1);

            if (yDiff < xDiff) {
                for (var i = 1; i < Math.abs(yDiff); ++i) {
                    route.push([x1 + i * xDirection, y1 + i * yDirection]);
                }
                var lastX = (route.length !== 0 ) ? route[route.length - 1][0] : x1,
                    newXDiff = x2 - lastX;
                for (var i = 1; i < Math.abs(newXDiff); ++i) {
                    route.push([lastX + i * xDirection, y2]);
                }
            } else {
                for (var i = 1; i < Math.abs(xDiff); ++i) {
                    route.push([x1 + i * xDirection, y1 + i * yDirection]);
                }
                var lastY = (route.length !== 0 ) ? route[route.length - 1][1] : y1,
                    newYDiff = y2 - lastY;
                for (var i = 1; i < Math.abs(newYDiff); ++i) {
                    route.push([x2, lastY + i * yDirection]);
                }
            }
        }
        return route;
    }

    // Checks is the route between points is clear in a way that it does
    // not have any walls => Drawing rectangle between dots, should not
    // contain walls.
    function isClearRoute(x1, y1, x2, y2) {

        var smallX = (x1 <= x2) ? x1 : x2,
            bigX = (x1 > x2) ? x1 : x2,
            smallY = (y1 <= y2) ? y1 : y2,
            bigY = (y1 > y2) ? y1 : y2;

        var coordinates = [];
        for (var y = smallY; y < bigY + 1; ++y) {
            for (var x = smallX; x < bigX + 1; ++x) {
                coordinates.push([x, y]);
            }
        }
        return !containsWall(coordinates);
    }

    // Returns the actual node in a coordinate
    function getNode(graph, x, y) {
        var nodeKey = keyFromCoordinates(x, y);
        if (graph.nodes.hasOwnProperty(nodeKey)) {
            return graph.nodes[nodeKey];
        }
        return null;
    }

    // Returns a key from coordinates that can be used in the nodes object.
    // This is because you can't have an array as a key in object.
    function keyFromCoordinates(x, y) {
        return x + ',' + y;
    }

    // Returns false if no coordinate in boxList is a wall.
    function containsWall(boxList) {
        for (var i = 0; i < boxList.length; ++i) {
            var x = boxList[i][0],
                y = boxList[i][1];

            if (map[y][x] === WALL) {
                return true;
            }
        }
        return false;
    }

    // Return near boxes which are in the map
    function nearBoxes(x, y, mode, filterMode) {

        if (typeof filterMode === 'undefined') {
            var filterMode = FILTER_MODE_NONE;
        }

        var coordinates = nearCoordinates(x, y, mode);

        // Filter coordinates that are out of map.
        boxes = coordinates.filter(function(item) {
            var otherX = item[0],
                otherY = item[1];

            return !(otherX > options.width - 1 ||
                     otherY > options.height - 1 ||
                     otherX < 0 || otherY < 0);
        });

        if (filterMode & FILTER_MODE_NO_WALL) {
            boxes = boxes.filter(function(item) {
                var otherX = item[0],
                    otherY = item[1];

                return map[otherY][otherX] !== WALL;
            });
        }

        var notNearWall = FILTER_MODE_DIAGONAL_NOT_NEAR_WALL;
        if (filterMode & notNearWall) {
            boxes = boxes.filter(function(item) {
                var otherX = item[0],
                    otherY = item[1];

                // The 'movement' is diagonal.
                if (Math.abs(otherX - x) > 0 && Math.abs(otherY - y) > 0) {

                    if (y - otherY > 0 && map[y - 1][x] === WALL ||
                        y - otherY < 0 && map[y + 1][x] === WALL ||
                        x - otherX > 0 && map[y][x - 1] === WALL ||
                        x - otherX < 0 && map[y][x + 1] === WALL)
                    {
                        return false;
                    }
                }
                return true;
            });
        }

        return boxes;
    }

    function nearCoordinates(x, y, mode) {
        // At least this is readable
        if (mode === COORD_MODE_ALL) {
            return [
                    [x - 1, y - 1], [x, y - 1], [x + 1 , y - 1],
                    [x - 1, y],                 [x + 1, y],
                    [x - 1, y + 1], [x, y + 1], [x + 1, y + 1]
                   ];
        } else if (mode === COORD_MODE_STRAIGHT) {
            return [
                                [x, y - 1],
                    [x - 1, y],             [x + 1, y],
                                [x, y + 1]
                   ];
        } else if (mode === COORD_MODE_DIAGONAL) {
            return [
                    [x - 1, y - 1],             [x + 1 , y - 1],

                    [x - 1, y + 1],             [x + 1, y + 1]
                   ];
        }
    }

    init();
    return my;
});