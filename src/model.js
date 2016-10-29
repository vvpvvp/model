import Utils from './utils';
import TYPE from './type';
import moment from 'momentjs';
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
        global.model = factory();
}(global||window, function () {
  function analysis(data) {
    const out_data = {};
    if (Utils.isArray(data)) {
      if (data.length == 0) {
        return null;
      } else {
        return analysisObject(data[0]);
      }
    } else {
      for (const i of Object.keys(data)) {
        const n = data[i];
        out_data[i] = analysisObject(n);
      }
      return out_data;
    }
  }

  function analysisObject(n) {
    let out_data = null;
    if (n instanceof Model) {
      out_data = n._model;
    } else if (Utils.isArray(n)) {
      out_data = {
        type: TYPE.ARRAY,
        value: analysis(n),
      }
    } else if (Utils.isObject(n)) {
            // 已配置规则
      if (n.type && TYPE.isType(n.type)) {
        out_data = {};
        Object.assign(out_data, n);
      } else {
                // 嵌套数据
        out_data = {
          type: TYPE.OBJECT,
          value: analysis(n),
        }
      }
    } else {
      out_data = {
        type: getType(n),
      }
    }
    return out_data;
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
        if (!param.notEmpty && model.default != undefined) {
          return model.default;
        }
        return null;
      }
    }
    let out_data = data;
    switch (model.type) {
    case TYPE.OBJECT:
      out_data = {};
      const columns = 0;
      if (param.isParse) {
        const keys = Utils.mergeArray(Object.keys(model.value), data ? Object.keys(data) : []);
        for (const i of keys) {
          if (model.value.hasOwnProperty(i)) {
            data = data || {};
            param.parentData = out_data;
            const _out = _parse_object(data[i], model.value[i], param);
            if (param.notEmpty && (_out == undefined || _out == null || (Utils.isArray(_out) && _out.length == 0))) {
              continue;
            } else {
              out_data[i] = _out;
            }
          } else {
            out_data[i] = Utils.deepCopy(data[i]);
          }
        }
      } else {
        for (const i of Object.keys(data)) {
          if (model.value.hasOwnProperty(i)) {
            param.parentData = out_data;
            const d = _parse_object(data[i], model.value[i], param);
            if (d != undefined && d != null) {
              if (param.emptyArray && Utils.isArray(d) && d.length == 0) {
                continue;
              }
              out_data[i] = d;
            }
          }
        }
      }
                // 依旧为空对象
      if (Object.keys(out_data).length == 0)out_data = null;
      break;
    case TYPE.ARRAY:
      out_data = [];
      for (const n of data) {
        const r = _parse_object(n, model.value, param);
        if (!(param.removeNullFromArray && r == null))
                        { out_data.push(r); }
      }
      break;
    case TYPE.NUMBER:
      if (Utils.isString(data) && data == '') {
        out_data = null;
      } else {
        out_data = Number(data);
      }
      break;
    case TYPE.DATE:
      if (Utils.isString(data) && data == '') {
        out_data = null;
      } else if (!data) {
        out_data = null;
      } else if (param.isParse) {
                        // out_data = {
                        //     value: moment(data)
                        // }
                        // .show
        out_data = moment(data).format(model.format || '');
      } else {
        out_data = moment(data).toISOString();
      }
      break;
    case TYPE.BOOLEAN:
      if (data === true || data == 'true') {
        out_data = true;
      } else if (data === false || data == 'false') {
        out_data = false;
      } else {
        out_data = null;
      }
      break;
    case TYPE.STRING:
      out_data = String(data);

    }
    if (TYPE.isType(model.type) && param.isParse && Utils.isFunction(model.format) && out_data) {
      out_data = model.format.call(null, out_data);
    }
        // dispose 的时候 如果为"",则输出null
    if (!param.isParse && param.setEmptyNull && Utils.isString(out_data) && out_data == '') {
      out_data = null;
    }
    return out_data;
  }

  function _parse(data, model, param) {
    let out_data = null;
    if (Utils.isArray(data)) {
      out_data = [];
      for (const n of data) {
        out_data.push(_parse_object(n, model, param));
      }
    } else if (Utils.isObject(data)) {
      out_data = _parse_object(data, model, param);
      if (out_data == null) {
        return {};
      }
    } else {
      out_data = data;
      if (out_data == null) {
        return [];
      }
    }

    return out_data;
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

    // data = User.parse(data);

    // data = User.dispose(data);

  Model.DATE = TYPE.DATE;
  Model.NUMBER = TYPE.NUMBER;
  Model.STRING = TYPE.STRING;
  Model.BOOLEAN = TYPE.BOOLEAN;
  return Model;
}));
