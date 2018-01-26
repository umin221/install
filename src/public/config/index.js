import pro from './project.js';

let name = pro['name'];

global['config'] = pro;
global['context'] = name;
global[name] = {};
