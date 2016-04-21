
# momentjs
超级简洁的日期处理Util，比moment.js小很多。
![momentjs](https://img.shields.io/badge/momentjs-1.1.0-red.svg)

##安装
```
npm install momentjs
```
建议本地安装

```
npm install --save momentjs
```
##文档
###初始化数据

初始化的时候，对月份做了修补。

`moment(String|Number|Date|Array)`

```javascript
moment(1459235037).format() //秒 2016-03-29
moment(1459235037000).format() //毫秒 2016-03-29
moment([2016,12,23,4,3,5]).format("f") 
//月份自动补充，执行：new Date(2016,11,23,4,3,5) 2016-12-23 04:03:05
moment([2015,12,3]).format("f") 
//执行：new Date(2015,11,3) 2015-12-03
moment("2014-12-03").format("f") //2014-12-03 00:00:00
moment("2014-12-03 12:34").format("f") //2014-12-03 12:34:00
moment("2014-12-03 12:34:12").format("f") //2014-12-03 12:34:34
moment("20141203").format("f") //2014-12-03 00:00:00
moment("201412031223").format("f") //2014-12-03 12:23:00
```

###format
格式化日期转换标准
- YYYY/yyyy:年份
- M:月份
- MM:月份，个位补充0
- D/d:天数
- DD/dd:天数，个位补充0
- H/h:小时
- HH/hh:小时，个位补充0
- m:分钟
- mm:分钟，个位补充0
- S/s:秒数
- SS/ss:秒数，个位补充0
- w:星期，返回中文：['日', '一', '二', '三', '四', '五', '六']
- q:上下午，返回中文：['上午', '下午']

####内置简洁的格式化
- "l": "YYYY-MM-DD",
- "ll": "YYYY年MM月DD日",
- "k": "YYYY-MM-DD hh:mm",
- "kk": "YYYY年MM月DD日 hh点mm分",
- "kkk": "YYYY年MM月DD日 hh点mm分 q",
- "f": "YYYY-MM-DD hh:mm:ss",
- "ff": "YYYY年MM月DD日 hh点mm分ss秒",
- "fff": "YYYY年MM月DD日 hh点mm分ss秒 星期w",
- "n": "MM-DD",
- "nn": "MM月DD日",

```javascript
//各种format
moment() // Tue Mar 29 2016 16:52:56 GMT+0800 (CST)
moment().toString() // Tue Mar 29 2016 16:52:56 GMT+0800 (CST)
moment().format() // 2016-03-29
moment().format("l") // 2016-03-29
moment().format("ll") // 2016年03月29日
moment().format("k") // 2016-03-29 16:52
moment().format("kk") // 2016年03月29日 16点52分
moment().format("kkk") // 2016年03月29日 16点52分 下午
moment().format("f") // 2016-03-29 16:52:56
moment().format("ff") // 2016年03月29日 16点52分56秒
moment().format("fff") // 2016年03月29日 16点52分56秒 星期二
moment().format("n") // 03-29
moment().format("nn") // 03月29日
moment().format("YYYY") // 2016
```
####定制简洁格式

```javascript
moment({
    formatString: {
        "r": "YYYY"
    }
}

moment().format("r") // 2016

```

###获取数值函数
`month()`方法，对月份做了修补。

```javascript
moment().year() //2016
moment().year(2018).format() //2018-03-29
moment().month() //2016-03-29
moment().month(4).format() //2016-04-29
moment().minutes() //59
moment().minutes(34)
moment().time() //1459242450800
moment().time(123131312321).format() //1973-11-26
moment().date() //29
moment().date(4).format() //2016-03-04
moment().isLeapYear() //是否为闰年 true
```
###distance

`moment.distance(Moment|String|Number|Date|Array,Moment.TYPE)`

```javascript
moment("2012-09-21").distance("2012-09-20 23:59:59") 
//两个日期间相隔天数，纠正日期计算偏差 1

moment("2012-09-21").distance("2012-09-20 23:59:59",moment.DAY) 
//两个日期间相隔天数 1

moment("2012-09-21").distance("2012-08-20 23:59:59",moment.MONTH) 
//两个日期间相隔月数 1

moment("2012-09-21").distance("2011-09-20 23:59:59",moment.YEAR) 
//两个日期间相隔年数 1

```
###add
`add`方法，对日期做加减法，只有add函数，如果需要减法，则传递负数。
`moment.add(Number,Moment.TYPE)`

```javascript
moment("2012-10-03 23:59:59").add(1,moment.DAY).format("fff")
//2012年10月04日 23点59分59秒 星期四

moment("2012-10-03 23:59:59").add(-1,moment.DAY).format("fff")
//2012年10月02日 23点59分59秒 星期二

moment("2012-10-03 23:59:59").add(26,moment.MONTH).format("fff")
//2014年12月03日 23点59分59秒 星期三

moment("2012-10-03 23:59:59").add(-1,moment.YEAR).format("fff")
//2011年10月03日 23点59分59秒 星期一

moment("2012-10-03 23:59:59").add(1,moment.MINUTE).format("ff")
//2012年10月04日 00点00分59秒
```

###startOf
`startOf`方法，对日期做一定规则的减法。  
`moment.startOf(Moment.TYPE)`

```javascript
moment("2012-10-03 23:59:59").startOf(moment.DAY).format("fff")
//2012年10月03日 00点00分00秒 星期三

moment("2012-10-03 23:59:59").startOf(moment.YEAR).format("fff")
//2012年01月01日 00点00分00秒 星期日

moment("2012-10-03 23:59:59").startOf(moment.MONTH).format("fff")
//2012年10月01日 00点00分00秒 星期一

moment("2012-10-03 23:59:59").startOf(moment.HOUR).format("fff")
//2012年10月03日 15点00分00秒 星期三
```


###endOf
`endOf`方法，对日期做一定规则的加法。  
`moment.endOf(Moment.TYPE)`

```javascript
moment("2012-10-03 23:59:59").endOf(moment.DAY).format("ff")
//2012年10月03日 23点59分59秒

moment("2012-10-03 23:59:59").endOf(moment.YEAR).format()
//2012-12-31

moment("2012-10-03 23:59:59").endOf(moment.MONTH).format()
//2012-10-31
```

