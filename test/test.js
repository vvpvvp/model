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
    "source": {
      type: Model.DATE
    },
    "description": {
      type: Model.STRING,
      format: FORMAT.GET
    },
    "tags": [
      0
    ],
    "companyId": {
      type: Model.STRING,
      default: "测试"
    },
    "rate": {
      type: Model.NUMBER,
      computed: function (data) {
        console.log(data.rateFrom);
        return data.rateFrom + 3;
      }
    },
    "id": 0
  });


  let Edu = new Model({
    "startTime": {
      type: Model.DATE,
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

  describe('model', function () {


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


    it('dispose post data', function () {
      expect(User.dispose(value)).to.be.deep.equal({
        edu: [],
        basic: {
          companyId: '测试',
          rate: NaN,
          id: 123123,
          source: '2016-04-18T16:00:00.000Z',
          tags: [12, 32]
        }
      });
    });
  });

}());
