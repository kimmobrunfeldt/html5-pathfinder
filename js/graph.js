// Graph and algorithms

var Edge = (function() {
  return {
    node: null,
    distance: Infinity
  };
});


var Node = (function(object, position) {
  var my = {
    object: object,
    position: position,
    distance: Infinity,
    predecessor: new Edge(),
    visited: false,
    edges: []
  };

  my.addEdge = function(edge) {
    for (var i = 0; i < my.edges.length; ++i) {
      if (my.edges[i].node === edge.node) {
        // Exists already
        return;
      }
    }
    my.edges.push(edge);
  };

  return my;
});


var Graph = (function() {

  var my = {
    nodes: {},
  };

  my.addNode = function(object, position) {
    var node = new Node(object, position);
    my.nodes[object] = node;
    return node;
  };

  my.addEdge = function(object1, object2, weight) {
    var edge = new Edge();
    edge.node = my.nodes[object2];
    edge.distance = weight;
    my.nodes[object1].addEdge(edge);

    var edge = new Edge();
    edge.node = my.nodes[object1];
    edge.distance = weight;
    my.nodes[object2].addEdge(edge);
  };

  return my;
});


/*
   Path-finding algorithm Dijkstra

   - worst-case running time is O((|E| + |V|) · log |V| ) thus better than
     Bellman-Ford for sparse graphs (with less edges), but cannot handle
     negative edge weights
 */
function dijkstra(g, source) {

  for (var i = 0; i < g.nodes.length; ++i) {
    g.nodes[i].distance = Infinity;
    g.nodes[i].predecessor.node = null;
    g.nodes[i].predecessor.distance = Infinity;
    g.nodes[i].visited = false;
  }

  g.nodes[source].distance = 0;

  var Q = new PriorityQueue({low: true});
  Q.push(g.nodes[source], source.distance);

  var node;

  while (!Q.empty()) {

    node = Q.pop();

    if (!node.visited) {
      node.visited = true;

      for (var i = 0; i < node.edges.length; ++i) {
        var edge = node.edges[i];

        if (!edge.node.visited) {
          var alt = node.distance + edge.distance;

          if (alt < edge.node.distance) {
            edge.node.distance = alt;

            newEdge = new Edge();
            newEdge.node = node;
            newEdge.distance = edge.distance;
            edge.node.predecessor = newEdge;

            Q.push(edge.node, edge.node.distance);
          }
        }
      }
    }
  }
}


// https://github.com/STRd6/PriorityQueue.js
(function() {
  /**
   * @private
   */
  var prioritySortLow = function(a, b) {
    return b.priority - a.priority;
  };

  /**
   * @private
   */
  var prioritySortHigh = function(a, b) {
    return a.priority - b.priority;
  };

  /*global PriorityQueue */
  /**
   * @constructor
   * @class PriorityQueue manages a queue of elements with priorities. Default
   * is highest priority first.
   *
   * @param [options] If low is set to true returns lowest first.
   */
  PriorityQueue = function(options) {
    var contents = [];

    var sorted = false;
    var sortStyle;

    if(options && options.low) {
      sortStyle = prioritySortLow;
    } else {
      sortStyle = prioritySortHigh;
    }

    /**
     * @private
     */
    var sort = function() {
      contents.sort(sortStyle);
      sorted = true;
    };

    var self = {
      /**
       * Removes and returns the next element in the queue.
       * @member PriorityQueue
       * @return The next element in the queue. If the queue is empty returns
       * undefined.
       *
       * @see PrioirtyQueue#top
       */
      pop: function() {
        if(!sorted) {
          sort();
        }

        var element = contents.pop();

        if(element) {
          return element.object;
        } else {
          return undefined;
        }
      },

      /**
       * Returns but does not remove the next element in the queue.
       * @member PriorityQueue
       * @return The next element in the queue. If the queue is empty returns
       * undefined.
       *
       * @see PriorityQueue#pop
       */
      top: function() {
        if(!sorted) {
          sort();
        }

        var element = contents[contents.length - 1];

        if(element) {
          return element.object;
        } else {
          return undefined;
        }
      },

      /**
       * @member PriorityQueue
       * @param object The object to check the queue for.
       * @returns true if the object is in the queue, false otherwise.
       */
      includes: function(object) {
        for(var i = contents.length - 1; i >= 0; i--) {
          if(contents[i].object === object) {
            return true;
          }
        }

        return false;
      },

      /**
       * @member PriorityQueue
       * @returns the current number of elements in the queue.
       */
      size: function() {
        return contents.length;
      },

      /**
       * @member PriorityQueue
       * @returns true if the queue is empty, false otherwise.
       */
      empty: function() {
        return contents.length === 0;
      },

      /**
       * @member PriorityQueue
       * @param object The object to be pushed onto the queue.
       * @param priority The priority of the object.
       */
      push: function(object, priority) {
        contents.push({object: object, priority: priority});
        sorted = false;
      }
    };

    return self;
  };
})();