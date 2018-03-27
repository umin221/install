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
        <mt-cell title="计算两点距离" @click.native="distance" is-link></mt-cell>
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
      },
      distance() {
        var dis1 = getDisance(22.615108, 114.035529, 22.544807, 113.95446);
        MessageBox('联想到深圳北的直线距离(公里)', dis1.toFixed(2));
        // 获取当前的经纬度
        function toRad(d) { return d * Math.PI / 180; }
        function getDisance(lat1, lng1, lat2, lng2) { // #lat为纬度, lng为经度, 一定不要弄错
          var radLat1 = toRad(lat1);
          var radLat2 = toRad(lat2);
          var deltaLat = radLat1 - radLat2;
          var deltaLng = toRad(lng1) - toRad(lng2);
          var dis = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(deltaLng / 2), 2)));
          return dis * 6378.137;
        }
      }
    }
  };

</script>

<style lang="scss"></style>
