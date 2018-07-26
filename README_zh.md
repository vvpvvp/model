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

## 基本

**Basic.js**
``` javascript
import Model from "js-model";

let Basic = new Model({
    id: 0,
    source: {
        type: Date,
        format: 'l'  // 使用manba日期格式化, "l": "YYYY-MM-DD",
    },
    description: "",
    tags: [ 0 ],
    companyId: "",
    rate: {
    	type: Number,
    	default: 0.8  // 使用默认值，只对 String, Number, Date 类型的值有效。
    },
    salary: {
        type: Number,
        unit: Model.Q // 金额转换，此处单位为 千
    }
});
export default Basic;

```
### parse
**Usage 1**: 补充字段

``` javascript
import Basic from './Basic.js'
let basicValue = Basic.parse({});
```

basicValue: 
``` javascript
{
    id: null,
    source: null,
    description: null,
    tags: [],
    companyId: null,
    rate: 0.8, // use default value
    salary: null
}
```

**Usage 2**: 转换金额与日期
``` javascript
import Basic from './Basic.js'
let basicValue = Basic.parse({
	source: "2017-06-09T00:00:00+08:00",
	salary: 10000,
	rate: 0.1
});
```

**result**: 
``` javascript
{
    id: null,
    source: "2017-06-09",  //
    description: null,
    tags: [],
    companyId: null,
    rate: 0.1,
    salary: 10 //10000 conversion to a thousand units 
}
```

### dispose
**Usage 1**: 删除null值的属性，并转换金额与日期

``` javascript
import Basic from './Basic.js'
let basicValue = Basic.dispose({
	id: null,
	source: "2017-06-09",
	description: null,
	tags: [],
	companyId: null,
	rate: "0.1",
	salary: 10
});
```

**result**: 与从parse的值一致

``` javascript
{
	source: "2017-06-09T00:00:00+08:00",
	salary: 10000,
	rate: 0.1
}
```


## 进阶

```javascript

// Basic.js

let Basic = new Model({
    id: 0,
    companyId: "",
    rate: 0
});
export default Basic;


// Edu.js

let Edu = new Model({
    id: 0,
    major: "",
    school: ""
});
export default Edu;


// User.js

import Edu from "./Edu";
import Basic from "./Basic";
let User = new Model({
    basic: Basic,
    edu: [Edu]
});
export default User;

```

### parse
```javascript
import User from './User'
let user = User.parse({
    basic:{
        id:123123
    },
    edu:[{
        id: 12
    }],
})
```

**result**:
```javascript
{   
    basic: {
        id: 123123,
        companyId: null,
        rate: null
    },
    edu: [{
        id: 12,
        school: null
        major: null,
    }]
}
```

### dispose

``` javascript
import User from './User'

let user = User.dispose({
    basic:{
        id:123123,
        companyId: 123,
        rate: null
    },
    edu:[{
        id: 12,
        school: "school"
        major: null,
    }],
})
```

**result**:
```javascript
{   
    basic: {
        id:123123,
        companyId: 123,
    },
    edu: [{
        id: 12,
        school: "school"
    }]
}
```

## 扩展

### 单独编写display和dispose


``` javascript

const info = new InfoModel({
  salary: {
    type: Number,
    parse(data) {
        return data / 1000
    },
    dispose(data) {
        return data * 1000
    }
  },

});

info.parse({salary: 10000})
// {salary: 10}

info.parse({salary: 20})
// {salary: 20000}


```

### 继承Model 

``` javascript

class InfoModel extends Model {
  parse(data) {
    let  b = super.parse(data);
    if(b.imgUrls.type.length == 0) {
       b.imgUrls.type.push('http://*****')
    }
    return b;
  }

  dispose(data, param) {
     return super.dispose(data, param)
  }
}

const info = new InfoModel({
  imgUrls: {
    type: ['']
  },
});

info.parse({})


```

**result**:
```javascript
{
  imgUrls: {
    type: ['http://*****']
  },
}
```

## 配置


**manba-config.js**
默认的日期转换是使用当前时区的ISO日期格式, 比如: 2016-04-19T00:00:00+08:00
```javascript
import Model from 'js-model';
// Redefining the format of the date conversion
Model.config({
  disposeDateFormat(date) {
    // change to use timestamp
    return manba(date).time();
  }
})
```

## 相关推荐
- [manba](https://www.npmjs.com/package/manba): 日期格式化工具
- [heyui](https://www.npmjs.com/package/heyui): HeyUI组件库



