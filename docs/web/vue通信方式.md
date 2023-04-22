# 前端知识分享


- ## vue组件通信的几种方式

  1. ## `props` / `$emit`

     ​	父组件通过`props`的方式向子组件传递数据，而通过`$emit` 子组件可以向父组件通信。

  2. ## `$children` / `$parent`

     通过`$parent`和`$children`就可以访问组件的实例,不建议使用,建议用上面的方法,组件库的封装除外

     > 要注意边界情况，如在`#app`上拿`$parent`得到的是`new Vue()`的实例，在这实例上再拿`$parent`得到的是`undefined`，而在最底层的子组件拿`$children`是个空数组。也要注意得到`$parent`和`$children`的值不一样，`$children` 的值是数组，而`$parent`是个对象

     ​		一个例子: (iview里面的方法)

     ​		递归调用,向上向下寻找对应name的组件,该方法必须在`mounted`生命周期中使用.

     ```javascript
     /**
     * @desc 寻找指定组件实例
     * @params {String} type 向上查找还是向下查找
     * @params {Object} context 当前上下文（一般指this，把this 传进来就可以了）
     * @params {String} componentName 要寻找的指定的组件名
     */
     function findComponents (type, context, componentName) {
     	if (['$parent', '$children'].indexOf(type) < 0) return
     
     	let currentComponent = context[type]
     	if (type === '$parent') currentComponent = [currentComponent]
     	let designatedCom = null
     
     	if (currentComponent.length) {
     		for(const com of currentComponent) {
     			const name = com.$options.name
     
     			if (name === componentName) {
     				designatedCom = com
     				break
     			} else {
     				designatedCom = findComponents(type, com, componentName)
     				if (designatedCom) break
     			}
     		}
     		return designatedCom
     	}
      }
     ```

     tips: 为什么须在`mounted` 周期调用?

     分析源码

     `src/core/instance/index.js`

     ```js
     import { initMixin } from './init'
     import { stateMixin } from './state'
     import { renderMixin } from './render'
     import { eventsMixin } from './events'
     import { lifecycleMixin } from './lifecycle'
     import { warn } from '../util/index'
     //此处对应new Vue() 然后调用this._init方法
     function Vue (options) {
       if (process.env.NODE_ENV !== 'production' &&
         !(this instanceof Vue)
       ) {
         warn('Vue is a constructor and should be called with the `new` keyword')
       }
       this._init(options)
     }
     
     initMixin(Vue)
     stateMixin(Vue)
     eventsMixin(Vue)
     lifecycleMixin(Vue)
     renderMixin(Vue)
     
     export default Vue
     ```

     然后打开同级目录下的`init.js`  里面都是初始化操作.第69行 

     ```js
     if (vm.$options.el) {
           vm.$mount(vm.$options.el)
         }
     ```

     vue中通过`$mount`实例方法去挂载DOM,之后的逻辑在vue的`runtime-with-compiler`组件下,具体的内容略,

     大致上`$mount`原型会调用`mountComponent`方法 方法里会进行虚拟Vnode的生成,升值之后更新DOM,同时 会实例化一个watcher用于后续的响应式监听和更新

     ```js
     updateComponent = () => {
           // 生成虚拟 vnode   
           const vnode = vm._render()
           // 更新 DOM
           vm._update(vnode, hydrating)
          
         }
     ```

     ```js
       // 实例化一个渲染Watcher，在它的回调函数中会调用 updateComponent 方法  
       new Watcher(vm, updateComponent, noop, {
         before () {
           if (vm._isMounted && !vm._isDestroyed) {
             callHook(vm, 'beforeUpdate')
           }
         }
       }, true /* isRenderWatcher */)
       hydrating = false
     ```

     `mountComponent` 核心就是先实例化一个渲染`Watcher`，在它的回调函数中会调用 `updateComponent` 方法，在此方法中调用 `vm._render` 方法先生成虚拟 Node，最终调用 `vm._update` 更新 `DOM`。

     **所以整个Component Tree的结构是在`mounted`周期完成构建的,故 以上**

  3. ## `provide`/ `inject`

     父组件中通过`provide`来提供变量, 然后再子组件中通过`inject`来注入变量。

     > 注意: 这里不论子组件嵌套有多深, 只要调用了`inject` 那么就可以注入`provide`中的数据，而不局限于只能从当前父组件的props属性中回去数据

  4. ## `ref` / `refs`

     `ref`：如果在普通的 DOM 元素上使用，引用指向的就是 DOM 元素；如果用在子组件上，引用就指向组件实例，可以通过实例直接调用组件的方法或访问数据

  5. ## `eventBus`

     `eventBus` 又称为事件总线，在vue中可以使用它来作为沟通桥梁的概念, 就像是所有组件共用相同的事件中心，可以向该中心注册发送事件或接收事件， 所以组件都可以通知其他组件。实际上就是new一个Vue实例来进行`emit/on`操作

     ```js
     // event-bus.js
     
     import Vue from 'vue'
     export const EventBus = new Vue()
     ```

     注意: 使用`eventBus` 要记得在组件销毁时使用 $off移出事件监听,因为eventBus是一个Vue实例 不会随着组件的销毁而消失 ,不执行移除操作可能会带来副作用

     ```js
         // 移除所有监听事件，当本组件被引用多次时，所有引用的监听全部移除
         this.eventBus.$off("notify");
         // 移除指定监听事件
         this.eventBus.$off("notify", this.listen);
     
     ```

     

  6. ## `Vuex`

     略

  7. ## `$attrs`与 `$listeners`

     **`vm.$attrs` 和 `vm.$listeners` 可以解决“父组件”和“子组件”、“孙子组件”、“曾孙子组件”等后代组件的通讯问题**

  8. **通过 $root 访问根实例**

     通过 `$root`，任何组件都可以获取当前组件树的根 Vue 实例，通过维护根实例上的 `data`，就可以实现组件间的数据共享。~~(笑死,根本维护不起来)~~
  
  9. ## Vue.observable https://v2.cn.vuejs.org/v2/api/#Vue-observable
  
     让一个对象可响应。Vue 内部会用它来处理 `data` 函数返回的对象。
  
     返回的对象可以直接用于[渲染函数](https://v2.cn.vuejs.org/v2/guide/render-function.html)和[计算属性](https://v2.cn.vuejs.org/v2/guide/computed.html)内，并且会在发生变更时触发相应的更新。也可以作为最小化的跨组件状态存储器，用于简单的场景：
  
     ```js
     const state = Vue.observable({ count: 0 })
     
     const Demo = {
       render(h) {
         return h('button', {
           on: { click: () => { state.count++ }}
         }, `count is: ${state.count}`)
       }
     }
     // 或者直接写的和Vuex差不多
     //store.js
     import Vue from 'vue';
     
     export let store =Vue.observable({count:0,name:'李四'});
     export let mutations={
         setCount(count){
             store.count=count;
         },
         changeName(name){
             store.name=name;
         }
     }
     //某个子组件内
     import {store,mutations} from '@/store'
     ...
      computed:{
          count(){
              return store.count
          },
              name(){
                  return store.name
              }
      },
     ...
      methods:{
          setCount:mutations.setCount,
          changeName:mutations.changeName    
      }
     ```
  
  10. ##### `localStorage / sessionStorage`  ~~为了凑够十条~~
  
      通过 window.localStorage.getItem(key) 获取数据
  
      通过 window.localStorage.setItem(key,value) 存储数据
  
      不好维护 **不建议使用**
  
- ## Vue自定义指令 https://v2.cn.vuejs.org/v2/guide/custom-directive.html

  > Vue除了提供了默认内置的指令外，还允许开发人员根据实际情况自定义指令，它的作用价值在于当开发人员在某些场景下需要对普通DOM元素进行操作的时候

​	

```js
// 注册一个全局自定义指令 `v-focus`
Vue.directive('focus', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el) {
    // 聚焦元素
    el.focus()
  }
})
// 局部注册
directives: {
  focus: {
    // 指令的定义
    inserted: function (el) {
      el.focus()
    }
  }
}

// 使用
<input v-focus>
```

一个指令定义对象可以提供如下几个钩子函数 (均为可选)：

- `bind`：只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置。
- `inserted`：被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)。
- `update`：所在组件的 VNode 更新时调用，**但是可能发生在其子 VNode 更新之前**。指令的值可能发生了改变，也可能没有。但是你可以通过比较更新前后的值来忽略不必要的模板更新 (详细的钩子函数参数见下)。
- `componentUpdated`:指令所在组件的 VNode **及其子 VNode** 全部更新后调用。

  **update** 和 **componentUpdated**

  组件更新都会调用，update在componentUpdated之前

  update 组件更新前的状态  componentUpdated 组件更新后的状态  

  **bind 和 inserted**

  dom插入都会调用二者,bind时父节点为null  inserted 时父节点存在。 bind是在dom树绘制前调用，inserted在dom树绘制后调用

  **自定义指令的钩子里面没有vue实例，this指向undefined；**

**钩子函数的参数**

- `el`：指令所绑定的元素，可以用来直接操作 DOM。

- `binding`

  ：一个对象，包含以下 property：

  - `name`：指令名，不包括 `v-` 前缀。
  - `value`：指令的绑定值，例如：`v-my-directive="1 + 1"` 中，绑定值为 `2`。
  - `oldValue`：指令绑定的前一个值，仅在 `update` 和 `componentUpdated` 钩子中可用。无论值是否改变都可用。
  - `expression`：字符串形式的指令表达式。例如 `v-my-directive="1 + 1"` 中，表达式为 `"1 + 1"`。
  - `arg`：传给指令的参数，可选。例如 `v-my-directive:foo` 中，参数为 `"foo"`。`v-mydirective:[argument]="value"`  这样就是可以动态绑定
  - `modifiers`：一个包含修饰符的对象。例如：`v-my-directive.foo.bar` 中，修饰符对象为 `{ foo: true, bar: true }`。

- `vnode`：Vue 编译生成的虚拟节点。

- `oldVnode`：上一个虚拟节点，仅在 `update` 和 `componentUpdated` 钩子中可用。

**除了 `el` 之外，其它参数都应该是只读的，切勿进行修改。如果需要在钩子之间共享数据，建议通过元素的 [`dataset`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLElement/dataset) 来进行。**

使用自定应指令写的一个自适应文字title展示:

```js
/*
 * @Date: 2022-11-22 14:17:11
 * @LastEditors: zhangheng zhangheng@zhaoshang.net
 * @LastEditTime: 2022-12-01 14:13:48
 * @FilePath: \enterprise_web\src\directive\tooltip.js
 */
export default {
    // 指令所在组件的 VNode 及其子 VNode 全部更新后调用
    componentUpdated(el) {
        
        let timeout
        /* 第1步：先要创建一个容器`span`去获取文本的宽度 */
        // 获取当前元素的style
        const curStyle = window.getComputedStyle(el, '');
        // console.log('curStyle: ', curStyle);
        // 创建一个容器来记录文字的width
        const textSpan = document.createElement('span');
        // console.log('textSpan: ', textSpan);
        // 设置新容器的字体样式，确保与当前需要隐藏的样式相同
        textSpan.style.fontSize = curStyle.fontSize;
        textSpan.style.fontWeight = curStyle.fontWeight;
        textSpan.style.fontFamily = curStyle.fontFamily;
        let elWidth = curStyle.maxWidth != 'none' ? + curStyle.maxWidth.slice(0, -2) - 0.01: el.offsetWidth;
        // 将容器插入body，如果不插入，offsetWidth为0
        document.body.appendChild(textSpan);
        // 设置新容器的文字
        textSpan.innerHTML = el.innerText;
        // console.log('el.innerText: ', el.innerText);
        const spanWidth = textSpan.offsetWidth
        
        // console.log('textSpan.offsetWidth: ', textSpan.offsetWidth,elWidth);
        
        // 如果字体元素大于当前元素，则需要隐藏
        /* 第2步：用获取到的宽跟`el`的宽进行对比，如果文本字体大于当前`el`元素的宽度，则需要title提示
         * 第3步：监听`el`的`onmouseenter`以及`onmouseleave`的鼠标移入移出事件
         */
        if (textSpan.offsetWidth > elWidth) {
            // 给当前元素设置超出隐藏
            el.style.overflow = 'hidden';
            el.style.textOverflow = 'ellipsis';
            el.style.whiteSpace = 'nowrap';
            el.setAttribute('title', el.innerText)
        }
        window.addEventListener('resize', () => {
            clearTimeout(timeout);
            
            timeout = setTimeout(function() {
                
                
                    // 
                if (spanWidth > el.offsetWidth) {

                    // 给当前元素设置超出隐藏
                    console.log("resize执行");
                    el.style.overflow = 'hidden';
                    el.style.textOverflow = 'ellipsis';
                    el.style.whiteSpace = 'nowrap';
                    el.setAttribute('title', el.innerText)
                }else {
                    el.removeAttribute('title')

                }
            }, 200);
        })
        // 需要注意：更新完之后需要移除容器，不然body里会多一个span元素内容
        document.body.removeChild(textSpan);
    },
    // 指令与元素解绑时
    unbind(el) {
        // el.removeAttribute('title')
        
        /* 第6步：解绑移除浮层元素 */
        // 找到浮层元素并移除
        // const kxmTooltipDom = document.getElementById('kxm-tooltip');
        // kxmTooltipDom && document.body.removeChild(kxmTooltipDom);
    }
}
```

- ### vue动态加载图片

  首先 动态的拼接url相对地址或者字符串变量形式的引入并不会生效,webpack的file-loader不会去处理,只会将它当成简单的文本进行替换

  ```
  <img :src="src">
  
  //data中定义变量src
  data() {
    return {
      src: '../images/demo.png' 
    }
  }
  ```

  解决方法: 

  - 将图片转为base64格式,适用于体积比较小的图片

  - 使用import引入图片

    ```
    <img :src="src">
    
    //使用import引入
    import img from '../images/demo.png'
    
    //data中定义变量src
    data() {
      return {
        src: img 
      }
    }
    ```

  - 使用require进行动态加载 --- **require是在运行时加载，而import是编译时加载；**

  - 引入publicPath

    > 当你在 JavaScript、CSS 或 `*.vue` 文件中使用相对路径 (必须以 `.` 开头) 引用一个静态资源时，该资源将会被包含进入 webpack 的依赖图中。
    >
    > 在其编译过程中，所有诸如 `<img src="...">`、`background: url(...)` 和 CSS `@import` 的资源 URL **都会被解析为一个模块依赖**。
    >
    > 用**绝对路径引入**时，路径读取的是`public`文件夹中的资源，任何放置在 `public` 文件夹的静态资源都会被简单的复制到编译后的目录中，而不经过 webpack特殊处理。
    >
    > 当你的应用被部署在一个域名的根路径上时，比如`http://www.abc.com/`，此时这种引入方式可以正常显示但是如果你的应用没有部署在域名的根部，那么你需要为你的 URL 配置 publicPath 前缀，`publicPath` 是部署应用包时的基本 URL，需要在 `vue.config.js` 中进行配置。

  补充一下file-loader url-loader,

  首先,webpack打包后,我们的相对路径就有可能不符合打包后的目录结构,因为路径会变成相对于index.html的而非开发时的相应文件的,此时file-loader可以解析项目中的url引入（不仅限于css），根据我们的配置，将图片拷贝到相应的路径，再根据我们的配置，修改打包后文件引用路径，使之指向正确的文件。,但是,如果图片比较多,就会使太多的图片资源请求,降低页面性能,此时 url-loader可以解决,它可以将图片转为dataUrl,这样图片资源也将一起被打包,降低请求次数,同时它还可以设置limit参数,来决定需要转换图片最大体积,因为体积越大转码越耗时,大于limit还是还是直接使用file-loader. url 封装了 file, **webpack5 这两个都被弃用了** 统一由asset处理

  

- #### 图片预加载preload

  <link rel="preload" as="image" href="important.png">

  示例页面(no-preload): https://responsive-preload.glitch.me/no_preload.html
  
  ![Chrome DevTools 网络面板的屏幕截图。](%E5%89%8D%E7%AB%AF%E7%9F%A5%E8%AF%86%E5%88%86%E4%BA%AB.assets/cyocwRmB3XlfY26vUZ5h-1672062734370-3-1672062737944-5.png)
  
  ​	图像是在js加载之后才开始加载
  
  ​	示例页面(preload): https://responsive-preload.glitch.me/preload.html
  
  ​	![Chrome DevTools 网络面板的屏幕截图。](%E5%89%8D%E7%AB%AF%E7%9F%A5%E8%AF%86%E5%88%86%E4%BA%AB.assets/rIRdFypLWf1ljMaXCVCs-1672062923005-9-1672062924061-11-1672062926304-13.png)
  
  ​	js文件与第一张图片同时加载
  
- #### 深拷贝与浅拷贝

  

  
  
  ### 
  
  
  
  

