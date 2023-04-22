# 批量转译压缩JS代码

工作中遇到一个需求,需要将大量 JS 文件中的代码进行 ES6+ => ES5 的转译,同时对代码进行压缩处理,最后在单独输出.

一开始陷入一个思维误区,不管干什么操作都想着在webpack中执行,完全忽视了 node 这一环境的存在,碰壁之后,发现了babel-cli 这一工具,开始走上正确的解决方法.

## 1.  使用方法

[仓库地址]: https://github.com/3biubiu/compressionCode	"仓库地址"

git clone => npm install => npm run build => 完事

将待处理的js文件和css文件放入对应的文件夹即可,命令执行完成后将会在同级目录下生成 `lib/js` 和 `lib/css` 文件夹,文件名保持不变

## 2.  一些思路

   **首先**在一开始就想到了使用 `babel` 来完成转义的工作,在此之前我一直以为babel具有代码压缩的功能,实际查询下来发现非也,压缩功能是由 `uglify-js` 提供,不过该工具支持 `ES5` 及以下代码,所以基本就和 `babel` 绑定使用了,此前一直用现成的框架,从来没有考虑过这些细节,将这些东西依次安装好后,又发现了一个问题, `uglify-js` 不支持批量操作😒, 后来搜索资料找到比较合适的JS脚本用来跑批量处理的操作,稍加改造 就能使用了,代码如下:

   ```js
   'use strict';
   
   const fs = require('fs');
   const path = require('path');
   const UglifyJS = require('uglify-js')
   
   const ROOT_PATH = path.join(__dirname, '../lib/js');
   function readFileList(currentPath) {
       const files = fs.readdirSync(currentPath);
   
       files.forEach(file => {
           const childPath = path.join(currentPath, file);
           const stat = fs.statSync(childPath);
           if (stat.isDirectory()) {
               readFileList(childPath);
           } else {
               if (file.endsWith('.js')) {
                   fs.writeFileSync(childPath, UglifyJS.minify({
                       "file.js": fs.readFileSync(childPath, "utf8"),
                   }).code, "utf8", function (error) {
                       console.log(error)
                   });
               }
   
           }
       })
   }
   
   readFileList(ROOT_PATH);
   ```

   **之后** 既然js都已经压缩了,就想着要不把css 也试着压缩以下,经过查询 了解到 `cssnano `是比较常用的压缩工具,但是它运行时需要postcss作为运行环境,很多 `css` 相关的工具都需要 `postcss` 作为一个平台,同时 我们需要同时 `postcss-cli` 去执行一些命令,好在 `postcss-cli` 支持 批量操作,不需要大费周折.

   **OK**, `css `和 `js` 已经压缩妥当,但是我看着自己写了三四条命令陷入沉思,总不能跑一次就是依次运行四个命令吧,完全没有自动化的美感与爽快,于是乎继续一番查找,被我找到了解决办法: 

   `node` 中有 `&&` 和 `&` 两种连接符号,其中,在 `bash` 命令或 `npm script` 中使用 `&` 来实现`并发`效果时，实际上是把`&`左侧的命令丢入后台运行，右侧剩余命令看做 *整体* 任务在前台运行，以此来实现并发效果。而 `&&` 是串行执行两侧命令，先执行完左侧后再执行右侧。

   *切记！！！*

   ```shell
   command1 & command2 && command3
   ```

   并不是并发执行`command1`和`command2`后再执行`command3`

   而是并发执行`command1`和`command2 && command3`

   经过这么组合,我的最终 `npm script` 如下:

   ```json
   "build": "postcss css --dir lib/css & babel js -d lib/js --presets=@babel/env && node scripts/minifyJs.js",
   ```

   (完)

   如果错误,欢迎指正.

   -- BIUBIU

