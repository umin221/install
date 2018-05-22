<template>
  <div>
    <div class="mint-content">
      <cus-field label="真实姓名" tag="真实姓名"
                 v-model="contactName"
                 class="mar-right"
                 v-valid.require
                 placeholder="请输入真实姓名"></cus-field>
      <cus-field label="手机号码" tag="手机号码"
                 class="mar-right"
                 v-model="mobile"
                 v-valid.require.phone
                 placeholder="请输入手机号">
        <cus-verify :mobile="mobile" ref="$verify"></cus-verify>
      </cus-field>
      <cus-field label="验证码" tag="验证码"
                 v-model="validate"
                 class="mar-right"
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
<script type="es6">
  import Vue from 'vue';
  import {mapActions} from 'vuex';
  import cusField from 'public/components/cus-field';
  import validateVp from 'public/plugin/validator';
  import cusVerify from '../components/cus-verify-code';
  import api from '../api/api';

  const NameSpace = 'telValidate';
  Vue.use(validateVp);
  export default {
    name: NameSpace,
    created() {
      this.openId = KND.Util.getParam('openid');
    },
    data: () => {
      return {
        mobile: '',
        contactName: '',
        validate: ''
      };
    },
    methods: {
      ...mapActions(NameSpace, ['toTelValidate']),
      submit() {
        let me = this;
        tools.valid.call(this, () => {
          // 校验短信验证码和手机号
          if (me.$refs.$verify.verify(me.validate)) {
            api.get({ // 更改状态
              key: 'setWXphone',
              method: 'POST',
              data: {
                'body': {
                  'ProcessName': 'KL WeChat Contact Binding Process',
                  'Open Id': me.openId,
                  'Contact Name': me.contactName,
                  'Contact Phone': me.mobile
                }
              },
              success: function(data) {
                if (!data.ERROR) {
                  Toast('绑定成功');
                  let path = KND.Session.get('nextPage');
                  me.$router.replace(path);
                }
              }
            });
          } else {
            Toast('请输入正确验证码');
          }
        });
      }
    },
    components: {cusField, validateVp, cusVerify}
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
