/**
 * @author umin
 * @copyright Copyright (c) 2018, YZKJ
 * @description event
 */
(function(context) {

  let stack = {};
  let point = {
    id: 1526649602787 // KND.Util.now()
  };

  class Event {
    bind() {
      var eventName, fn, pointer;
      var argArr = Array.prototype.slice.call(arguments, 0);
      if (argArr.length > 1) {
        eventName = argArr.shift();
        fn = argArr.shift();
        pointer = argArr.shift() || point;
      } else {
        return;
      }
      if (!stack[eventName]) {
        stack[eventName] = {
          callbacks: {}
        };
      }
      stack[eventName].callbacks[pointer.id] = fn;
    };
    emit() {
      var eventName, args, pointer;
      var argArr = Array.prototype.slice.call(arguments, 0);
      if (argArr.length > 0) {
        eventName = argArr.shift();
        args = argArr.shift() || {};
        pointer = argArr.pop();
        pointer = args.id && !pointer ? args : point;
      } else {
        return;
      }
      if (stack[eventName]) {
        let fn = stack[eventName].callbacks[pointer.id];
        if (fn) fn(args);
      }
    };
    unbind() {
      var eventName, pointer;
      var argArr = Array.prototype.slice.call(arguments, 0);
      if (argArr.length > 0) {
        eventName = argArr.shift();
        pointer = argArr.shift() || point;
      } else {
        return;
      }
      var callbacks = stack[eventName];
      if (callbacks) delete callbacks[pointer.id];
    };
  };

  context['Event'] = new Event();

})(global[global['context']]);
