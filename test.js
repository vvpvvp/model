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
        type: Model.DATE
    },
    "description": {
        type:Model.STRING,
        format: FORMAT.GET
    },
    "tags": [
        0
    ],
    "companyId": {
        type:Model.STRING,
        default:"测试"
    },
    "rate": {
        type:Model.NUMBER,
        computed:function(data){
            console.log(data.rateFrom);
            return data.rateFrom+3;
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


let value = User.parse({
        basic:{
            id:"123123",
            source:"Tue Apr 19 2016 21:46:11 GMT+0800 (CST)",
            tags:[
                "12","32"
            ],
            rateFrom:1
        }
    });

    console.log(value)
console.log(User.dispose(
    value
    )
);