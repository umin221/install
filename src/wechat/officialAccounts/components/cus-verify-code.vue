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
  import rules from 'public/plugin/rules';

  let NAMESPACE = 'verify';
  export default {
    name: NAMESPACE,
    data() {
      return {
//        标记是否已发送验证码
        isSend: false,
//        验证码触发周期，120秒
        second: 120
      };
    },
    props: {
      phone: ''
    },
    methods: {
      sendVerCode() {
        let me = this;
        if (rules['phone'].test(me.phone)) {
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
        } else {
          Toast('请检查号码准确性');
        }
      },
      verify(code) {
        console.log(code);
        return false;
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
