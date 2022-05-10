---
title: 设计 MongoDB Schema 的 6 条经验准则：Part 1
date: "2020-07-17T11:14:08.284Z"
tags:
- mongodb
categories:
- 技术文章
description: MongoDB 是一款非常不错的 NoSQL 数据库，但是大部分用惯的了 SQL 的程序员在使用 MongoDB 的时候，都是带着 SQL 的思维方式在使用 MongoDB，这样使用其实并不能发挥 MongoDB 的自身优势，而且在网络上关于如何使用 MongoDB 的文章大部分都只是讲 CRUD 操作，关于如何进行 Schema 设计的文章少之又少。本文将解决你在设计 MongoDB Schema 时的疑惑。
---
![](https://raw.githubusercontent.com/w1zd/image-hosting/main/img/2022/05/10/11-41-46-d2582e9ef5586bc819fec7cc1df972bf-mongodb-91c09c.jpeg)
作者：MongoDB 首席技术支持工程师 William Zola

“我用SQL很长时间了, 但是 MongoDB 对我而言算是一个新东西。在 MongoDB 里面我该怎么处理___一对多___的关系呢？”这是我在 MongoDB 工作期间，用户问的最多的一个问题。

这个问题我没办法用简单的一两句话就给说明白，因为不止一种方式可以做到这件事情。对于 SQL 中经常谈及的比较扁平化的___一对多___这个数据表之间的关系，MongoDB 有非常丰富而且细腻的词汇来表达它。接下来我们就一起看一下，在 MongoDB 中处理___一对多___这种关系的时候，你都有哪些选择。

由于要讲的东西太多，我会把内容分为 3 部分来向说。在第一部分中，我会给大家讲解在MongoDB中实现___一对多___关系的 3 种基本方式；在第二部分中，我会介绍更加复杂的 Schema 设计方式，包括非规范化和双向引用；在最有一部分中，我会带大家回顾所有内容，并针对在 MongoDB 中设计___一对多___关系时，你会考虑的上千种选择（真的是上千种哦），给你一些建议。

在大多数新手看来，MongoDB 中设计这种___一对多___的关系只有一种方案，那就是在父文档（parent document)中嵌入一个包含子文档（sub-document)的数组，但事实并非如此。但这只是因为你可以使用嵌入方式（embedding），并不意味着你应该使用嵌入方式（embedding）。

在设计一个 MongoDB Schema 的时候，你应该从一个你在使用 SQL 的时候从来都不会考虑的问题开始：关系（Relationship）的基数（cardinality<sup>注[1]</sup>）是什么？换句更通俗易懂的话来讲：你需要用更准确的方式来描述你的___一对多___关系，是”一对几个”，还是“一对很多个”，还是___一对超级多___，这对你讲采用哪种方式来建立你的关系模型，有着至关重要的影响。

## 基础：一对几

举个___一对几个___这种关系的简单例子，一个人和他的地址。这是进行嵌入方式（embedding）很好的一个例子——你可以把 addresses 作为一个数组，嵌套到你的 Person 对象中:

```bash
> db.person.findOne()
{
	name: "岳云鹏",
	ssn: "123-456-7890",
	addresses : [
     { street: '史各庄东路108号', city: '北京', cc: 'China' },
     { street: '王府井大街250号', city: '北京', cc: 'China' }
  ]
}
```

这种设计体现了嵌入方式（embedding）的所有优点和缺点。最大的好处在于，你不需要在做一个额外的查询来获取嵌入内容的详细信息；而最大的坏处在于，你没办法以独立的实体方式来访问嵌入到Document中的内容。

举个例子：假设您正在设计一个任务跟踪系统，那么每个人都会被分配许多任务。将任务嵌入到 Person 文档中，会使诸如“显示明天到期的所有任务”这样的查询变的非常困难，在下一篇文章中，我会介绍更适合这个用例的设计。

## 基础：一对多

举一个___一对很多个___这种关系的例子，产品的可替换部分的订单系统。每种产品可能有几百个可替换的部件，但一般不会超过几千个。这个是一个很好的引用方式用例——你可以把可替换部件的 `ObjectIDs` 作为一个数组，放到 product 文档中去。（在这个例子中为了便于阅读，我用了两个字节的 ObjectID，但是实际开发当中 ObjectID 应该是 12 个字节的）

每个可替换部件都有自己的文档。

```bash
> db.parts.findOne()
{
    _id : ObjectID('AAAA'),
    partno : '123-aff-456',
    name : '#4 grommet',
    qty: 94,
    cost: 0.94,
    price: 3.99
```

同样，每个产品都有自己的文档，其中包含对组成该产品的可替换部件的 `ObjectID` 引用数组

```bash
> db.products.findOne()
{
    name : 'left-handed smoke shifter',
    manufacturer : 'Acme Corp',
    catalog_number: 1234,
    parts : [     // 可替换部件的数组引用
        ObjectID('AAAA'),    // reference to the #4 grommet above
        ObjectID('F17C'),    // reference to a different Part
        ObjectID('D2AA'),
        // etc
    ]
```

然后，你需要使用应用程序级别的联接查询来检索特定产品的可替换零件：

```bash
// 获取指定catalog number对应的产品文档
> product = db.products.findOne({catalog_number: 1234});
// 获取当前这个产品所有的可替换部件
> product_parts = db.parts.find({_id: { $in : product.parts } } ).toArray() ;
```

为了使操作效率更高，你需要在 `product.catlog_number` 上创建索引。要注意，  `parts._id` 上始终会有索引，所以这个查询总是高效的。

这种引用的风格和嵌入方式有互补的优缺点。每个 Part (可替换部件)都是一个独立的 Document，因此独立的搜索和更新 Part 会变得特别容易。使用这中模式的代价在于，如果你想要获取一个商品的某个部件的详情，你需要进行二次查询。(在阅读本文 Part2 之前，可以先这么理解）

还有一个额外的好处就是，这种 Schema 设计方案下，你可以让一个 Part (可替换部件) 被多个 Product (商品) 使用。这样不需要任何额外操作的情况下，你的”一对多”的关系，就变成了“多对多”关系。

## 基础：一对超级多

一个用于收集不同机器日志消息的日志系统，应该算是一个___一对超级多___这种关系的例子。任何一个主机所产生的日志信息都足以让文档大小超过 MongoDB 限制的 16MB ，哪怕你只是把 ObjectID 存放在数组中。这是一个“父级引用”的经典用例——你有个针对主机的 Document，然后将主机的 ObjectID 存储在记录日志消息的 Document 中。

```bash
> db.hosts.findOne()
{
    _id : ObjectID('AAAB'),
    name : 'goofy.example.com',
    ipaddr : '127.66.66.66'
}

>db.logmsg.findOne()
{
    time : ISODate(""2014-03-28T09:42:41.284Z".382Z"),
    message : 'cpu is on fire!',
    host: ObjectID('AAAB')       // 引用主机 Document
}
```

你可以使用一个应用程序级别的关联查询来查找最近的5,000条日志记录。

```bash
// 先找到指定的主机
> host = db.hosts.findOne({ipaddr : '127.66.66.66'});  // 这里假设 ipaddr： 127.66.66.66 是唯一的
// 在找到主机对应的最近的5000条日志信息
> last_5k_msg = db.logmsg.find({host: host._id}).sort({time : -1}).limit(5000).toArray()
```

## 总结

因此，尽管上面讲的东西都很基础，但是我们会发现，在设计 MonogDB Schema 的时候明显要比设计关系型的 Schema 想的更多。你需要思考的有两个因素：

* 在你的___一对多___关系中，”多“的这一方，需要被设计成单独的实体吗？
* 你设计的关系的基数（cardinality）是什么？ 一对多？一对很多？还是一对超级多？

基于这两个因素，您可以选择三种基本的___一对多___模式设计之一：

* 如果你的基数是一对几的，并且无需在父对象的上下文之外访问嵌入的对象，则将”多“的那一边嵌入到父对象中
* 如果你的基数是一对多的，或者由于其他任何原因，”多“这一边对象应该独立存在，则使用对”多“这一边的对象的引用数组
* 如果你的基数是一对超级多，请在”多“那边的对象中使用对”一“那边的引用

下篇文章中，我们将看到如何使用双向关系和非规范化来增强这些基本 Schema 的性能。

---

[1] [techopedia 中对 Cardinality 的解释](https://www.techopedia.com/definition/18/cardinality-databases)

