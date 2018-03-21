<template>
    <div>
      <mt-header fixed title="Indicator">
        <fallback slot="left"></fallback>
      </mt-header>

      <div class="mint-content">
        <mt-cell title="获取当前位置" @click.native="getLocation" is-link></mt-cell>
        <mt-cell title="扫一扫" @click.native="scan" is-link></mt-cell>
        <mt-cell title="附件组件" to="attach" is-link></mt-cell>
        <mt-cell title="拨打电话" @click.native="call=true" is-link></mt-cell>
        <cus-call number="13522229999" v-model="call"></cus-call>
      </div>
    </div>
</template>

<script type="es6">
  import {mapActions} from 'vuex';
  import cusCall from 'public/components/cus-call';

  let NAMESPACE = 'native';
  export default {
    name: NAMESPACE,
    components: {cusCall},
    data() {
      return {
        call: false
      };
    },
    created() {
      this.getAuthority();
    },
    methods: {
      ...mapActions('app', ['getAuthority']),
      getLocation() {
        KND.Native.getLocation({
          success(data) {
            console.log(data);
          }
        });
      },
      scan() {
        KND.Native.scanQRCode({
          success(data) {
            console.log(data);
          }
        });
      }
    }
  };

</script>

<style lang="scss"></style>
