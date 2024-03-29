---
title: 树莓派刷OpenWrt-获取固件
date: 2020-03-17T12:23:12.284Z
tags:
- Linux
- 路由器
categories:
- 技术文章
description: 最近这几天连着好几个晚上一直在折腾OpenWrt，好累，这里把方法，和遇到的坑，都记录一下。
toc: true
---

## OpenWrt 概述

这东西到底能干啥？我为什么要费这么大劲刷这个玩意儿？

大白话，这东西是一个路由器固件（可以理解为操作系统），可以给你提供一个可定制化的路由器，你可以做DDNS、NAS、DLNA、FTP、Aria2、Global Ladder(这个看不懂就对了，哈哈) 等等等等。

有了这个东西你的路由器就能有超能力了！！！

## 设备要求

你的设备得能够支持刷固件，很多厂商造的路由器都不支持刷固件的。

我这边用的是当时被割韭菜（其实没啥体会，感觉就是免费拿路由，到底是不是被割韭菜了咱也不敢说，咱也不敢问）买的斐讯K2，还有树莓派3B，这俩都能用来玩OpenWrt。当然市场上还有很多可以玩的，好像斐讯全系都能玩，还有什么N1盒子。

## 准备工作

看到这里，我就默认你已经准备好设备了（K2或者Pi，当然其他设备也可以看，不过能不能让你找到灵感我就不知道了)。

接下来，我们需要的就是找到设备对应的固件。

哪里来呢？你有两种途径可以获取：

1. 找现成的别人编译好的固件，互联网资源这么丰富，直接去搜就完事儿了
2. 自己编译（Oh my god, 他居然让我自己编译？？编译是啥？？？ 别慌，往下看）

### 找别人编译好的

官方提供的我是不愿意用的，虽然功能也很丰富，但是我要的东西（Global Ladder）它没有，你们懂的。

gayhub上的可以找到很多别人自己进行过修改后编译的固件，这个太赞了。

* [官方网址](https://openwrt.org/toh/views/toh_fwdownload) 这里面有所有支持的设备列表
* [github](https://github.com) 搜索（设备名 OpenWrt)

### 自己编译

上面说的让大家去找别人编译好的固件，其实你能找到的固件，基本上都是从[Lean's OpenWrt source](https://github.com/coolsnowwolf/lede)出来的（不对这句话负责哦）, 有兴趣的同学可以去看一下。

那我们怎么编译呢？你有两个选择：

1. 自己部署编译环境（Ubuntu、g++、automake blablabla....)
2. 利用神器!!! **GitHub Action** (btw 我太爱这个了)

这里给大家提供两个项目地址, 都是用github Action来进行编译的：
[K2的固件 https://github.com/a-gg/openwrt-wt3200-firmware](https://github.com/a-gg/openwrt-wt3200-firmware)
[树莓派的固件 https://github.com/a-gg/Action-OpenWrt-Rpi](https://github.com/a-gg/Action-OpenWrt-Rpi)

## 开始编译

要怎么进行编译呢？

### 下载项目

fork 上面的 github 项目，并把项目 clone 到本地(git的使用自行学习，这里不讲了)

首先跟大家介绍一下项目的目录结构和文件组成。

|路径|说明|
|--|--|
|.github/workflows/xxx.yaml|这个是用来配置 github 的 workflow 的，也就是利用 Github Action 进行编译的关键，不要乱改，除非你知道你在做什么|
|xxxx.config|这个是我们要编译的 OpenWrt 固件的配置文件，你需要在固件中加入什么东西删除什么东西，基本上都是在这里配置的|
|xxx.sh|一般都是用来做固件的配置修改的，比如把路由管理地址修改为192.168.5.1, 再比如帮路由webUI更换主题等等|

[https://github.com/a-gg/Action-OpenWrt-Rpi](https://github.com/a-gg/Action-OpenWrt-Rpi)这个项目由于树莓派设备系列都可以用，所以配置文件就比较多，存在一个 `template` 目录，你需要使用哪个设备，就直接把 `template` 中的 `.config` 文件放在项目根目录，`.workflow` 文件拿出来放到`.github/workflows/`这个目录里

### 修改配置

按照自己的需要进行 config 文件的修改。这里面其实最主要的配置内容，就是要你要给你的 OpenWrt 增加或者删除哪些个功能
配置项主要是'luci-app-xxxx'这样的。

比如我要给自己的 OpenWrt 增加 ShadowsockR Plus+ 这个插件，那就找到文件对应的配置项，默认的应该是这样的

```yaml
# CONFIG_PACKAGE_luci-app-ssr-plus is not set
```

我们将其修改为下面这样，就能开启ssr plus客户端了

```yaml
CONFIG_PACKAGE_luci-app-ssr-plus=y
```

再比如我要开启 ShadowsockR Plus+ 的 Trojan协议，就找到如下的配置项, 注意这两行不是在一起的，逐行去搜索。

```yaml
# CONFIG_PACKAGE_luci-app-ssr-plus_INCLUDE_Trojan is not set
# CONFIG_PACKAGE_trojan is not set
```

修改为

```yaml
CONFIG_PACKAGE_luci-app-ssr-plus_INCLUDE_Trojan=y
CONFIG_PACKAGE_trojan=y
```

### push 代码

将修改后的代码，push 到 github，会自动出发 github action 的编译工作。

![](https://raw.githubusercontent.com/w1zd/image-hosting/main/img/2022/05/10/11-43-00-8841460d4fa6eb07ece4ce1bf737b46f-01-4473b6.png)

### 下载固件

等待编译完成之后就可以在 Github Action 里面下载编译好的固件了，这里要提醒一下，不要用下载工具下载，因为下载链接有权限校验，下载工具下载不下来。

![](https://raw.githubusercontent.com/w1zd/image-hosting/main/img/2022/05/10/11-43-24-cf8198ac0dc928863a8c2a8b6bf824fd-02-9e7d75.png)

<font color="red">到这里我们就已经获取到要用的固件了，下一篇我会告诉大家如何进行固件安装，敬请期待</font>
