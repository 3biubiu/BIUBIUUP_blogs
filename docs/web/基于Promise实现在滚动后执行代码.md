# 基于Promise实现在滚动后执行回调的方法

一般的滚动结束监听一般使用`addEventLister` 监听 `Scroll` 事件, 大概就是这样:

```js
let timer = null;
window.addEventListener('scroll', function() {
    if(timer !== null) {
        clearTimeout(timer);        
    }
    timer = setTimeout(function() {
          // do something
    }, 150);
}, false);
```

其实就是一个防抖函数. 个人对全局的事件监听还是比较反感.

下面介绍一个更加现代,基于Promise的实现方法:

```js
function waitForScrollEnd () {
    let last_changed_frame = 0
    // 可以监听横向与纵向的滚动
    let last_x = window.scrollX
    let last_y = window.scrollY

    return new Promise( resolve => {
        function tick(frames) {
            // 如果超过20帧 没有发生滚动,就认为滚动已经停止(设置成20是因为有时候会因为掉帧原因导致滚动并非连续的)
            // 同时监听事件的上限时500帧,超过也会退出监听
            if (frames >= 500 || frames - last_changed_frame > 20) {
                resolve()
            } else {
                if (window.scrollX != last_x || window.scrollY != last_y) {
                    last_changed_frame = frames
                    last_x = window.scrollX
                    last_y = window.scrollY
                }
                //使用requestAnimationFrame执行监听函数,进行累加,滚动也是动画的一种,滚动行为与帧数一般是同步的
                requestAnimationFrame(tick.bind(null, frames + 1))
            }
        }
        tick(0)
    })
}
```

使用方法:

```javascript
document.querySelector(selectors).scrolltoView({behavior:'smooth'})

await waitForScrollEnd()

waitForScrollEnd().then(() => { /* callback */ })
```

