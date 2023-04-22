# Axios取消请求(AbortController)

从 `v0.22.0` 开始，Axios 支持以 fetch API 方式—— [`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) 取消请求：

```javascript
const controller = new AbortController();

axios.get('/foo/bar', {
   signal: controller.signal
}).then(function(response) {
   //...
});
// 取消请求
controller.abort()
```

注意: `CancelToken` 从从 `v0.22.0` 开始已被弃用，不应在新项目中使用。



我们一般在项目中会把 `axios` 进行二次封装,封装之后如何传递 `signal`  需要注意下

```javascript
/**

 \* @description: 获取查看时间

 \* @param {*} formData

 \* @return {*}

 */

$api.getCheckTime = (formData, signal) => {

 let url = `/xxxxx`

 return  $http.get(url, { params: formData, signal },)

}

// 在组件中调用该接口

 /**
   * @description: 获取查看时间
   * @return {*}
   */
  async getTime(uid) {
      
      if (this.abortController) {
          // 如果存在abortController,就取消掉上次的请求,注意不同接口如果使用同一个abortController,则会被abort() 一起取消掉
          this.abortController.abort()
      }
      this.abortController = new AbortController()
      let res = await $api.getCheckTime({ card_id: this.cardId, uid }, this.abortController.signal);
  }
```

如果接口为 `post` 请求, `signal` 参数的传递应该为:

```JS
axios.post('demo/url', {
    id: 123,
    name: 'Henry',
    signal,
},{
   timeout: 1000,
    ...//其他相关配置
})
    // 如果是二次封装的axios,那可能是:
$http.post(url, {
    id: 123,
    name: 'Henry',
    signal,
})
```

**要谨记Axios不同请求方式传参的方式,作者就是因为没搞清Axios的传值方式,没有成功的将signal传递给Axios,走了很多弯路😭**