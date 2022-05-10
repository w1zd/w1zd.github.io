---
title: Ubuntu 14.04 亮度BUG解决方案
date: "2014-04-24T01:11:47.284Z"
tags:
- Ubuntu
categories:
- 技术文章
---

从去年9月份，不少Ubuntu 13.10用户遇到了屏幕亮度设置异常问题，无法调节亮度级别，尤其使用英特尔的平台。同样该系统BUG在最新开发的Ubuntu 14.04 (Trusty Tahr)中也继续存在，官方也没有及时修复该问题。  

如果你现有的平台基于英特尔，使用了英特尔芯片组，在Ubuntu 13.10/Ubuntu 14.04系统下，无法更改屏幕亮度级别。  

具体问题如下，打开系统设置，进入“亮度&锁屏”选项，调节亮度级别都无法正常生效。

除了影响英特尔平台外，不少使用英伟达显卡设备的用户也会遇到该系统问题，目前爱好者已经发布临时的解决方案。

## 解决步骤（仅限英特尔平台）

1. 打开终端，输入Sudo安装命令：
```bash
sudo gedit /usr/share/X11/xorg.conf.d/20-intel.conf
```
2. 打开一个参数文件，输入密码，获取root授权
3. 在该文本中输入如下设置参数，重新保存该参数文件，重启当前系统。
```bash
Section “Device”
Identifier “card0”
Driver “intel”
Option “Backlight” “intel_backlight”
BusID “PCI:0:2:0”
EndSection
```
重启，系统设置功能下的“亮度&锁屏”选项可以对屏幕亮度进行控制。
