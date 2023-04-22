# 解决Safari浏览器使用`SVG foreignObject` 不生效,错位的问题

`foreignObject` 在safari下渲染,有可能会遇到以下问题: 节点内的元素被渲染到父 SVG 的坐标 0,0（左上角）,这是由于 Safari 中的一个错误，该错误会影响 `foreignObject` 根据顶部 SVG 而不是外部对象本身来计算渲染位置。某些样式会导致这个问题: 

- `position`（可以使用 position:fixed 但这会引入溢出问题,比如缩放与移动时出界）
- `webkit-transform-style`
- `webkit-backface-visibility`
- `transition`
- `transform`
- `calc  ` 可能无法按预期工作
- `opacity` 。

检查浏览器是否是 Safari，然后删除这些样式,注意 `foreignObject` 内部所有的样式都不能包含这些样式.

PS: 如何判断浏览器为Safari: 

```javascript
export const IS_SAFARI = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
```

