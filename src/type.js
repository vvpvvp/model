import Utils from './utils';
const TYPE = {
  STRING: Symbol('string'),
  DATE: Symbol('date'),
  NUMBER: Symbol('number'),
  BOOLEAN: Symbol('boolean'),
  OBJECT: Symbol('object'),
  ARRAY: Symbol('array'),
  isType(date) {
        return date === this.STRING ||
        date === this.DATE ||
        date === this.NUMBER ||
        date === this.BOOLEAN;
  },
}
Utils.deepFreeze(TYPE);
export default TYPE;
