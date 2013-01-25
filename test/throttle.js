"use strict";

var test = require("reducers/test/util/test")
var delay = require("reducers/delay")
var throttle = require("../throttle")

exports["test throttle using stamping function"] = test(function(assert) {
  var now = Date.now()
  var input = [
    { id: 1, time: now },
    { id: 2, time: now + 20 },
    { id: 3, time: now + 25 },
    { id: 4, time: now + 32 },
    { id: 5, time: now + 47 },
    { id: 6, time: now + 60 },
    { id: 7, time: now + 78 }
  ]
  var actual = throttle(input, function(value) { return value.time }, 20)

  assert(actual, [input[0], input[1], input[4], input[6]],
         "throttle items using stamping function")
})

exports["test async input"] = test(function(assert) {
  var input = [{}, {}, {}, {}, {}, {}, {}]
  var actual = throttle(delay(input, 25), 40)

  assert(actual, [input[0], input[2], input[4], input[6]],
         "throttle items by time")
})


if (require.main === module)
  require("test").run(exports)
