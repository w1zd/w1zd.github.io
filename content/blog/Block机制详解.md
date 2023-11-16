---
title: Block机制详解
date: "2015-04-06T11:47:15.284Z"
tags:
- Obj-C
- iOS
categories:
- 技术文章
description: 我们知道在Block使用中，Block内部能够读取外部局部变量的值。但我们需要改变这个变量的值时，我们需要给它附加上`__block`修饰符。
---
## Block机制详解

我们知道在`Block`使用中，`Block`内部能够读取外部局部变量的值。但我们需要改变这个变量的值时，我们需要给它附加上`__block`修饰符。

`__block`另外一个比较多的使用场景是，为了避免某些情况下Block循环引用的问题，我们也可以给相应对象加上`__block`修饰符。

为什么不使用`__block`就不能在`Block`内部修改外部的局部变量？

我们把以下代码通过 clang -rewrite-objc 源代码文件名重写：

```objc
int main(int argc, const char * argv[]) {
    @autoreleasepool {
      int val = 10;
      void (^block)(void) = ^{
        NSLog(@"%d", val);
      };
      block();
    }
  return 0;
}
```

可得到如下代码：

```objc
struct __Block_byref_val_0 {
   void *__isa;
   __Block_byref_val_0 *__forwarding;
   int __flags;
   int __size;
   NSInteger val;
};
struct __main_block_impl_0 {
    struct __block_impl impl;
    struct __main_block_desc_0* Desc;
    __Block_byref_val_0 *val; // by ref
    __main_block_impl_0(void *fp, struct __main_block_desc_0 *desc, __Block_byref_val_0 *_val, int flags=0) : val(_val->__forwarding) {
    impl.isa = &_NSConcreteStackBlock;
    impl.Flags = flags;
    impl.FuncPtr = fp;
    Desc = desc;
    }
};
static void __main_block_func_0 (struct __main_block_impl_0 *__cself) {
  __Block_byref_val_0 *val = __cself->val; // bound by ref
  (val->__forwarding->val) = 1;
}
static void __main_block_copy_0 (struct __main_block_impl_0*dst, struct __main_block_impl_0*src) {
  _Block_object_assign((void*)&dst->val, (void*)src->val, 8/*BLOCK_FIELD_IS_BYREF*/);
}
static void __main_block_dispose_0 (struct __main_block_impl_0*src)   {
  _Block_object_dispose((void*)src->val, 8/*BLOCK_FIELD_IS_BYREF*/);
}
static struct __main_block_desc_0 {
  size_t reserved;
  size_t Block_size;
  void (*copy)(struct __main_block_impl_0*, struct __main_block_impl_0*);
  void (*dispose)(struct __main_block_impl_0*);
} 
__main_block_desc_0_DATA = { 0, sizeof(struct __main_block_impl_0), __main_block_copy_0, __main_block_dispose_0};
int main(int argc, const char * argv[]) {
  {   
    __AtAutoreleasePool __autoreleasepool; 
    __attribute__((__blocks__(byref))) __Block_byref_val_0 val = {(void*)0,(__Block_byref_val_0 *)&val, 0, sizeof(__Block_byref_val_0), 0};
    void (*block)(void) = (void (*)())&__main_block_impl_0((void *)__main_block_func_0, &__main_block_desc_0_DATA, (__Block_byref_val_0 *)&val, 570425344);
    ((void (*)(__block_impl *))((__block_impl *)block)->FuncPtr)((__block_impl *)block);
    NSLog((NSString *)&__NSConstantStringImpl__val_folders_gm_0jk35cwn1d3326x0061qym280000gn_T_main_d7fc4b_mi_0, (val.__forwarding->val));
  }
  return 0;
}
```

我们发现由`__block`修饰的变量变成了一个`__Block_byref_val_0`结构体类型的实例。该结构体的声明如下：

```objc
struct __Block_byref_val_0 {
   void *__isa;
   __Block_byref_val_0 *__forwarding;
   int __flags;
   int __size;
   NSInteger val;
};
```

注意到这个结构体中包含了该实例本身的引用`__forwarding`。
我们从上述被转化的代码中可以看出 Block 本身也一样被转换成了`__main_block_impl_0`结构体实例，该实例持有`__Block_byref_val_0`结构体实例的指针。
我们再看一下赋值和执行部分代码被转化后的结果：

```objc
static void __main_block_func_0 (struct __main_block_impl_0 *__cself) {
  __Block_byref_val_0 *val = __cself->val; // bound by ref
  (val->__forwarding->val) = 1;
}
((void (*)(__block_impl *))((__block_impl *)block)->FuncPtr)((__block_impl *)block);
```

我们从`__cself`找到`__Block_byref_val_0`结构体实例，然后通过该实例的`__forwarding`访问成员变量`val`。成员变量`val`是该实例自身持有的变量，指向的是原来的局部变量。

上面部分我们展示了`__block`变量在Block查看和修改的过程，那么问题来了：
当block作为回调执行时，局部变量`val`已经出栈了，这个时候代码为什么还能正常工作呢?
我们为什么是通过成员变量`__forwarding`而不是直接去访问结构体中我们需要修改的变量呢? `__forwarding`被设计出来的原因又是什么呢？

**存储域**
通过上面的描述我们知道Block和`__block`变量实质就是一个相应结构体的实例。

我们在上述转换过的代码中可以发现`__main_block_impl_0`结构体构造函数中， `isa`指向的是`_NSConcreteStackBlock`。

Block还有另外两个与之相似的类:
`_NSConcreteStackBlock`保存在栈中的block，出栈时会被销毁
`_NSConcreteGlobalBlock`全局的静态block，不会访问任何外部变量
`_NSConcreteMallocBlock`保存在堆中的block，当引用计数为0时会被销毁

上述示例代码中，Block是被设为`_NSConcreteStackBlock`，在栈上生成。

当我们把Block作为全局变量使用时，对应生成的Block将被设为`_NSConcreteGlobalBlock`，如:

```objc
void (^block)(void) = ^{NSLog(@"This is a Global Block");};
int main(int argc, const char * argv[]) {
  @autoreleasepool {
    block();
  }
  return 0;
}
```

该代码转换后的代码中，Block结构体的成员变量isa的初始化如下:

```objc
impl.isa = &_NSConcreteGlobalBlock;
```

**那么_NSConcreteMallocBlock在什么时候被使用呢？**

分配在全局变量上的Block，在变量作用域外也可以通过指针安全的访问。但分配在栈上的Block，如果它所属的变量作用域结束，该Block就被废弃。同样地，`__block`变量也分配在栈上，当超过该变量的作用域时，该`__block`变量也会被废弃。  

这个时候_NSConcreteMallocBlock就登场了，Blocks提供了将Block和`__block`变量从栈上复制到堆上的方法来解决这个问题。将分配到栈上的Block复制到堆上，这样但栈上的Block超过它原本作用域时，堆上的Block还可以继续存在。 

复制到堆上的Block，它的结构体成员变量`isa`将变为:

```objc
impl.isa = &_NSConcreteMallocBlock;
```

而`_block`变量中结构体成员`__forwarding`就在此时保证了从栈上复制到堆上能够正确访问`__block`变量。在这种情况下，只要栈上的`_block`变量的成员变量`__forwarding`指向堆上的实例，我们就能够正确访问。  

我们一般可以使用copy方法手动将 Block 或者`__block`变量从栈复制到堆上。比如我们把Block做为类的属性访问时，我们一般把该属性设为copy。有些情况下我们可以不用手动复制,比如Cocoa框架中使用含有`usingBlock`方法名的方法时，或者GCD的API中传递Block时。  

当一个Block被复制到堆上时，与之相关的`__block`变量也会被复制到堆上，此时堆上的Block持有相应堆上的`__block`变量。当堆上的`__block`变量没有持有者时，它才会被废弃。(这里的思考方式和objc引用计数内存管理完全相同。)
而在栈上的`__block`变量被复制到堆上之后，会将成员变量`__forwarding`的值替换为堆上的`__block`变量的地址。这个时候我们可以通过以下代码访问:

```objc
val.__forwarding->val
```

**`__block`变量和循环引用问题**
`__block`修饰符可以指定任何类型的局部变量，上面的转换代码中，有如下代码:

```objc
static void __main_block_copy_0 (struct __main_block_impl_0*dst, struct __main_block_impl_0*src) {
  _Block_object_assign((void*)&dst->val, (void*)src->val, 8/*BLOCK_FIELD_IS_BYREF*/);
}
static void __main_block_dispose_0 (struct __main_block_impl_0*src)   {
  _Block_object_dispose((void*)src->val, 8/*BLOCK_FIELD_IS_BYREF*/);
}
```

当Block从栈复制到堆时，会使用`_Block_object_assign`函数持有该变量(相当于`retain`)。当堆上的Block被废弃时，会使用`_Block_object_dispose`函数释放该变量(相当于`release`)。

由上文描述可知，我们可以使用下述代码解除Block循环引用的问题:

```objc
void(^block)(void) = ^{
  tmp = nil;
};
block();
```

通过执行block方法，`nil`被赋值到`_block`变量`tmp`中。这个时候`_block`变量对`self`的强引用失效，从而避免循环引用的问题。使用`__block`变量的优点是:
通过`__block`变量可以控制对象的生命周期
在不能使用`__weak`修饰符的环境中，我们可以避免使用`__unsafe_unretained`修饰符
在执行Block时可动态地决定是否将nil或者其它对象赋值给`__block`变量
但是这种方法有一个明显的缺点就是，我们必须去执行Block才能够解除循环引用问题，否则就会出现问题。
