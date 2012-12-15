(function($, window){

    // Returns random element from a list.
    function randomChoice(list) {
        if (list.length === 0) {
            return undefined;
        }
        var index = Math.floor(Math.random() * (list.length));
        return list[index];
    }

    function generateMap(width, height) {
        var blocks = [];
        for (var y = 0; y < height; ++y) {
            var row = [];
            for (var x = 0; x < width; ++x) {
                row.push(randomChoice([1, 1, 1, 1, 1, 1, 1,1,0]));
            }
            blocks.push(row);
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

        var blocks = generateMap(width, height);

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

            if (rightDistance > leftDistance) {
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
    });

})($, window);
