<template>
  <div>
    <div class="mint-content">
      <cus-field label="真实姓名" tag="真实姓名"
                 v-model="contactName"
                 class="require mar-right"
                 v-valid.require
                 placeholder="请输入真实姓名"></cus-field>
      <cus-field label="手机号码" tag="手机号码"
                   class="require mar-right"
                 v-model="phoneNumber1"
                 v-valid.require.phone
                   placeholder="请输入手机号码">
        <mt-button type="primary"
                   v-if="!isSend"
                   @click.native="toValidate"
                   size="small"
                   style="color: orangered;background: none;border: 1px solid;">发送验证码</mt-button>
        <mt-button type="primary"
                   v-else
                   size="small"
                   style="color: grey;background: none;border: 1px solid;">{{curCount}}秒内输入</mt-button>
      </cus-field>
      <cus-field label="验证码" tag="验证码"
                 v-model="validate"
                 class="require mar-right"
                 v-valid.require
                 placeholder="请输入验证码"></cus-field>
      <div style="font-size: 0.65rem;text-align: center;margin-top: 20px"><span>绑定手机号将绑定你的微信，仅支持手机号绑定</span></div>
      <div style="display: flex;justify-content: center;margin-top: 30px">
        <mt-button type="primary"
                   style="width: 200px"
                   @click.native="submit">立即绑定</mt-button>
      </div>
    </div>
  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex';
  import cusField from '../../../public/components/cus-field';
  import Vue from 'vue';
  import md5 from 'js-md5';
  import api from '../api/api';
  import validateVp from 'public/plugin/validator';
//  import { Toast } from 'mint-ui';
  let phoneReg = new RegExp('^[1][3,4,5,7,8][0-9]{9}$');
  const NameSpace = 'telValidate';
  let interValObj = '';
  Vue.use(validateVp);
  export default {
    name: NameSpace,
    created() {
      let me = this;
      me.openId = KND.Util.getParam('openid');
//      KND.Session.get
    },
    data: () => {
      return {
        phoneNumber1: '',
        contactName: '',
        validate: '',
        curCount: 120,
        isSend: false
      };
    },
    computed: {
      ...mapState(NameSpace, ['obj'])
    },
    methods: {
      ...mapActions(NameSpace, ['toTelValidate']),
      toValidate() {
        let me = this;
        if (me.phoneNumber1) {
          if (!phoneReg.test(me.phoneNumber1)) {
            Toast('手机号码格式错误');
            return;
          } else {
            var num = '';
            for (var i = 0; i < 4; i++) {
              num += Math.floor(Math.random() * 10);
            }
            console.log(num);
            var message = '【坚朗海贝斯】您的验证码：' + num + '，请在2分钟内完成输入。如非本人操作，请忽略此条信息。详情咨询客服4009319898！';
            var ACCOUNT = 'gdjlwj';
            var PASSWORD = 'Net263gdjl';
            var timestamp = me.getTs(8);
            var pswd = md5(ACCOUNT + PASSWORD + timestamp);
            console.dir(pswd);
            var obj = {
              account: ACCOUNT,
              timestamp: timestamp,
              pswd: pswd,
              msg: encodeURI(message),
              phoneNumber: me.phoneNumber1,
              number: num
            };
            console.dir('===========');
            console.dir(obj);
            me.toTelValidate(obj);
          }
        } else {
          Toast('请输入手机号码');
          return;
        }
        me.isSend = true;
        interValObj = window.setInterval(me.contM, 1000);
      },
      pad(num, n) {
        var len = num.toString().length;
        while (len < n) {
          num = '0' + num;
          len++;
        }
        return num;
      },
      getTs(timeZone) {
        var self = this;
        var timestamp = Date.parse(new Date()) / 1000;
        if (typeof (timeZone) === 'number') {
          timestamp = parseInt(timestamp, 10) + parseInt(timeZone, 10) * 60 * 60;
        }
        var time = new Date(timestamp * 1000);
        var ymdhis = '';
        ymdhis += time.getUTCFullYear();
        ymdhis += self.pad((time.getUTCMonth() + 1), 2);
        ymdhis += self.pad(time.getUTCDate(), 2);
        ymdhis += self.pad(time.getUTCHours(), 2);
        ymdhis += self.pad(time.getUTCMinutes(), 2);
        ymdhis += self.pad(time.getUTCSeconds(), 2);
        return ymdhis;
      },
      submit() {
        var self = this;
        if (!self.isSend) { // 超时
          Toast('请重新获取验证码');
          return;
        }
        tools.valid.call(this, () => {
          if (self.obj.phoneNumber === self.phoneNumber1 && self.obj.number === self.validate) {
            api.get({ // 更改状态
              key: 'setWXphone',
              method: 'POST',
              data: {
                'body': {
                  'ProcessName': 'KL WeChat Contact Binding Process',
                  'Open Id': self.openId,
                  'Contact Name': self.contactName,
                  'Contact Phone': self.phoneNumber1
                }
              },
              success: function(data) {
                if (!data.ERROR) {
                  Toast('绑定成功');
                  let path = KND.Session.get('nextPage');
                  self.$router.replace(path);
                }
              }
            });
          } else {
            Toast('请输入正确验证码');
          }
        });
      },
      contM() {
        if (this.curCount) {
          this.curCount = this.curCount - 1;
        } else {
          window.clearInterval(interValObj);
          this.isSend = false;
          this.curCount = 120;
        }
      }
    },
    components: {cusField, validateVp}
  };
</script>
<style lang="scss">
  .sendValidate{
    width: 100px;
    height: 30px;
    border-radius: 10px;
    border: 1px solid  black;
    color: red;
  }
  .mar-right>.mint-field>.mint-cell-wrapper>.mint-cell-value>input{
    margin-right: 10px;
  }
</style>
