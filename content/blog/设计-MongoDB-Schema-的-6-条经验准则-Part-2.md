---
title: 设计 MongoDB Schema 的 6 条经验准则：Part 2
date: "2020-07-18T12:16:10.284Z"
tags:
- mongodb
categories:
- 技术文章
description: 设计 MongoDB Schema 的 6 条经验准则第二部分。
---

![](https://raw.githubusercontent.com/w1zd/image-hosting/main/img/2022/05/10/11-39-52-56f9d07a30d9bfc238f9ab56db7fd345-mongodb-3e2fab.jpeg)
作者：MongoDB 首席技术支持工程师 William Zola

这是我们[[设计-MongoDB-Schema-的-6-条经验准则-Part-1]]的第二站。在上一部分中，我们介绍了三种基本的 Schema 设计：嵌入、子引用、父引用。我们还介绍了选择这三种模式的两种因素：

* ***一对多***关系中，***多***的那一部分需要需要作为独立的实体存在？
* ***一对多***关系的基数（cardinality）是什么？是一对几？还是一对很多？还是一对超级多？

有了这些基础的支撑，接下来我就可以跟大家介绍更加复杂的 Schema 设计方式，其中包括双向引用和非规范化存储。

## 中级：双向引用

如果你想更花哨一些，你可以将两种技术结合起来，在你的 Schema 中同是包含两种风格的引用，既有一对多的引用（子引用），也有多对一的引用（父引用）。

我们还是回到之前那个任务追踪系统的例子。我们有一个 `people` 集合来存储 `Person` 文档，有一个 `task` 集合来存储 `Task`，并且 `Person` 和 `task` 是一对多的关系。任务追踪系统需要追踪每一个人的所有任务，所以我们需要在 `Person` 中做一个 `Task` 的子引用。

在添加了一个对于 `Task` 文档的引用数组之后，单个的 `Person` 文档可能长这样：

```bash
db.person.findOne()
{
    _id: ObjectID("AAF1"),
    name: "Kate Monster",
    tasks [     // array of references to Task documents
        ObjectID("ADF9"), 
        ObjectID("AE02"),
        ObjectID("AE73") 
        // etc
    ]
}
```

另一方面，在程序里某些上下文中，我们需要展示一个任务列表（举个例子，一个多人项目中的所有任务）并且需要快速的找出每项任务的负责人。其实我们可以通过在 `Task` 文档中额外添加对 `Person` 的引用来优化这个查询效率。

```bash
db.tasks.findOne()
{
    _id: ObjectID("ADF9"),
    description: "Write lesson plan",
    due_date: ISODate("2020-04-01),
    owner: ObjectID("AAF1") //Reference to Person document
}
```

这种设计具有***一对多***的所有的有点和缺点，但是多了一些功能。在 `Task` 文档中添加一个额外的 `owner` 引用，意味着可以更加快捷和方便的找到任务的负责人，但是同时也意味着当你在重新分配任务给其他人的时候，你需要执行**两次**更新，而不是一次。
具体来讲，你将需要更新两个引用，一个是 `Person` 对 `Task` 的引用，另一个是 `Task` 对 `Person` 的引用。（对于正在阅读本文的关系专家来说——您是对的，使用这种模式设置意味着不再可能通过一次原子更新。这对于我们的任务跟踪系统来说是可以的：您需要考虑这是否适用于您的特定用例。）

## 中级：“一对多”关系中的的非规范化存储

除了对各种关系进行建模之外，你还可以在你的 `Schema` 中添加非规范化存储。在某些情况下，这个可以避免进行应用程序级别的链接查询，但是这样做的代价就是会在执行更新的时候增加复杂度。下面的例子能够很好的说明这个问题。

### “多到一”中的非规范化存储

在我们之前提到的商品部件的例子中，你可以将可替换部件的 `name` 进行非规范化存储，放到 `parts[]` 数组中。 下面是之前没有进行非规范化存储的代码，给大家参考。

```bash
> db.products.findOne()
{
    name : 'left-handed smoke shifter',
    manufacturer : 'Acme Corp',
    catalog_number: 1234,
    parts : [     // array of references to Part documents
        ObjectID('AAAA'),    // reference to the #4 grommet above
        ObjectID('F17C'),    // reference to a different Part
        ObjectID('D2AA'),
        // etc
    ]
}
```

非规范化存储意味着在需要显示商品所有部件名字的时候，不需要进行应用程序级别的连接查询，但是在你需要可替换部件的其他信息的时候，你仍然需要进行链接查询。

```bash
> db.products.findOne()
{
    name : 'left-handed smoke shifter',
    manufacturer : 'Acme Corp',
    catalog_number: 1234,
    parts : [
        { id : ObjectID('AAAA'), name : '#4 grommet' },         // Part name is denormalized
        { id: ObjectID('F17C'), name : 'fan blade assembly' },
        { id: ObjectID('D2AA'), name : 'power switch' },
        // etc
    ]
}
```

虽然这样使得我们获取部件名称更加容易，但是这会给应用程序级别的连接查询增加一些工作：

```bash
// Fetch the product document
> product = db.products.findOne({catalog_number: 1234});  
  // Create an array of ObjectID()s containing *just* the part numbers
> part_ids = product.parts.map( function(doc) { return doc.id } );
  // Fetch all the Parts that are linked to this Product
> product_parts = db.parts.find({_id: { $in : part_ids } } ).toArray() ;
```

非规范化存储可以提升对非规范化数据的查询效率，但是同样也增加了在更新数据是开销：如果你把 `Part` 的 `name` 非规范化存储到了 `Production` 文档中，那么当你进行部件 `name` 更新的时候，你就必须更新 `Product` 文档中 `parts` 数组中每一个出现当前 `name` 的位置。

只有在读取操作的比例远大于更新操作时，非规范存储才会有意义。如果非常频繁的读取数据，但是更新的频率却很低，那么这个时候为了让查询更加高效，导致更新操作变慢和复杂是值得的。但是随着更新操作相对读取操作的频率逐渐提升，非规范化存储带来的受益也会逐渐减少。

举个例子：假设部件的 `name` 很少会发生变更，但是部件的数量更新却很频繁，那这就意味着，将部件名称进行非规范化存储是有意义的，但是将数量进行非规范化存储就没啥意义了。

同样你也需要注意一点，当你拥有一个非规范化存储的字段的同时，你也失去了对这个字段进行原子更新和独立更新的能力。就想我们上面讲的`双向引用`的例子一样，如果你更新了 `Part` 文档中的部件名称，然后又更新了 `Product` 文档中的部件名称，那么在两次更新之间就有一定的时间差，而在这段时间差内，`Product` 文档中的部件名称和 `Part` 文档中的部件名称就会有差异（Part中是新值，而Product中是旧值）。

### “一到多”中的非规范化存储

你也可以将`一`的内容非规范化存储到`多`的字段中：

```bash
> db.parts.findOne()
{
    _id : ObjectID('AAAA'),
    partno : '123-aff-456',
    name : '#4 grommet',
    product_name : 'left-handed smoke shifter',   // Denormalized from the ‘Product’ document
    product_catalog_number: 1234,                     // Ditto
    qty: 94,
    cost: 0.94,
    price: 3.99
}
```

但是如果你将产品名称非规范化存储到了 `Part` 文档中，那么在你更新产品名称时，你同样必须更新当前产品所有相关部件中对应的产品名称。这个更新就比较耗性能了，因为你更新的是多个部件，而不是单个产品。因此，以这种方式进行非规范化存储的时候，你可一定得考虑清楚读写操作的频率比。

## 中级：“一对超级多”中的非规范化存储

你也可以非规范化存储”一对超级多的“例子，这适用于两种方式之一：你既可以把”一“那一侧的信息非规范化存储到”超级多“那一侧里面，也可以把”超级多“一侧的概括信息放到”一“那一侧。

这里有一个将数据非规范化存储到”超级多“那一侧的例子。我将会把主机的 ip 地址（从”一“那一侧）添加到单独的日志信息中：

```bash
> db.logmsg.findOne()
{
    time : ISODate(""2014-03-28T09:42:41.284Z".382Z"),
    message : 'cpu is on fire!',
    ipaddr : '127.66.66.66',
    host: ObjectID('AAAB')
}
```

当你查询特定的 ip 地址最近的日志消息的时候，将会变得更加容易：查询从两条变成了一条

```bash
> last_5k_msg = db.logmsg.find({ipaddr : '127.66.66.66'}).sort({time : -1}).limit(5000).toArray()
```

事实上，如果你存储到“一”那一边的信息非常少，你完全可以将**所有**的信息全部费正规化存储到“超级多”那一边，然后将另外一个集合完全省掉。

```bash
> db.logmsg.findOne()
{
    time : ISODate(""2014-03-28T09:42:41.284Z".382Z"),
    message : 'cpu is on fire!',
    ipaddr : '127.66.66.66',
    hostname : 'goofy.example.com',
}
```

另一方面，你也可以将数据非规范化存储到“一”那一侧。假设你想将来自主机的最后 1000 条日志消息保留在 `hosts` 文档中。 你可以使用 MondoDB 2.4 中引入的 `$each` `$slice` 功能保留最后 1000 条消息，并且使其顺序不变。

```javascript
//  Get log message from monitoring system logmsg = get_log_msg();
log_message_here = logmsg.msg;
log_ip = logmsg.ipaddr;
// Get current timestamp
now = new Date()
// Find the _id for the host I’m updating
host_doc = db.hosts.findOne({ipaddr : log_ip },{_id:1});  // Don’t return the whole document
host_id = host_doc._id;
// Insert the log message, the parent reference, and the denormalized data into the ‘many’ side
db.logmsg.save({time : now, message : log_message_here, ipaddr : log_ip, host : host_id ) });
// Push the denormalized log message onto the ‘one’ side
db.hosts.update( {_id: host_id },{
    $push : {
        logmsgs : {
            $each:  [ { time : now, message : log_message_here } ],
            $sort:  { time : 1 },  // Only keep the latest ones
            $slice: -1000 }        // Only keep the latest 1000
    }
} );
```

注意，这里使用了投影规范（{_id: 1}), 可以防止 MongoDB 通过网络发送整个 `hosts` 文档。通过告诉 MongoDB 只返回 `_id` 字段，我们将网络开销减少到存储这个字段所需要的几个字节（当然，要加上传输协议的开销）。

就像在“一对很多”的情况下进行非规范化存储一样，你需要考虑读取和更新的频率比例。只有当更新日志消息的次数相对于应用程序需要查看单个主机的所有消息的次数很少时，才有意义。如果你希望查看数据的频率低于更新数据的频率，那么这种特殊的费正规化存储就不是一个好主意。

## 回顾

在这篇文章里，除了最进本的嵌入、子引用、父引用之外，我们还介绍了其他的选择：

* 如果双向引用能够用来提升你 `Schema` 的性能，并且你不在乎失去了进行原子查询的能力，那么你可以使用它
* 如果你正在使用引用（无论父引用、子引用)，你可以把数据从“一”非规范化存储到“多”，也可以将数据从“多”非规范化存储到“一”

当我们考虑是否使用非规范化存储的时候，需要考虑两个因素：

* 你无法对非规范化的数据进行原子更新
* 只有当读写比例较高的时候，非规范化才有意义

下一篇文章里，我将会在这些方式的选择上，给大家提供一些一些指导建议。