import WebStorageCache from './web-storage-cache.min';

let cache = new WebStorageCache();
cache.isSupport = cache.isSupported();

export default cache;
