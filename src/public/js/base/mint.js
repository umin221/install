import Vue from 'vue';

// import 'mint-ui/lib/style.css';

import Mint from 'mint-ui';

Vue.use(Mint);

global.Toast = Mint.Toast;
global.Indicator = Mint.Indicator;
global.MessageBox = Mint.MessageBox;
