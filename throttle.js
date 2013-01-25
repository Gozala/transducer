"use strict";

var reductions = require("reducers/reductions")
var filter = require("reducers/filter")
var map = require("reducers/map")
var dropRepeats = require("./drop-repeats")


var ITEM = 1
var STAMP = 0

function throttle(input, stamp, delta) {
  /**
  Function takes reducible `input` (supposedly signal or asynchronous stream)
  and `delta` value and returns throttled version back. Items are dropped if
  time difference between sends is larger then given `delta`. Optionally
  `stamp` function maybe passed in order to manually stamp values on which
  differences will be asserted.

  ## Examples

      var input = delay([1, 2, 3, 4, 5, 6, 7], 25)
      throttle(input, 40)
      // => < 1 3 5 7 >

      throttle(clickEvents, function(event) {
        return event.timeStamp
      }, 20)
  **/
  if (delta === void(0)) {
    delta = stamp
    stamp = Date.now
  }
  var states = reductions(input, function(state, item) {
     var now = stamp(item)
     return now - state[STAMP] >= delta ? [now, item] :
            state
  }, [0])
  return map(dropRepeats(states), function(state) { return state[ITEM] })
}

module.exports = throttle
