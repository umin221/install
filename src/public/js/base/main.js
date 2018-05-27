/**
 * @author umin
 * @since
 * @copyright Copyright (c) 2018, YZKJ
 * @description main
 */
// Inject Global Css
import 'public/sass/index.scss';
import 'mint-ui/lib/style.css';
import 'public/config'; // Loader Config
import './util'; // Global Util
import './session'; // Global Session
import '../native'; // Register Native API
// import './filters'; // Global Vue Filter
// import './mixin'; // Global Mixin
import './tools'; // Global Tools
import './vc'; // VConsole
// Inject Global Event Control
import './event';

// Object extend
Object.extend = require('node.extend');
