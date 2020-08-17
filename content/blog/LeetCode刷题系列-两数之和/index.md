---
title: LeetCode刷题系列-两数之和
date: "2019-07-23T20:14:49.284Z"
tags: 
  - 算法
  - LeetCode
  - JavaScript
categories:
  - JavaScript
description: 给定一个整数数组 nums 和一个目标值 target，请你在该数组中找出和为目标值的那 两个 整数，并返回他们的数组下标。
toc: true
---

## 题目

> 给定一个整数数组 `nums` 和一个目标值 `target`，请你在该数组中找出和为目标值的那 `两个` 整数，并返回他们的数组下标。
> 你可以假设每种输入只会对应一个答案。但是，你不能重复利用这个数组中同样的元素。

## 示例

```plain
给定 nums = [2, 7, 11, 15], target = 9

因为 nums[0] + nums[1] = 2 + 7 = 9
所以返回 [0, 1]
```

## 答案

本题要求其实算是比较简单，只需要我们找出数组中任意两个相加之和等于目标数值的元素的下标即可。
而且题目说我们可以假设输入只会对应一个答案，也就是说不会出现多组数据相加都能得出目标数值的情况，我们只需要找一组，大大降低了难度。

### 方案一： 双层for循环

最简单的方案则是双层for循环，进行遍历判断，但是这种方案时间复杂度相对来说比较高 `O(n^2)`

```js
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    for(var i = 0; i < nums.length; i ++){
        for(var j = nums.length - 1; j > i; j --){
            if(nums[i] + nums[j] == target){
                return [i, j];
            }
        }
    }
    retrun []
};
```

### 方案二： hashmap

相比上面的双层for循环，这个方法的时间复杂度会比较低 `O(n)`

```js
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    let hashMap = {};
    for(var i = 0; i < nums.length; i ++){
        if(hashMap.hasOwnProperty(target - nums[i])){
            return [i, hashMap[target-nums[i]]];
        }
        hashMap[nums[i]] = i;
    }
};
```
