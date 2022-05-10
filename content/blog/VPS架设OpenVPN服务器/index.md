---
title: VPS架设OpenVPN服务器
date: "2016-09-20T17:27:32.284Z"
tags: 
- Linux 
- OpenVPN
categories:
- 技术文章
description: 本文主要讲述如何在Linux中架设OpenVPN服务器
toc: true
---

由于GFW如神一般的存在，使用局域网的我们不得不尝试去做一些事情，让自己接触外面的世界。
外面的世界很精彩，里面的世界很无奈。

由于前几天把所有东西从香港VPS搬到了Tokyo VPS，之前在windows下架设的VPN也就不能再用了。

这次架设VPN是在CentOS系统下，过程各种曲折。下面就把最简洁的方法奉上。

## 安装脚本获取

github简直无所不能，所以我在上面发现了一个安装OpenVPN的脚本，简直不要太方便
[GitHub飞机票](https://github.com/Nyr/openvpn-install)

```bash
#直接执行如下代码，获取执行一步完成
wget https://git.io/vpn -O openvpn-install.sh && bash openvpn-install.sh
```

配置什么的大家应该完全可以看懂。。。一路往下就ok了

## 问题处理
安装完成之后，可能会出现vpn可以连接，但是却无法上网的情况。

究其根源是路由转发的问题：

脚本中应该是多添加了一条`iptables nat`规则,那么我们把`iptables`的转发规则中的`-o eth0`那条去掉，只保留一条，即：
```bash
iptables -t nat -A POSTROUTING -s 10.8.0.0/24  -j MASQUERADE
```
然后
```bash
service iptables save
service iptables restart
```

## 悲剧收尾
就在千辛万苦的把所有的东西都搞定之后，VPN刚连上，google秒开，但是。。。
GFW实在太强了，连接建立好没3秒马上就能给你掐了,什么东西都ping不通了。。。 大写的服了，真服！

这个问题还没解决，有大神解决了的，给指点下迷津。。。

