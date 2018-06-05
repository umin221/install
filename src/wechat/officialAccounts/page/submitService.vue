<template>
  <div>
    <div class="mint-content submitService">
        <mt-cell title="产品品牌"
                 placeholder="请选择"
                 :value="brand"></mt-cell>
        <mt-field label="产品条形码"
                  v-model="KLSN"
                  class="marginL"
                  @change.native="serchSn"
                  placeholder="请扫码或输入条形码">
          <router-link class="xs-icon klsn" to="scanSn"></router-link>
          <i class="xs-icon icon-scan" @click="toScan"></i></mt-field>
        <mt-field label="联系人" tag="联系人"
                  type="text"
                  v-valid.require
                  v-model="lastName"
                  placeholder="请输入联系人"></mt-field>
        <cus-field label="手机号码" tag="手机号码"
                   type="number"
                   v-model="callPhone"
                   @change="changePhone"
                   v-valid.require.phone
                   placeholder="请输入手机号">
          <cus-verify v-show="verify" :mobile="callPhone" ref="$verify"></cus-verify>
        </cus-field>
        <cus-field label="验证码" tag="验证码"
                   type="number"
                   v-if="verify"
                   v-model="validate"
                   v-valid.require
                   placeholder="请输入验证码"></cus-field>
        <cus-field label="详细地址" tag="详细地址"
                 placeholder="请选择"
                 :value="address"
                   @click.native="addressFn()"
                 class="requisite hideText"
                 v-valid.require
                 is-link></cus-field>
        <cus-field label="故障现象" tag="故障现象"
                 placeholder="请选择"
                 :value="SubArea"
                 class="requisite"
                 v-valid.require
                 @click.native="showAreaBox"
                 is-link></cus-field>
        <cus-field label="预约时间" tag="预约时间"
                 placeholder="请选择"
                 :value="appointTime"
                 class="requisite"
                 v-valid.require
                 @click.native="open('picker1')"
                 is-link></cus-field>
        <mt-field label="问题说明"
                  type="textarea"
                  class="mint-textarea"
                  :attr="{ maxlength: 200 }"
                  v-model="ComplaintDescription"
                  rows="4"
                  placeholder="请详细说明,最多输入200字..."></mt-field>
        <attach ioName="KL Service Request Attachment IO" ref="attach"
                :attach="attach.list"
                :edit="attach.edit"
                title="相关照片">
        </attach>
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
<script type="es6">
  import {mapState, mapActions, mapMutations} from 'vuex';
  import Vue from 'vue';
  import cusField from 'public/components/cus-field';
  import cusVerify from '../components/cus-verify-code';
  import { Toast } from 'mint-ui';
  import menuBox from 'public/components/cus-menu';
  import vp from 'public/plugin/validator';
  const NAMESPACE = 'submit';
  const INDEX = 'index';

  let util = KND.Util;
  // 用户信息
  let contact = util.parse(KND.Session.get('Contact'));
  let phoneReg = new RegExp('^[A-Za-z0-9]+$');
  let _upload = function(serverIds, id) {
    // 成功回调
    let callback = data => {
      tools.success(data, {
        back: false,
        successTips: '提交成功'
      });
    };
    // 上传附件
    serverIds ? this.upload({
      data: {
        MediaId: serverIds,
        Id: id,
        IOName: 'KL Service Request Attachment IO',
        Comment: this.value
      },
      success: callback
    }) : callback(id);
  };
  let t = new Date().getTime() + 3600000;
  Vue.use(vp);
  export default {
    name: NAMESPACE,
    created() {
      let me = this;
      me.lastName = contact['Last Name']; // 名字
      me.callPhone = contact['Cellular Phone #']; // 电话
      me.getLov({
        type: 'KL_SR_ATT_TYPE',
        parent: '',
        success: function(data) {
          let items = data.items;
          for (let i = 0; i < items.length;i++) {
            if (items[i].Name === 'Customer Upload File') {
              me.value = items[i].Value;
            }
          }
        }
      });
    },
    activated() {
      let me = this;
      // 清空历史信息
      if (me.$parent.transitionName === 'turn-on') {
        me.KLSN = '';
        me.Area = '';
        me.SubArea = '';
        me.appointTime = '';
        me.AppointTime = '';
        me.ComplaintDescription = '';
      }
    },
    data: () => {
      return {
        pickerVisible: new Date(),
        startDate: new Date(t),
        slots: [
          {flex: 1, values: [], className: 'slot1', textAlign: 'center'},
          {flex: 1, values: [], className: 'slot1', textAlign: 'center'}
        ],
        showBox: false,
        value: '客户上传附件',
        KLSN: '',              // 条形码
        brand: '坚朗海贝斯',  // 品牌
        lastName: '',         // 联系人
        callPhone: '',         // 联系电话
//        Province: '',         // 省
//        City: '',              // 城市
//        Town: '',              // 区
//        DetailAddress: '',    // 详细地址
        Area: '',              // 故障分类
        SubArea: '',           // 故障描述
        ComplaintDescription: '', // 故障详情描述
        AddressId: '',        // 如果是用户自己新建了地址，传新建的地址Id,如果只是简单定位，不用传
        appointTime: '',
        AppointTime: '',      // 用户的预约上门时间
        AssetId: '',           // 如果是用户扫码了，并带出了资产，传资产Id，扫不出来，不用传
        attach: { // 附件
          list: [],
          edit: true,
          title: '相关照片'
        },
        validate: '', // 短信验证码
        verify: false // 标记是否需要验证码
      };
    },
    computed: {
      ...mapState(INDEX, ['cutAddress', 'form']),
      address() {
        let me = this;
        if (me.form.Id) {
          return me.form.Province + me.form.City + me.form.County + me.form['Street Address'] + me.form['Street Address 2'] + me.form['Street Address 3'] + me.form['Street Address 4'];
        } else {
          return '';
        }
      }
    },
    methods: {
      ...mapActions('app', ['upload']),
      ...mapActions(INDEX, ['getLov', 'submitService', 'getAsset']),
      ...mapMutations(INDEX, ['addressBack']),
      addressFn() {
        let me = this;
        me.$router.push({
          name: 'address'
        });
      },
      submit() {
        let me = this;
        let uploadAttach = id => {
          _upload.call(me, me.$refs.attach.getServerIds(), id);
        };
        // 控制验证码节点
        me.$nextTick(data => {
          tools.valid.call(me, () => {
            // 校验短信验证码和手机号
            if (!me.verify || me.$refs.$verify.verify(me.validate)) {
              let form = {
                'Address Id': me.form.type === 'add' ? me.form.Id : '', // 如果是用户自己新建了地址，传新建的地址Id,如果只是简单定位，不用传
                'Appoint Time': me.AppointTime ? me.AppointTime : '', // 用户的预约上门时间
                'Asset Id': me.AssetId,  // 如果是用户扫码了，并带出了资产，传资产Id，扫不出来，不用传
                'Province': me.form.Province, // 省
                'City': me.form.City, // 城市
                'Town': me.form.County, // 区
                'Detail Address': me.form['Street Address'], // 详细地址
                'Building': me.form['Street Address 2'], // 详细地址
                'Floor': me.form['Street Address 3'], // 详细地址
                'Room': me.form['Street Address 4'], // 详细地址
                'Contact Name': me.lastName, // 名字
                'Contact Phone': me.callPhone, // 电话
                'WeChat Id': contact['Id'], // 微信报修人id
                'Area': me.Area, // 故障分类
                'Sub-Area': me.SubArea, // 故障描述
                'Complaint Description': me.ComplaintDescription, // 故障详情描述
                'callback': function(data) {
                  uploadAttach(data['SR Id']);
                  me.$router.push({
                    name: 'myRepair',
                    query: {
                      ContactId: data['Contact Id']
                    }
                  });
                }
              };
              // 提交服务请求
              me.submitService(form);
            } else {
              Toast('验证码错误，请重试');
            }
          });
        });
      },
      serchSn() {
        let me = this;
        if (!phoneReg.test(me.KLSN)) {
          me.KLSN = '';
          Toast('请输入正确的条形码');
          return;
        }
        me.getAsset({
          num: me.KLSN,
          callback: function(data) {
            console.dir('0000' + data);
            if (data) {
              let form = {
                Province: data['KL Personal Province'],
                City: data['Personal City'],
                County: data['KL Personal Town'],
                'Street Address': data['Personal Address'],
                'Street Address 2': data['KL Personal Address Building'],
                'Street Address 3': data['KL Personal Address Floor'],
                'Street Address 4': data['KL Personal Address Room'],
                Id: 'Asset'
              };
              me.AssetId = data.Id;
              me.addressBack(form);
            } else {
              me.KLSN = '';
            }
          }
        });
      },
      handleChange(value) {
        let me = this;
        me.appointTime = util.format(value, 'yyyy-MM-dd hh:mm:ss');
        me.AppointTime = value.format('MM/dd/yyyy hh:mm:ss');
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
            let items = util.toArray(data.items);
            for (let i = 0; i < items.length;i++) {
              me.slots[0].values.push(items[i].Value);
            }
            me.showBox = !me.showBox;
          }
        });
      },
      enter(value) {
        console.log(value);
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
            let items = util.toArray(data.items);
            for (let i = 0; i < items.length;i++) {
              me.slots[1].values.push(items[i].Value);
            }
          }
        });
      },
      toScan() {
        let me = this;
        KND.Native.scanQRCode({
          success(data) {
            console.log(data);
            let resultStr = data.resultStr.split(',')[1];
            me.getAsset({
              num: resultStr,
              callback: function(data) {
                if (data) {
                  let datas = util.toArray(data);
                  let form = {
                    Province: datas[0]['KL Personal Province'],
                    City: datas[0]['Personal City'],
                    County: datas[0]['KL Personal Town'],
                    'Street Address': datas[0]['Personal Address'],
                    'Street Address 2': datas[0]['KL Personal Address Building'],
                    'Street Address 3': datas[0]['KL Personal Address Floor'],
                    'Street Address 4': datas[0]['KL Personal Address Room'],
                    Id: 'Asset'
                  };
                  me.KLSN = resultStr;
                  me.addressBack(form);
                  me.AssetId = datas[0]['Id'];  // 产品ID
                } else {
                  me.KLSN = '';
                }
              }
            });
          }
        });
      },
      // 修改号码后需要验证验证码
      changePhone(val) {
        this.verify = contact['Cellular Phone #'] !== val;
      }
    },
    components: {menuBox, vp, cusField, cusVerify}
  };
</script>
<style lang="scss">
  .submitService{
      background-color: #ffffff;
      margin-bottom: 2rem;

      .mint-textarea>.mint-cell-wrapper{
        display: block;
      }
      .marginL>.mint-cell-wrapper>.mint-cell-value>input{
        margin-right: 0.5rem;
      }
      .marginL>.mint-cell-wrapper>.mint-cell-title{
        margin-left: 20px;
      }
      .marginL>.mint-cell-wrapper>.mint-cell-value>.mint-field-other{
        position: inherit !important;
      }
      .klsn{
        position: absolute;
        left: 5px;
        top: 15px;
        text-decoration: none;
      }
      .klsn:before{
        content: '\A133';
        color: #000000;
        font-size: 20px;
      }
      .mint-field .mint-cell-title {
        width: 80px;
      }
    }
    .datetime>.picker>.picker-items>.picker-slot:nth-child(5){
      display: none;
    }
  .hideText>.mint-cell-wrapper>.mint-cell-value{
    width: 65%;
    span{
      text-align: right;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      display: block;
      width: 100%;
    }
  }
</style>
