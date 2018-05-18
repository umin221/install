<template>
  <div>
    <mt-header fixed title="Indicator">
      <fallback slot="left"></fallback>
    </mt-header>

    <div class="mint-content">
      <div>
        <mt-cell v-for="(l, index) in list"
                 :key="index"
                 :title="l.title"
                 @click.native="l.fn"
                 is-link></mt-cell>
        <cus-call number="13522229999" v-model="call"></cus-call>
      </div>
    </div>

  </div>
</template>

<script type="es6">
  import {mapActions} from 'vuex';
  import cusCall from 'public/components/cus-call';

  KND.Event.bind('setPosition', data => {
    console.log(data);
  });

  let NAMESPACE = 'native';
  export default {
    name: NAMESPACE,
    components: {cusCall},
    data() {
      return {
        call: false,
        list: [{
          title: '查看地图位置',
          fn: () => {
            KND.Native.openLocation({
              success(data) {
                console.log(data);
              }
            });
          }
        }, {
          title: '获取当前位置信息',
          fn: () => {
            KND.Native.getLocation({
              success(data) {
                console.log(data);
              }
            });
          }
        }, {
          title: '地图选择位置',
          fn: () => {
            this.$router.push('position');
          }
        }, {
          title: '经纬度转位置',
          fn: () => {
            let geocoder = new qq.maps.Geocoder({
              complete: function(result) {
                console.log(result);
                var address = result.detail.addressComponents.province + result.detail.addressComponents.city + result.detail.addressComponents.district + result.detail.addressComponents.town + result.detail.addressComponents.street + result.detail.addressComponents.streetNumber;
                MessageBox('地址信息', address);
              }
            });
            var latLng = new qq.maps.LatLng(22.615108, 114.035529);
            // 调用获取位置方法
            geocoder.getAddress(latLng);
          }
        }, {
          title: '扫一扫',
          fn: () => {
            KND.Native.scanQRCode({
              success(data) {
                console.log(data);
              }
            });
          }
        }, {
          title: '附件组件',
          fn: () => this.$router.push('attach')
        }, {
          title: '拨打电话',
          fn: () => {
            this.call = true;
          }
        }, {
          title: '计算两点距离',
          fn: () => {
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
        }]
      };
    },
    methods: {
      ...mapActions('app', ['getAuthority'])
    }
  };

</script>

<style lang="scss"></style>
