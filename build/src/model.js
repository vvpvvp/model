'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

var _type = require('./type');

var _type2 = _interopRequireDefault(_type);

var _manba = require('manba');

var _manba2 = _interopRequireDefault(_manba);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (global, factory) {
  (typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : global.model = factory();
})(undefined, function () {
  function analysis(data) {
    var outData = {};
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
          outData[i] = analysisObject(n);
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

      return outData;
    }
  }

  function analysisObject(n) {
    var outData = null;
    if (n instanceof Model) {
      outData = n._model;
    } else if (_utils2.default.isArray(n)) {
      outData = {
        type: _type2.default.ARRAY,
        value: analysis(n)
      };
    } else if (_utils2.default.isObject(n)) {
      // 已配置规则
      if (n.type && _type2.default.isType(n.type)) {
        outData = {};
        Object.assign(outData, n);
      } else {
        // 嵌套数据
        outData = {
          type: _type2.default.OBJECT,
          value: analysis(n)
        };
      }
    } else {
      outData = {
        type: getType(n)
      };
    }
    return outData;
  }

  function _parse_object(data, model, param) {
    // isParse, parentData
    if (!param.isParse && _utils2.default.isFunction(model.computed)) {
      return model.computed.call(null, param.parentData);
    }
    if (param.isParse && _utils2.default.isFunction(model.parse)) {
      return model.parse.call(null, data);
    }
    if (data === undefined || data === null) {
      if (model.type == _type2.default.ARRAY && param.isParse) {
        return [];
      } else if (!(model.type == _type2.default.OBJECT && param.isParse)) {
        if (!param.removeNull && model.default != undefined) {
          return model.default;
        }
        return null;
      }
    }
    var outData = data;
    switch (model.type) {
      case _type2.default.OBJECT:
        outData = {};
        var columns = 0;
        if (param.isParse) {
          var keys = _utils2.default.mergeArray(Object.keys(model.value), data ? Object.keys(data) : []);
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = keys[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var i = _step2.value;

              if (model.value.hasOwnProperty(i)) {
                data = data || {};
                param.parentData = outData;
                var _out = _parse_object(data[i], model.value[i], param);
                if (param.removeNull && (_out == undefined || _out == null || _utils2.default.isArray(_out) && _out.length == 0)) {
                  continue;
                } else {
                  outData[i] = _out;
                }
              } else {
                outData[i] = _utils2.default.deepCopy(data[i]);
              }
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

              if (model.value.hasOwnProperty(i)) {
                param.parentData = outData;
                var d = _parse_object(data[i], model.value[i], param);
                if (d != undefined && d != null) {
                  if (param.removeEmptyArray && _utils2.default.isArray(d) && d.length == 0) {
                    continue;
                  }
                  outData[i] = d;
                }
              }
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
        // 依旧为空对象
        if (Object.keys(outData).length == 0) outData = null;
        break;
      case _type2.default.ARRAY:
        outData = [];
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
          for (var _iterator4 = data[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var n = _step4.value;

            var r = _parse_object(n, model.value, param);
            if (!(param.removeNullFromArray && r == null)) {
              outData.push(r);
            }
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
        if (_utils2.default.isString(data) && data == '') {
          outData = null;
        } else {
          outData = Number(data);
          if (model.unit) {
            if (param.isParse) {
              outData = outData / model.unit;
            } else {
              outData = outData * model.unit;
            }
          }
        }
        break;
      case _type2.default.DATE:
        if (_utils2.default.isString(data) && data == '') {
          outData = null;
        } else if (!data) {
          outData = null;
        } else if (param.isParse) {
          outData = (0, _manba2.default)(data).format(model.format || '');
        } else {
          outData = (0, _manba2.default)(data).toISOString();
        }
        break;
      case _type2.default.BOOLEAN:
        if (data === true || data == 'true') {
          outData = true;
        } else if (data === false || data == 'false') {
          outData = false;
        } else {
          outData = null;
        }
        break;
      case _type2.default.STRING:
        outData = String(data);

    }
    if (_type2.default.isType(model.type) && param.isParse && _utils2.default.isFunction(model.format) && outData) {
      outData = model.format.call(null, outData);
    }
    // dispose 的时候 如果为"",则输出null
    if (!param.isParse && param.setEmptyNull && _utils2.default.isString(outData) && outData == '') {
      outData = null;
    }
    return outData;
  }

  function _parse(data, model, param) {
    var outData = null;
    if (_utils2.default.isArray(data)) {
      outData = [];
      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = data[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var n = _step5.value;

          outData.push(_parse_object(n, model, param));
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
      outData = _parse_object(data, model, param);
      if (outData == null) {
        return {};
      }
    } else {
      outData = data;
      if (outData == null) {
        return [];
      }
    }

    return outData;
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
      key: 'parse',
      value: function parse(data) {
        var param = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        param.isParse = true;
        return _parse(data, this._model, param);
      }
    }, {
      key: 'dispose',
      value: function dispose(data) {
        var param = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        param.isParse = false;
        return _parse(data, this._model, param);
      }
    }]);

    return Model;
  }();

  Model.DATE = _type2.default.DATE;
  Model.NUMBER = _type2.default.NUMBER;
  Model.STRING = _type2.default.STRING;
  Model.BOOLEAN = _type2.default.BOOLEAN;
  Model.S = _type2.default.S;
  Model.B = _type2.default.B;
  Model.Q = _type2.default.Q;
  Model.W = _type2.default.W;
  Model.SW = _type2.default.SW;
  Model.BW = _type2.default.BW;
  Model.QW = _type2.default.QW;
  Model.Y = _type2.default.Y;
  return Model;
});