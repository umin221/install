<template>
  <div>
    <mt-header fixed title="个人中心">
      <fallback slot="left"></fallback>
    </mt-header>

    <div class="wrapper">
      <div class="mint-content multiple">
        <mt-cell label="姓名" :value="user['Last Name']"></mt-cell>
        <mt-cell label="账号" :value="user['Login Name']"></mt-cell>
        <mt-cell label="版本" :value="version"></mt-cell>
      </div>

      <div class="login-form">
        <mt-button @click.native="logoutFn">注销</mt-button>
      </div>
    </div>

  </div>
</template>

<script type="es6">
  import {mapActions} from 'vuex';

  let NAMESPACE = 'setting';
  export default {
    name: NAMESPACE,
    created() {
      this.user = KND.Util.parse(KND.Session.get('userInfo'));
    },
    data() {
      return {
        user: '',
        version: tools.cordova.app.version
      };
    },
    methods: {
      ...mapActions('login', ['logout']),
      // 注销登录
      logoutFn() {
        let me = this;
        // 注销用户登录
        me.logout({
          success: result => {
            // 清除用户信息 下次匹配后刷新本地缓存
            KND.Session.remove('userInfo');
            // 重定向到登录
            me.$router.replace({
              name: 'login',
              query: {login: true} // 重定向登陆页必须携带此参数
            });
          }
        });
      }
    }
  };

</script>

<style lang="scss">
  .login-form {
    padding: 0 20px 20px;

    .mint-button {
      width: 100%;
      border-radius: 20px;
      color: $theme-color;
    }
  }
</style>
