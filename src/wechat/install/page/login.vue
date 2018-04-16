<template>
  <div class="login-container">
    <div class="logo">
      <img src="../assets/bg_login.png" />
    </div>

    <div class="login-form xs-icon">
      <cus-field class="account" label="账号" tag="账号"
                 v-model="username"
                 v-valid.require></cus-field>
      <cus-field class="password" label="密码" tag="密码" type="password"
                 v-model="password"
                 v-valid.require></cus-field>

      <mt-checklist
        v-model="remember"
        :options="['记住密码']">
      </mt-checklist>

      <mt-button class="single"
                 @click.native="loginFn">登陆</mt-button>
    </div>

    <div class="copyright">坚朗五金制品股份有限公司</div>
  </div>
</template>

<script type="es6">
  import {mapActions} from 'vuex';
  import cusField from 'public/components/cus-field';
  import buttonGroup from 'public/components/cus-button-group';
  import Vue from 'vue';
  import vp from 'public/plugin/validator';
  // use plugin
  Vue.use(vp);

  let NAMESPACE = 'login';
  export default {
    name: NAMESPACE,
    created() {
      this.getAddress();
    },
    data() {
      return {
        remember: [],
        username: '',
        password: ''
      };
    },
    methods: {
      ...mapActions(NAMESPACE, ['getAddress']),
      loginFn() {
        let me = this;
        console.log(`username=${this.username},password${this.password}`);
        me.$router.push('index');
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
      padding: 0 20px 20px;
      z-index: 1;

      .account {
        .mint-cell-wrapper:before {
          color: $theme-color;
          content: '\A186';
        }
      }

      .password {
        .mint-cell-wrapper:before {
          color: $theme-color;
          content: '\A187';
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
