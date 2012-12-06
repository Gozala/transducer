"use strict";

var takeWhile = require("reducers/take-while")

var takeWhen = require("./take-when")

function takeUntil(input, behavior) {
  /**
  Takes two reducible signals and returns narrowed down `input` based on
  `behavior`. Items form `input` propagate into returned reducible, when
  `behavior` yields / becomes `true`-thy until it yields / becomes `false`-thy,
  at while point returned reducible ends. More simply function returns signal
  of events from `input` until `behavior` is `false`. Result ends when
  `behavior` yields / becomes `true` or either one from `input` & `behavior`
  ends.
  **/

  return takeWhen(input, takeWhile(behavior, Boolean))
}

module.exports = takeUntil
