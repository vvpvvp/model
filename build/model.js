"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _utils = require("./utils");

var _utils2 = _interopRequireDefault(_utils);

var _type = require("./type");

var _type2 = _interopRequireDefault(_type);

var _momentjs = require("momentjs");

var _momentjs2 = _interopRequireDefault(_momentjs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (global, factory) {
    (typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : global.model = factory();
})(undefined, function () {
    "use strict";

    function analysis(data) {
        var out_data = {};
        if (_utils2.default.isArray(data)) {
            if (data.length == 0) {
                return null;
            } else {
                return analysisObject(data[0]);
            }
        } else {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = Object.keys(data)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var i = _step.value;

                    var n = data[i];
                    out_data[i] = analysisObject(n);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            return out_data;
        }
    }

    function analysisObject(n) {
        var out_data = null;
        if (n instanceof Model) {
            out_data = n._model;
        } else if (_utils2.default.isArray(n)) {
            out_data = {
                type: _type2.default.ARRAY,
                value: analysis(n)
            };
        } else if (_utils2.default.isObject(n)) {
            //已配置规则
            if (n.type && _type2.default.isType(n.type)) {
                out_data = {};
                Object.assign(out_data, n);
            } else {
                //嵌套数据
                out_data = {
                    type: _type2.default.OBJECT,
                    value: analysis(n)
                };
            }
        } else {
            out_data = {
                type: getType(n)
            };
        }
        return out_data;
    }

    function _parse_object(data, model, isParse) {
        if (data === undefined) return null;
        var out_data = data;
        switch (model.type) {
            case _type2.default.OBJECT:
                out_data = {};
                if (isParse) {
                    var _iteratorNormalCompletion2 = true;
                    var _didIteratorError2 = false;
                    var _iteratorError2 = undefined;

                    try {
                        for (var _iterator2 = Object.keys(model.value)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                            var i = _step2.value;

                            out_data[i] = _parse_object(data[i], model.value[i], isParse);
                        }
                    } catch (err) {
                        _didIteratorError2 = true;
                        _iteratorError2 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                _iterator2.return();
                            }
                        } finally {
                            if (_didIteratorError2) {
                                throw _iteratorError2;
                            }
                        }
                    }
                } else {
                    var _iteratorNormalCompletion3 = true;
                    var _didIteratorError3 = false;
                    var _iteratorError3 = undefined;

                    try {
                        for (var _iterator3 = Object.keys(data)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                            var i = _step3.value;

                            if (model.value.hasOwnProperty(i)) out_data[i] = _parse_object(data[i], model.value[i], isParse);
                        }
                    } catch (err) {
                        _didIteratorError3 = true;
                        _iteratorError3 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion3 && _iterator3.return) {
                                _iterator3.return();
                            }
                        } finally {
                            if (_didIteratorError3) {
                                throw _iteratorError3;
                            }
                        }
                    }
                }
                break;
            case _type2.default.ARRAY:
                out_data = [];
                var _iteratorNormalCompletion4 = true;
                var _didIteratorError4 = false;
                var _iteratorError4 = undefined;

                try {
                    for (var _iterator4 = data[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                        var n = _step4.value;

                        out_data.push(_parse_object(n, model.value));
                    }
                } catch (err) {
                    _didIteratorError4 = true;
                    _iteratorError4 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion4 && _iterator4.return) {
                            _iterator4.return();
                        }
                    } finally {
                        if (_didIteratorError4) {
                            throw _iteratorError4;
                        }
                    }
                }

                break;
            case _type2.default.NUMBER:
                out_data = Number(data);
                break;
            case _type2.default.DATE:
                if (isParse) {
                    out_data = {
                        value: (0, _momentjs2.default)(data)
                    };
                    out_data.show = out_data.value.format();
                } else {
                    out_data = (0, _momentjs2.default)(data).toString();
                }
                break;
            case _type2.default.STRING:
                out_data = String(data);

        }
        if (_type2.default.isType(model.type) && isParse && model.format) {
            if (_type2.default.DATE === model.type && _utils2.default.isString(model.format)) {
                out_data.show = out_data.value.format(model.format);
            } else if (_utils2.default.isFunction(model.format)) {
                out_data = {
                    value: out_data,
                    show: model.format.call(null, out_data)
                };
            }
        }
        return out_data;
    }

    function _parse(data, model, isParse) {
        var out_data = null;
        if (_utils2.default.isArray(data)) {
            out_data = [];
            var _iteratorNormalCompletion5 = true;
            var _didIteratorError5 = false;
            var _iteratorError5 = undefined;

            try {
                for (var _iterator5 = data[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                    var n = _step5.value;

                    out_data.push(_parse_object(n, model, isParse));
                }
            } catch (err) {
                _didIteratorError5 = true;
                _iteratorError5 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion5 && _iterator5.return) {
                        _iterator5.return();
                    }
                } finally {
                    if (_didIteratorError5) {
                        throw _iteratorError5;
                    }
                }
            }
        } else if (_utils2.default.isObject(data)) {
            out_data = _parse_object(data, model, isParse);
        } else {
            out_data = data;
        }
        return out_data;
    }

    function getType(date) {
        if (_type2.default.isType(date)) {
            return date;
        }
        if (_utils2.default.isNumber(date)) {
            return _type2.default.NUMBER;
        } else if (_utils2.default.isString(date)) {
            return _type2.default.STRING;
        } else if (_utils2.default.isBoolean(date)) {
            return _type2.default.BOOLEAN;
        }
        return _type2.default.STRING;
    }

    var Model = function () {
        function Model(_model) {
            _classCallCheck(this, Model);

            this._model = analysisObject(_model);
        }

        _createClass(Model, [{
            key: "parse",
            value: function parse(data) {
                return _parse(data, this._model, true);
            }
        }, {
            key: "dispose",
            value: function dispose(data) {
                return _parse(data, this._model, false);
            }
        }]);

        return Model;
    }();

    // data = User.parse(data);

    // data = User.dispose(data);

    Model.DATE = _type2.default.DATE;
    Model.NUMBER = _type2.default.NUMBER;
    Model.STRING = _type2.default.STRING;
    Model.BOOLEAN = _type2.default.BOOLEAN;
    return Model;
});