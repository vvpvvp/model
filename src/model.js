import Utils from './utils';
import TYPE from './type';
import manba from 'manba';
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.Model = factory();
}(this, function () {
  function analysis(data) {
    const outData = {};
    if (Utils.isArray(data)) {
      if (data.length == 0) {
        return null;
      } else {
        return analysisObject(data[0]);
      }
    } else {
      for (const i of Object.keys(data)) {
        const n = data[i];
        outData[i] = analysisObject(n);
      }
      return outData;
    }
  }

  function analysisObject(n) {
    let outData = null;
    if (n instanceof Model) {
      outData = n._model;
    } else if (Utils.isArray(n)) {
      outData = {
        type: TYPE.ARRAY,
        value: analysis(n),
      }
    } else if (Utils.isObject(n)) {
      // 已配置规则
      if (n.type && TYPE.isType(n.type)) {
        outData = {};
        Object.assign(outData, n);
      } else {
        // 嵌套数据
        outData = {
          type: TYPE.OBJECT,
          value: analysis(n),
        }
      }
    } else {
      outData = {
        type: getType(n),
      }
    }
    return outData;
  }

  function _parse_object(data, model, param) {
    // isParse, parentData
    if ((!param.isParse) && Utils.isFunction(model.computed)) {
      return model.computed.call(null, param.parentData);
    }
    if (param.isParse && Utils.isFunction(model.parse)) {
      return model.parse.call(null, data);
    }
    if (data === undefined || data === null) {
      if (model.type == TYPE.ARRAY && param.isParse) {
        return [];
      } else if (!(model.type == TYPE.OBJECT && param.isParse)) {
        if (!param.removeNull && model.default != undefined) {
          return model.default;
        }
        return null;
      }
    }
    let outData = data;
    switch (model.type) {
    case TYPE.OBJECT:
      outData = {};
      const columns = 0;
      if (param.isParse) {
        const keys = Utils.mergeArray(Object.keys(model.value), data ? Object.keys(data) : []);
        for (const i of keys) {
          if (model.value.hasOwnProperty(i)) {
            data = data || {};
            param.parentData = outData;
            const _out = _parse_object(data[i], model.value[i], param);
            if (param.removeNull && (_out == undefined || _out == null || (Utils.isArray(_out) && _out.length == 0))) {
              continue;
            } else {
              outData[i] = _out;
            }
          } else {
            outData[i] = Utils.deepCopy(data[i]);
          }
        }
      } else {
        for (const i of Object.keys(data)) {
          if (model.value.hasOwnProperty(i)) {
            param.parentData = outData;
            const d = _parse_object(data[i], model.value[i], param);
            if (d != undefined && d != null) {
              if (param.removeEmptyArray && Utils.isArray(d) && d.length == 0) {
                continue;
              }
              outData[i] = d;
            }
          }
        }
      }
      // 依旧为空对象
      if (Object.keys(outData).length == 0) outData = null;
      break;
    case TYPE.ARRAY:
      outData = [];
      for (const n of data) {
        const r = _parse_object(n, model.value, param);
        if (!(param.removeNullFromArray && r == null)) { outData.push(r); }
      }
      break;
    case TYPE.NUMBER:
      if (Utils.isString(data) && data == '') {
        outData = null;
      } else {
        outData = Number(data);
        if (model.unit) {
          if (param.isParse) {
            outData = outData / model.unit, 3;
          } else {
            outData = outData * model.unit;
          }
        }
      }
      break;
    case TYPE.DATE:
      if (Utils.isString(data) && data == '') {
        outData = null;
      } else if (!data) {
        outData = null;
      } else if (param.isParse) {
        outData = manba(data).format(model.format || '');
      } else {
        outData = manba(data).toISOString();
      }
      break;
    case TYPE.BOOLEAN:
      if (data === true || data == 'true') {
        outData = true;
      } else if (data === false || data == 'false') {
        outData = false;
      } else {
        outData = null;
      }
      break;
    case TYPE.STRING:
      outData = String(data);

    }
    if (TYPE.isType(model.type) && param.isParse && Utils.isFunction(model.format) && outData) {
      outData = model.format.call(null, outData);
    }
    // dispose 的时候 如果为"",则输出null
    if (!param.isParse && param.setEmptyNull && Utils.isString(outData) && outData == '') {
      outData = null;
    }
    return outData;
  }

  function _parse(data, model, param) {
    let outData = null;
    if (Utils.isArray(data)) {
      outData = [];
      for (const n of data) {
        outData.push(_parse_object(n, model, param));
      }
    } else if (Utils.isObject(data)) {
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
    if (TYPE.isType(date)) {
      return date;
    }
    if (Utils.isNumber(date)) {
      return TYPE.NUMBER;
    } else if (Utils.isString(date)) {
      return TYPE.STRING;
    } else if (Utils.isBoolean(date)) {
      return TYPE.BOOLEAN;
    }
    return TYPE.STRING;
  }

  class Model {
    constructor(_model) {
      this._model = analysisObject(_model);
    }

    parse(data, param = {}) {
      param.isParse = true;
      return _parse(data, this._model, param);
    }

    dispose(data, param = {}) {
      param.isParse = false;
      return _parse(data, this._model, param);
    }
  }

  Model.DATE = TYPE.DATE;
  Model.NUMBER = TYPE.NUMBER;
  Model.STRING = TYPE.STRING;
  Model.BOOLEAN = TYPE.BOOLEAN;
  Model.S = TYPE.S;
  Model.B = TYPE.B;
  Model.Q = TYPE.Q;
  Model.W = TYPE.W;
  Model.SW = TYPE.SW;
  Model.BW = TYPE.BW;
  Model.QW = TYPE.QW;
  Model.Y = TYPE.Y;
  return Model;
}));
