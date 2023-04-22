# 2023 在 VS Code 中调试 Vue2 项目

环境: 

`VsCode@1.75`

`webpack@3.12.0 ` 

`vue@2.6.11`

由于官网教程许久未更新 [Vue2文档](https://v2.cn.vuejs.org/v2/cookbook/debugging-in-vscode.html),教程中的所提及的VsCode插件:

- [Debugger for Chrome](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome)
- [Debugger for Firefox](https://marketplace.visualstudio.com/items?itemName=hbenl.vscode-firefox-debug)

已经被合并为:

- [JavaScript Debugger](https://marketplace.visualstudio.com/items?itemName=ms-vscode.js-debug-nightly)

部分配置已经不尽相同,经过多次尝试,下面这一套配置适用于目前最新VsCode版本以及Vue-cli创建的项目:

`launch.json`

```js
{
    // 使用 IntelliSense 了解相关属性。 
    // 悬停以查看现有属性的描述。
    // 欲了解更多信息，请访问: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
		//launch方式会重新打开一个浏览器窗口
        {
            "type": "chrome",
            "request": "launch",
            "name": "launch vuejs: chrome",
            "url": "http://localhost:8080",
            "webRoot": "${workspaceFolder}",
            "sourceMaps": true,
            "sourceMapPathOverrides": {
                "webpack:///src/*.vue": "${webRoot}/src/*.vue",
                "webpack:///./src/*.js": "${webRoot}/src/*.js",
               
            }
        },
        {
            "type": "chrome",
            "request": "attach",
            "name": "attach vuejs: chrome",
            "urlFilter": "https://localhost:8080/*",
            "port": 9222,
            "webRoot": "${workspaceFolder}",
            "breakOnLoad": true,
            "sourceMaps": true,
            "sourceMapPathOverrides": {
                "webpack:///src/*.vue": "${webRoot}/src/*.vue",
                "webpack:///./src/*.js": "${webRoot}/src/*.js",
                
            }
          }

    ]
}
```

**关于`${workspaceFolder}`** ,指的就是项目文件夹所在的路径,例如:![image-20230206224326727](https://s2.loli.net/2023/02/09/mx4cPLQi1C56fvl.png)

mini-vue项目的路径 "xxxx/mini-vue"就是`${workspaceFolder}`的值.

**`sourceMapPathOverrides`**: 这里的配置和vue2文档的不尽相同,配置该项主要是的目的就是将`webpack`打包的后的`source-map`文件与本地文件相对应起来,如果路径配置错误,将无法打断点.

```json
"webpack:///src/*.vue": "${webRoot}/src/*.vue",
"webpack:///./src/*.js": "${webRoot}/src/*.js",
```

重点就是将vue文件和js文件分别进行映射,否则可能出现js文件可以打断点,vue文件不可以打断电的情况,如果你的源码不是在src里面或者有多个,分别映射即可.



**`launch` 和 `attach`:**

前者的意思就是 VSCode 会打开这个程序然后进入调试，后者的意思是你已经打开了程序，然后接通 Node.js 的内部调试协议进行调试. 经过测试,launch方式打开的浏览器没有插件等相关内容(类似于无痕窗口) 如 `vue devtool`,attach方式则和一般开发流程类似.

launch方式配置好之后直接启动就好,而attach方式还需要一些折腾才能使用,如果launch方式足以满足你的调试需求,那么接下来attach方式的额外配置则不需要在意:

- 首先先关闭所有的Chrome窗口（确保任务管理器中Chrome进程都被关闭掉了！）[2]；

- 找到Chrome启动快捷键，右键打开属性，在“目标”中增加启动参数`--remote-debugging-port=9222` ，记住这里的端口为 `9222` 和上面的配置文件保持一致；大致如下：

```bash
"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222
```

![image-20230206222042461](https://s2.loli.net/2023/02/09/C7YgMnqKemWDuRk.png)

- 启动你的本地项目，在Chrome中打开项目地址，如 [http://localhost:8080](https://link.juejin.cn/?target=http%3A%2F%2Flocalhost%3A8080) ；

- 在VSCode中运行`attach vuejs: chrome`，启动调试；

PS: 如果你恰好和我一样喜欢常用浏览器固定到底部菜单栏,那么可以到如下位置:

```bash
"C:\Users\用户名\AppData\Roaming\Microsoft\Internet Explorer\Quick Launch\User Pinned\StartMenu"
```

找到相关的快捷方式进行设置

![image-20230206222159305](https://s2.loli.net/2023/02/06/No5GWa4qyd7n8sk.png)