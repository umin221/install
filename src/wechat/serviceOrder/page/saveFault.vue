<template>
  <div>
    <mt-header fixed title="完工确认单">
      <fallback slot="left"></fallback>
      <mt-button slot="right" @click.native="submit">提交</mt-button>
    </mt-header>

    <div class="mint-content">
      <div class="saveFault">
        <mt-cell title="单据编号：" >{{Service['SR Number']}}</mt-cell>
        <mt-cell title="移交日期：">{{toDate(Service['KL Cutoff Date'])}}</mt-cell>
        <mt-cell class="require" title="是否保修范围" @click.native="getLov1('bn')" is-link>{{isBn}}</mt-cell>
        <mt-cell title="维修配件"><i class="xs-icon icon-arrow-down"></i></mt-cell>
        <div class="servesParts">
          <div class="Parts" v-for="(item, index) in returnSelect"  v-if="item['Name'] !== 'AP003'">
            <mt-cell-swipe class="lock-line-cell enable"
                           :right="getSwipeBtn(index, item)">
              <mt-switch
                v-model="switchStatus[index]"
                @change="changeSwitch(item)">
                {{switchStatus[index]?'保内': '保外'}}
              </mt-switch>
              <div class="TranslatedLine">
                <div>配件代码： {{item['Name']}}</div>
                <div style="width: 65%;">配件名称： {{item['KL Translated Name']}}</div>
                <div class="toRed">￥<input v-show="!switchStatus[index]" type="number" v-model="item['Unit Price']"  class="numberCalss" @change="Product"/></div>
                <num-box :index="index" :type="switchStatus[index]" :number="item.num" @input="productNumber"></num-box>
              </div>
            </mt-cell-swipe>
          </div>
          <div class="Parts" v-show="isBn === '保外'">
            <div style="width: 30%"></div>
            <!--<div class="PartsDetail"><div>上门费</div><div class="toRed">￥{{fee}}</div><div></div></div>-->
          </div>
          <div class="addBtn">
            <mt-button type="primary" @click.native="toTranslated"><i class="xs-icon icon-add"></i>添加配件</mt-button>
            <!--<mt-button type="primary" v-show="isBn === '保外'" @click.native="getLov1('wm')"><i class="xs-icon icon-add" ></i>添加上门费</mt-button>-->
          </div>
        </div>
        <!-- v-show="isBn === '保外'"        :attr="{'min':'0'}"-->
        <cus-field label="上门费"
                   tag="上门费"
                   placeholder="请输入上门费"
                   v-valid.number
                   v-model="fee"></cus-field>
        <mt-cell title="总费用">￥{{Product}}</mt-cell>
        <mt-cell class="require" title="附件"></mt-cell>
        <div style="background-color: #ffffff">
          <attach ioName="KL Service Request Attachment IO" ref="attach"
                  :attach="attach.list"
                  :edit="attach.edit"
                  :title="attach.title">
          </attach>
        </div>
        <mt-popup v-if="showBox" v-model="showBox" position="bottom">
          <menu-box @my-enter="enter" @my-cancel="showBox = !showBox" :slots="slots" :type="lovType"></menu-box>
        </mt-popup>
      </div>
    </div>
  </div>
</template>
<script>
import {mapState, mapActions, mapMutations} from 'vuex';
import { Toast } from 'mint-ui';
import menuBox from '../../../public/components/cus-menu';
import numBox from '../components/number-box';
import cusField from 'public/components/cus-field';
import Vue from 'vue';
import vp from 'public/plugin/validator';
Vue.use(vp);
let testVal = /^\d+(\.{0,1}\d+){0,1}$/; // /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/;
const NAMESPACE = 'saveFault';
let _upload = function(serverIds, id, successBack) {
  let callback = data => {
    tools.success(data, {
      successTips: '提交成功'
    });
  };
  serverIds ? this.upload({
    data: {
      MediaId: serverIds,
      Id: id,
      IOName: 'KL Service Request Attachment IO',
      Comment: this.val
    },
    success: successBack,
    error: data => {
      data.ERROR = '附件提交失败,请重新上传';
      callback(data);
    }
  }) : callback(id);
};
export default {
  name: NAMESPACE,
  created() {
    let me = this;
    let service = me.$route.query;
    console.log(service);
    me.serviceId = service.id;
    me.Service = service.Service;
    me.serviceType = service.type;
    if (me.serviceId) {
      me.getServiceR({
        Id: me.serviceId,
        callback: function(data) {
          me.Service = data['SiebelMessage']['Service Request'];
          if (service.Service.Id) {
            let isBn = me.Service['Product Warranty Flag'] === 'Y' ? '保内' : '保外';
            me.setIsBn(isBn);
          }
          let EntryOrders = KND.Util.toArray(me.Service['Order Entry - Orders']);
          if (EntryOrders.length) {
            for (let i = 0;i < EntryOrders.length;i++) {
              if (EntryOrders[i]['Status LIC'] === 'Draft') {
                me.EntryOrdersId = EntryOrders[i].Id;
                let LineItems = KND.Util.toArray(EntryOrders[i]['Order Entry - Line Items']);
                if (LineItems.length) {
                  for (let j = 0; j < LineItems.length; j++) {
                    if (LineItems[j].Product === 'AP003') {
                      me.fee = LineItems[j]['Unit Price - Display'] || 0;
                    }
                    me.switchStatus.push(LineItems[j]['KL Warranty Flag'] === 'Y');
                    me.selectProduct({
                      Name: LineItems[j].Product,
                      num: parseInt(LineItems[j]['Quantity Requested'], 0),
                      'KL Translated Name': LineItems[j]['KL Product Name Join'],
                      'Unit Price': LineItems[j]['Unit Price - Display'],
                      Id: LineItems[j]['Product Id'],
                      saveId: LineItems[j]['Id']
                    });
                  }
                }
                return;
              }
            }
          }
        }
      });
    }
    console.log(me.returnSelect);
    if (me.returnSelect.length) {
      for (let i = 0;i < me.returnSelect.length;i++) {
        if (me.returnSelect[i].Name === 'AP003') {
          me.fee = me.returnSelect[i]['Unit Price'] || 0;
        }
      }
    }
    me.getPrice(); // 获取价格列表
    me.switchStatus = [];
    for (let i = 0;i < me.returnSelect.length;i++) {
      if (me.isBn === '保内') {
        me.switchStatus.push(true);
      } else {
        me.switchStatus.push(false);
      }
    }
    me.getLov({
      type: 'KL_SR_ATT_TYPE',
      parent: '',
      success: function(data) {
        let items = data.items;
        for (let i = 0; i < items.length;i++) {
          if (items[i].Name === 'Job Sheet') {
            me.val = items[i].Value;
          }
        }
      }
    });
  },
  data: () => {
    return {
      isSwitch: false,
      value: '',
      val: '维修单据',
      showBox: false,
      slots: [{flex: 1, values: [], className: 'slot1', textAlign: 'center'}],
      serviceType: '',
      productData: [],
      switchStatus: [],
      fee: '', // 上门费
      allFee: 0,
      one: 1,
      Service: {},
      EntryOrdersId: '',
      serviceId: ''
    };
  },
  computed: {
    ...mapState(NAMESPACE, ['isBn', 'returnSelect', 'dataService', 'attach']),
    ...mapState('searchTrans', ['priceId', 'selected']),
    ...mapState('detail', ['ServiceRequest']),
    Product() {
      let me = this;
      let len = me.returnSelect.length;
      me.allFee = 0;
      // if (me.isBn === '保外') {
      /* } else {
        me.allFee = me.allFee + 0;
      }*/
      if (len) {
        for (let i = 0;i < len;i++) {
          console.log(me.returnSelect.length);
          if (!me.switchStatus[i] && me.returnSelect[i].Name !== 'AP003') {
            var Price = 0;
            var listPrice = me.returnSelect[i]['Unit Price'];
            if (!testVal.test(listPrice)) {
              Toast('必须为正数');
            }
            if (me.returnSelect[i]['Unit Price']) {
              Price = me.returnSelect[i]['Unit Price'];
            }
            me.allFee += me.returnSelect[i].num * parseFloat(Price, 0);
          }
        }
      }
      if (me.fee) {
        me.allFee = me.allFee + parseFloat(me.fee, 0);
      }
      return me.allFee.toFixed(2) || 0;
    }
  },
  methods: {
    ...mapActions(NAMESPACE, ['addServiceOrder', 'getServiceR', 'getOrderDetail', 'upDateOrderStatu', 'deleteOrderEntry', 'backDone']),
    ...mapMutations(NAMESPACE, ['setIsBn', 'ProductNum', 'deleteProduct', 'initSelect', 'selectProduct', 'setA', 'setSelectBn']),
    ...mapActions('app', ['getLov', 'upload']),
    ...mapActions('searchTrans', ['getPrice']),
    ...mapMutations('searchTrans', ['initSelected', 'deleteSelected']),
    ...mapMutations('detail', ['setPartner']),
    toDate(time) {
      if (time) {
        return KND.Util.format(time, 'yyyy-MM-dd hh:mm:ss');
      } else {
        return '';
      }
    },
    productNumber(val, num, type) {
      let me = this;
      me.ProductNum({num, val});
    },
    getSwipeBtn(index, item) {
      return [{
        content: '删除',
        style: {background: 'red', color: '#fff', 'font-size': '15px', 'line-height': '54px'},
        handler: () => this.deleteFn(index, item)
      }];
    },
    deleteFn(index, item) {
      let me = this;
      me.deleteProduct(index);
    },
    submit() {
      /**
      * 1.上传附近
       * 2. 请求接口更新保内保外
       * 3. 维修配件为空，则调用完成子服务请求更改状态
       * 4.维修配件不为空，则提交创建订单 ， 则调用完成子服务请求更改状态
       */
      let me = this;
      tools.valid.call(this, () => {
        if (me.returnSelect.length > 0) { // 检验维修配件输入正整数
          for (let i = 0; i < me.returnSelect.length; i++) {
            if (me.returnSelect[i].num < 1) {
              Toast('维修配件请填写正确的数量');
              return;
            }
            if (me.returnSelect[i].isBn) { // 保内 价格等于0
              me.returnSelect[i]['Unit Price'] = 0;
            }
            var listPrice = me.returnSelect[i]['Unit Price'];
            if (!testVal.test(listPrice)) {
              Toast('必须为正数');
              return;
            }
          }
        }
        if (!me.attach.list.length) {
          Toast('请上传维修记录表');
          return;
        }
        // 人为损坏 总金额要大于0
        if (me['Service']['KL Responsbility LIC'] === 'Human' && (me.Product === 0 || me.Product === '0.00' || !me.Product)) {
          Toast('此单为【人为损坏】，费用必须大于0！');
          return;
        }
        MessageBox.confirm('确认提交，数据一经提交不可修改。', '提示').then(action => {
          let uploadAttach = id => {
            _upload.call(me,
              me.$refs.attach.getServerIds(),
              id,
              function(data) {
                // 提交订单
                me.submitOrder();
              });
          };
          uploadAttach(me['Service'].Id); // 上传附件
         // me.submitOrder();
        });
      });
    },
    submitOrder() {
      var me = this;
      let lineItems = []; // 维修配件集合
      let obj = {}; // 维修配件对象
      let isBn = me.isBn === '保内' ? 'Y' : 'N';  // 是否报修范围
      let key = !me.EntryOrdersId ? 'addServiceOrder' : 'deleteOrderEntry'; // EntryOrdersId有值则删除再重新提交
      for (let i = 0;i < me.returnSelect.length; i++) {
        if (me.returnSelect[i].Name !== 'AP003') {
          obj = {
            'Id': i + 1,
            'Product': me.returnSelect[i].Name, // 产品编码
            'Quantity Requested': me.returnSelect[i].num, // 数量
            'Unit Price': me.returnSelect[i]['Unit Price'],
            'KL Warranty Flag': me.returnSelect[i].isBn ? 'Y' : 'N'
          };
          lineItems.push(obj);
        }
      }
      if (me.fee) {
        if (me.fee === 0 || me.fee === '0' || me.fee === '0.00' || me.fee < 0) {
          Toast('上门费用必须大于0！');
          return;
        }
        obj = {
          'Id': '001',
          'Product': 'AP003', // 产品编码
          'Unit Price': me.fee,
          'KL Warranty Flag': 'N',
          'KL EBS Update Flag': 'Y'
        };
        lineItems.push(obj); // 上门费用不为空 则当成一个维修配件
      }
      obj = {
        // 订单行
        lineItems: lineItems,
        // 订单头
        EntryOrdersId: me.EntryOrdersId,
        ServiceRequestId: me['Service'].Id,   // 服务请求ID
        priceId: me.priceId,      // 价格列表ID
        warrantyFlag: isBn,    // 订单头是否保内
        contactId: me['ServiceRequest']['Contact Id'], // 联系人Id
        assetId: me['ServiceRequest']['Asset Id'], // 资产Id
        srNum: me['Service']['SR Number'],
        parentId: me.ServiceRequest.Id,
        type: me.serviceType,
        key: key,
        callBack: function(data) {
          KND.Session.set('popupVisible', 'popupVisible');
          me.setPartner(data);
          me.$router.go(-1);
          _upload('', true);
        },
        error: function() {
          me.getServiceR({
            Id: me.Service.Id,
            callback: function(data) {
              me.Service = data['SiebelMessage']['Service Request'];
              let EntryOrders = KND.Util.toArray(me.Service['Order Entry - Orders']);
              if (EntryOrders.length) {
                for (let i = 0;i < EntryOrders.length;i++) {
                  if (EntryOrders[i]['Status LIC'] === 'Draft') {
                    me.EntryOrdersId = EntryOrders[i].Id;
                    return;
                  }
                }
              }
            }
          });
        }
      };
      console.log(obj);
      if (me.Service['Product Warranty Flag'] !== isBn) { // 根据保外包内更改保修期
        me.upDateOrderStatu({
          Id: me.ServiceRequest.Id,
          type: isBn,
          callback: function(data) {
          }
        });
      }
      if (lineItems.length || (isBn === 'N' && me.fee)) { // 维修配件不为空 || 保外金额不为空，则提交创建订单 ， 则调用完成子服务请求更改状态
        me[key](obj);
      } else { // 维修配件为空，则调用完成子服务请求更改状态
        me.backDone(obj);
      }
    },
    toTranslated() {
      this.$router.push('searchTrans');
    },
    enter(val, type) {
      let me = this;
      me.showBox = !me.showBox;
      if (type === 'bn') {
        me.switchStatus = [];
        for (let i = 0;i < me.returnSelect.length;i++) {
          if (val[0] === '保内') {
            me.switchStatus.push(true);
            me.returnSelect[i].isBn = true;
          } else {
            me.switchStatus.push(false);
            me.returnSelect[i].isBn = false;
          }
        }
//        me.setSelectBn(val[0] === '保内');
        me.setIsBn(val[0]);
      } else {
        me.fee = val[0] === '工作时间' ? 100 : 150;
      }
    },
    getLov1(type) {
      let me = this;
      me.showBox = true;
      me.lovType = type;
      if (type === 'bn') {
        me.slots[0].values = ['保内', '保外'];
      } else {
        me.slots[0].values = ['工作时间', '其他时间'];
      }
    },
    changeSwitch(item) {
      if (item.isBn) {
        item.isBn = false;
      } else {
        item.isBn = true;
      }
    }
  },
  watch: {
    fee() {
      let reg = new RegExp(/-/g, '');
      this.fee = this.fee.replace(reg);
    }
  },
  components: {menuBox, numBox, Toast, cusField}
};
</script>
<style lang="scss">
  .saveFault{
    .numberCalss{
      width: 80px;
      line-height: 26px;
      margin-bottom: 5px;
      border: 1px solid #d9d9d9;
      text-align: left !important;
    }
    .servesParts{
      .Parts{
        font-size: 0.75rem;
        display: flex;
        line-height: 2.5rem;
        .mint-switch{
          width: 30%;
        }
        .PartsDetail{
          align-items: center;
          display: flex;
          width: 70%;
          justify-content: space-around;
          background-image: linear-gradient(0deg, #d9d9d9, #d9d9d9 0%, transparent 5%);
          div{
            width: 30%;
            text-align: center;
          }
        }
        .enable{
          width: 100%;
          .mint-cell-wrapper{
            width: 100%;
            .mint-cell-value{
              width: 100%;
              .TranslatedLine{
                position: relative;
                width: 70%;
              }
              .TranslatedLine>div{
                line-height: 25px;
              }
              .cus-number-box{
                position: absolute;
                right: 0;
                top: 25px;
              }
            }
          }
        }
      }
      .addBtn{
        height: 5rem;
        display: flex;
        justify-content: space-around;
        align-items: center;
        button{
          width:35%;
          i{
            font-size: 0.5rem;
          }
        }
      }
    }
    .toRed {
      color: red;
    }
    /*.require>.mint-cell-wrapper>.mint-cell-title>span:before{
      content: '*';
      color: red;
    }*/
  }
</style>
