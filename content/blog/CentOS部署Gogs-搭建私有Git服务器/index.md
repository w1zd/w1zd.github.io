---
title: CentOS部署Gogs-搭建私有Git服务器
date: "2019-03-12T23:00:23.284Z"
tags: 
- CentOS
- Linux
- Gogs
categories:
- 技术文章
description: "简单的介绍一款极易搭建的自助 Git 服务: Gogs的安装和使用"
toc: true
---


一般公司都需要有自己的私有源代码托管服务，而SVN这种东西又不太好用，应该算是已经过时了吧（我自己瞎BB一下就好，求大家别打脸）。
GitHub挺好用的，但是服务器再国外，而且创建私有库是需要软妹币的。
GitLab也可以用来部署私有Git服务器，后续如果有机会我再发一篇教程出来。

今天呢，简单的介绍一款极易搭建的自助 Git 服务: [Gogs](https://github.com/gogs/gogs)的安装和使用

## 第一步：准备依赖环境
* [安装和配置MySQL](https://github.com/a-gg/a-gg.github.io/issues/2)
* 创建用户及用户组`git`
```bash
groupadd git
useradd -g git git
```
* 安装git，这个简单`yum groupinstall "Development tools"`

## 第二步：下载Gogs解压二进制包
下载地址:[https://gogs.io/docs/installation/install_from_binary.html](https://gogs.io/docs/installation/install_from_binary.html)
```bash
wget https://dl.gogs.io/0.11.86/gogs_0.11.86_linux_amd64.tar.gz
```
解压：
```bash
tar -xvf gogs_0.11.86_linux_amd64.tar.gz
```

## 第三步：添加Gogs到系统服务
在gogs文件夹下面，已经提供了相应的模板文件`gogs/scripts/systemd/gogs.service`

我们需要将其复制到`/etc/systemd/system`目录下：
```bash
cp scripts/systemd/gogs.service /etc/systemd/system;
```

修改内容
```bash
vi /etc/systemd/system/gogs.service;
```
修改数据库，因为我们选择使用的MySQL所以将`After`修改成MySQL
```
After=mysqld.service
```

注释掉`Restart=always`(这一步是可选的，因为我自己在安装完成之后启动报错了，所以进行了如下的修改，如果你安装启动没问题，那么下面这一步，你可以不做)：
```
#Restart=always
```

注意看配置文件里的这个配置项：`ExecStart=/home/git/gogs/gogs web`
所以，我们需要把自己下载的gogs文件夹移动到git目录下，或者直接将这里路径改成自己需要的路径
```bash
mv gogs /home/git
```

激活服务：
```bash
systemctl enable gogs
```

## 创建数据库
在Gogs文件夹内也提供了相应的创建数据库的文件`mysqls.sql`，直接使用即可
```bash
mysql -uroot -p < scripts/mysql.sql
```

## 启动Gogs
```bash
systemctl start gogs
```

## 访问并进行设置安装
启动成功之后，可以使用[域名:3000](http://域名:3000)

成功打开页面之后，需要进行简单的设置，即可使用。

## 相关配置
在使用Gogs之后我们需要进行简单的配置
配置文件路径为： `custom/conf/app.ini`

打开你就基本能看懂什么是什么了。
这里面要改的：
```ini
APP_NAME = Gogs
RUN_USER = git
RUN_MODE = prod

[database]
DB_TYPE  = mysql
HOST     = 127.0.0.1:3306
NAME     = gogs
USER     = root
PASSWD   = 123456
SSL_MODE = disable
PATH     = data/gogs.db

[repository]
ROOT = /home/git/gogs-repositories

[server]
DOMAIN           = localhost  这要改，改成自己域名
HTTP_PORT        = 3000
ROOT_URL         = http://localhost:3000  这里也要改成自己域名
DISABLE_SSH      = false
SSH_PORT         = 22  在启用ssh的时候，这个端口一般都需要更改，否则gogs服务无法启动
START_SSH_SERVER = false  这里要改成true, 否则ssh链接无法使用
OFFLINE_MODE     = false

[mailer]
ENABLED = false

[service]
REGISTER_EMAIL_CONFIRM = false
ENABLE_NOTIFY_MAIL     = false
DISABLE_REGISTRATION   = false
ENABLE_CAPTCHA         = true
REQUIRE_SIGNIN_VIEW    = false

[picture]
DISABLE_GRAVATAR        = false
ENABLE_FEDERATED_AVATAR = false

[session]
PROVIDER = file

[log]
MODE      = file
LEVEL     = Info
ROOT_PATH = /home/git/gogs/log

[security]
INSTALL_LOCK = true
SECRET_KEY   = xxxx

```