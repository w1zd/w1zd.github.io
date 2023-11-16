---
title: CentOS使用yum安装MySQL
date: "2019-05-07T18:03:57.284Z"
tags:
- MySQL
- Linux
- CentOS
categories:
- 技术文章
description: "CentOS中默认没有MySQL的yum源，直接使用yum install mysql-community-server会报错，本文介绍如何使用yum安装MySQL"
toc: true
---

CentOS中默认没有MySQL的`yum`源，直接使用`yum install mysql-community-server` 会报错。

下面记录使用`yum`安装`MySQL`的详细步骤：

## 第一步：下载并安装`MySQL`源
[yum-repo-mysql](https://dev.mysql.com/downloads/repo/yum/)，这个网址中可以找到yum的MySQL源。

### 下载：
```bash
wget https://dev.mysql.com/get/mysql80-community-release-el7-2.noarch.rpm
```
### 安装
```bash
sudo yum localinstall mysql80-community-release-el7-2.noarch.rpm
```
## 第二步： 安装MySQL
```bash
sudo yum install mysql-community-server -y
```
## 第三步： 启动MySQL
```bash
systemctl start msyqld
```
## 第四步： 找到默认密码
MySQL安装完毕之后会自动设置一个默认密码，我们需要找到默认密码

```bash
grep 'temporary password' /var/log/mysqld.log
```
![获取临时密码](https://raw.githubusercontent.com/w1zd/image-hosting/main/img/2022/05/10/13-44-43-da1c6d37edca4c602896f45b0d640436-temppass-071067.png)

## 第五步：连接到MySQL数据库，修改密码

这里连接需要用到上一步我们找到的数据库的默认密码。
```bash
mysql -uroot -p
```

连接成功之后，首先修改密码：
```bash
ALTER USER 'root'@'localhost' IDENTIFIED BY 'root123';
```

如果密码过于简单，比如我上面的密码，就很简单，会提示如下的错误：
![密码安全策略错误提示](https://raw.githubusercontent.com/w1zd/image-hosting/main/img/2022/05/10/13-44-54-de4733f62ba63683ed5f5e81e90b386f-passplicy-4ae126.png)

这里网上有很多教程，让设置如下两个变量（**你先往下看，别着急去执行这两条命令**）：
```bash
set global validate_password.policy=0;
set global validate_password.length=1;
```
这两项设置就是降低密码复杂度要求并且最小长度改成1的，但是如果是初次安装，默认密码还没有进行更改，这个操作是执行不了的，会有报错：`'validate_password_policy' 变量不存在`

所以首先，我们就需要先修改一个系统能接受的密码：（如：Fuck_66fuck）
```bash
ALTER USER 'root'@'localhost' IDENTIFIED BY 'Fuck_66fuck';
```
再去修改上面两个变量，然后重新设置一个简单的密码。
```bash
set global validate_password_policy=0;
set global validate_password_length=1;
```

上面这步可能会出错(出错信息如下)：
![设置变量错误提示](https://raw.githubusercontent.com/w1zd/image-hosting/main/img/2022/05/10/13-45-02-1b6535acccae5d289c55f8d5113d1479-errorinfo-5ec88c.png)

出错原因，是因为少密码校验的插件，给他装上就好了
```
install plugin validate_password soname 'validate_password.so';
```

这里还需要在注意一个问题，如果装的MySQL版本是8以上的话，上面那两个变量的名字就发生变化了，改的时候换成：
```
set global validate_password.policy=0;
set global validate_password.length=1;
```

最后再修改一个简单的密码：
```bash
ALTER USER 'root'@'localhost' IDENTIFIED BY '123456';
```

## 大功告成啦！
其他后续设置，以后用空我再补上来。