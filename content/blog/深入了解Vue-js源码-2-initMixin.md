---
title: '深入了解Vue.js源码(#2-initMixin-part1)'
date: "2019-08-02T16:06:08.284Z"
tags:
- Vue
categories:
- 技术文章
description: '本系列文章详细介绍了Vue.js源代码，对其中的JavaScript代码进行了详细的说明。 并且尝试将概念分解为JavaScript初学者可以理解的水平。' 
toc: true
---

构造函数中调用的 `this._init` 是在哪里定义的呢？正如我们所看到的，构造函数内部并未对这个 `._init` 方法进行定义。
快速进行全局搜索源码可以发现 `._init` 方法是在名为 `initMixin` 的函数中添加到 `Vue.prototype` 上的。

## initMixin

`this._init` 方法被定义在 `initMixin` 函数中。`initMixin` 函数在 `Vue` 构造函数定义之后，和其他一组函数一起立即就被调用了，而且这一组函数调用全部接收了 `Vue` 构造函数作为实参。

```javascript
  function Vue (options) {
    if (!(this instanceof Vue)
    ) {
      warn('Vue is a constructor and should be called with the `new` keyword');
    }
    this._init(options);
  }

  initMixin(Vue);
  stateMixin(Vue);
  eventsMixin(Vue);
  lifecycleMixin(Vue);
  renderMixin(Vue);
```

我们来看一下 `initMixin` 函数的定义，特别简单，接收 `Vue` 构造函数作为形参，并且为构造函数原型添加了 `_init` 方法。

```javascript
  function initMixin (Vue) {
    Vue.prototype._init = function (options) {
      [. . . .]
    };
  }
```

## `uid$3`

在顶级作用域中， `initMixin` 上面定义了一个变量 `uid$3`，这个变量被当做一个计数器，每当创建一个 `Vue` 实例的时候，都会自增，然后添加为当次创建的 `Vue` 实例的属性。

```javascript
  function initMixin (Vue) {
    Vue.prototype._init = function (options) {
      // a uid
      vm._uid = uid$3++;
      [. . . .]
    };
  }
```

## `vm` 和 `this`

在 `_init` 方法内部设置了一个 `this` 的帮助变量。通常情况下，我们会将代表当前函数上下文对象的 `this` 关键字保存在其他变量中，方便以后使用，比如 `self = this`。 这里的做法是类似的，将 `this` 保存在了一个名为 `vm` 的变量中：

```javascript
  function initMixin (Vue) {
    Vue.prototype._init = function (options) {
      var vm = this;
      [. . . .]
    };
  }
```

## 性能相关

接下来，`._init`方法中，设置了性能检查相关的内容。

```javascript
function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    ...
    var startTag, endTag;
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      startTag = "vue-perf-start:" + (vm._uid);
      endTag = "vue-perf-end:" + (vm._uid);
      mark(startTag);
    }
    ...
  }
}
```

这里声明了两个变量 `startTag` 和 `endTag`.

```javascript

function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    [. . . .]
    var startTag, endTag;
    [. . . .]
  }
}
```

然后你可能会注意到这个奇怪的注释：

```javascript
/* istanbul ignore if */
```

[`Istanbul`](https://github.com/gotwarlost/istanbul) 其实是一个覆盖率测试工具，这里的注释是在告诉 `Istanbul` 忽略掉 `if` 语句。

`if` 语句首先检查的是当前环境是开发环境还是生产环境，然后判断 `config.performence` 属性是否有设置为 `true`。

```javascript
function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    [. . . .]
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
    }
    [. . . .]
  }
}
```

### `config` 对象

这里我们不得不去关注一下 `config` 这个对象，这个对象声明在别的地方，并且默认的 `performance` 这个属性是 `false`。

```javascript
var config = ({
  [. . . .]
    /**
   * Whether to record perf
   */
  performance: false,
  [. . . .]
})
```

就像注释标记的那样，`config.performance` 这个属性用来决定 `Vue` 是否要记录性能。

我们继续回到 `_init` 方法里面来，`if` 语句中接下来又检查了一个名为 `mark` 的变量。

```javascript
function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    [. . . .]
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
    }
    [. . . .]
  }
}
```

### `mark` 函数

那我们又不得不去找找看 `mark` 到底是在哪儿定义的。

```javascript
  var mark;
  var measure;

  {
    var perf = inBrowser && window.performance;
    /* istanbul ignore if */
    if (
      perf &&
      perf.mark &&
      perf.measure &&
      perf.clearMarks &&
      perf.clearMeasures
    ) {
      mark = function (tag) { return perf.mark(tag); };
      measure = function (name, startTag, endTag) {
        perf.measure(name, startTag, endTag);
        perf.clearMarks(startTag);
        perf.clearMarks(endTag);
        // perf.clearMeasures(name)
      };
    }
  }
```

查看代码我们会发现，这个`mark`变量，只会在特定的情况下被赋值。首先呢，他会检查，我们是否在浏览器环境中，然后检查 `window.performance` 是否存在。

```javascript
  // Browser environment sniffing
  var inBrowser = typeof window !== 'undefined';
  [. . . .]
  {
    var perf = inBrowser && window.performance;
    [. . . .]
  }
```

要知道这里在干吗，我们需要去文档查看一下 `window` 对象的 `performance` 属性。 MDN中说: 
> “`window` 对象的 `performance` 属性返回一个 `Performance` 对象，可用于收集当前文档的性能信息。 它作为 `Performance Timeline API`，`High Resolution Time API`，`Navigation Timing API`，`User Timing API`和`Resource Timing API`的公开点。性能接口是`High Resolution Time API`的一部分，可以通过它来访问当前页面性能相关信息。

`mark`, `measure`, `clearMarks`, `clearMeasures` 都是 `Performance` 对象上的方法。

* `mark` 方法用给定的名字在浏览器的性能输入缓冲区创建一个时间戳。

* `measure` 方法在浏览器的性能输入缓冲区中两个指定标记(分别称为开始标记和结束标记)之间创建一个命名时间戳。

* `clearMarks` 方法用来移除浏览器的性能输入缓冲区中指定的 `mark`
  
* `clearMeasures` 方法用来移除浏览器的性能输入缓冲区中指定的 `measure`

就像Vue [API](https://vuejs.org/v2/api/#performance)中解释的那样，如果 `performance` 选项被设置为 `true`，将会在浏览器的 `devtool peformance/timeline` 面板中开启对组件初始化、编译、渲染以及组件更新的性能追踪。但是只能在`development` 模式下生效，并且受限于浏览器，只能在支持 `performance.mark` 接口的浏览器中使用。

所以，我们继续回头看一下 `mark` 变量的初始化代码：

```javascript
{
  var perf = inBrowser && window.performance;
  /* istanbul ignore if */
  if (
    perf &&
    perf.mark &&
    perf.measure &&
    perf.clearMarks &&
    perf.clearMeasures
  ) {
    mark = function (tag) { return perf.mark(tag); };
    measure = function (name, startTag, endTag) {
      perf.measure(name, startTag, endTag);
      perf.clearMarks(startTag);
      perf.clearMarks(endTag);
      perf.clearMeasures(name);
    };
  }
}
```

如果 `perf` 对象存在，并且当 `perf` 对象中存在 `mark`、 `measure`、 `clearMarks` 和 `clearMeasures` 方法，那么 Vue 就会设置好 `mark` 和 `measure` 函数。

`mark` 函数接收一个 `tag` 作为形参，并且返回一个在浏览器性能入口缓存区中用 `tag` 作为名字的时间戳。

`mark` 与 `measure` 一起，就允许我们在浏览器 `devtool perfomance/timeline` 面板中跟踪性能。

### 继续回到`_init`方法

现在我们知道了 `mark` 函数是用来做什么的，我们终于可以继续回到 `Vue.prototype._init` 方法中继续了解代码所做的事情。

下面的代码，检查了是否是开发环境，确认了性能配置选项是否被设置为 `true`, 还确认了 `mark` 函数是否存在。如果上述三个检查都通过了，Vue 会设置两个变量 `startTag` 和 `endTag`, 然后使用 `startTag` 作为形参调用 `mark` 函数。

```javascript
function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    var vm = this;
    // a uid
    vm._uid = uid$3++;var startTag, endTag;
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      startTag = "vue-perf-start:" + (vm._uid);
      endTag = "vue-perf-end:" + (vm._uid);
      mark(startTag);
    }
    [. . . .]
  }
}
```