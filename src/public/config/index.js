import config from './config.json';

let name = config['name'];

global['config'] = config;
global['context'] = name;
global[name] = {};
