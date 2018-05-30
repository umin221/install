<template>
  <div class="login-container">
    <div class="logo" @click="clearFn">
      <img src="../assets/bg_login.png" />
    </div>

    <indicator></indicator>
    <div class="copyright">坚朗五金制品股份有限公司</div>
    <div class="login-form xs-icon"
      v-show="showLogin">
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

  // 缓存登陆id，后续使用此账号提交数据
  let setUser = user => {
    let userID = KND.Util.parse(user)['Login Name'];
    KND.Native.userID = userID;
    KND.Session.set('userID', userID);
    KND.Session.set('userInfo', user);
  };

  let NAMESPACE = 'login';
  export default {
    name: NAMESPACE,
    created() {
      let me = this;
      me.getCacheUser({
        success: result => {
          if (result.length) {
            // 获取缓存用户进入APP首页
            setUser(result[0].data);
            me.$router.push('index');
          } else {
            me.showLogin = true;
          }
        }
      });

      if (!config.isProduction) {
        me.username = 'IE01'; // 15899999999 13899997777
        me.password = 'Asdf2017';
      }
    },
    data() {
      return {
        remember: [],
        username: '',
        password: '',
        showLogin: false
      };
    },
    methods: {
      ...mapActions(NAMESPACE, ['queryUserInfo', 'getCacheUser', 'clear']),
      clearFn() {
        // this.clear().then(result => {
        //  Indicator.process(false);
        // });
      },
      loginFn() {
        let me = this;
        tools.valid.call(me, () => {
          me.queryUserInfo({
            data: {
              'Login Name': me.username.trim(),
              'KL Outsource Password': me.password.trim(),
              'KL Status': 'Active'
            },
            success: user => {
              // 缓存用户进入APP首页
              setUser(JSON.stringify(user));
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
