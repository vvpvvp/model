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
  S: 10,
  B: 100,
  Q: 1000,
  W: 10000,
  SW: 100000,
  BW: 1000000,
  QW: 10000000,
  Y: 100000000,
}
Utils.deepFreeze(TYPE);
export default TYPE;
