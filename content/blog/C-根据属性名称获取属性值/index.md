---
title: 'C#根据属性名称获取属性值'
date: "2014-04-25T21:16:31.284Z"
tags: 
- CSharp
- .NET
categories: 
- .NET
---

有的时候我们会遇到这样的问题：  
把类的属性名称配置到配置文件中，然后需要通过这个属性名称获取当前实例的该属性的值。这个该怎怎么做呢？  
首先，我们声明一个`Person`类，设置两个属性`Name`，`Age`
```csharp
public class Person{
    public string Name { get; set; }
    public int Age { get; set; }
}
```
然后获取一个Person类的实例
```csharp
Person person = new Person{Name = "Ryan", Age = 20};
```
然后通过字符串`"Name"`来获取`person`对象的`Name`属性值
```csharp
 string name = person.GetType().GetProperty("Name").GetValue(person, null).ToString();
```
Well done，我们获取到这个属性的值了！
