<template>
  <div class="verify-container">
    <mt-button type="primary"
               v-if="!isSend"
               @click.native="sendVerCode"
               size="small"
               style="color: orangered;background: none;border: 1px solid;">发送验证码</mt-button>
    <mt-button type="primary"
               v-else
               size="small"
               style="color: grey;background: none;border: 1px solid;">{{second}}秒内输入</mt-button>
  </div>
</template>

<script type="es6">
  import {mapActions} from 'vuex';
  import rules from 'public/plugin/rules';
  import md5 from 'js-md5';

  const NAMESPACE = 'verify';
  // 待验证号码
  let mobile;
  export default {
    name: NAMESPACE,
    data() {
      return {
//        标记是否已发送验证码
        isSend: false,
//        验证码触发周期，120秒
        second: 120,
//        随机验证码
        code: ''
      };
    },
    props: {
      mobile: ''
    },
    methods: {
      ...mapActions('index', ['sendMsg']),
//      更新当前按钮状态
      updateState() {
        let me = this;
        me.isSend = true;
        let interValObj = setInterval(() => {
          if (me.second > 0) {
            me.second--;
          } else {
            clearInterval(interValObj);
            me.second = 120;
            me.isSend = false;
          }
        }, 1000);
      },
//      发送短信
      sendSM() {
        let me = this;
        let csm = config.shortMsg;
        let code = me.code;
        let mobile = me.mobile;
        let msg = encodeURI(`【坚朗海贝斯】您的验证码：${code}，请在2分钟内完成输入。如非本人操作，请忽略此条信息。详情咨询客服4009319898！`);
        let account = csm.account;
        let password = csm.password;
        let ts = new Date().format('yyyyMMddhhmmssss');
        let pswd = md5(account + password + ts);
        // 发送短信
        me.sendMsg({ account, ts, pswd, msg, mobile });
      },
//      发送验证码
      sendVerCode() {
        let me = this;
        console.log(me.mobile);
        if (rules['phone'].test(me.mobile)) {
//          更新当前按钮状态
          me.updateState();
//          生成验证码
          me.generateCode();
//          发送短信
          me.sendSM();
        } else {
          Toast('手机号码格式错误');
        }
      },
//      校验验证码
      verify(code) {
        return this.mobile === mobile && this.code === code;
      },
//      生成随机验证码
      generateCode() {
        mobile = this.mobile;
        this.code = Math.random().toString().substr(2, 4);
        console.log(this.code);
      }
    }
  };

</script>

<style lang="scss">
  .verify-container {
    .mint-button--small {
      padding: 0 4px;
    }
  }
</style>
