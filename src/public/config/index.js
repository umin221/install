'use strict';
import prod from './prod.env';
import dev from './dev.env';

let project = global['project'] || {};
let name;

let config = Object.assign(dev, process.env.NODE_ENV === 'production' ? prod : {}, project);

name = config['name'];
global['config'] = config;
global['context'] = name;
global[name] = {};
