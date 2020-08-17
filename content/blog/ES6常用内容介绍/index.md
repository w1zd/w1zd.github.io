---
title: ES6常用内容介绍
date: "2018-01-22T23:00:23.284Z"
tags: 
- JavaScript
- ES6
categories:
- JavaScript
description: ES6的普及度越来越高，本文主要介绍ES6中最常见的内容及其使用方式。
---


## 变量声明- let、const

### let

- ES6 新增了let命令，用来声明变量。它的用法类似于var，但是所声明的变量，只在let命令所在的代码块内有效。

- `let`特点：
  - 1 块级作用域（ES6）
  - 2 先声明再使用
  - 3 不允许重复声明

```js
/* 基本使用 */
let num = 2

{
  let num = 9
}
console.log(num)
```

### const

- const声明一个**只读的常量**。一旦声明，常量的值就不能改变。
- const的作用域与let命令相同：只在声明所在的块级作用域内有效

```js
const PI = 3.1415
console.log(PI) // 3.1415

// 修改 常量的值 会报错
PI = 3 // TypeError: Assignment to constant variable.

// 可以修改对象中属性的值
const user = { name: 'rose' }
user.name = 'jack'
```

## 字符串模板

- 说明：代替原始的字符串拼接

```js
const num = 1

// ${} 中可以使用JS表达式
let dv = `<div>${num}</div>`
```

## 箭头函数

- [ES6箭头函数](http://es6.ruanyifeng.com/#docs/function)
- 注意 1：函数体内的this对象，就是定义时所在的对象（一般是外层函数中的this）
- 注意 2：无法使用arguments，没有arguments对象
- 注意 3：不能当作构造函数，不能使用new创建对象
- 注意：**不要在Vue的选项属性或回调上使用箭头函数**
  - 比如：`created: () => console.log(this.a)` 或 `vm.$watch('a', newValue => this.myMethod())`

```js
/* 语法： */
var fn = arg => arg

// 上面的箭头函数等同于：
var fn = function (arg) {
  return arg
}

var fn = () => {
  console.log('随机内容')
}
// 等同于：
var fn = function () {
  console.log('随机内容')
}
```

## rest参数

- ES6 引入 rest 参数（形式为...变量名），用于获取函数的多余参数，这样就不需要使用arguments对象了
- 说明：rest 参数的类型是：数组
- 注意：rest 参数之后不能再有其他参数（即只能是最后一个参数），否则会报错

```js
function add(...values) {
  var sum = 0
  values.forEach(function(val) {
    sum += val
  })
  return sum
}

add(2, 5, 3) // 10


// 报错
function f(a, ...b, c) {
  // ...
}
```

## 解构赋值

- [ES6解构](http://es6.ruanyifeng.com/#docs/destructuring)
- ES6 允许按照一定模式，从数组和对象中提取值，对变量进行赋值，这被称为解构（Destructuring）。

```js
// 对象解构
var { foo, bar } = { foo: "aaa", bar: "bbb" }
foo // "aaa"
bar // "bbb"

// 数组解构
var [a, b, c] = [1, 2, 3]

// 函数参数的解构赋值
function foo({x, y}) {
  console.log(x, y)
}

foo({x: 1, y: 2}) // 1 2
```

## 对象简化语法

- 对象中的属性和方法，都可以使用简化语法

```js
/* 属性的简化语法： */
var foo = 'bar'
var baz = {foo}

// 等同于
var baz = {foo: foo}


/* 方法的简化语法： */
var o = {
  method() {
    return "Hello!"
  }
}
// 等同于
var o = {
  method: function() {
    return "Hello!"
  }
}
```

### 属性名表达式

- ES6 允许字面量定义对象时，用表达式作为对象的属性名，即把表达式放在方括号内。

```js
var propKey = 'foo'
var methodKey = 'bar'

var obj = {
  [propKey]: true,
  ['a' + 'bc']: 123,
  [methodKey]() {
    return 'hi'
  }
}
```

## class关键字

- ES6以前，JS是没有class概念的，而是通过构造函数+原型的方式来实现的
- 注意：ES6中的class仅仅是一个语法糖，并不是真正的类，与Java等服务端语言中的类是有区别的
- [ES6 - 文档](http://es6.ruanyifeng.com/#docs/class)

```js
class Person {
  constructor() {
    // 实例属性
    this.name = 'jack'
  }

  // 实例方法
  say() {}

  // 静态方法
  static coding() {}
}
// 静态属性
Person.age = 0

console.log(Person.age)
```

- 类继承：
  - 1 如果子类提供了 constructor，那么，必须要调用`super()`
  - 2 子类添加属性，必须在 super() 调用后面

```js
// 类继承：
class Chinese extends Person {
  constructor(name, gender, weight) {
    super(name, gender)

    this.weight = weight
  }
}

const ch = new Chinese('小明', '男', 130)
```

### 静态属性和实例属性

- 静态属性：直接通过类名访问
- 实例属性：通过实例对象访问

## ES6模块化 - import和export

- [导入和导出](http://blog.csdn.net/DeepLies/article/details/52916221?locationNum=13&fps=1)
- `import`：导入模块
- `export`：导出模块

- 注意1：`export default` 每个模块只能使用一次
- 注意2：`export` 每个模块可以使用多次
- 注意3：一个模块可以导出多个内容，`export default` 和 `export` 可以一起使用

```js
// main.js
// 导入 default 内容，可自定义导入名称
// import num from './a.js'
import num1 from './a.js'

// a.js
const num = 123
export default num
```

```js
// main.js
// 导入 export内容
// 注意：导入非default模块内容（str、fn），必须与 导出名称 相同，或者通过 as 修改
// 注意：必须使用花括号
import { str, fn } from './b'

// 加载并修改变量名
// import { str as str1, fn } from './b'
// 整体加载
// import * as bModule from './b'

// b.js
export const str = 'abc'
export function fn() {}
```

```js
// main.js
import { str, fn } from './b'

// b.js
const str = 'abc'
function fn() {}
// 一次性导出
export { str, fn }
```

## 数组扩展运算符

- 扩展运算符（spread）是三个点（...）。作用：将一个数组转为用逗号分隔的参数序列

```js
var arr = ['a', 'b', 'c']
console.log(...arr)

// 上面这句代码相当于：
console.log(arr[0], arr[1], arr[2]);
```

## 对象扩展运算符

- 注意：该语法不是真正的ES规范，需要使用`stage-2`解析

```js
var obj = {name: 'jack', age: 19}
var o = {...obj, gender: 'male'}
// o => {name: 'jack', age: 19, gender: 'male'}
```

## Promise 异步编程

- [ES6 - Promise](http://es6.ruanyifeng.com/#docs/promise)
- Promise是一种对尚未返回的数据的一种承诺
- `promise`：承诺、保证

### 介绍

```html
Promise 是异步编程的一种解决方案，比传统的解决方案`回调函数和事件`更合理和更强大
Promise 将异步操作以同步操作（链式编程）的流程表达出来，避免了层层嵌套的回调函数（回调地狱的问题）
```

- 所谓Promise，简单说就是一个容器，里面保存着某个未来才会结束的事件（通常是一个异步操作）的结果。

- Promise对象代表一个异步操作，有三种状态：**pending（进行中）**、**fulfilled（已成功）**和**rejected（已失败）**
  - 状态改变 1：pending -> fufilled
  - 状态改变 2：pending -> rejected
  - **一旦状态改变，就不会再变**

### 基本使用

```js
// Promise 是一个构造函数
// 通过 new 创建Promise的实例对象
var promise = new Promise(function(resolve, reject) {
  // ... some code

  if (/* 异步操作成功 */) {
    resolve(value)
  } else {
    reject(error)
  }
})
```

### then 和 catch

- `then()`： 用于指定异步操作成功时的回调函数
- `catch()`：用于指定发生错误时的回调函数
- 说明：`then()`方法可以有多个，按照先后顺序执行，通过回调函数返回值传递数据给下一个then

```js
let promise = new Promise(function(resolve, reject) {
  console.log('1 Promise');
  // 异步操作
  setTimeout(resolve, 1000, 'done');
});

promise.then(function() {
  console.log('3 resolved.');
});

console.log('2 Hi!');
```

- 异步读取图片示例：

```js
const loadImageAsync = function(url) {
  return new Promise(function(resolve, reject) {
    const image = new Image()
    image.src = url

    // 图片加载成功
    image.onload = function() {
      resolve(image)
    }

    // 图片加载失败
    image.onerror = function() {
      reject(new Error('Could not load image at ' + url))
    }
  })
}

// 推荐方式：
loadImageAsync('url')
  // 成功处理
  .then(function(value) {})
  // 错误处理
  .catch(function(err) {})

// 其他方式：
loadImageAsync('url')
  .then(function(value) {
    // 成功，value 获取到 图片对象（image）
  }, function(error) {
    // 失败，error 获取到 错误信息
  });
```

### all 和 race

```js
// 所有请求发送成功：
const p = Promise.all([
  axios('http://vue.studyit.io/api/getlunbo'),
  axios('http://vue.studyit.io/api/getnewslist')
])

p.then(function (res) {
  // res 是 all() 方法中所有异步操作的结果
  console.log('两个异步请求完成：', res);
})

// 哪个请求先发送成功：
const p = Promise.race([
  axios('http://vue.studyit.io/api/getlunbo'),
  axios('http://vue.studyit.io/api/getnewslist')
])

p.then(function (res) {
  // res 是 race() 方法中先完成的异步操作的结果：
  console.log('一个异步请求完成：', res);
})
```