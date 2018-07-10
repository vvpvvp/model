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


## Model Samples

**Basic.js**
``` javascript
import Model from "js-model";

let Basic = new Model({
    "id": 0,
    "source": {
        type: Date,
        format: 'l'  // use manba date format, "l": "YYYY-MM-DD",
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
        unit: Model.Q //money thousand
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
    "rate": 0.8, // use default value
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
    "salary": 10 //10000 conversion to a thousand units 
}
```

#### dispose
**Use1**: remove null property

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

basicValue: Consistent with the values converted from parse

``` javascript
{
	source: "2017-06-09T00:00:00+08:00",
	salary: 10000,
	rate: 0.1
}
```


## Advanced

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


## Recommend
- [manba](https://www.npmjs.com/package/manba): Date Format Plugin
- [heyui](https://www.npmjs.com/package/heyui): HeyUI component library


