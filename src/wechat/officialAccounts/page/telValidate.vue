<template>
  <div>
    <div class="mint-content">
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
      <cus-field label="真实姓名" tag="真实姓名"
                 v-model="name"
                 class="require mar-right"
                 v-valid.require
                 placeholder="请输入真实姓名"></cus-field>
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
//  import {mapActions} from 'vuex';
  import cusField from '../../../public/components/cus-field';
  import Vue from 'vue';
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
        name: '',
        validate: '',
        curCount: 120,
        isSend: false
      };
    },
    computed: {
    },
    methods: {
//      ...mapActions(NameSpace, ['toTelValidate']),
      toValidate() {
        let me = this;
        if (me.phoneNumber1) {
          if (!phoneReg.test(me.phoneNumber1)) {
            Toast('手机号码格式错误');
            return;
          } else {
//            me.toTelValidate();
          }
        } else {
          Toast('请输入手机号码');
          return;
        }
        me.isSend = true;
        interValObj = window.setInterval(me.contM, 1000);
      },
      submit() {
        tools.valid.call(this, () => {
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
