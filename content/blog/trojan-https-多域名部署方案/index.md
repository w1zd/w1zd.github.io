---
title: 使用Trojan 的情况下多个 HTTPS 域名部署方案
date: "2020-08-13T16:32:59.284Z"
tags:
- Trojan
- Linux
- Nginx
categories:
- 技术文章
description: Trojan 是目前比较便捷且可靠的扶墙工具， 但是其本身工作方式会导致在使用 Trojan 的同时， 多 HTTPS 域名部署会是一个小问题， 本文带你解决这个问题。
---

## Trojan 原理简介

最简单来讲， Trojan 是通过 HTTPS 的方式进行穿墙操作的， 也就是所有的请求， 先通过 Trojan 客户端加工之后， 以正常 HTTPS 请求的方式发往墙外服务器， 然后在 Trojan 服务端， 对请求内容进行解析后， 将原请求转发给目标服务器，再将目标服务器返回的数据包装成正常的 HTTPS 响应包返回给 Trojan 客户端。

![](https://raw.githubusercontent.com/w1zd/image-hosting/main/img/2022/05/10/11-47-23-9a16a4b0495228a521a9d199a5726835-TrojanDataFlow-a4e62d.png)

## Trojan 和 Nginx 的配合模式

由于整个穿墙操作借助的是 TLS， 所以 Trojan 需要监听 443 端口， 而 Nginx 则是在 Trojan 后面提供网页服务的。 也就是说其实 Trojan 会导致 Nginx 无法使用 HTTPS， Trojan 会独占 443 端口， 只为穿墙域名提供 HTTPS 服务， Nginx 只能使用 HTTP。 这就很蛋疼了， 为了穿墙导致其他域名全部无法使用 HTTPS， 如果这台服务器单纯就是用来扶墙的还好， 但是如果还有别的站点需要进行托管， 那就很不爽了。

我们可以通过一张图来看一下 Trojan 和 Nginx 的配合模式。

![](https://raw.githubusercontent.com/w1zd/image-hosting/main/img/2022/05/10/11-47-02-f7ba184481751dd1b336a655ffdc0d1d-trojan-nginx-cff97a.png)

单看图，是不是觉得挺好啊，Trojan 这不是能识别 Trojan 请求和非 Trojan 请求么？ 那其他需要托管的站点通过浏览器访问的时候，不都应该是正常的么？ 想法是美好的，当然如果你不在乎是不是 HTTPS，现实也很美好。

## 问题是什么

Trojan 只能为一个域名配置 HTTPS，而它本身又独占了 443 端口， 就导致你的<font color='red'>***整台服务器上就只能有一个 HTTPS 域名服务***</font>, 多个 HTTPS 配置不了。

那么，如何在使用 Trojan 的时候， 部署多个 HTTPS 站点呢？

## 解决方案

在[Trojan 和 Nginx 的配合模式](#Trojan-和-Nginx-的配合模式)一节中我们知道， 所有请求先是经过 Trojan， 然后由 Trojan 进行甄别之后决定是否要交给 Nginx 进行处理。

我们把处理流程进行一下更改，其实就能是实现我们的需求了。 如图:

![](https://raw.githubusercontent.com/w1zd/image-hosting/main/img/2022/05/10/11-47-14-071491d6e3b416d08e1f717e6efeebdc-nginxinfront-a56ad6.png)

这样的话，我们就把 443 端口从 Trojan 中解放出来交还给了 Nginx。 所有请求先到达 Nginx， Nginx 中进行处理， 如果请求的是为 Trojan 配置的域名， 那么就将请求转发给 Trojan， 如果不是则由 Nginx 自行处理。

使用 Nginx `ngx_stream_ssl_preread_module` 这个模块就能满足我们的诉求。 [看这儿](https://github.com/trojan-gfw/trojan/issues/131#issuecomment-535122993)

### 具体配置

***/etc/nginx/nginx.conf***

```nginx
...
stream{
        map $ssl_preread_server_name $name {
            trojan.xxx.com trojan;
            anotherdomain.com nginx;
        }

        upstream trojan {
            server 127.0.0.1:8889;
        }

        upstream nginx {
            server 127.0.0.1:8888;
        }

        server {
            listen      443;
            listen      [::]:443;
            proxy_pass  $name;
            ssl_preread on;
        }
}
http {
    server {
        server {
        listen       8888 ssl;
        listen       [::]:8888 ssl;
        server_name  anotherdomain.com;
        ssl_certificate  xxxxxx.crt;
        ssl_certificate_key xxxxxxx.key;
        sl_protocols       TLSv1 TLSv1.1 TLSv1.2;
        ssl_ciphers         HIGH:!aNULL:!MD5;
        ...
    }
}
...
```

***/usr/src/trojan/server.conf***

```json
{
    "run_type": "server",
    "local_addr": "0.0.0.0",
    "local_port": 8889,
    "remote_addr": "127.0.0.1",
    "remote_port": 80,

    ...
}
```

## 后续更新

这里要注意一下，可能是不同方式安装的 Nginx 版本不一致的问题，可能会导致安装之后 `ngx_stream_ssl_preread_module` 模块找不到的问题。

可以通过以下两种方式解决：
1. 通过 yum 安装 Nginx（推荐）[可以参考之前的文章](https://w1zd.xyz/CentOS7%E5%AE%89%E8%A3%85Nginx/)
2. 自行下载编译 Nginx 
...

还可能会遇到
```
nginx: [emerg] unknown directive "stream" in /etc/nginx/nginx.conf:18
```
只需要
```
yum install nginx-mod-stream.x86_64
```
