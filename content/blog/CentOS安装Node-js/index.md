---
title: CentOS安装Node.js
date: "2016-11-22T23:00:23.284Z"
tags: 
- Linux
- CentOS
categories:
- 技术文章
description: 今天尝试着在CentOS7下安装Node.js，本想省事儿，直接使用了yum安装，但是后来发现使用yum安装的Node.js版本太低了，所以经历了一番波折。记录一下。
toc: true
---

## 第一种方式

yum自带源中没有Node.js,所以首先要获取Node.js资源：

```bash
# 4.x
curl --silent --location https://rpm.nodesource.com/setup_4.x | bash -
# 5.x
curl --silent --location https://rpm.nodesource.com/setup_5.x | bash -
# 0.10
curl --silent --location https://rpm.nodesource.com/setup | bash -
```

获取完成后，执行如下代码

```bash
yum install -y nodejs
```

安装完成之后使用如下指令测试安装是否成功

```bash
node -v
```

## 第二种方式

使用已经编译好的源码

去Node.js官方网站直接下载即可

```bash
wget https://nodejs.org/dist/v6.9.1/node-v6.9.1-linux-x64.tar.xz
```

由于是.xz格式的文件，需要用如下命令将其转换为tar可以处理的格式

```bash
xz -d node-v6.9.1-linux-x64.tar.xz
```

再使用`tar`对其进行解压

```bash
tar -xvf node-v6.9.1-linux-x64.tar
```

紧接着，可以修改一下文件夹名称，或者不修改也行，然后将文件夹放在合适的位置（随意）

```bash
mv node-v6.9.1-linux-x64 node
```

然后去修改`/etc/profile`,新增如下内容

```bash
export NODE_HOME=你的文件路径/node
export PATH=$NODE_HOME/bin:$PATH
```

然后重新登录就可以测试了

```bash
node -v
```

## 第三种方式

使用源码进行编译安装，首先要去官网下载源码

```bash
wget https://nodejs.org/dist/v6.9.1/node-v6.9.1.tar.gz
```

然后解压

```bash
tar -zxvf node-v6.9.1.tar.gz
```

紧接着，安装必要的编译软件：

* gcc
* gcc-c++
* python

这里要注意 gcc 好像要求是4.8以上的，如果不是可能报错

```bash
sudo yum install gcc gcc-c++
```

然后直接编译安装就好了

```bash
./configure
make && make install
```
