<template>
  <div>
    <mt-header fixed title="项目楼层信息补充">
      <fallback slot="left"></fallback>
    </mt-header>
    <div class="mint-content buildingInfo">
      <mt-cell title="省市区"
               @click.native="showLovFn('KL_PROVINCE')"
               placeholder="请选择"
               is-link
               v-model="provinces"></mt-cell>
      <cus-field class="block"
                 label="详细地址"
                 v-model= 'detailAddress'
                 type="textarea"
                 placeholder="请输入详细地址"></cus-field>
      <div style="height: 5px"></div>
      <div style="background: white;padding-bottom: 10px;">
        <mt-cell>
          <div slot="title" class="list-text"><span class="list-text-span">楼层信息</span></div>
        </mt-cell>
        <div class="cus-cell">
            <div class="cus-title">楼栋数<span class="cus-title-span">默认栋，如1栋</span></div>
            <div class="cus-title" style="text-align: right;margin-bottom: 10px;">
              <div class="cus-title-div" ><span @click="reduceVal('buildingNum')">-</span><input v-model="buildingNum"/><span @click="plusVal('buildingNum')">+</span></div><span>栋</span>
            </div>
        </div>
        <div class="cus-cell">
          <div class="cus-title">楼层数/栋<span class="cus-title-span">默认F，如1F</span></div>
          <div class="cus-title" style="text-align: right;margin-bottom: 10px;">
            <div class="cus-title-div" ><span  @click="reduceVal('layerNum')">-</span><input v-model="layerNum"/><span @click="plusVal('layerNum')">+</span></div><span>F</span>
          </div>
        </div>
        <div class="cus-cell">
          <div class="cus-title">房间数/层<span class="cus-title-span">房号，楼层号+001，如1001</span></div>
          <div class="cus-title" style="text-align: right;margin-bottom: 10px;">
            <div class="cus-title-div" ><span  @click="reduceVal('roomNum')">-</span><input v-model="roomNum"/><span @click="plusVal('roomNum')">+</span></div><span>&nbsp;</span>
          </div>
        </div>
      </div>
      <div class="buildingInfo-zy">注意：非标准楼层选择楼数量后手工编辑</div>
    </div>
    <!--下拉菜单-->
    <mt-popup v-model="showBox" position="bottom">
      <menu-box @my-enter="enter"
                @my-cancel="showBox = false"
                @my-change="onValuesChange"
                @my-change1="onValuesChange1"
                :slots="slots"
                :slots1="slots1"
                :slots2="slots2"></menu-box>
    </mt-popup>
    <button-group>
      <mt-button class="single"
                 @click.native="submitFn">保存提交</mt-button>
    </button-group>
  </div>
</template>
<style lang="scss">
  .buildingInfo{
    .cus-cell {
      position: relative;
      margin: 10px;
      padding: 10px;
      border-radius: 4px;
      overflow: hidden;
      font-size: 0.75rem;
      background: #f3f1f1;
    }
    .cus-title {
      background: #f3f1f1!important;
      line-height: 30px;
    }
    .cus-title-span {
      color: #777;
      font-size: 0.65rem;
      margin-left: 10px;
    }
    .cus-title-div {
      position: absolute;
      height: 36px;
      width: 200px;
      border-radius: 4px;
      overflow: hidden;
      font-size: 0.75rem;
      right: 30px;
      background: white;
      border: 1px solid #ebebeb;
    }
    .cus-title-div input{
      width: 100px;
      line-height: 36px;
      border-left: 1px solid #ebebeb;
      border-right: 1px solid #ebebeb;
      border-bottom: none;
      border-top: none;
      text-align: center;
      font-size: $font-size-icon;
      color: $primary-color;
    }
    .cus-title-div span{
      padding:20px;
    }
    .buildingInfo-zy{
      color: #777;
      line-height: 22px;
      margin: 10px;
      font-size: 0.75rem;
    }
  }
</style>
<script type="application/javascript">
  import {mapState, mapActions} from 'vuex';
  import cusField from 'public/components/cus-field';
  import menuBox from '../components/cus-menu';
  import api from '../api/api';

  import buttonGroup from 'public/components/cus-button-group';
  let isMunicipality = function(...args) {
    let me = this;
    let city = args.pop();
    let isMun = true;
    for (let i = 0;i < me.Municipality.length; i++) {
      if (city === me.Municipality[i]) {
        isMun = false;
      }
    }
    return isMun;
  };
  const NameSpace = 'buildingInfo';
  export default {
    name: 'buildingInfo',
    created() {
      console.dir(1);
      let param = this.$route.query;
      this.id = param.id;
      this.orderID = param.orderID;
    },
    data: () => {
      return {
        value: '',
        id: '',
        slots: [{flex: 1, values: [], className: 'slot1', textAlign: 'center'}],
        slots1: [{flex: 1, values: [], className: 'slot1', textAlign: 'center'}],
        slots2: [{flex: 1, values: [], className: 'slot1', textAlign: 'center'}],
        showBox: false,
        provinces: '',
        KL_PROVINCE: '',
        KL_CITY: '',
        KL_TOWN: '',
        detailAddress: '',
        active: 'tab-container'
      };
    },
    beforeRouteEnter(to, from, next) {
      console.dir(2);
      next(vm => {
        let query = vm.$route.query;
        console.dir(query);
      });
    },
    methods: {
      ...mapActions(NameSpace, ['reduceValFn', 'plusValFn', 'getLov']),
      showLovFn(type) {
        let me = this;
        me.slots[0].values = [];
        me.showBox = true;
        me.getLov({
          type: 'KL_PROVINCE',
          parent: '中国',
          success: data => {
            let datas = KND.Util.toArray(data.items) ;
            for (let i = 0;i < datas.length; i++) {
              me.slots[0].values.push(datas[i].Value);
            }
          }
        });
      },
      enter(values) {
        let me = this;
        let isMun = isMunicipality.call(this, values['KL_PROVINCE']);
        me.showBox = false;
        me.KL_PROVINCE = values['KL_PROVINCE'];
        me.KL_CITY = values['KL_CITY'];
        me.KL_TOWN = values['KL_TOWN'];
        if (isMun) {
          me.provinces = values['KL_PROVINCE'] + values['KL_CITY'] + values['KL_TOWN'];
        } else {
          me.provinces = values['KL_CITY'] + values['KL_TOWN'];
        }
      },
      onValuesChange(value) {
        let me = this;
        me.slots1[0].values = [];
        if (value[0]) {
          me.getLov({
            type: 'KL_CITY',
            parent: value[0],
            success: data => {
              let datas = KND.Util.toArray(data.items) ;
              for (let i = 0;i < datas.length; i++) {
                me.slots1[0].values.push(datas[i].Value);
              }
            }
          });
        }
      },
      onValuesChange1(value) {
        let me = this;
        me.slots2[0].values = [];
        if (value[0]) {
          me.getLov({
            type: 'KL_TOWN',
            parent: value[0],
            success: data => {
              let datas = KND.Util.toArray(data.items) ;
              for (let i = 0;i < datas.length; i++) {
                me.slots2[0].values.push(datas[i].Value);
              }
            }
          });
        }
      },
      reduceVal: function(type) {
        this.reduceValFn({
          type: type,
          success: data => {
          }
        });
      },
      plusVal: function(type) {
        this.plusValFn({
          type: type,
          success: data => {
          }
        });
      },
      submitFn: function() {
        var self = this;
        api.get({
          key: 'setBuild',
          method: 'POST',
          data: {
            'body': {
              'OrderId': self.orderID, // 详情ID
              'TaskId': self.id, // 批次ID
              'Type': 'Initial',
              'ProcessName': 'KL Install Order Asset Create Process',
              'BuilingName': '栋',
              'BuildingNum': self.buildingNum,
              'FloorName': 'F',
              'FloorNum': self.layerNum,
              'RoomNum': self.roomNum,
              'Country': '中国',
              'Province': self.KL_PROVINCE,
              'City': self.KL_CITY,
              'County': self.KL_TOWN,
              'Street Address': self.detailAddress
            }
          },
          success: function(data) {
            if (!data.ERROR) {
              api.get({ // 更改按钮状态
                key: 'getUPStatus',
                method: 'POST',
                data: {
                  'body': {
                    'ProcessName': 'KL Install Task Submit For Approval Workflow',
                    'RowId': self.id
                  }
                },
                success: function(dataObj) {
                  if (!dataObj.ERROR) {
                    Toast('提交成功');
                    KND.Util.back(-2);
                  }
                }
              });
            }
          }
        });
      }
    },
    components: {buttonGroup, menuBox, cusField},
    computed: {
      ...mapState(NameSpace, ['Municipality']),
      ...mapState(NameSpace, ['buildingNum', 'layerNum', 'roomNum'])
    }

  };
</script>
