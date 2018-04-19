<template>
  <div class="login-container">
    <div class="logo" @click="clearFn">
      <img src="../assets/bg_login.png" />
    </div>

    <indicator></indicator>
    <div class="copyright">坚朗五金制品股份有限公司</div>
    <div class="login-form xs-icon"
      v-show="login">
      <cus-field class="account" label="账号" tag="账号"
                 v-model="username"
                 v-valid.require></cus-field>
      <cus-field class="password" label="密码" tag="密码" type="password"
                 v-model="password"
                 v-valid.require></cus-field>

      <!--<mt-checklist-->
        <!--v-model="remember"-->
        <!--:options="['记住密码']">-->
      <!--</mt-checklist>-->

      <mt-button class="single"
                 @click.native="loginFn">登陆</mt-button>
    </div>
  </div>
</template>

<script type="es6">
  import {mapActions} from 'vuex';
  import cusField from 'public/components/cus-field';
  import buttonGroup from 'public/components/cus-button-group';

  let NAMESPACE = 'login';
  export default {
    name: NAMESPACE,
    created() {
      let me = this;
      me.getCacheUser({
        success: result => {
          result.length ? me.$router.push('index') : me.login = true;
        }
      });
    },
    data() {
      return {
        remember: [],
        username: '13048225658',
        password: '123',
        login: false
      };
    },
    methods: {
      ...mapActions(NAMESPACE, ['queryUserInfo', 'cacheUser', 'getCacheUser', 'clear']),
      clearFn() {
        this.clear().then(result => {
          Indicator.process(false);
        });
      },
      loginFn() {
        let me = this;
        tools.valid.call(me, () => {
          me.queryUserInfo({
            data: {
              'Login Name': this.username,
              'KL Outsource Password': this.password
            },
            success: result => {
              // 缓存用户信息
              me.cacheUser(result.items);
              // 跳转首页
              me.$router.push('index');
            },
            error: err => {
              console.log(err);
              Toast({
                message: '用户名或密码错误',
                position: 'bottom'
              });
            }
          });
        });
      }
    },
    components: {cusField, buttonGroup}
  };
</script>

<style lang="scss">
  $label-color: #929292;

  #app .login-container {
    background-color: #fff;

    .logo {
      width: 100%;
      height: 44%;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .login-form {
      position: relative;
      background-color: #fff;
      padding: 0 20px 20px;

      .account {
        .mint-cell-wrapper:before {
          color: $theme-color;
          content: '\A186';
          font-size: 0.9rem;
        }
      }

      .password {
        .mint-cell-wrapper:before {
          color: $theme-color;
          content: '\A187';
          font-size: 0.9rem;
        }
      }

      .mint-button {
        width: 100%;
        border-radius: 20px;
        color: #fff;
        background-color: $theme-color;
      }

      .mint-field .mint-cell-title {
        padding-left: 10px;
        min-width: 50px;
        width: 50px;

        &:before {
          content: '';
        }
      }

      .mint-field-core {
        text-align: left;
      }

      .mint-field {
        @include border;
        background-size: 120% 2px;
        min-height: 40px;
        padding-top: 12px;

        .mint-cell-wrapper {
          background: none;
          color: $label-color;
        }
      }

      .mint-checklist {
        .mint-checklist-title {
          display: none;
        }

        .mint-cell {
          background: none;

          .mint-cell-wrapper {
            background: none;

            .mint-checkbox-core {
              width: 18px;
              height: 18px;
              border-radius: 4px;
            }

            .mint-checkbox-label {
              color: $label-color;
              font-size: $font-size-small;
            }
          }
        }
      }

      .mint-button {
        margin: 30px 0;

        label {
          display: inline-block;
          letter-spacing: 40px;
          text-indent: 40px;
        }
      }
    }

    .copyright {
      position: absolute;
      font-size: $font-size-small;
      color: $label-color;
      width: 100%;
      text-align: center;
      bottom: 10px;
    }
  }
</style>
