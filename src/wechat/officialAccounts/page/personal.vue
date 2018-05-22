<template>
  <div style="background-color: #ebebeb;">
    <div class="mint-content">
      <div class="contact-info co-flex co-ac" style="padding: 0 1rem; min-height: 5rem; background: #ffffff">
        <div class="co-f1">
          <img class="headimgurl" v-if="contactInfo.headimgurl" :src="contactInfo.headimgurl"/>
          <img class="headimgurl" v-else src="../img/timg.jpeg"/>
        </div>
        <div class="co-f2" v-text="contactInfo.nickname"></div>
      </div>
      <div class="my-personal">
        <div class="co-flex co-ver co-jsa" @click="toMyDevice">
          <span class="xs-icon icon-device" style="font-size: 1.5rem"></span>
          <span>我的设备</span>
        </div>
        <div class="co-flex co-ver co-jsa" @click="toAddress">
          <span class="xs-icon icon-addr" style="font-size: 1.5rem"></span>
          <span>我的地址</span>
        </div>
        <div class="co-flex co-ver co-jsa" @click="callService">
          <span class="xs-icon icon-call" style="font-size: 1.5rem"></span>
          <span>热线服务</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="es6">
  import {mapActions} from 'vuex';
  import menuBox from 'public/components/cus-menu';
  const NAMESPACE = 'personal';
  export default {
    name: NAMESPACE,
    created() {
      let me = this;
      me.getContactInfo(data => {
        me.contactInfo = data;
      });
    },
    data: () => {
      return {
        contactInfo: {
          'nickname': '微信名称',
          'headimgurl': ''
        }
      };
    },
    methods: {
      ...mapActions(NAMESPACE, ['getContactInfo']),
      submit() {
        this.$router.push('myRepair');
      },
      toMyDevice() {
        this.$router.push('myDevice');
      },
      toAddress() {
        this.$router.push('address');
      },
      callService() {
        this.$router.push('hotTelephone');
      }
    },
    components: {menuBox}
  };
</script>
<style lang="scss">
  .contact-info {
    .co-f1 {
      height: 3.5rem;
    }

    .headimgurl {
      width: 3.5rem;
      height: 3.5rem;
      border-radius: 4px;
    }
  }

  .my-personal{
    margin-top: 1.5rem;
    background-color: #ffffff;
    div{
      display: inline-flex;
      width: 49%;
      height: 6rem;
      font-size: $font-size-default;
      text-align: center;
      padding: 10px 0;
      border-bottom: 1px solid #eaeaea;
      border-right: 1px solid #eaeaea;
      box-sizing: border-box;
    }
  }
</style>
