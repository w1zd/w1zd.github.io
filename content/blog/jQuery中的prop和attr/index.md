---
title: jQuery中的prop和attr
date: "2014-09-11T21:16:50.284Z"
tags:
- 前端
- jQuery
categories:
- jQuery
---
在JQuery中，对CheckBox的操作分两个阶段，一个是JQuery1.6之前的版本，一个是1.6之后的版本

在1.6之前，我们这么做：
```markup
<input type='checkbox' id='checkbox'/> 
<script> 
var isChecked = $('#checkbox').attr('checked'); 
$('#checkbox').attr('checked',true); 
</script>
```
但是细心的同学会发现，在jQuery1.6之后，如果还像上面这么做，那肯定会出问题： 
`$('#checkbox').attr('checked');`获取到的值并不是`true`和`false`，而是`checked`或者`undefined`  

那在1.6之后如何进行操作呢?

jQuery在之后的版本中对属性和特性进行了比较细致的区分，什么是特性呢？  
特性就是像 `checked`，`selectedIndex`, `tagName`, `nodeName`, `nodeType`, `ownerDocument`, `defaultChecked`, 和`defaultSelected`等等这些。

那prop()和attr()到底有什么区别呢？

1. 于build-in属性，attribute和property共享数据，attribute更改了会对property造成影响，反之亦然，但是两者的自定义属性是独立的数据，即使name一样，也互不影响，看起来是下面这张图，但是IE6、7没有作区分，依然共享自定义属性数据   
2. 并不是所有的attribute与对应的property名字都一致，比如刚才使用的attribute 的class属性，使用property操作的时候应该是这样className  
	 `t.className='active2';`
3. 对于值是true/false的property，类似于input的checked attribute等，attribute取得值是HTML文档字面量值，property是取得计算结果，property改变并不影响attribute字面量，但attribute改变会一向property计算  
	`<input id="test3" type="checkbox"/>`

	```javascript
		var t=document.getElementById('test3');
        console.log(t.getAttribute('checked'));//null
        console.log(t.checked);//false;

        t.setAttribute('checked','checked');
        console.log(t.getAttribute('checked'));//checked
        console.log(t.checked);//true

        t.checked=false;
        console.log(t.getAttribute('checked'));//checked
        console.log(t.checked);//false
	```

4. 对于一些和路径相关的属性，两者取得值也不尽相同，但是同样attribute取得是字面量，property取得是计算后的完整路径  
	`<a id="test4" href="#">Click</a>`
	```javascript
	var t=document.getElementById('test4');
    console.log(t.getAttribute('href'));//#
    console.log(t.href);//file:///C:/Users/bsun/Desktop/ss/anonymous.html#
  ```

|Attribute/Property|.attr()|.prop()|
|--|--|--|
|accesskey|√| |
|align|√| |
|async|√|√|
|autofocus|√|√|
|checked|√|√|
|class|√| |
|contenteditable|√| |
|draggable|√| |
|href|√| |
|id|√| |
|label|√| |
|location ( i.e. window.location )|√|√|
|multiple|√|√|
|readOnly|√|√|
|rel|√| |
|selected|√|√|
|src|√| |
|tabindex|√| |
|title|√| |
|type|√| |
|width ( if needed over .width() )|√| |
