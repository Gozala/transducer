"use strict";

var filter = require("reducers/filter")
var concat = require("reducers/concat")
var sample = require("sample")

var nil = new String("void sample")

// Makes sample non `nil` sample if behavior state is truthy.
function makeSample(state, value) { 
  return state ? value : nil
}
// Returns `true` if value isn't `nil` sample
function isntNil(value) { return value !== nil }

function takeWhen(input, behavior) {
  /**
  Takes two reducible signals and returns narrowed down `input` based on
  `behavior`. Items form `input` propagate into returned reducible, when
  `behavior` yields / becomes `true`-thy. Items do not propagate when `behavior`
  yields / becomes `false`-thy until it switches back again. More simply
  function returns signal of events from `input` only when `behavior` is `true`.
  Result ends when either `input` or `behavior` ends.
  **/

  // prepend `false` the behavior to make sure it's first one to yield,
  // that way if behavior switches later, last input value won't propagate.
  var samples = sample(concat(false, behavior), input, makeSample)
  return filter(samples, isntNil)
}

module.exports = takeWhen
