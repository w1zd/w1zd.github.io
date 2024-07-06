---
title: JavaScript深拷贝实现
date: "2016-10-08T19:02:29.284Z"
tags:
- JavaScript
- Front-end
categories:
- 技术文章
description: 深拷贝和浅拷贝在很多语言中都会涉及到，在JavaScript当中，没有现成的可以直接实现深拷贝的方法，虽然我们可以使用jQuery当中提供的`extend`方法，但是这个方法有一定的局限性，所以本文主要研究JavaScript当中深拷贝的实现。
toc: true
---

在实际开发当中，我们经常会遇到要对对象进行深拷贝的情况。而且深拷贝这个问题在面试过程中也经常会遇到，下面就对本人在学习过程中的收获，做以简单的总结。

## 什么是浅拷贝，什么是深拷贝？
### 什么是浅拷贝
关于浅拷贝的概念，我在网上看到一种说法，直接上代码。
```javascript
var person = {name: "Jason", age: 18, car: {brand: "Ferrari", type: "430"}};
var person1 = person; 		//他们认为这是浅拷贝
```
但是我个人认为，上面这个根本不涉及拷贝，只是一个简单的引用赋值。以我的理解，浅拷贝应该是不考虑对象的引用类型的属性，只对当前对象的所有成员进行拷贝，代码如下：
```javascript
function copy(obj){
	var objCopy = {};
	for(var key in obj){
		objCopy[key] = obj[key];
	}
	return objCopy;
}

var person = {name: "Jason", age: 18, car: {brand: "Ferrari", type: "430"}};
var personCopy = copy(person);
```
上面这段代码中，`person`对象拥有两个基本类型的属性`name`和`age`，一个引用类型的属性`car`，当使用如上方法进行拷贝的时候，`name`和`age`属性会被正常的拷贝，但是`car`属性，只会进行引用的拷贝，这样会导致拷贝出来的对象`personCopy`和`person`会共用一个`car`对象。这样就是所谓的浅拷贝。

### 什么是深拷贝

深拷贝的就是在拷贝的时候，需要将当前要拷贝的对象内的所有引用类型的属性进行完整的拷贝，也就是说拷贝出来的对象和原对象之间没有任何数据是共享的，所有的东西都是自己独占的一份。

## 如何实现深拷贝
### 实现深拷贝需要考虑的问题
实现深拷贝需要考虑如下几个因素：
* 传入的对象是使用对象字面量`{}`创建的对象还是由构造函数生成的对象
* 如果对象是由构造函数创建出来的，那么是否要拷贝原型链上的属性
* 如果要拷贝原型链上的属性，那么如果原型链上存在多个同名的属性，保留哪个
* 处理循环引用的问题

### 第三方库实现深拷贝

#### jQuery的$.extend()
我们可以通过`$.extend()`方法来完成深复制。值得庆幸的是，我们在`jQuery`中可以通过添加一个参数来实现递归`extend`。调用`$.extend(true, {}, ...)`就可以实现深复制，参考下面的例子:
```javascript
var x = {
    a: 1,
    b: { f: { g: 1 } },
    c: [ 1, 2, 3 ]
};

var y = $.extend({}, x),          //shallow copy
    z = $.extend(true, {}, x);    //deep copy

y.b.f === x.b.f       // true
z.b.f === x.b.f       // false
```

但是jQuery的这个`$.extend()`方法，有弊端，什么弊端呢？我们看下面的例子：
```javascript
var objA = {};
var objB = {};

objA.b = objB;
objB.a = objA;

$.extend(true,{},a);

//这个时候就出现异常了
//Uncaught RangeError: Maximum call stack size exceeded(…)
```
也就是说，jQuery中的`$.extend()`并没有处理循环引用的问题。

### 使用JSON对象实现深拷贝
使用`JSON`全局对象的`parse`和`stringify`方法来实现深复制也算是一个简单讨巧的方法。
```javascript
function jsonClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}
var clone = jsonClone({ a:1 });
```

然而使用这种方法会有一些隐藏的坑，它能正确处理的对象只有 `Number`, `String`, `Boolean`, `Array`, 扁平对象，即那些能够被 json 直接表示的数据结构。


### 自己造轮子
下面我们给出一个简单的解决方案，当然这个方案是参考别人的方式来实现的。希望对大家有用。

```javascript
var clone = (function() {
	//这个方法用来获取对象的类型 返回值为字符串类型 "Object RegExp Date Array..."
	var classof = function(o) {
		if (o === null) {
			return "null";
		}
		if (o === undefined) {
			return "undefined";
		}
		// 这里的Object.prototype.toString很可能用的就是Object.prototype.constructor.name
		// 这里使用Object.prototype.toString来生成类型字符串
		var className = Object.prototype.toString.call(o).slice(8, -1);
		return className;
	};

	//这里这个变量我们用来存储已经保存过的属性，目的在于处理循环引用的问题
	var references = null;

	//遇到不同类型的对象的处理方式
	var handlers = {
		//正则表达式的处理
		'RegExp': function(reg) {
			var flags = '';
			flags += reg.global ? 'g' : '';
			flags += reg.multiline ? 'm' : '';
			flags += reg.ignoreCase ? 'i' : '';
			return new RegExp(reg.source, flags);
		},
		//时间对象处理
		'Date': function(date) {
			return new Date(+date);
		},
		//数组处理 第二个参数为是否做浅拷贝
		'Array': function(arr, shallow) {
			var newArr = [],
			i;
			for (i = 0; i < arr.length; i++) {
				if (shallow) {
					newArr[i] = arr[i];
				} else {
					//这里我们通过reference数组来处理循环引用问题
					if (references.indexOf(arr[i]) !== -1) {
						continue;
					}
					var handler = handlers[classof(arr[i])];
					if (handler) {
						references.push(arr[i]);
						newArr[i] = handler(arr[i], false);
					} else {
						newArr[i] = arr[i];
					}
				}
			}
			return newArr;
		},
		//正常对象的处理 第二个参数为是否做浅拷贝
		'Object': function(obj, shallow) {
			var newObj = {}, prop, handler;
			for (prop in obj) {
				//关于原型中属性的处理太过复杂，我们这里暂时不做处理
				//所以只对对象本身的属性做拷贝
				if (obj.hasOwnProperty(prop)) {
					if (shallow) {
						newObj[prop] = obj[prop];
					} else {
						//这里还是处理循环引用的问题
						if (references.indexOf(obj[prop]) !== -1) {
							continue;
						}
						
						handler = handlers[classof(obj[prop])];
						//如果没有对应的处理方式，那么就直接复制
						if (handler) {
							references.push(obj[prop]);
							newObj[prop] = handler(obj[prop], false);
						} else {
							newObj[prop] = obj[prop];
						}
					}
				}
			}
			return newObj;
		}
	};

	return function(obj, shallow) {
		//首先重置我们用来处理循环引用的这个变量
		references = [];
		//我们默认处理为浅拷贝
		shallow = shallow === undefined ? true : false;
		var handler = handlers[classof(obj)];
		return handler ? handler(obj, shallow) : obj;
	};
}());

(function() {
	//下面是一些测试代码
	var date = new Date();
	var reg = /hello word/gi;
	var obj = {
		prop: 'this ia a string',
		arr: [1, 2, 3],
		o: {
			wow: 'aha'
		}
	};
	var refer1 = {
		arr: [1, 2, 3]
	};
	var refer2 = {
		refer: refer1
	};
	refer1.refer = refer2;

	var cloneDate = clone(date, false);
	var cloneReg = clone(reg, false);
	var cloneObj = clone(obj, false);
	alert((date !== cloneDate) && (date.valueOf() === cloneDate.valueOf()));
	alert((cloneReg !== reg) && (reg.toString() === cloneReg.toString()));
	alert((obj !== cloneObj) && (obj.arr !== cloneObj.arr) && (obj.o !== cloneObj.o) && (JSON.stringify(obj) === JSON.stringify(cloneObj)));

	clone(refer2, false);
	alert("I'm not dead yet!");
	// Output:
	// true
	// true
	// true
	// I'm not dead yet!
}());
```
