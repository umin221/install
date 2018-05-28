let ws = require('./web-storage-cache.min');

let cache = new ws.WebStorageCache();
cache.isSupport = cache.isSupported();

export default cache;
