#     使用 `CSS3 `新特性 `:is()` , `@layer` 覆写 `!important` 

如果想覆盖如下样式:

```css
td {height: 100px !important}
```

我们可以添加另一个CSS规则,同样具有 `!important` 同时赋予它更高的层级,如添加额外的选择器(标签,ID或者class选择器),

同时我们可以在内联样式中添加`!important`, 给元素添加的**内联样式** (例如，`style="font-weight:bold"`) 总会覆盖外部样式表的任何样式，因此可看作是具有最高的优先级。

或者,使用JS进行覆盖也是为一个办法: 

```js
$('.mytable td').attr('style', 'display: none !important');
```

在了解到一些CSS3的选择器之后,可以使用:is()和:not() 结合使用,为css选择器设置任意的层级:
```css
:is(td, #A#A#A:not(*)) {height: 200px !important}
```

MDN文档: 

[:is() (:matches(), :any())](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:is) , [:not()](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:not)

`:is()` 选择器的大致作用如下:

```css
/* 选择 header、main、footer 里的任意一个悬浮状态的段落 */
:is(header, main, footer) p:hover {
  color: red;
  cursor: pointer;
}

/* 以上内容相当于以下内容 */
header p:hover,
main p:hover,
footer p:hover {
  color: red;
  cursor: pointer;
}
```

我们继续回头看我们的代码:

```css
:is(td, #A#A#A:not(*)) {height: 200px !important}
```

首先, `:is()` 计入整体选择器的优先级（它接受优先级最高参数的优先级）,同时 与之类似的 [`:where()`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:where) 的优先级为 0

`:not(*)` 部分意味着该选择器永远不会匹配任何元素本身,但是 `#A#A#A `提供了三个ID选择器(3,0,0),我们几乎可以覆盖所有的 `!important` 同时不需要担心副作用,  ~~`!important` 已经够让人心累了~~  但是这种方法仍然属于歪门邪道(hack代码)

不过,还有更好的方法: [`@layer`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@layer) 级联层,级联层内部的样式永远高于级联层外部的样式,后声明的级联层层级高于先前的

```css
@layer { 
   td {height: 200px !important} 
}
```

**PS:请注意，这两种方法都不允许您覆盖 HTML 样式属性中的 !important 设置。**

[`@layer` 兼容性查询](https://caniuse.com/mdn-css_at-rules_layer)

![image-20230213214401646](https://s2.loli.net/2023/02/13/f9GCSl5Yhz3QDoF.png)

截止到 `2023/02/13` 兼容性马马虎虎吧