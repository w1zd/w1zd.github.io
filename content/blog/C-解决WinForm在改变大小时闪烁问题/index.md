---
title: 'C#解决WinForm在改变大小时闪烁问题'
date: "2014-04-01T14:17:44.284Z"
tags: 
- C#
- .NET
- WinForm
categories: 
- .NET
description: 最近写WinForm程序的时候遇见一个问题，就是在拖动窗体改变大小的时候，窗体闪烁会非常严重。
toc: true
---

## 问题发现
最近写WinForm程序的时候遇见一个问题，就是在拖动窗体改变大小的时候，窗体闪烁会非常严重。

网上找的解决方案都是说用`双缓冲`进行处理。

## 双缓冲
在图形图像处理编程过程中，双缓冲是一种基本的技术，如果窗体在响应OnPaint事件的时候要进行复杂的图形处理，那么窗体在重绘的时候由于过频的刷新而引起闪烁现象。
使用双缓冲时，更新的图形首先被绘制到内存的缓冲区中，然后，此缓冲区的内容被迅速写入某些或所有显示的图面中。

双缓冲实现过程如下：
1、在内存中创建与画布一致的缓冲区
2、在缓冲区画图
3、将缓冲区位图拷贝到当前画布上
4、释放内存缓冲区

## 没用的方案
下面列出来比较多见的一种做法：
```cs
this.SetStyle(ControlStyles.OptimizedDoubleBuffer | 　　
                  ControlStyles.ResizeRedraw |
                  ControlStyles.AllPaintingInWmPaint, true);
```
但是这样写之后，状况并没有太大的改善，在拖动窗体大小的时候，闪烁情况依旧非常明显。

## 有用的方案(CreateParams)
使用双缓冲之后并没有什么收获，所以，费劲九牛二虎之力的我找到了`CreateParams`这个东西。

窗体和控件的属性`CreateParams`（这真的是一个属性）很神奇，因为通过它你能够很方便的控制窗体或控件诸如边框、最大化最小化关闭按钮的隐藏、窗体的模式化弹窗模式等的一些特性。

那具体怎么操作呢？

在主窗体的任意位置重写CreateParams，便能大幅改善闪烁的状况，代码如下：
```cs
protected override CreateParams CreateParams
{
    get
    {
        CreateParams cp = base.CreateParams;
        cp.ExStyle |= 0x02000000;////用双缓冲绘制窗口的所有子控件
        return cp;
    }
}
```

