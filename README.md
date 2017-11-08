# Model
Model for javascript

## Install
### npm install
```sh
npm install js-model
```

## Recommend
- [manba](https://www.npmjs.com/package/manba): Date Format Plugin

## Model

### 字段定义:
- "": **String**
- 0: **Number**
- Model.DATE: **Date**
- []: **Array**
- {}: **Object**

### 方法

- **parse**:   
    当数据从后台传输过来的时候，日期是时间戳，金额是以元为单位，数据是不全的，因为只传递了有值的数据。  
    parse方法是帮你转换时间戳至时间字符串，金额以一定单位转换好，并帮你补全好所有的字段。  

    补全了所有数据，让你摆脱{{a&&a.b&&a.c?a.b.c:''}}这种无聊的判断了  

- **dispose**:  
    当你需要把数据传送至后台之前，把日期转换成时间戳，把金额转换为以元为单位的数额，标准化数据格式，删除为空的数据。

    例：通过input修改的数值为String, 通过dispose转换成数字格式。


## Default Param

```javascript
{
  //dispose的时候移除空数组
  removeEmptyArray: false,
  //parse的时候移除null数据
  removeNull: false,
  //移除null数据从数组中
  removeNullFromArray: false,
  //从子对象中移除空对象
  removeEmptyObject: true,
}
```

## Const

```javascript

  Model.DATE // date format
  Model.NUMBER //number format
  Model.STRING //string format
  Model.BOOLEAN //boolean format
  Model.S // money ten 十
  Model.B // money hundred 百
  Model.Q // money thousand 千
  Model.W //money ten thousand 万
  Model.SW // money one hundred thousand 十万
  Model.BW // money million 百万
  Model.QW // money ten million 千万
  Model.Y // money billion 亿
```
## Code

**manba-config.js**

```javascript
import Model from 'js-model';

//重新定义dispose时日期转换的格式
//默认为8时区的ISO日期格式，例：2016-04-19T00:00:00+08:00
Model.config({
  disposeDateFormat(date) {
    return manba(date).time();
  }
})
```

**format.js**
```javascript

// manba
// "l": "YYYY-MM-DD",
// "ll": "YYYY年MM月DD日",
// "k": "YYYY-MM-DD hh:mm",
const FORMAT = {
    DAY: "l",
    LL: "ll",
    MINUTE: "k",
    MONTH: 'YYYY-MM',
    GET:function(data){
        return "get"+data;
    }
}
export default FORMAT;
```


**Basic.js**
```javascript
import FORMAT from "./format";
import Model from "js-model";
let Basic = new Model({
    "source": {
        type: Model.DATE,
        format: FORMAT.DAY
    },
    "description": '',
    "tags": [
        0
    ],
    "companyId": "",
    "rate": 0,
    "salary": {
        type: Model.NUMBER,
        unit: Model.Q
    },
    "id": 0
});
export default Basic;
```

**Edu.js**
```javascript
let Edu = new Model({
    "startTime": {
        type: Model.DATE,
        format: FORMAT.MINUTE
    },
    "endTime": {
        type: Model.DATE,
        format: FORMAT.MINUTE
    },
    "degree": 0,
    "major": "",
    "school": "",
    "takeTime": "",
    "id": ""
});
export default Edu;
```

**User.js**
```javascript
import Model from "js-model";
import Edu from "./Edu";
import Basic from "./Basic";
let User = new Model({
    "basic": Basic,
    "edu": [Edu]
});
export default User;
```


**test.js**
```javascript
import User from './User'
console.log(User.parse({
    basic:{
        id:123123,
        source: "Tue Apr 19 2016 21:46:11 GMT+0800 (CST)",
        tags:[
            "123", "132"
        ],
        description:"abcdefg",
        salary:100000
    },
    edu:[{
        "startTime": "Tue Apr 19 2016 21:46:11 GMT+0800 (CST)",
        "takeTime": "",
        "id": ""
    }],
}))
console.log(User.dispose({
    basic:{
        id:123123,
        source: "2017-06-09",
        tags:[
            123,132
        ],
        description:"abcdefg",
        salary:100000
    },
    edu:[{
        "startTime": "2017-06-10",
        "id": ""
    }],
})
);
```

**result**:
```javascript

//parse
{   
    basic: {
        companyId: null
        description: "abcdefg"
        id: 123123
        rate: null
        salary: 100
        source: "2016-04-19",
        tags: [123, 132]
    },
    edu: [
        {
            degree: null
            endTime: null
            id: null
            major: null
            school: null
            startTime: "2016-04-19 21:46"
            takeTime: null
        }
    ]
}

//dispose
{   
    basic: {
        description: "abcdefg"
        id: 123123
        salary: 100000000
        source: "2016-04-19T21:46:11+08:00"
        tags: [123, 132]
    },
    edu: [
        {
            startTime: "2016-04-19T21:46:11+08:00"
        }
    ]
}
```