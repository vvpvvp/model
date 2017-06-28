
export default {
  isObject(input) {
    return Object.prototype.toString.call(input) === '[object Object]';
  },
  isArray(input) {
    return input instanceof Array || Object.prototype.toString.call(input) === '[object Array]';
  },
  isDate(input) {
    return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';
  },
  isNumber(input) {
    return input instanceof Number || Object.prototype.toString.call(input) === '[object Number]';
  },
  isString(input) {
    return input instanceof String || Object.prototype.toString.call(input) === '[object String]';
  },
  isBoolean(input) {
    return typeof input == 'boolean';
  },
  isFunction(input) {
    return typeof input == 'function';
  },
  deepCopy(data) {
    let copyOne = null;
    if (this.isObject(data)) {
      copyOne = {};
      for (const key in data) {
        copyOne[key] = this.deepCopy(data[key]);
      }
    } else if (this.isArray(data)) {
      copyOne = [];
      for (const index of data) {
        copyOne.push(this.deepCopy(index));
      }
    } else {
      copyOne = data;
    }
    return copyOne;
  },
  deepFreeze(obj) {
    const that = this;
    Object.freeze(obj);
    Object.keys(obj).forEach((key, value) => {
      if (that.isObject(obj[key])) {
        this.deepFreeze(obj[key]);
      }
    });
    return obj;
  },
  mergeArray(arr1, arr2) {
    for (var i = 0; i < arr1.length; i++) {
      for (let j = 0; j < arr2.length; j++) {
        if (arr1[i] === arr2[j]) {
          arr1.splice(i, 1);
        }
      }
    }
    for (var i = 0; i < arr2.length; i++) {
      arr1.push(arr2[i]);
    }
    return arr1;
  },
  extend: function () {
    var options, name, src, copy, copyIsArray, clone,
      target = arguments[0] || {},
      i = 1,
      length = arguments.length,
      deep = false;
    if (typeof target === "boolean") {
      deep = target;
      target = arguments[1] || {};
      i = 2;
    }
    if (typeof target !== "object" && !this.isFunction(target)) {
      target = {};
    }
    if (length === i) {
      target = this;
      --i;
    }
    for (; i < length; i++) {
      if ((options = arguments[i]) != null) {
        for (name in options) {
          src = target[name];
          copy = options[name];
          if (target === copy) {
            continue;
          }
          if (deep && copy && (this.isPlainObject(copy) || (copyIsArray = this.isArray(copy)))) {
            if (copyIsArray) {
              copyIsArray = false;
              clone = src && this.isArray(src) ? src : [];
            } else {
              clone = src && this.isPlainObject(src) ? src : {};
            }
            target[name] = this.extend(deep, clone, copy);
          } else if (copy !== undefined) {
            target[name] = copy;
          }
        }
      }
    }
    return target;
  },
};
