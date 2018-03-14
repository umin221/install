/**
* @file 打卡
* @author  石
* @date  2018/3/14
*/
<template>
  <div id='sign'>
    <mt-header fixed :title="headTitle">
      <fallback slot="left"></fallback>
       <mt-button slot="right" @click="signRecord">签到记录</mt-button>
    </mt-header>
    <div class="mint-content">
       <baidu-map class="map" :center="center":zoom="zoom" @ready="handler" :dragging='dragging'>
         <!-- <bm-geolocation :showAddressBar="false" :autoLocation="true"></bm-geolocation> -->
          <bm-marker :position="center" :dragging="false" ></bm-marker>
       </baidu-map>
       <div class="box">
        <mt-cell :title="location" icon="location" class="locationName magrgin10"></mt-cell>
        <mt-cell title="周边客户" class="magrgin10"></mt-cell>
        <mt-radio
          v-model="selected"
          :options="['选项A', '选项B', '选项C', '选项D', '选项E']">
        </mt-radio>
       </div>
       <button-group class="singBtn">
        <mt-button type="primary" 
                   @click.native="sign">立即签到</mt-button>
      </button-group>
    </div>
  </div>
</template>
<script>
  import buttonGroup from 'public/components/cus-button-group';
  import { Toast, MessageBox } from 'mint-ui';
  // import { mapState } from 'vuex';
  // const NAMESPACE = 'index';
  export default {
    components: {buttonGroup},
    name: 'sign',
    data() {
      return {
        headTitle: '打卡',
        center: {lng: 0, lat: 0},
        zoom: 15,
        location: '正在定位...',
        value: '',
        BMap: '',
        map: '',
        dragging: false, // 禁止地图拖拽
        selected: ''
      };
    },
    created() {
    },
    computed: {
    },
    methods: {
      // 地图初始化之后调用
      handler({BMap, map}) {
        var geolocation = new BMap.Geolocation();
        var gc = new BMap.Geocoder();
        this.BMap = BMap;
        this.map = map;
        geolocation.getCurrentPosition((position) => this.locationSuccess(gc, position), {enableHighAccuracy: true});
      },
      // 定位成功
      locationSuccess(gc, position) {
        var self = this;
        self.center.lng = position.point.lng;
        self.center.lat = position.point.lat;
        gc.getLocation(position.point ? position.point : position, function(rs) {
          var addComp = rs.addressComponents;
          self.location = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber;
        });
      },
      // 定位失败
      locationError(err) {
        Toast(err);
      },
      // 跳转签到记录
      signRecord() {
        this.$router.push('/record');
      },
      // 点击签到按钮
      sign() {
        // var BMap = this.BMap;
        // var position = new BMap.Point(112.297478, 39.928437); // 转换百度api可识别的经纬度
        // this.locationSuccess(new BMap.Geocoder(), position);
        MessageBox('提示', '根据公司规定，制定当天工作计划后才可更新安装相关进度，请您配合');
      }
    }
  };

</script>

<style scoped lang="scss">
  #sign {
    background-color: #fff;
    .locationName{
      border-bottom: 1px solid #ddd;
      color:#777;
    }
  }
  .magrgin10{
    margin-left: 10px;
  }
  .singBtn{
    border-top: 1px solid #ddd;
  }
  .mint-radiolist-title:empty{
    display: none;
  }
  .box {
    padding-bottom: 2.4rem;
  }
  .map {
  width: 100%;
  height: 16rem;
}
</style>
