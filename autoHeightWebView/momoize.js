'use strict';

function defaultIsNewArgEqualToLast(newArgs, lastArgs) {
    return newArgs.length === lastArgs.length && newArgs.every((arg, index) => arg === lastArgs[index]);
}

export default function memoize(resultCallback, isNewArgEqualToLast) {
  let lastArgs = [];
  let lastResult;
  let calledOnce = false;
  const isEqual = isNewArgEqualToLast || defaultIsNewArgEqualToLast;
  const result = function(...newArgs) {
    if (calledOnce && isEqual(newArgs, lastArgs)) {
      return lastResult;
    }
    calledOnce = true;
    lastArgs = newArgs;
    lastResult = resultCallback.apply(this, newArgs);
    return lastResult;
  };
  return result;
}