# 父元素Hover样式不生效

遇到需求: 想要实现父元素hover时,两个子元素字体颜色都变化,但是一开始怎么设置都不生效.

开发时写过如下代码: 

```html
<!DOCTYPE html>
<html lang="en">

<head>
  
</head>

<body>
    <div class="wrap">
        <p class="item-one">子元素1</p>
        <p class="item-two">子元素2</p>
    </div>

    <style>
        .wrap {}

        .item-one {
            color: black;
        }

        .item-two {
            color: black;
        }
		
        /* 方法1 这样是无效的 */
        .wrap:hover {
            color: red;
        }

        /* 方法2 这样使有效的 */
        /* .wrap:hover .item-one {
            color: red;
        }
        .wrap:hover .item-two {
            color: red;
        } */
    </style>
</body>

</html>
```



当时使用第一种 `hover` 方案,字体颜色怎么都不会变,使用第二种方案就可以了.

原因: `item-one` `item-two` 此前已经有样式覆盖, `hover` 中的 父元素的color属性无法被传递到子元素,如果去除这一段代码:

```css
        .item-one {
            color: black;
        }

        .item-two {
            color: black;
        }
```



那么方法1是有效的