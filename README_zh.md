# js-model
为javascript准备的数据模型工具

## 安装
### npm安装
```sh
npm install js-model --save
```
## Model

### 字段定义:
- **String**: "" || String
- **Number**: 0 || Number
- **Date**: Date
- **Array**: []
- **Object**: {}

### Default Parameter

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

### Const

```javascript
  Model.S // money ten 十
  Model.B // money hundred 百
  Model.Q // money thousand 千
  Model.W //money ten thousand 万
  Model.SW // money one hundred thousand 十万
  Model.BW // money million 百万
  Model.QW // money ten million 千万
  Model.Y // money billion 亿
```

### 方法

- **parse**:   
    * 创建完整对象数据，让你摆脱{{a&&a.b?a.b.c:''}}这种无聊的判断了
    * 数据标准化转换，当数据从后台传输过来的时候，日期是时间戳，金额是以元为单位，parse方法是帮你转换时间戳至时间字符串，金额以一定单位转换好，并且可以帮助你补全好所有的字段。  

- **dispose**:  
    * 当你需要把数据传送至后台之前，把日期转换成时间戳，把金额转换为以元为单位的数额，标准化数据格式，删除为空的数据。

    
    例：通过input修改的数值为String, 通过dispose转换成数字格式。

## Model 样例

**Basic.js**
``` javascript
import Model from "js-model";

let Basic = new Model({
    "id": 0,
    "source": {
        type: Date,
        format: 'l'  // 使用manba日期格式化, "l": "YYYY-MM-DD",
    },
    "description": "",
    "tags": [ 0 ],
    "companyId": "",
    "rate": {
    	type: Number,
    	default: 0.8
    },
    "salary": {
        type: Number,
        unit: Model.Q //金额，千为单位
    }
});
export default Basic;
```
#### parse
**Use1**: fill property

``` javascript
import Basic from './Basic.js'
let basicValue = Basic.parse({});
```

basicValue: 
``` javascript
{
    "id": null,
    "source": null,
    "description": null,
    "tags": [],
    "companyId": null,
    "rate": 0.8, // 使用定义的默认值
    "salary": null
}
```

**Use2**: conversion amount and date
``` javascript
import Basic from './Basic.js'
let basicValue = Basic.parse({
	source: "2017-06-09T00:00:00+08:00",
	salary: 10000,
	rate: 0.1
});
```

basicValue: 
``` javascript
{
    "id": null,
    "source": "2017-06-09",
    "description": null,
    "tags": [],
    "companyId": null,
    "rate": 0.1,
    "salary": 10 //10000 转换为10千
}
```

#### dispose
**Use1**: 删除空属性

``` javascript
import Basic from './Basic.js'
let basicValue = Basic.dispose({
	"id": null,
	"source": "2017-06-09",
	"description": null,
	"tags": [],
	"companyId": null,
	"rate": "0.1",
	"salary": 10
});
```

basicValue: 转换日期与金额，字符串

``` javascript
{
	source: "2017-06-09T00:00:00+08:00",
	salary: 10000,
	rate: 0.1
}
```


## Advanced

**manba-config.js**  
默认的日期转换是使用当前时区的ISO日期格式, 比如: 2016-04-19T00:00:00+08:00
```javascript
import Model from 'js-model';

// 重新定义日期转换
Model.config({
  disposeDateFormat(date) {
    // 改成使用时间戳
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
    MONTH: 'YYYY-MM'
}
export default FORMAT;
```


**Basic.js**
```javascript
import FORMAT from "./format";
import Model from "js-model";
let Basic = new Model({
    "source": {
        type: Date,
        format: FORMAT.DAY
    },
    "description": '',
    "tags": [
        0
    ],
    "companyId": "",
    "rate": 0,
    "salary": {
        type: Number,
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
        type: Date,
        format: FORMAT.MINUTE
    },
    "endTime": {
        type: Date,
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


**parse**
```javascript
import User from './User'
let user = User.parse({
    basic:{
        id:123123,
        source: 1461024000000,
        tags:[
            "123", "132"
        ],
        description:"abcdefg",
        salary:100000
    },
    edu:[{
        "startTime": 1461073560000,
        "takeTime": "",
        "id": ""
    }],
})
```

**result**:
```javascript
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
```

**dispose**
``` javascript
import User from './User'

let user = User.dispose({
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
        "startTime": "2017-06-10 08:00",
        "id": ""
    }],
})
```

**result**:
```javascript
{   
    basic: {
        description: "abcdefg"
        id: 123123
        salary: 100000000
        source: 1496966400000
        tags: [123, 132]
    },
    edu: [
        {
            startTime: 1497052800000
        }
    ]
}
```

## 相关推荐
- [manba](https://www.npmjs.com/package/manba): 日期格式化工具
- [heyui](https://www.npmjs.com/package/heyui): HeyUI组件库



