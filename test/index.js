"use strict";

exports["test take when"] = require("./take-when")
exports["test take until"] = require("./take-until")
exports["test drop repeats"] = require("./drop-repeats")
exports["test throttle"] = require("./throttle")

require("test").run(exports)
