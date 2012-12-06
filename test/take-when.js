"use strict";

var test = require("reducers/test/util/test")
var event = require("reducers/test/util/event")

var take = require("reducers/take")
var concat = require("reducers/concat")
var delay = require("reducers/delay")


var end = require("reducible/end")

var takeWhen = require("../take-when")

exports["test input ends sampled"]  = test(function(assert) {
  var stop = event()
  var input = event()
  var behavior = event()

  var sampled = takeWhen(input, behavior)
  var actual = concat(sampled, stop)

  assert(actual, [4, 5, 5, 8], "behavior ends sample")

  input.send(1)
  input.send(2)
  behavior.send(false)
  behavior.send(true)
  behavior.send(true)
  behavior.send(false)
  input.send(3)
  behavior.send(true)
  input.send(4)
  input.send(5)
  input.send(5)
  behavior.send(false)
  input.send(6)
  input.send(7)
  behavior.send(true)
  input.send(8)
  input.send(end)

  assert.ok(input.isReduced, "input is reduced")
  assert.ok(!behavior.isReduced, "behavior is not reduced yet")

  behavior.send(false)

  assert.ok(behavior.isReduced, "behavior is reduced on next yield")

  behavior.send(true)
  input.send(9)
  behavior.send(false)
  input.send(7)
  stop.send(end)
})

exports["test behavior ends sampled"]  = test(function(assert) {
  var stop = event()
  var input = event()
  var behavior = event()

  var sampled = takeWhen(input, behavior)
  var actual = concat(sampled, stop)

  assert(actual, [4, 5, 5, 8], "behavior ends sample")

  input.send(1)
  input.send(2)
  behavior.send(false)
  behavior.send(true)
  behavior.send(true)
  behavior.send(false)
  input.send(3)
  behavior.send(true)
  input.send(4)
  input.send(5)
  input.send(5)
  behavior.send(false)
  input.send(6)
  input.send(7)
  behavior.send(true)
  input.send(8)
  behavior.send(end)

  assert.ok(!input.isReduced, "input is not reduced yet")
  assert.ok(behavior.isReduced, "ended behavior is reduced")

  input.send(9)

  assert.ok(input.isReduced, "input is reduced on next yield")

  behavior.send(true)
  behavior.send(false)
  input.send(7)
  stop.send(end)
})

exports["test early behavior switches (last false)"]  = test(function(assert) {
  var stop = event()
  var input = event()
  var behavior = event()

  var sampled = takeWhen(input, behavior)
  var actual = concat(sampled, stop)

  assert(actual, [4, 5, 6], "values from when behavior was true")

  behavior.send(true)
  behavior.send(false)
  behavior.send(true)
  behavior.send(false)
  input.send(1)
  input.send(2)
  input.send(3)
  behavior.send(true)
  input.send(4)
  input.send(5)
  behavior.send(false)
  behavior.send(true)
  input.send(6)
  input.send(end)

  assert.ok(input.isReduced, "ended input is reduced")
  assert.ok(!behavior.isReduced, "behavior is not reduced yet")

  behavior.send(false)

  assert.ok(behavior.isReduced, "behavior is reduced on next yield")

  behavior.send(true)
  input.send(7)
  stop.send(end)
})

exports["test early behavior switches (last true)"]  = test(function(assert) {
  var stop = event()
  var input = event()
  var behavior = event()

  var sampled = takeWhen(input, behavior)
  var actual = concat(sampled, stop)

  assert(actual, [1, 2, 3, 6], "values from input when behavior is true")

  behavior.send(true)
  behavior.send(false)
  behavior.send(true)
  input.send(1)
  input.send(2)
  input.send(3)
  behavior.send(false)
  behavior.send(false)
  input.send(4)
  input.send(5)
  behavior.send(false)
  behavior.send(true)
  input.send(6)
  input.send(end)

  assert.ok(input.isReduced, "ended input is reduced")
  assert.ok(!behavior.isReduced, "behavior is not reduced yet")

  behavior.send(false)

  assert.ok(behavior.isReduced, "behavior is reduced on next yield")

  behavior.send(true)
  input.send(7)
  stop.send(end)
})

exports["test stop reduction before end"] = test(function(assert) {
  var input = event()
  var behavior = event()
  var stop = event()

  var samples = take(takeWhen(input, behavior), 4)
  var actual = concat(samples, stop)

  assert(actual, [3, 4, 5, 8], "take ends transduced signal")

  input.send(1)
  input.send(2)
  behavior.send(true)
  input.send(3)
  behavior.send(true)
  input.send(4)
  input.send(5)
  behavior.send(false)
  input.send(5)
  behavior.send(false)
  input.send(6)
  input.send(7)
  behavior.send(true)
  input.send(8)

  assert.ok(input.isReduced, "input is reduced on yield")
  assert.ok(!behavior.isReduced, "behavior is reduced yet")

  behavior.send(false)

  assert.ok(behavior.isReduced, "behavior is reduced on yield")

  behavior.send(true)
  input.send(7)
  behavior.send(false)
  input.send(8)
  stop.send(end)
})

exports["test error in behavior propagates"] = test(function(assert) {
  var boom = Error("Boom!!")

  var input = event()
  var behavior = event()

  var actual = delay(takeWhen(input, behavior))

  assert(actual, {
    error: boom,
    values: [3, 5]
  }, "error propagate to reducer and stops reducibles")

  input.send(1)
  input.send(2)
  behavior.send(true)
  behavior.send(false)
  input.send(3)
  behavior.send(true)
  input.send(3)
  behavior.send(false)
  input.send(4)
  behavior.send(true)
  input.send(5)
  behavior.send(false)
  behavior.send(boom)

  assert.ok(behavior.isReduced, "behavior is closed or error")
  assert.ok(!input.isReduced, "input is not closed yet")

  input.send(6)

  assert.ok(input.isReduced, "input is reduced on next yield")

  behavior.send(true)
  input.send(7)
  behavior.send(false)
})

exports["test error in input propagates"] = test(function(assert) {
  var boom = Error("Boom!!")

  var input = event()
  var behavior = event()

  var actual = delay(takeWhen(input, behavior))

  assert(actual, {
    error: boom,
    values: [2, 3]
  }, "error propagate to reducer and stops reducibles")

  input.send(1)
  behavior.send(true)
  input.send(2)
  behavior.send(false)
  input.send(3)
  behavior.send(true)
  input.send(3)
  behavior.send(false)
  input.send(4)
  behavior.send(true)
  input.send(boom)

  assert.ok(!behavior.isReduced, "behavior is not yet")
  assert.ok(input.isReduced, "input is closed on error")

  behavior.send(false)

  assert.ok(behavior.isReduced, "behavior is reduced on next yield")

  behavior.send(true)
  input.send(6)
  behavior.send(false)
})


if (require.main === module)
  require("test").run(exports)
