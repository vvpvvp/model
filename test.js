"use strict;"
let Model = require("./build/model");
const FORMAT = {
    L: "l",
    LL: "ll",
    KK: "k",
    GET:function(data){
        return "get"+data;
    }
}

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