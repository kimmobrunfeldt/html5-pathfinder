(function($, window){

    // Returns random element from a list.
    function randomChoice(list) {
        if (list.length === 0) {
            return undefined;
        }
        var index = Math.floor(Math.random() * (list.length));
        return list[index];
    }

    // Random int between start and end.
    function randomInt(start, end) {
        return Math.floor(Math.random() * (end - start + 1)) + start;
    }

    // Generates a block in random place in 0 - width and 0 - height
    function randomWallObject(width, height) {
        var objWidth = randomInt(2, 4),
            objHeight = randomInt(2, 4),
            startX = randomInt(0, width - objWidth - 1),
            startY = randomInt(0, height - objHeight - 1);

        var coords = [];

        for (var y = startY; y < startY + objHeight; ++y) {
            for (var x = startX; x < startX + objWidth; ++x) {
                coords.push([x, y]);
            }
        }
        return coords;
    }

    function generateMap(width, height, wallObjectCount) {
        var blocks = [];
        for (var y = 0; y < height; ++y) {
            var row = [];
            for (var x = 0; x < width; ++x) {
                row.push(1);  // Empty space
            }
            blocks.push(row);
        }

        // Create rectangle walls
        for (var i = 0; i < wallObjectCount; ++i) {
            var coords = randomWallObject(width, height);
            for (var k = 0; k < coords.length; ++k) {
                blocks[coords[k][1]][coords[k][0]] = 0;
            }
        }

        return blocks;
    }

    // Not really elegant, but simplest and works well in this purpose.
    function deepCopy(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    function drawAndSolveMaps() {
        var leftCanvas = $('#left-canvas')[0],
            rightCanvas = $('#right-canvas')[0],
            width = 15,
            height = 15,
            boxSize = 25;

        var blocks = generateMap(width, height, 8);

        // Set corners walkable
        blocks[0][0] = 1;
        blocks[height - 1][width - 1] = 1;

        var leftMap = new Map({
            canvas: leftCanvas,
            map: deepCopy(blocks),
            width: width,
            height: height,
            boxSize: boxSize
        });
        var leftDistance = leftMap.route(0,0,width-1, height-1, "dijkstra");
        if (leftDistance === Infinity) {
            $('#left-distance').html('No path found.');
        } else {
            $('#left-distance').html('Distance: <span class="underline">' +
                                     leftDistance.toFixed(1) +
                                     '</span>');
        }

        var rightMap = new Map({
            canvas: rightCanvas,
            map: deepCopy(blocks),
            width: width,
            height: height,
            boxSize: boxSize
        });
        var rightDistance = rightMap.route(0,0,width-1, height-1, "corner");

        if (rightDistance === Infinity) {
             $('#right-distance').html('No path found.');
        } else {
            $('#right-distance').html('Distance: <span class="underline">' +
                                      rightDistance.toFixed(1) +
                                      '</span>');

            if (rightDistance.toFixed(2) > leftDistance.toFixed(2)) {
                $('#right-distance').append(' <span class="red">(!) not the shortest</span>');
            }
        }
    }

    $(window).load(function() {
        var reloadElement = $('#reload');

        $('#reload').click(function() {
            drawAndSolveMaps();
        });

        drawAndSolveMaps();

        var explanations = new Explanations();
        explanations.start();
    });

})($, window);
