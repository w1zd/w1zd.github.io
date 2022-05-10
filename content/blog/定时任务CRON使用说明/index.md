---
title: 定时任务 cron 使用说明
date: 2021-04-29T11:45:12.284Z
tags:
- Linux
- DevOps
categories:
- Linux
description: Cron 是类 Unix 系统中用于执行定时任务的工具，我们可以通过 Cron 在固定时间、日期、间隔下，运行定期任务（可以是命令和脚本）。Cron 最常使用的是服务器运维和管理方向，当然也可用于其他地方，如：定期下载文件等。
toc: false
---

![](https://raw.githubusercontent.com/w1zd/image-hosting/main/img/2022/05/10/11-45-00-28024130c0135066048c989955be90e4-cover-cron-fb63c9.png)

## Cron 简介

`Cron` 是类 Unix 系统中用于执行定时任务的工具，我们可以通过 `cron` 在固定时间、日期、间隔下，运行定期任务（可以是命令和脚本）。`cron` 最常使用的是服务器运维和管理方向，当然也可用于其他地方，如：定期下载文件等。

> The origin of the name *cron* is from the Greek word for time, χρόνος ([chronos](https://en.wikipedia.org/wiki/Chronos)).
>
> Cron 的名字来历是古希腊神话中代表时间的神 Chronos

## Cron 使用

`crond` 可以理解为是用来执行定时任务的服务，而 `crontab` 则是用来管理定时任务的。

要使用 `Cron` 我们首先得确保自己系统的 `crond` 守护进程在运行，如果没有，则执行运行命令（什么？你没安装，[点这儿](https://google.com))

```bash
# 查看 crond 状态
systemctl status  crond.service
# 启动 crond
systemctl start  crond.service
```

`Cron` 任务的管理工具 `crontab` ，使用格外简单：

```bash
# crontab [选项]

#查看当前用户的 crontab，输入
crontab –l 
# 编辑 crontab
crontab –e 
# 删除 crontab
crontab –r  
```



我们直接 `crontab -e` 编辑当前用户的定时任务，这里需要用到 `Cron` 的语法（先直接用后面会讲具体用法）

```bash
# 当你执行了 crontab -e 之后，会自动调用VI编辑器打开一个空文件用作输入
# 我们直接输入下面这一行内容，然后:wq 保存退出即可

* * * * * echo `date` >> ~/hello.txt
```

保存成功后，使用 `crontab -l`，你会发现你的定时任务中已经多了一条，这条任务的作用就是每分钟向 `~/hello.txt`  中写入当前系统时间。

```bash
$crontab -l
* * * * * echo `date` >> ~/hello.txt
```

静待一会儿，去查看`~/hello.txt` 你会发现已经有内容了，就意味着我们的定时任务ok啦。

```bash
$cat hello.txt
Thu Apr 29 11:07:01 CST 2021
Thu Apr 29 11:08:01 CST 2021
Thu Apr 29 11:09:01 CST 2021
Thu Apr 29 11:10:01 CST 2021
Thu Apr 29 11:11:01 CST 2021
```

如果你不想要这个定时任务了，直接执行 `crontab -r` 即可，这里如果你只有一个任务，那就直接删掉了。如果你有多个任务，他会自动打开 vi，你只需要删掉不想要的那一行，保存退出即可。



## Cron 语法

```bash
┌──分钟（0 - 59）
│ ┌──小时（0 - 23）
│ │ ┌──日（1 - 31）
│ │ │ ┌─月（1 - 12）
│ │ │ │ ┌─星期（0 - 6，表示从周日到周六）
│ │ │ │ │
*  *  *  *  * <被执行的命令>
```

每部分的取值可以有如下表示方式：

- 逗号（**`,`**）表示列举，例如： **`1,3,4,7 * * * * echo hello world`** 表示，在每小时的1、3、4、7分时，打印"hello world"。
- 中划线（**`-`**）表示范围，例如：**`1-6 * * * * echo hello world`** ，表示，每小时的1到6分钟内，每分钟都会打印"hello world"。
- 星号（**`*`**）代表任何可能的值。例如：在“小时”里的星号等于是“每一个小时”。
- 百分号(**`%`**) 表示“每"。例如：**`*%10 * * * * echo hello world`** 表示，每10分钟打印一回"hello world"。



## Cron 注意事项(这部分不是特别关键)

### 执行权限问题

- **/etc/cron.allow** 如果这个文件存在，那么只有被添加到这个文件中的用户才能使用 cron
- **/etc/cron.deny** 如果 **/etc/cron.allow** 不存在，但是这个文件存在，那么用户不在这个文件里才能使用cron

### 定时任务查找位置

* `/etc/crontab`：为系统任务时间表（crontab）。以前用于跑以日为单位、以周为单位、以月为单位的任务，现在用于跑 `anacron`。
* `/etc/cron.d/`：该目录包含系统层次的任务时间表（crontabs），不同用户共同使用。
* `/var/spool/cron/`：该路径包含用户通过 `crontab` 命令创建的任务时间表（crontables），这个不要手动去改哦，要改就通过 `crontab` 命令改。





## 总结

`Cron` 可以非常方便的帮我们在 Linux 系统中执行定时任务，还有很多其他有周期任务需求的系统中也都支持 `Cron` 语法，比如我前面写过的 [GitHub Action 入门](/GithubActions入门/) ，如果你想定时执行你的 Github Action 就可以使用 `Cron`。