
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
    isBoolean(input){
        return typeof input == "boolean";
    },
    isFunction(input){
        return typeof input == "function";
    },
    deepFreeze(obj){
      Object.freeze(obj);
      Object.keys(obj).forEach( (key, value) => {
        if ( typeof obj[key] === 'object' ) {
          constantize( obj[key] );
        }
      });
      return obj;
    }
};