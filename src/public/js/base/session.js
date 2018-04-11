/**
 * @author umin
 * @copyright Copyright (c) 2018, YZKJ
 * @description session
 */
((context) => {

  const LOCK = 1521174072972;

  class Session {

    constructor() {
      context.Util.log('Session init...');
    };

    /**
     * 设置值
     * @param key
     * @param val
     */
    set(key, val) {
      key += LOCK;
      sessionStorage.setItem(key, val);
    };

    /**
     * 获取值
     * @param key
     */
    get(key) {
      key += LOCK;
      return sessionStorage.getItem(key);
    };

    /**
     * 删除值
     * @param key
     */
    remove(key) {
      key += LOCK;
      return sessionStorage.removeItem(key);
    };
  };

  context['Session'] = new Session();

})(global[global['context']]);
