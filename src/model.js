import Utils from "./utils";
import TYPE from "./type";
import moment from "momentjs";
(function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
        global.model = factory();
}(this, function() {
    "use strict";

    function analysis(data) {
        let out_data = {};
        if (Utils.isArray(data)) {
            if (data.length == 0) {
                return null;
            } else {
                return analysisObject(data[0]);
            }
        } else {
            for (let i of Object.keys(data)) {
                let n = data[i];
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
                value: analysis(n)
            }
        } else if (Utils.isObject(n)) {
            //已配置规则
            if (n.type && TYPE.isType(n.type)) {
                out_data = {};
                Object.assign(out_data, n);
            } else {
                //嵌套数据
                out_data = {
                    type: TYPE.OBJECT,
                    value: analysis(n)
                }
            }
        } else {
            out_data = {
                type: getType(n)
            }
        }
        return out_data;
    }

    function _parse_object(data, model, isParse) {
        if (data === undefined) return null;
        let out_data = data;
        switch (model.type) {
            case TYPE.OBJECT:
                out_data = {};
                if (isParse) {
                    for (let i of Object.keys(model.value)) {
                        out_data[i] = _parse_object(data[i], model.value[i], isParse);
                    }
                } else {
                    for (let i of Object.keys(data)) {
                        if (model.value.hasOwnProperty(i))
                            out_data[i] = _parse_object(data[i], model.value[i], isParse);
                    }
                }
                break;
            case TYPE.ARRAY:
                out_data = [];
                for (let n of data) {
                    out_data.push(_parse_object(n, model.value));
                }
                break;
            case TYPE.NUMBER:
                out_data = Number(data);
                break;
            case TYPE.DATE:
                if (isParse) {
                    out_data = {
                        value: moment(data)
                    }
                    out_data.show = out_data.value.format();
                } else {
                    out_data = moment(data).toString();
                }
                break;
            case TYPE.STRING:
                out_data = String(data);

        }
        if (TYPE.isType(model.type) && isParse && model.format) {
            if (TYPE.DATE === model.type && Utils.isString(model.format)) {
                out_data.show = out_data.value.format(model.format);
            } else if (Utils.isFunction(model.format)) {
                out_data = {
                    value: out_data,
                    show: model.format.call(null, out_data)
                }
            }
        }
        return out_data;
    }

    function _parse(data, model, isParse) {
        let out_data = null;
        if (Utils.isArray(data)) {
            out_data = [];
            for (let n of data) {
                out_data.push(_parse_object(n, model, isParse));
            }
        } else if (Utils.isObject(data)) {
            out_data = _parse_object(data, model, isParse);
        } else {
            out_data = data;
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

        parse(data) {
            return _parse(data, this._model, true);
        }

        dispose(data) {
            return _parse(data, this._model, false);
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
