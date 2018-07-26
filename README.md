# js-model
Data model for javascript

## 中文文档
[中文文档](https://github.com/vvpvvp/model/blob/master/README_zh.md)

## Install
### npm install
```sh
npm install js-model --save
```

## Model

### Column Define:
- **String**: "" || String
- **Number**: 0 || Number
- **Date**: Date
- **Array**: []
- **Object**: {}

### Default Parameter

```javascript
{
  // when use dispose data, remove empty array.
  removeEmptyArray: false,
  
  // when use parse data, remove null value.
  removeNull: false,
  
  // when use dispose data, remove null value from array.
  removeNullFromArray: false,
  
  // when use parse data, remove null value from object.
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

### Methods

- **parse**:   
    * **Fill property**: Creating a complete object data,  allows you to get rid of the boredom of {{a&&a.b?a.b.c:''}}
    * **Data conversion**: Data standardization conversion, when data is transferred from the background, the date is a timestamp, the amount is in unit, parse method is to help you convert time stamp to time string, the amount is converted in a certain unit, and also can help you to complete all the fields.
    * **Default value**: define default value

- **dispose**:  
    * When you need to transfer the data to the background, convert the date into a timestamp, convert the amount to the amount in the unit, standardize the data format, and delete the empty data.

    
    Example: the value modified by input is String, and is converted to digital format through dispose.


## Basic

**Basic.js**
``` javascript
import Model from "js-model";

let Basic = new Model({
    id: 0,
    source: {
        type: Date,
        format: 'l'  // use manba date format, "l": "YYYY-MM-DD",
    },
    description: "",
    tags: [ 0 ],
    companyId: "",
    rate: {
    	type: Number,
    	default: 0.8  // use default value, only effective for String, Number, Date
    },
    salary: {
        type: Number,
        unit: Model.Q // money transfor, a unit of 1000
    }
});
export default Basic;

```
### parse
**Usage 1**: fill property

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

**Usage 2**: conversion amount and date
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
**Usage 1**: remove null property

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

basicValue: Consistent with the values converted from parse

``` javascript
{
	source: "2017-06-09T00:00:00+08:00",
	salary: 10000,
	rate: 0.1
}
```


## Advanced

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

## Extend


### Single display and dispose


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

### Extend Model 

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

## Config


**manba-config.js**
The default is the ISO date format of the current time zone, for example: 2016-04-19T00:00:00+08:00
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


## Recommend
- [manba](https://www.npmjs.com/package/manba): Date Format
- [heyui](https://www.npmjs.com/package/heyui): 🎉UI Toolkit for Web, Vue2.0


