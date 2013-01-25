# transducer

[![Build Status](https://secure.travis-ci.org/Gozala/transducer.png)](http://travis-ci.org/Gozala/transducer)

Library for filtering signals based on other signal behavior

## API

### takeWhen(input, behavior)

Takes two reducible signals and returns narrowed down `input` based on
`behavior`. Items form `input` propagate into returned reducible, when
`behavior` yields / becomes `true`-thy. Items do not propagate when `behavior`
yields / becomes `false`-thy until it switches back again. More simply
function returns signal of events from `input` only when `behavior` is `true`.
Result ends when either `input` or `behavior` ends.

```js
var event = require("dom-reduce/event")
var map = require("dom-reduce/map")

var mousedown = event("mousedown", document.documentElement)
var mouseup = event("mouseup", document.documentElement)
var mousemove = event("mousemove", document.documentElement)

function True() { return true }
function False() { return false }

var pressed = merge([map(mousedown, True), map(mouseup, False)])
var drag = takeWhen(mousemove, pressed)
```

### takeUntil(input, behavior)

Takes two reducible signals and returns narrowed down `input` based on
`behavior`. Items form `input` propagate into returned reducible, when
`behavior` yields / becomes `true`-thy until it yields / becomes `false`-thy,
at while point returned reducible ends. More simply function returns signal
of events from `input` until `behavior` is `false`. Result ends when
`behavior` yields / becomes `true` or either one from `input` & `behavior`
ends.

This is similar to `takeWhen` with difference being that result will end
as soon as behavior switches to `false`.


### dropRepeats(input, assert)

Takes reducible `input` and returns narrowed down version with sequential
repeated values dropped. For example, if a given `input` contains items has
following form `< 1 1 2 2 1 >` then result will have a form of `< 1 2 1 >` by
dropping the values that are the same as the previous value. Function takes
second optional argument `assert` that can be used to compare items. Items
to which `assert` returns true will be dropped.

```js
dropRepeats([1, 2, 2, 3, 4, 4, 4, 4, 5])
// => < 1 2 3 4 5 >

dropRepeats([1, "1", 2, "2", 2, 2, 3, 4, "4"])
// => < 1 "1" 2 "2" 2 3 4 "4" >

dropRepeats([1, "1", 2, "2", 2, 3, 4, "4"], function(a, b) {
  return a == b
})
// => < 1 2 3 4 >
```

### throttle(input, [stamp,] delta)

Function takes reducible `input` (supposedly signal or asynchronous stream)
and `delta` value and returns throttled version back. Items are dropped if
time difference between sends is larger then given `delta`. Optionally
`stamp` function maybe passed in order to manually stamp values on which
differences will be asserted.

```js
var input = delay([1, 2, 3, 4, 5, 6, 7], 25)
throttle(input, 40)
// => < 1 3 5 7 >

throttle(clickEvents, function(event) {
  return event.timeStamp
}, 20)
```

## Install

    npm install transducer
