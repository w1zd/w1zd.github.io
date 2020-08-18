---
title: CentOS7安装Nginx
date: "2016-12-22T23:00:23.284Z"
tags: 
- Linux
- CentOS
categories:
- CentOS
description: CentOS7安装Nginx
toc: true
---

# CentOS7安装Nginx

## Step One-添加Nginx源

命令行中输入如下命令，添加Nginx源

```bash
sudo yum install epel-release
```

## Step Two-安装Nginx

```bash
sudo yum install nginx
```

## Step Three-启动Nginx

```bash
sudo systemctl start nginx
```

## Step Four-配置防火墙规则

如果使用的是防火墙

```bash
sudo firewall-cmd --permanent --zone=public --add-service=http 
sudo firewall-cmd --permanent --zone=public --add-service=https
sudo firewall-cmd --reload
```

如果是用的是iptables则手动添加端口规则