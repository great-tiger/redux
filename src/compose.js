/**
 * Composes single-argument functions from right to left. The rightmost
 * function can take multiple arguments as it provides the signature for
 * the resulting composite function.
 *
 * @param {...Function} funcs The functions to compose.
 * @returns {Function} A function obtained by composing the argument functions
 * from right to left. For example, compose(f, g, h) is identical to doing
 * (...args) => f(g(h(...args))).
 
 compose 函数编程里的方法，从右到左来组合多个函数
 简单的例子
 function A(arg){
  return arg + 3;
  console.log("A");
}

function B(arg){
  return arg + 2;
  console.log("B");
}

function C(arg){
  return arg+1;
  console.log("C");
}

var ret=compose(A,B,C)(0);
console.log("ret is : ",ret)  //6






 */
 
export default function compose(...funcs) {
  return (...args) => {
    if (funcs.length === 0) {
      return args[0]
    }

    const last = funcs[funcs.length - 1]
    const rest = funcs.slice(0, -1)

    return rest.reduceRight((composed, f) => f(composed), last(...args))
  }
}
