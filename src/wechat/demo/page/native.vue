<template>
  <div>
    <mt-header fixed title="Indicator">
      <fallback slot="left"></fallback>
    </mt-header>

    <div class="mint-content">
      <div v-show="!showLocationPicker">
        <mt-cell v-for="(l, index) in list"
                 :key="index"
                 :title="l.title"
                 @click.native="l.fn"
                 is-link></mt-cell>
        <cus-call number="13522229999" v-model="call"></cus-call>
      </div>

      <iframe v-show="showLocationPicker" id="mapPage" style="position: absolute; top: 0; bottom: 0; left: 0; right: 0;" frameborder=0
              src="http://apis.map.qq.com/tools/locpicker?search=1&type=1&key=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77&referer=myapp">
      </iframe>
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
        call: false,
        showLocationPicker: false,
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
            this.showLocationPicker = true;
            window.addEventListener('message', function(event) {
              // 接收位置信息，用户选择确认位置点后选点组件会触发该事件，回传用户的位置信息
              var loc = event.data;
              if (loc && loc.module === 'locationPicker') { // 防止其他应用也会向该页面post信息，需判断module是否为'locationPicker'
                console.log('location', loc);
                this.showLocationPicker = false;
              }
            }, false);
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
