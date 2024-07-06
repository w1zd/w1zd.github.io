---
title: 如何在 React 中使用节流和防抖并将他们抽象成 Hooks
date: "2019-12-01T01:24:47.284Z"
tags:
- React Hooks
- Translation
categories:
- 技术文章
description: “防抖”和“节流”是我们前端开发中很常用的两个功能，那么如何在 React 中使用节流和防抖并将他们抽象成 React Hooks 呢？这篇文章将为大家揭晓。
---

Hooks 是 React 很出色的一个功能更新。它极大的简化了之前在类组件中必须拆分到各个声明周期中的逻辑。

但是，Hooks 需要一种新的思维模式，尤其是对初学者来讲。

## 防抖和节流

网络上有太多太多关于防抖和节流的文章了，所以我不打算再深入讨论如何编写自己的防抖和节流功能。方便起见，我们考虑直接使用 Lodash 中提供的 `debounce` 和 `throttle`。

这里我们带大家快速复习一下，防抖和节流两个函数都接收两个参数，一个回调函数以及一个以毫秒为单位的延迟（暂时称为 `x`）,而且这两个函数都返回另外一个具有特定功能的函数：

* `debounce`: 返回一个可以调用任意次的函数（一般是快速的连续调用），但是这个函数实际只会在最后一次调用完 `x` 毫秒后，调用回调函数。
* `throttle`: 返回一个可以调用任意次的函数（一般是快速的连续调用），但是每 `x` 毫秒间隔内最多只会调用一次回调函数。

## 案例

我们有一个迷你博客编辑器（[Github仓库地址](https://github.com/wtjs/react-debounce-throttle-hooks/)），在这个编辑器中，我们需要在用户每次输入停止1秒后将博客内容存储到数据库内。
> 如果你想看最终版本的代码，直接访问 [Codesandbox](https://codesandbox.io/s/github/wtjs/react-debounce-throttle-hooks) 就可以
我们的编辑器最小版的代码应该是这样：

```javascript
import React, { useState } from 'react';
import debounce from 'lodash.debounce';

function App() {
  const [value, setValue] = useState("");
  const [dbValue, saveToDb] = useState(""); // would be an API call normally

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <main>
      <h1>Blog</h1>
      <textarea value={value} onChange={handleChange} rows={5} cols={50} />
      <section className="panels">
        <div>
          <h2>这是编辑器端的内容 (Client)</h2>
          {value}
        </div>
        <div>
          <h2>这是存储好了的内容 (DB)</h2>
          {dbValue}
        </div>
      </section>
    </main>
  );
}
```

上面这段代码里，`saveToDb` 实际上应该是对后端 API 的调用，但是这里为了让代码保持简洁，我把数据存储在 state 中，且为了方便大家观看，我直接将其渲染到了页面上。

因为我们只想在用户停止输入 1s 后执行这个存储操作，所以这里应该使用防抖。

大家可以[在这里](https://github.com/wtjs/react-debounce-throttle-hooks/tree/starter)查看起始代码。

## 创建一个防抖函数

首先，我们需要一个防抖函数来封装对 `saveToDb` 函数的调用：

```javascript
import React, { useState } from 'react';
import debounce from 'lodash.debounce';

function App() {
  const [value, setValue] = useState("");
  const [dbValue, saveToDb] = useState(""); // would be an API call normally

  const handleChange = (event) => {
    const { value: nextValue } = event.target;
    setValue(nextValue);
    // highlight-starts
    const debouncedSave = debounce(() => saveToDb(nextValue), 1000);
    debouncedSave();
    // highlight-ends
  };

  return <main>{/* Same as before */}</main>;
}

```

但是，这样其实是不能正常工作的，大家自习观察就会发现，我们是在 `handleChange` 函数中创建的 `debouncedSave` 函数，那这就意味着，每次按键触发 `handleChange` 事件都会重新创建一个 `debouncedSave` 函数，引用不一致就会导致防抖功能失效了。

## useCallback

在我们给子组件传递回调函数的时候，`useCallback` 可以用来优化性能。但是我们可以利用他的另外一个特性，就是会对回调函数进行缓存，在依赖不发生任何变更的情况下，能保证每次调用的都是同一个。这样就能保证我们每次调用的 `debounceSave` 都是同一个了。

这样就跟我们预想的一样了：

```javascript
import React, { useState, useCallback } from 'react';
import debounce from 'lodash.debounce';

function App() {
  const [value, setValue] = useState("");
  const [dbValue, saveToDb] = useState(""); // would be an API call normally

  // highlight-starts
  const debouncedSave = useCallback(
    debounce((nextValue) => saveToDb(nextValue), 1000),
    [] // will be created only once initially
  );
  // highlight-ends

  const handleChange = (event) => {
    const { value: nextValue } = event.target;
    setValue(nextValue);
    // Even though handleChange is created on each render and executed
    // it references the same debouncedSave that was created initially
    debouncedSave(nextValue);
  };

  return <main>{/* Same as before */}</main>;
}

```

## useRef

`useRef` 可以用来创建一个可修改的对象，我们传递给 `useRef`的参数会作为初始值赋值给这个对象的 `.current` 属性。最关键的是，如果我们不去手动的更改，那么这个值会组件的生命周期内持续存在。

同样，这样也能和我们预期的一样：

```javascript
import React, { useState, useRef } from 'react';
import debounce from 'lodash.debounce';

function App() {
  const [value, setValue] = useState("");
  const [dbValue, saveToDb] = useState(""); // would be an API call normally

  // This remains same across renders
  // highlight-starts
  const debouncedSave = useRef(
    debounce((nextValue) => saveToDb(nextValue), 1000)
  ).current;
  // highlight-ends

  const handleChange = (event) => {
    const { value: nextValue } = event.target;
    setValue(nextValue);
    // Even though handleChange is created on each render and executed
    // it references the same debouncedSave that was created initially
    debouncedSave(nextValue);
  };

  return <main>{/* Same as before */}</main>;
}

```

## 封装一个自定义 Hook

上面两个方法中，我们用到了 `useCallback` 和 `useRef`，而且都能很好的帮我们实现需求。对于一次性案例来讲，这样挺好，但是如果写法能变得更简洁岂不是更棒？如果我们不使用 `useCallback` 和 `useRef` 的话，我们的代码会变得可读性更高。我们当然可以把这个逻辑抽象到一个 `useDebounce` Hook 中。

下面的代码是我们使用 `useCallback` 来实现我们的构思：

```javascript
import React, { useState, useCallback } from "react";
import debounce from "lodash.debounce";

function useDebounce(callback, delay) {
  const debouncedFn = useCallback(
    debounce((...args) => callback(...args), delay),
    [delay] // will recreate if delay changes
  );
  return debouncedFn;
}

function App() {
  const [value, setValue] = useState("");
  const [dbValue, saveToDb] = useState(""); // would be an API call normally

  const debouncedSave = useDebounce((nextValue) => saveToDb(nextValue), 1000);

  const handleChange = (event) => {
    const { value: nextValue } = event.target;
    setValue(nextValue);
    debouncedSave(nextValue);
  };

  return <main>{/* Same as before */}</main>;
}

```

这个代码确实能正常运行也能完成我们要的功能，但是很奇怪的，我的 TypeScript Linter 报了一个错误：

```bash
React Hook useCallback received a function whose dependencies are unknown.
Pass an inline function instead. eslint(react-hooks/exhaustive-deps)
```

但是这个代码能在 JavaScript 环境下正常运行，并且没有任何错误（使用的是 create-react-app 模板）。不管怎么样，下边给大家提供一个替代方案，使用 `useRef` 来实现的 `useDebounce` Hook:

```javascript
function useDebounce(callback, delay) {
  // Memoizing the callback because if it's an arrow function
  // it would be different on each render
  const memoizedCallback = useCallback(callback, []);
  const debouncedFn = useRef(debounce(memoizedCallback, delay));

  useEffect(() => {
    debouncedFn.current = debounce(memoizedCallback, delay);
  }, [memoizedCallback, debouncedFn, delay]);

  return debouncedFn.current;
}
```

这个代码没有上面使用 `useCallback` 实现的简洁，很有可能我那个 Linter 的错误是一个 Gug, 说不定过不了多久就能修复了。

在这篇文章里，我只是简单的介绍了防抖，但是节流也可以用同样的方式来实现。一样的，你也可以做一个自己的 `useThrottle` Hook。
