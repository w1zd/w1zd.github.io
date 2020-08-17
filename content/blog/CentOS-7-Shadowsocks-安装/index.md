---
title: CentOS 7 Shadowsocks 安装
date: "2016-09-29T22:53:05.284Z"
tags:
- Linux
- CentOS
- ShadowSocks
categories:
- CentOS
description: 之前使用OpenVPN失败，之后又尝试了OpenVPN+Obfs，还是失败，这次我们来试试ShadowSocks!!!
toc: true
---

架设VPN服务器真不是件容易的事儿，之前尝试了`OpenVPN`，满心欢喜的搭建好之后发现被墙了，那个失落感。。。后来又不断的爬帖子，找到了使用`Obfsproxy`混淆`OpenVPN`的招，但是经过尝试之后，还是不行。

之前咨询VPS客服的时候告诉我，服务器只支持`OpenVPN`，难住我了，一度都要放弃了。后来在网上看到有关于`obfs4`的相关内容，也不想去看了，心累。但后来询问客服，又得到一个好消息，就是`ShadowSocks`是支持的，今天动手，尝试了一番，算是小有成果。

## ShadowSocks简介

ShadowSocks是基于`Socks5`,使用Python,C++,C#等语言开发的，用于保护网络流量、加密资料传输的工具。

注意ShadowSocks不是VPN，它只是网络代理，不能用作匿名通信，他的宗旨不在于提供完善的通信安全机制，而是为了协助用户突破某些网络环境的封锁。

## 安装步骤

在CentOS下，安装ShadowSocks的方法有好多种。

### 第一种
通过github,[https://github.com/shadowsocks/shadowsocks-libev](https://github.com/shadowsocks/shadowsocks-libev)

首先安装所需的库
```bash
sudo yum install gcc autoconf libtool automake make zlib-devel openssl-devel asciidoc xmlto
```
clone git库
```bash
git clone https://github.com/shadowsocks/shadowsocks-libev.git
```

编译安装
```bash
cd shadowsocks-libev
./configure && make
sudo make install
```

### 第二种

直接通过`yum`安装
```bash
yum install shadowsocks-libev
```

### 第三种

一键脚本安装
```bash
cd /tmp
wget --no-check-certificate https://raw.githubusercontent.com/teddysun/shadowsocks_install/master/shadowsocks-libev.sh
chmod +x shadowsocks-libev.sh
./shadowsocks-libev.sh 2>&1 | tee shadowsocks-libev.log
```

## 配置

ShadowSocks配置文件所在位置为：
```bash
/etc/shadowsocks-libev/config.json
```
配置文件格式为：
```json
{
    "server":["[::0]","0.0.0.0"],
    "server_port":your_server_port,
    "local_address":"127.0.0.1",
    "local_port":1080,
    "password":"your_password",
    "timeout":600,
    "method":"aes-256-cfb"
}
```

## 启动命令
```bash
service shadowsocks start   # 启动
service shadowsocks stop    # 停止
service shadowsocks restart # 重启
```

如果是使用git库自己编译安装的，可能会没法使用上面的命令进行启动。具体原因还在调查当中。哈哈哈，不过如果出现了不能使用的情况，可以先用`ss-server`凑合。

也可以通过如下方式自己新建启动脚本文件:

新建启动脚本文件/etc/systemd/system/shadowsocks.service，内容如下：
```bash
[Unit]
Description=Shadowsocks

[Service]
TimeoutStartSec=0
ExecStart=/usr/local/bin/ss-server -c /etc/shadowsocks-libev/config.json

[Install]
WantedBy=multi-user.target
```

执行以下命令启动ShadowSocks服务:
```bash
$ systemctl enable shadowsocks
$ systemctl start shadowsocks
```
为了检查ShadowSocks服务是否已经成功启动，可以执行如下命令来查看服务的状态：
```bash
systemctl status shadowsocks -l
```
