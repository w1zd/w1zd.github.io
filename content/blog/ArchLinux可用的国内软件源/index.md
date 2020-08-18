---
title: ArchLinux Arm 可用的国内软件源
date: "2020-03-23T23:46:17.284Z"
tags:
- Arch
categories: 
- Arch
description:
---

今天尝试给自己的树莓派 3B+ 装了 ArchLinux，但是装好之后 pacman 安装软件各种慢，发现是软件源的问题，就尝试网上找了一些相应的国内软件源，配置好之后，又各种报错404。

** 树莓派安装的是 Arm 版的 ArchLinux， 所以软件源也应该找相应 Arm 版的 **

下面是几个国内可用的 ArchLinux Arm 软件源，添加到 `/etc/pacman.d/mirrorlist` 中即可正常使用

```bash
## 清华

Server = http://mirrors.tuna.tsinghua.edu.cn/archlinuxarm/$arch/$repo

## 中科大

Server = http://mirrors.ustc.edu.cn/archlinuxarm/$arch/$repo

## 成都电子科大

Server = http://mirrors.stuhome.net/archlinuxarm/$arch/$repo
```

在设置完软件源之后，需要执行下面的命令，初始化key

```bash
pacman-key --init
pacman-key --populate
```
