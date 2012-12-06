"use strict";

var test = require("reducers/test/util/test")
var event = require("reducers/test/util/event")

var take = require("reducers/take")
var concat = require("reducers/concat")
var delay = require("reducers/delay")


var end = require("reducible/end")

var takeUntil = require("../take-until")

exports["test immediate false behavior makes empty"]  = test(function(assert) {
  var stop = event()
  var input = event()
  var behavior = event()

  var sampled = takeUntil(input, behavior)
  var actual = concat(sampled, stop)

  assert(actual, [], "immediate false behavior results in empty")

  input.send(1)
  input.send(2)
  behavior.send(false)

  assert.ok(behavior.isReduced, "behavior is reduced as soon as it's false")
  assert.ok(!input.isReduced, "input is not reduced yet")

  input.send(3)

  assert.ok(input.isReduced, "input is reduced on next yield")

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
  stop.send(end)
})

exports["test behavior switch to false ends result"]  = test(function(assert) {
  var stop = event()
  var input = event()
  var behavior = event()

  var sampled = takeUntil(input, behavior)
  var actual = concat(sampled, stop)

  assert(actual, [3, 4, 5], "behavior switch to false ends result")

  input.send(1)
  input.send(2)
  behavior.send(true)

  input.send(3)
  input.send(4)
  input.send(5)

  behavior.send(false)

  assert.ok(behavior.isReduced, "behavior is reduced as soon as it's false")
  assert.ok(!input.isReduced, "input is not reduced yet")

  input.send(5)

  assert.ok(input.isReduced, "input is reduced on next yield")

  behavior.send(true)
  behavior.send(false)

  input.send(6)
  input.send(7)
  behavior.send(true)
  input.send(8)
  input.send(end)
  stop.send(end)
})

exports["test behavior end ends result"]  = test(function(assert) {
  var stop = event()
  var input = event()
  var behavior = event()

  var sampled = takeUntil(input, behavior)
  var actual = concat(sampled, stop)

  assert(actual, [3, 4, 5, 6], "behavior ends ends result")

  input.send(1)
  input.send(2)
  behavior.send(true)
  behavior.send(true)
  input.send(3)
  behavior.send(true)
  input.send(4)
  input.send(5)
  input.send(6)
  behavior.send(end)

  assert.ok(!input.isReduced, "input is not reduced yet")
  assert.ok(behavior.isReduced, "ended behavior is reduced")

  input.send(6)

  assert.ok(input.isReduced, "input is reduced on next yield")

  input.send(7)
  behavior.send(true)
  input.send(8)
  behavior.send(true)

  input.send(9)

  behavior.send(true)
  behavior.send(false)
  input.send(7)
  stop.send(end)
})

exports["test input end ends result"]  = test(function(assert) {
  var stop = event()
  var input = event()
  var behavior = event()

  var sampled = takeUntil(input, behavior)
  var actual = concat(sampled, stop)

  assert(actual, [3, 4, 5, 6], "behavior ends ends result")

  input.send(1)
  input.send(2)
  behavior.send(true)
  behavior.send(true)
  input.send(3)
  behavior.send(true)
  input.send(4)
  input.send(5)
  input.send(6)
  input.send(end)

  assert.ok(input.isReduced, "input end ends result")
  assert.ok(!behavior.isReduced, "behavior is not reduced yet")

  behavior.send(true)

  assert.ok(behavior.isReduced, "behavior is reduced on next yield")

  input.send(7)
  behavior.send(true)
  input.send(8)
  behavior.send(true)

  input.send(9)

  behavior.send(true)
  behavior.send(false)
  input.send(7)
  stop.send(end)
})

exports["test reduction completion closes sources"] = test(function(assert) {
  var input = event()
  var behavior = event()
  var stop = event()

  var taken = take(takeUntil(input, behavior), 4)
  var actual = concat(taken, stop)

  assert(actual, [3, 4, 5, 6], "take ends transduced signal")

  input.send(1)
  input.send(2)
  behavior.send(true)
  input.send(3)
  behavior.send(true)
  input.send(4)
  input.send(5)
  input.send(6)

  assert.ok(input.isReduced, "input is reduced on yield")
  assert.ok(!behavior.isReduced, "behavior is reduced yet")

  behavior.send(false)

  assert.ok(behavior.isReduced, "behavior is reduced on yield")

  input.send(5)
  behavior.send(false)
  input.send(6)
  input.send(7)
  behavior.send(true)
  input.send(8)
  stop.send(end)
})


exports["test error in behavior propagates"] = test(function(assert) {
  var boom = Error("Boom!!")

  var input = event()
  var behavior = event()

  var actual = delay(takeUntil(input, behavior))

  assert(actual, {
    error: boom,
    values: [3, 4, 5]
  }, "error propagate to reducer and stops reducibles")

  input.send(1)
  input.send(2)
  behavior.send(true)
  input.send(3)
  input.send(4)
  behavior.send(true)
  input.send(5)
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

  var actual = delay(takeUntil(input, behavior))

  assert(actual, {
    error: boom,
    values: [2, 3, 4]
  }, "error propagate to reducer and stops reducibles")

  input.send(1)
  behavior.send(true)
  input.send(2)
  input.send(3)
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
