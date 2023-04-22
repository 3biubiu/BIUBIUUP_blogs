# 在SVG中插入HTML标签

## 需求背景:

设计想要在SVG绘图中做折行打点出省略号的功能,先前的代码需要在IE环境下运行,使用JS函数进行分割替换打点,然后还要手动定位,很是麻烦,不过当时的样式不是很复杂,还要适配IE就迁就了,这次除了两行打点功能之外, 还要考虑到整体内容做一个自适应居中效果,而且不考虑IE适配,索性使用[**`foreignObject`**](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/foreignObject)

来看一下MDN的解释:

> [SVG](https://developer.mozilla.org/zh-CN/docs/Web/SVG)中的 **`foreignObject`** 元素允许包含来自不同的 XML 命名空间的元素。在浏览器的上下文中，很可能是 XHTML / HTML。

## foreignObject

具有四个属性,分别为`height`,`width`,`x`,`y` ,这些属性与常规的SVG元素一致,支持动画过渡效果,没什么好说的,

**备注：** 从 SVG2 开始，x、y、宽度和高度都是几何属性，这意味着这些属性也可以用作该元素的 CSS 属性。

```html
<foreignObject x="20" y="20" width="160" height="160">
    // 需要给内部的html/xhtml元素添加命名空间
    <div xmlns="http://www.w3.org/1999/xhtml"> 
      \Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Sed mollis mollis mi ut ultricies. Nullam magna ipsum,
      porta vel dui convallis, rutrum imperdiet eros. Aliquam
      erat volutpat.\
    </div>
</foreignObject>
```

**TIPS:** 如果使用D3等框架进行SVG的绘制操作,在foreignObject内部进行append操作是 需要注意:

```javascript
d3.select('foreignObject').append('div')
//❎ 直接使用"div" 不起作用,渲染出的元素不会出出现在浏览器中
d3.select('foreignObject').append('xmlns:div')
//✅ 有效
```

如果不指定命名空间,`div` 只是一个普通的XML元素,不具备HTML的含义,传统的开发中,我们写的HTML语法本身具有默认格式,在SVG这种XML语言中,div没有特殊含义,所以需要为他指明HTMl的命名空间.

