---
title: WordPress插件安装时Missing archive file
date: "2014-03-21T19:59:55.284Z"
tags:
- WordPress
categories:
- WordPress
---

打开wordpress根目录下的wp-config.php文件
找到如下：

```php
/** WordPress 目录的绝对路径。 */
if ( !defined(‘ABSPATH’) )
define(‘ABSPATH’, dirname(__FILE__) . ‘/’);
```
在下面增加如下代码即可：
```php
/** 指定WordPress的临时目录 */
define(‘WP_TEMP_DIR’, ABSPATH . ‘wp-content/temp’);
```
最后再wp-content文件夹下新建个temp文件夹，更新。