"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utils = require("./utils");

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TYPE = {
    STRING: Symbol("string"),
    DATE: Symbol("date"),
    NUMBER: Symbol("number"),
    BOOLEAN: Symbol("boolean"),
    OBJECT: Symbol("object"),
    ARRAY: Symbol("array"),
    isType: function isType(date) {
        return date === this.STRING || date === this.DATE || date === this.NUMBER || date === this.BOOLEAN;
    }
};
_utils2.default.deepFreeze(TYPE);
exports.default = TYPE;