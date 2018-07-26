// let Model = require("../build/model");
let Model = require("../src/model");
var expect = require('chai').expect;
(function () {
  'use strict';
  const FORMAT = {
    L: "l",
    LL: "ll",
    KK: "k",
    GET: function (data) {
      return "get" + data;
    }
  }

  let Basic = new Model({
    "source": Date,
    "description": {
      type: String,
      format: FORMAT.GET
    },
    "tags": [
      0
    ],
    "companyId": {
      type: Model.String,
      default: "测试"
    },
    "rate": {
      type: Model.Number,
      computed: function (data) {
        return data.rateFrom + 3;
      }
    },
    "id": 0
  });


  let Edu = new Model({
    "startTime": {
      type: Date,
      format: FORMAT.L
    },
    "degree": 0,
    "major": "",
    "school": "",
    "endTime": 0,
    "takeTime": "",
    "id": ""
  });


  let User = new Model({
    "basic": Basic,
    "bind": {},
    "edu": [Edu]
  });

  describe('judge type object', function () {

    let TypeModel = new Model({
      type: String,
      list: [{
        type: Number,
        default: true
      }],
      object: {
        type: Boolean,
        id: 0,
      },
      normal: {
        type: Number
      }
    });

    it('judge type object parse', function () {
      expect(TypeModel.parse({list:[{}]})).to.be.deep.equal({
        type: null,
        list: [{
          type: null,
          default: null
        }],
        object: {
          type: null,
          id: null,
        },
        normal: null
      });
    });

    it('judge type object dispose', function () {
      expect(TypeModel.dispose({
        type: 123,
        list: [{
          type: false,
          default: "true"
        }],
        object: {
          type: false,
          id: "23"
        },
        normal: "123"
      })).to.be.deep.equal({
        type: "123",
        list: [{
          type: 0,
          default: true
        }],
        object: {
          type: false,
          id: 23,
        },
        normal: 123
      });
    });

  });

  describe('basic model', function () {


    let value = User.parse({
      basic: {
        id: "123123",
        source: "Tue Apr 19 2016 21:46:11 GMT+0800 (CST)",
        tags: [
          "12", "32"
        ],
        rateFrom: 1
      }
    });



    it('parse full model', function () {
      expect(value).to.be.deep.equal({
        bind: null,
        edu: [],
        basic: {
          description: null,
          companyId: '测试',
          rate: null,
          id: 123123,
          source: '2016-04-19',
          tags: [12, 32],
          rateFrom: 1
        }
      });

    });

    it('parse empty value', function () {
      expect(User.parse({})).to.be.deep.equal({
        bind: null,
        edu: [],
        basic: {
          description: null,
          companyId: "测试",
          rate: null,
          id: null,
          source: null,
          tags: []
        }
      });

    });


    it('dispose post data', function () {
      expect(User.dispose(value)).to.be.deep.equal({
        edu: [],
        basic: {
          companyId: '测试',
          id: 123123,
          rate: 4,
          source: '2016-04-19T00:00:00+08:00',
          tags: [12, 32]
        }
      });
    });


    it('dispose post data2', function () {
      let Test = new Model({
        id:0
      });
      expect(Test.dispose([{id:null}])).to.be.deep.equal([{}]);
    });

    

    it('disposeDateFormat', function () {
      let Test1 = new Model({
        source: Model.DATE
      });

      Model.config({
        disposeDateFormat(date) {
          return new Date(date).getTime();
        }
      })
      expect(Test1.dispose({
        source: '2016-04-19'
      })).to.be.deep.equal({
        source: 1461024000000
      });

    });

    let Test2 = new Model({
      money: {
        type: Number,
        unit: Model.Q
      }
    });

    it('parseMoney', function () {
      expect(Test2.parse({
        money: 32209.99
      })).to.be.deep.equal({
        money: 32.20999
      });
    });

    it('disposeMoney', function () {
      expect(Test2.dispose({
        money: 32.200
      })).to.be.deep.equal({
        money: 32200
      });
    });

  });



  describe('parse, dispose function', function () {

    let pdModel = new Model({
      parse: {
        type: Number,
        parse(data) {
          return data.id + 1
        }
      },
      dispose: {
        type: Number,
        parse(data) {
          return data.dispose * 10
        },
        dispose(data) {
          return data.dispose / 10
        }
      },
      id: 0
    });

    it('judge type object parse', function () {
      expect(pdModel.parse({id: 1, dispose: 10})).to.be.deep.equal({
        parse: 2,
        dispose: 100,
        id: 1,
      });
    });

    it('judge type object dispose', function () {
      expect(pdModel.dispose({
        id: 1, dispose: 10
      })).to.be.deep.equal({
        dispose: 1,
        id: 1
      });
    });

  });

}());
