"use strict";

var test = require("reducers/test/util/test")
var dropRepeats = require("../drop-repeats")

exports["test drop repeats"] = test(function(assert) {
  var actual = dropRepeats([1, 2, 2, 3, 4, 4, 4, 4, 5])
  assert(actual, [1, 2, 3, 4, 5], "skips repeating items")
})

exports["test drop similars"] = test(function(assert) {
  var actual = dropRepeats([1, "1", 2, "2", 2, 3, 4, "4"])
  assert(actual, [1, "1", 2, "2", 2, 3, 4, "4"], "strict assertion is used")
})

exports["test optional assert function"] = test(function(assert) {
  var actual = dropRepeats([1, "1", 2, "2", 2, 3, 4, "4"], function(a, b) {
    return a == b
  })

  assert(actual, [1, 2, 3, 4], "use passed-in asserts function")
})

exports["test optional assert function"] = test(function(assert) {
  var actual = dropRepeats([1, "1", 2, "2", 2, 3, 4, "4"], function(a, b) {
    return a == b
  })

  assert(actual, [1, 2, 3, 4], "use passed-in asserts function")
})



if (require.main === module)
  require("test").run(exports)
