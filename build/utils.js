'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    isObject: function isObject(input) {
        return Object.prototype.toString.call(input) === '[object Object]';
    },
    isArray: function isArray(input) {
        return input instanceof Array || Object.prototype.toString.call(input) === '[object Array]';
    },
    isDate: function isDate(input) {
        return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';
    },
    isNumber: function isNumber(input) {
        return input instanceof Number || Object.prototype.toString.call(input) === '[object Number]';
    },
    isString: function isString(input) {
        return input instanceof String || Object.prototype.toString.call(input) === '[object String]';
    },
    isBoolean: function isBoolean(input) {
        return typeof input == "boolean";
    },
    isFunction: function isFunction(input) {
        return typeof input == "function";
    },
    deepFreeze: function deepFreeze(obj) {
        Object.freeze(obj);
        Object.keys(obj).forEach(function (key, value) {
            if (_typeof(obj[key]) === 'object') {
                constantize(obj[key]);
            }
        });
        return obj;
    }
};