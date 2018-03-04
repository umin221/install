'use strict';
import prod from './prod.env';
import dev from './dev.env';

let config = dev;
let name;

if (process.env.NODE_ENV === 'production') {
  config = Object.assign(dev, prod);
};

name = config['name'];
global['config'] = config;
global['context'] = name;
global[name] = {};
