<template>
  <div style="background-color: #ebebeb;">
    <div class="mint-content submitService">
      <div class="addform">
        <mt-cell title="产品品牌"
                 placeholder="请选择"
                 :value="brand"></mt-cell>
        <mt-field label="产品条形码"
                  v-model="KLSN"
                  class="klsn"
                  placeholder="请扫码或输入条形码">
          <i class="xs-icon icon-scan" @click="toScan"></i></mt-field>
        <mt-field label="联系人" tag="联系人"
                  type="text"
                  v-valid.require
                  v-model="lastName"
                  placeholder="请输入联系人"></mt-field>
        <mt-field label="联系电话" tag="联系电话"
                  type="number"
                  v-model="callPhone"
                  v-valid.require.phone|fax
                  placeholder="请输入联系电话"></mt-field>
        <mt-cell title="详细地址" tag="详细地址"
                 placeholder="请选择"
                 :value="address"
                 to="address"
                 class="require"
                 v-valid.require
                 is-link></mt-cell>
        <mt-cell title="预约时间"
                 placeholder="请选择"
                 :value="AppointTime"
                 @click.native="open('picker1')"
                 is-link></mt-cell>
        <mt-cell title="故障现象"
                 placeholder="请选择"
                 :value="SubArea"
                 @click.native="showAreaBox"
                 is-link></mt-cell>
        <mt-field label="问题说明"
                  v-model="ComplaintDescription"
                  placeholder="请详细说明..."></mt-field>
        <attach ioName="KL Service Request Attachment IO" ref="attach"
                :attach="attach.list"
                :edit="attach.edit"
                :title="attach.title">
        </attach>
      </div>
      <mt-datetime-picker
        ref="picker1"
        v-model="pickerVisible"
        :startDate="startDate"
        year-format="{value} 年"
        month-format="{value} 月"
        date-format="{value} 日"
        hour-format="{value} 时"
        class="datetime"
        @confirm="handleChange">
      </mt-datetime-picker>

      <mt-popup v-if="showBox" v-model="showBox" position="bottom">
        <menuBox @my-enter="enter"
                 @my-change="onValuesChange"
                 @my-cancel="showBox = !showBox"
                 :slots="slots"></menuBox></mt-popup>

      <button-group>
        <mt-button class="single" @click.native="submit">提交</mt-button>
      </button-group>
    </div>
  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex';
  import Vue from 'vue';
  import menuBox from 'public/components/cus-menu';
  import vp from 'public/plugin/validator';
  const NameSpace = 'index';
  Vue.use(vp);
  export default {
    name: NameSpace,
    created() {
      let me = this;
      me.openId = KND.Util.getParam('openid');
      console.log(me.openId);
    },
    data: () => {
      return {
        pickerVisible: new Date(),
        startDate: new Date(),
        slots: [
          {flex: 1, values: [], className: 'slot1', textAlign: 'center'},
          {flex: 1, values: [], className: 'slot1', textAlign: 'center'}
        ],
        showBox: false,
        KLSN: '',              // 条形码
        brand: '坚朗海贝斯',  // 品牌
        lastName: '',         // 联系人
        callPhone: '',        // 联系电话
//        Province: '',         // 省
//        City: '',              // 城市
//        Town: '',              // 区
//        DetailAddress: '',    // 详细地址
        Area: '',              // 故障分类
        SubArea: '',           // 故障描述
        ComplaintDescription: '', // 故障详情描述
        AddressId: '',        // 如果是用户自己新建了地址，传新建的地址Id,如果只是简单定位，不用传
        AppointTime: '',      // 用户的预约上门时间
        AssetId: '',           // 如果是用户扫码了，并带出了资产，传资产Id，扫不出来，不用传
        openId: '',
        attach: { // 附件
          list: [],
          edit: true,
          title: '相关照片'
        }
      };
    },
    computed: {
      ...mapState(NameSpace, ['Contact', 'cutAddress', 'form']),
      address() {
        let me = this;
        if (me.form.Id) {
          return me.form.Province + me.form.City + me.form.County + me.form['Street Address'];
        }
      }
    },
    methods: {
      ...mapActions(NameSpace, ['getLov', 'submitService']),
      submit() {
        tools.valid.call(this, () => {
          let me = this;
          let form = {
            'Address Id': me.form.type === 'add' ? me.form.Id : '', // 如果是用户自己新建了地址，传新建的地址Id,如果只是简单定位，不用传
            'Appoint Time': me.AppointTime ? new Date(me.AppointTime).format('MM/dd/yyyy hh:mm:ss') : '', // 用户的预约上门时间
            'Asset Id': me.AssetId,  // 如果是用户扫码了，并带出了资产，传资产Id，扫不出来，不用传
            'Province': me.form.Province, // 省
            'City': me.form.City, // 城市
            'Town': me.form.County, // 区
            'Detail Address': me.form['Street Address'], // 详细地址
            'Contact Name': me.lastName, // 名字
            'Contact Phone': me.callPhone, // 电话
            'Area': me.Area, // 故障分类
            'Sub-Area': me.SubArea, // 故障描述
            'Complaint Description': me.ComplaintDescription, // 故障详情描述
            'Open Id': me.openId, // 微信端的OpenId
            'callback': function(data) {
              me.$router.push({
                name: 'myRepair',
                query: {
                  ContactId: data['Contact Id']
                }
              });
            }
          };
          me.submitService(form);
        });
      },
      handleChange(value) {
        let me = this;
        me.AppointTime = value.format('yyyy-MM-dd hh:mm:ss');
        console.log(me.AppointTime);
      },
      open(picker) {
        this.$refs[picker].open();
      },
      showAreaBox() {
        let me = this;
        me.slots[0].values = [];
        me.getLov({
          type: 'SR_AREA',
          parent: '',
          success: function(data) {
            let items = data.items;
            for (let i = 0; i < items.length;i++) {
              me.slots[0].values.push(items[i].Value);
            }
            me.showBox = !me.showBox;
          }
        });
      },
      enter(value) {
        let me = this;
        me.Area = value[0];
        me.SubArea = value[1];
        me.showBox = !me.showBox;
      },
      onValuesChange(value) {
        let me = this;
        me.slots[1].values = [];
        me.getLov({
          type: 'SR_AREA',
          parent: value[0],
          success: function(data) {
            let items = data.items;
            console.log(items);
            for (let i = 0; i < items.length;i++) {
              me.slots[1].values.push(items[i].Value);
            }
          }
        });
      },
      toScan() {
        KND.Native.scanQRCode({
          success(data) {
            console.log(data);
          }
        });
      }
    },
    components: {menuBox, vp}
  };
</script>
<style lang="scss">
  .submitService{
    .addform{
      background-color: #ffffff;
      margin-bottom: 2rem;

      .klsn>.mint-cell-wrapper>.mint-cell-value>input{
        margin-right: 0.5rem;
      }
    }
    .datetime>.picker>.picker-items>.picker-slot:nth-child(5){
      display: none;
    }
  }
</style>
