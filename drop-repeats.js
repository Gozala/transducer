"use strict";

var reductions = require("reducers/reductions")
var filter = require("reducers/filter")
var map = require("reducers/map")


var ITEM = 0
var EQUAL = 1

function dropRepeats(input, assert) {
  /**
  Takes reducible `input` and returns narrowed down version with sequential
  repeated values dropped. For example, if a given `input` contains items has
  following form `< 1 1 2 2 1 >` then result will have a form of `< 1 2 1 >` by
  dropping the values that are the same as the previous value. Function takes
  second optional argument `assert` that can be used to compare items. Items
  to which `assert` returns true will be dropped.

  ## Examples

      dropRepeats([1, 2, 2, 3, 4, 4, 4, 4, 5])
      // => < 1 2 3 4 5 >

      dropRepeats([1, "1", 2, "2", 2, 2, 3, 4, "4"])
      // => < 1 "1" 2 "2" 2 3 4 "4" >

      dropRepeats([1, "1", 2, "2", 2, 3, 4, "4"], function(a, b) {
        return a == b
      })
      // => < 1 2 3 4 >
  **/
  var states = reductions(input, function(state, item) {
    var equal = assert ? assert(state[ITEM], item) :
                item === state[ITEM]
    return [item, equal]
  }, [{}])
  var updates = filter(states, function(state) { return !state[EQUAL] })
  return map(updates, function(update) { return update[ITEM] })
}

module.exports = dropRepeats
