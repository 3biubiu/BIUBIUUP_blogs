# 阻止safari浏览器弹性滚动效果

Safari浏览器在滚动到底部或者顶部时,还可以继续滚动一定范围,宛如具有弹性一般,这对一些嵌套的吸顶布局造成了影响,可以通过以下代码关闭此类效果:

```css
html {
    height:100%;
    overflow:hidden;
    position:relative;
}
body{
    height:100%;
    overflow:auto;
    position:relative;
}
```

希望对你有所帮助