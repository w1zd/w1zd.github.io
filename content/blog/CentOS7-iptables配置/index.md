---
title: CentOS7 iptables配置
date: "2016-09-18T17:49:39.284Z"
tags: 
- CentOS
categories:
- 技术文章
description: CentOS7使用的防火墙默认为firewalle,本篇文章主要讲述如何在CentOS7中安装和使用iptables防火墙。
---

CentOS7使用的防火墙默认为firewalle,本篇文章主要讲述如何在CentOS7中安装和使用iptables防火墙。

安装iptable iptable-service

```bash
#先检查是否安装了iptables
service iptables status
#安装iptables
yum install -y iptables
#升级iptables
yum update iptables 
#安装iptables-services
yum install iptables-services
```
禁用/停止自带的firewalld服务

```bash
#停止firewalld服务
systemctl stop firewalld
#禁用firewalld服务
systemctl mask firewalld
```

设置现有规则

```bash
#查看iptables现有规则
iptables -L -n
#先允许所有,不然有可能会杯具
iptables -P INPUT ACCEPT
#清空所有默认规则
iptables -F
#清空所有自定义规则
iptables -X
#所有计数器归0
iptables -Z
#允许来自于lo接口的数据包(本地访问)
iptables -A INPUT -i lo -j ACCEPT
#开放22端口
iptables -A INPUT -p tcp --dport 22 -j ACCEPT
#开放21端口(FTP)
iptables -A INPUT -p tcp --dport 21 -j ACCEPT
#开放80端口(HTTP)
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
#开放443端口(HTTPS)
iptables -A INPUT -p tcp --dport 443 -j ACCEPT
#允许ping
iptables -A INPUT -p icmp --icmp-type 8 -j ACCEPT
#允许接受本机请求之后的返回数据 RELATED,是为FTP设置的
iptables -A INPUT -m state --state  RELATED,ESTABLISHED -j ACCEPT
#其他入站一律丢弃
iptables -P INPUT DROP
#所有出站一律绿灯
iptables -P OUTPUT ACCEPT
#所有转发一律丢弃
iptables -P FORWARD DROP
```
其他规则设定

```bash
#如果要添加内网ip信任（接受其所有TCP请求）
iptables -A INPUT -p tcp -s 45.96.174.68 -j ACCEPT
#过滤所有非以上规则的请求
iptables -P INPUT DROP
#要封停一个IP，使用下面这条命令：
iptables -I INPUT -s ***.***.***.*** -j DROP
#要解封一个IP，使用下面这条命令:
iptables -D INPUT -s ***.***.***.*** -j DROP
```
保存规则设定

```bash
#保存上述规则
service iptables save
```
开启iptables服务 

```bash
#注册iptables服务
#相当于以前的chkconfig iptables on
systemctl enable iptables.service
#开启服务
systemctl start iptables.service
#查看状态
systemctl status iptables.service
```

解决vsftpd在iptables开启后,无法使用被动模式的问题

1.首先在/etc/sysconfig/iptables-config中修改或者添加以下内容

```bash
#添加以下内容,注意顺序不能调换
IPTABLES_MODULES="ip_conntrack_ftp"
IPTABLES_MODULES="ip_nat_ftp"
```
2.重新设置iptables设置

```bash
iptables -A INPUT -m state --state  RELATED,ESTABLISHED -j ACCEPT
```

**以下为完整设置脚本**
```bash
#!/bin/sh
iptables -P INPUT ACCEPT
iptables -F
iptables -X
iptables -Z
iptables -A INPUT -i lo -j ACCEPT
iptables -A INPUT -p tcp --dport 22 -j ACCEPT
iptables -A INPUT -p tcp --dport 21 -j ACCEPT
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT
iptables -A INPUT -p icmp --icmp-type 8 -j ACCEPT
iptables -A INPUT -m state --state RELATED,ESTABLISHED -j ACCEPT
iptables -P INPUT DROP
iptables -P OUTPUT ACCEPT
iptables -P FORWARD DROP
service iptables save
systemctl restart iptables.service
```

##如何删除单条规则？
```bash
#先使用行号显示所有规则
iptables -t nat -L -n --line-numbers
#找到要删除的规则，确认前面的行号，使用下面的命令进行删除
iptables -t nat -D PREROUTING 行号
```

##如何删除多条规则？
```bash
#将所有的iptables规则导出到iptableRules文件
iptables-save > iptablesRules
#打开该文件，将你不想要的所有规则都删掉，改完记得保存
#保存完之后使用该文件重新配置iptables
iptables-restore < iptablesRules
```
