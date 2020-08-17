---
title: 给新手看的 React Hooks 教程
date: "2019-11-27T15:24:47.284Z"
tags:
- React Hooks
categories:
- React
description: Hooks 到底是个啥玩意儿？？？
---
![React Hooks](reacthooks.png)
"Hooks 到底是个啥玩意儿？？？"

你是不是有这样的疑惑？在你自认为已经了解了差不多 React 所有的内容的时候，Hooks 就这么出现了。

这就是前端开发人员的日常，技术从未停止更新。

学习新东西是一件很棒的事情吗？当然是！但有的时候我们又不得不思考：”为什么要学它？这个新东西有啥意义？我是必须得学他吗？“。

针对 Hooks 而言，上面的这个问题答案是否定的，你不需要立马就学它。如果您一直在使用 React，并且迄今为止一直在使用基于类的组件，那么就不必急于转向 Hooks。Hooks 是可选的，可以与现有组件配合使用。我相信当你因为要使用新东西而不得不重写整个代码库，你整个人都是崩溃的。

## 在函数组件中使用状态

在使用 Hooks 之前，我们不能在函数组件中使用状态。这就意味着，如果您有一个经过精心设计和测试的函数组件，突然需要存储状态，那么你就不得不把他重构为一个类组件。

牛逼的来了，Hooks 让函数组件也能使用状态，就意味着我们不需要重构之前自己的写的代码，[可以点击这篇文章查看更多](https://scotch.io/courses/5-essential-react-concepts-to-know-before-learning-redux/presentational-and-container-component-pattern-in-react)。

## 类组件很笨重

我们不的不承认的是，类组件附带了太多的东西。constructor，binding，“this”无处不在。使用函数组件可以消除许多这种情况，能让我们的代码更容易维护。

可以在[React文档中了解更多相关内容](https://reactjs.org/docs/hooks-intro.html#classes-confuse-both-people-and-machines)

## 更高的可读性

由于 Hooks 允许我们在函数组件中使用状态，因此和类组件相比，这意味同样的功能，我们写出来的代码会更好。 这也会让我们的代码更具可读性。 我们再也不用担心方法是不是绑定了 `this`，也不必记住 `this` 之间的关系等等。 我们可以专心写代码了。

## React State Hook

状态，是React生态系统的基础。接下来我将通过介绍最常见的 Hook —— `useState()` 来让大家初步了解 Hooks。

我们先来看一下具有状态的类组件。

```jsx
import React, { Component } from 'react';
import './styles.css';

class Counter extends Component {
	state = {
		count: this.props.initialValue,
	};

	setCount = () => {
		this.setState({ count: this.state.count + 1 });
	};

	render() {
		return (
			<div>
				<h2>This is a counter using a class</h2>
				<h1>{this.state.count}</h1>

				<button onClick={this.setCount}>Click to Increment</button>
			</div>
		);
	}
}

export default Counter;
```

有了React Hooks 之后，我们可以重写这个类组件并删除很多内容，使其更易理解

```js
import React, { useState } from 'react';

function CounterWithHooks(props) {
	const [count, setCount] = useState(props.initialValue);

	return (
		<div>
			<h2>This is a counter using hooks</h2>
			<h1>{count}</h1>
			<button onClick={() => setCount(count + 1)}>Click to Increment</button>
		</div>
	);
}

export default CounterWithHooks;
```

代码变少了，但这到底是啥情况呢？

## React State Syntax

在上面的代码里，我们已经用到了人生中第一个 React Hook

```jsx
const [count, setCount] = useState();
```

简单来讲，这里使用了数组的结构赋值。

`useState()` 函数为我们提供了两个东西:

	* 一个保存状态值的变量，在本例中称为count;
	* 一个更改值的函数，在本例中称为setCount。

当然，你可以为这两个东西起任何你想要的名字。

```jsx
const [myCount, setCount] = useState(0);
```

而且，你也可以在你的代码中像使用正常变量/函数一样去用他们。

```jsx
function CounterWithHooks() {
	const [count, setCount] = useState();

	return (
		<div>
			<h2>This is a counter using hooks</h2>
			<h1>{count}</h1>
			<button onClick={() => setCount(count + 1)}>Click to Increment</button>
		</div>
	);
}
```

注意最上面的的`useState` Hook。 我们声明、结构了2个东西：

* counter：是用来保存状态的
* setCounter：是用来更改计数器变量的函数

往下看代码，您会看到这一行：

```jsx
<h1>{count}</h1>
```

这是一个使用 Hooks 变量的例子。在JSX中，我们将 `count` 变量放在 `{}` 中，然后作为JavaScript执行它，最后将 `count` 的值将展示在页面上。

我们来对照一下我们之前在类组件中使用状态的方式：

```jsx
<h1>{this.state.count}</h1>
```

你会发现，我么再也不需要关注 `this` 的使用了，这使我们的编码工作变得更加轻松了。

比如，当你没定义 `{count}` 的时候，VS Code编辑器直接就给你报警告了，你就更早的发现错误。 但是在运行代码之前，VS Code 可不会知道 `{this.state.count}` 是不是定义了。

我们继续往下看

```jsx
<button onClick={() => setCount(count + 1)}>Click to Increment</button>
```

在这行代码中，我们使用 `setCount` 函数来更改 `count` 变量。

单击按钮的时侯，我们把 `count` 变量更新为1。由于状态变化，因此会触发视图重新渲染，React 会用新的 `count `值为我们更新视图。 真香！

## 那我怎么给数据一个初始值呢？

您可以通过给`useState()`传递参数来设置初始状态。 可以是一个硬编码的值：

```jsx
 const [count, setCount] = useState(0);
```

或者你也可以用 `props` 传进来的值作为初始值：

```jsx
 const [count, setCount] = useState(props.initialValue);
```

不论你的`props.initialValue`是啥，都会赋值给 `count` 作为初始值。

总结一下：`useState` 最爽的地方在于，你可以像使用正常变量、函数一样处理你的状态。

## 那如果我有多个状态数据咋办?

这是就是Hooks另外一个牛逼的地方了，在组件里，`useState`你想用多少次，就用多少次：

```jsx
 const [count, setCount] = useState(props.initialValue);
 const [title, setTitle] = useState("This is my title");
 const [age, setAge] = useState(25);
```

如你所见，我们现在有3个独立的状态对象。例如，如果我们想更新年龄，只需调用`setAge()`函数。`count`和`title`也是一样。我们不再受制于旧的笨重的类组件方式——用`setState()`来管理一个超大的状态对象.

```jsx
this.setState({ count: props.initialValue, title: "This is my title", age: 25 })
```

## 那数据更新的时候，我要做一些事情怎么做？

在使用函数组件 + React Hooks 这种模式下，我们再也不用去管什么生命周期了，什么 `componentDidMount`、`componentDidUpdate`都可以统统见鬼去了。

你可能会问，那我用啥？？？别慌，兄弟！ React 给我们提供了另外一个钩子来干这事儿。

## useEffect

效果钩子 `useEffect` 是我们处理“副作用”的地方。

呃,副作用？那是啥? 

### 副作用

那我们就先偏离一下正题，讨论一下副作用到底是什么。这有助于我们理解 `useEffect()` 的作用以及为什么他很有用。

一个你看不懂的无聊的正规解释应该是：

> ​	“在编程中，副作用是指在程序处理过程改变了程序范围之外的变量”

用 React 术语来说，副作用其实意味着“当组件的变量或状态因某些外部事物而改变”。 例如：

* 组件接受了一个改变组件本身状态的props

* 当组件进行接口调用并在接口返回结果是执行了某些操作（例如，更改了组件的状态）

那么为什么称之为副作用呢？ 

***我们不能确定这些代码的执行结果是什么***。 我们永远无法百分百确定我们的组件会接收到什么样的 `props `，也无法确定接口调用返回的结果数据是什么。 而且，我们无法确定这将如何影响我们的组件。

当然，我们也可以编写代码校验、处理错误等，但是我们最终还是不能确定这样的事情带来的副作用是什么。

所以可以这么说，当组件的状态因为一些外界因素改变的时候，这就可以称作副作用。



好了，我们可以回正题了。继续来看`useEffect`这个Hook。

在使用函数组件时，我们不再使用生命周期钩子函数，例如 `componentDidMount`，`componentDidUpdate`等。因此，可以这么说，`useEffect` Hook 代替了之前我们用到的React钩子函数。

让我们比较一下基于类的组件和`useEffect` Hooks的使用方式

```jsx
import React, { Component } from 'react';

class App extends Component {
	componentDidMount() {
		console.log('I have just mounted!');
	}

	render() {
		return <div>Insert JSX here</div>;
	}
}
```



用了`useEffect`之后

```jsx
function App() {
	useEffect(() => {
		console.log('I have just mounted!');
	});

	return <div>Insert JSX here</div>;
}
```

在继续往下之前，我们必须要知道一件事儿，在默认情况下，`useEffect` Hook 在每次渲染和重新渲染时都会执行。 

因此，只要组件中的状态发生变化或组件收到新的`props`时，组件都会重新渲染并导致`useEffect Hook 再次运行。

## 能不能只执行一次useEffect  (就像 componentDidMount 一样)

如果 `useEffect` Hook 在组件每次渲染时都运行，那么我们怎么才能做到 Hook 在挂载组件时仅运行一次？ 

例如，如果组件从接口获取数据，我们肯定不希望每次重新渲染组件时都去重新请求下数据吧？

`useEffect()` 钩子接受第二个参数，是一个数组，其中包含导致 `useEffect` 钩子运行的依赖项的列表。当这些依赖项更改时，它将触发 Effect Hook。如果想要只运行一次 Effect Hook，那直接给他传递一个空数组，就OK啦！！

```jsx
useEffect(() => {
	console.log('This only runs once');
}, []);
```

这就意味着 useEffect Hook 将在第一次渲染时正常运行。然而，当你的组件重新渲染时，useEffect 会想 “好吧，我已经运行了，数组中啥也没有，我没啥依赖项，谁变都跟我没关系了，所以我不必再运行了。” 然后就什么也不做了。

> 总结： 空数组就意味着useEffect Hook只在挂载时运行一次



## 当有内容更新时使用effect (就像componentDidUpdate一样)

我们已经介绍了如何确保 useEffect Hook仅运行一次，但是当我们的组件收到新的 `props` 时该怎么办？ 或者我们要在状态更改时运行一些代码？ 其实Hooks 也能处理！

```jsx
 useEffect(() => {
	console.log("The name props has changed!")
 }, [props.name]);
```

请注意，这次我们如何将东西传递给useEffect数组的，`props.name`。

在这种情况下，useEffect Hook 将像往常一样在首次加载时运行。 每当您的组件从其父组件收到新的`props.name`时，都会触发useEffect Hook，并且运行其中的代码。



我们也可以使用状态变量来做同样的事情：

```jsx
const [name, setName] = useState("Chris");

 useEffect(() => {
    console.log("The name state variable has changed!");
 }, [name]);
```

每当`name`发生变化时，组件就会重新渲染 ，useEffect Hook 就会运行并输出消息。而且因为这是一个数组，我们其实可以向它添加多个东西：

```jsx
const [name, setName] = useState("Chris");

 useEffect(() => {
    console.log("Something has changed!");
 }, [name, props.name]);
```

这样，当 `name` 状态变量更改或 `props.name` 更改时，useEffect Hook 都将运行并显示控制台消息。

## 那我们能用componentWillUnmount吗？

想要在组件即将卸载时运行一个Hook，我们只需从`useEffect` Hook 返回一个函数

```jsx
useEffect(() => {
	console.log('running effect');

	return () => {
		console.log('unmounting');
	};
});
```

## 那我们可以多个不同的 Hooks 一起使用吗？

当然! 你可以在组件中使用任意数量的Hooks，并根据需要混合使用

```jsx
function App = () => {
	const [name, setName] = useState();
	const [age, setAge] = useState();

	useEffect(()=>{
		console.log("component has changed");
	}, [name, age])

	return(
		<div>Some jsx here...<div>
	)
}
```

## 小结- 接下来干啥呢？

你这不已经学会React Hooks了么，Hooks允许我们使用老式的JavaScript函数来创建更简单的React组件，并减少大量代码。



接下来，手不痒痒么？当然是自己赶紧动手那Hooks做项目体验去啊！