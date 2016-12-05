import compose from './compose'

/**
 * Creates a store enhancer that applies middleware to the dispatch method
 * of the Redux store. This is handy for a variety of tasks, such as expressing
 * asynchronous actions in a concise manner, or logging every action payload.
 *
 * See `redux-thunk` package as an example of the Redux middleware.
 *
 * Because middleware is potentially asynchronous, this should be the first
 * store enhancer in the composition chain.
 *
 * Note that each middleware will be given the `dispatch` and `getState` functions
 * as named arguments.
 *
 * @param {...Function} middlewares The middleware chain to be applied.
 * @returns {Function} A store enhancer applying the middleware.
 */

 /*
   中间件主要被用于分离那些不属于你应用的核心业务逻辑的可被组合起来使用的代码

   如果你使用过 Express 或者 Koa 等服务端框架, 那么应该对 middleware 的概念不会陌生。 
   在这类框架中，middleware 是指可以被嵌入在框架接收请求到产生响应过程之中的代码。
   例如，Express 或者 Koa 的 middleware 可以完成添加 CORS headers、记录日志、内容压缩等工作。
   middleware 最优秀的特性就是可以被链式组合。你可以在一个项目中使用多个独立的第三方 middleware。
   Redux的中间件，提供的是位于 action 被发起之后，到达 reducer 之前的扩展点

   applyMiddleware函数返回值，就是一个enhancer。结合createStore注释。

   要想看明白下面的代码，首先要知道middleware签名是怎样的。
   store => next => action => {
     console.log('dispatching', action)
     let result = next(action)
     console.log('next state', store.getState())
     return result
   }
   通过签名，我们就可以知道，中间件的作用：
   提供的是位于 action 被发起之后，到达 reducer 之前的扩展点


 */
export default function applyMiddleware(...middlewares) {
  return (createStore) => (reducer, initialState, enhancer) => {
    //创建Store
    var store = createStore(reducer, initialState, enhancer)
    var dispatch = store.dispatch
    var chain = []

    //参考middleware签名，签名中的store其实就是它。getState,dispath其实都来源于原始store。阉割版store
    var middlewareAPI = {
      getState: store.getState,
      dispatch: (action) => dispatch(action)
    }

    /*
      chain中函数签名
      next => action => {
        return next(action)
      }

      调用它们需要传入next函数
    */
    chain = middlewares.map(middleware => middleware(middlewareAPI))

    /*
      调用chain中函数

      假如chain=[A,B,C,D]
      var dispath=A(B(C(D(store.dispath))));

    */
    dispatch = compose(...chain)(store.dispatch)

    return {
      ...store,
      dispatch
    }
  }
}
