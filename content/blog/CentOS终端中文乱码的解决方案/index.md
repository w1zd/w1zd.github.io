---
title: CentOS终端中文乱码的解决方案
date: "2017-04-06T11:47:15.284Z"
tags:
- CentOS
- Linux
categories:
- CentOS
description: 在使用ssh连接CentOS的时候，发现终端中出现中文乱码的问题，记录一下解决方案
toc: true
---

# CentOS终端中文乱码的解决方案

在使用ssh连接CentOS的时候，发现终端中出现中文乱码的问题，记录一下解决方案

## 问题描述

当ssh连接后，终端中显示如下：

```bash
-bash: warning: setlocale: LC_CTYPE: cannot change locale (UTF-8): No such file or directory
```

## 解决方案

编辑`/etc/enviroment`文件，加入语言设置即可

```bash
vi /etc/environment
```

添加如下内容

```bash
LANG=en_US.utf-8
LC_ALL=en_US.utf-8
```