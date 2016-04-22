# model
Model for javascript


##Install
###npm install
```
npm install js-model
```

###Download
```
git clone https://github.com/vvpvvp/model
```

##recommend
- [momentjs](https://www.npmjs.com/package/momentjs): Date Format Plugin

##Model

###Description:
- ""||Model.STRING: **String**
- 0||Model.NUMBER: **Number**
- Model.DATE: **Date**，default format is momentjs().format()=>'YYYY-MM-DD'
- []: **Array**, and the first element mean array's type
- {}: **Object**

###Format:
- FORMAT.LL: It's a short format string, and the value will format by momentjs
- Function: this property will be a object such as:
```javascript
{
    value:0,
    show:"本科"
}
```

###function

- **parse**:   
    Parse object or array translate to a standard data for use in template.  
    It will add the missing property to data, and according the model define add the show property. 
- **dispose**:  
    Parse object or array data to a standard data for submit to server.  
    It will not add the other property to the data, and translate some string to date or number.
    For example: "2012-01-23" => "Mon Jan 23 2012 08:00:00 GMT+0800 (CST)"

##Code

**format.js**
```javascript

// "l": "YYYY-MM-DD",
// "ll": "YYYY年MM月DD日",
// "k": "YYYY-MM-DD hh:mm",
const FORMAT = {
    L: "l",
    LL: "ll",
    KK: "k",
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
        format: FORMAT.LL
    },
    "description": {
        type:Model.STRING,
        format: FORMAT.GET
    },
    "tags": [
        0
    ],
    "companyId": "",
    "rate": 0,
    "id": 0
});
export default Basic;
```

**Edu.js**
```javascript
import FORMAT from "./format";
import Model from "js-model";
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
export default Edu;
```

**User.js**
```javascript
import Model from "js-model";
import Edu from "./Edu";
import Basic from "./Basic";
let User = new Model({
    "basic": Basic,
    "bind": {},
    "edu": [Edu]
});
export default User;
```


**test.js**
```javascript
import User from './User'
console.log(User.parse(
    {
        basic:{
            id:123123,
            source:"Tue Apr 19 2016 21:46:11 GMT+0800 (CST)",
            tags:[
                123,132
            ],
            description:"abcdefg"
        }
    })
);
console.log(User.dispose(
    {
        basic:{
            id:"123123",
            source:"2013-04-09",
            tags:[
                "12","32"
            ]
        }
    })
);
```

**result**:
```javascript
{ basic: 
   { source: { value: [Object], show: '2016年04月19日' },
     description: { value: 'abcdefg', show: 'getabcdefg' },
     tags: [ 123, 132 ],
     companyId: null,
     rate: null,
     id: 123123 },
  bind: null,
  edu: null }
{ basic: 
   { id: 123123,
     source: 'Tue Apr 09 2013 00:00:00 GMT+0800 (CST)',
     tags: [ 12, 32 ] } }
```