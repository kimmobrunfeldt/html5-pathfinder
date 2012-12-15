(function($, window){

    // Returns random element from a list.
    function randomChoice(list) {
        if (list.length === 0) {
            return undefined;
        }
        var index = Math.floor(Math.random() * (list.length));
        return list[index];
    };

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
    };


    var grid = undefined;
    $(window).load(function() {
        var canvas = $('#canvas')[0],
            width = 15,
            height = 15,
            boxSize = 25;

        var gridSettings = {
            canvas: canvas,
            columns: width,
            rows: height,
            boxSize: boxSize,
            borderColor: "#999"
        };

        // console.log('generated map');
        var blocks = generateMap(width, height);
        console.log(JSON.stringify(blocks));

        var map = new Map({
            gridSettings: gridSettings,
            map: blocks,
            width: width,
            height: height
        });
        setTimeout(function() { map.route(0,0,width-1, height-1, "corner"); }, 50);
    });

})($, window);
