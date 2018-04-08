<template>
  <div>
    <mt-header fixed title="完工确认单">
      <fallback slot="left"></fallback>
      <mt-button slot="right" @click.native="submit">提交</mt-button>
    </mt-header>

    <div class="mint-content">
      <div class="saveFault">
        <mt-cell title="单据编号：" >{{ServiceRequest['SR Number']}}</mt-cell>
        <mt-cell title="移交日期：">{{ServiceRequest['KL Cutoff Date']}}</mt-cell>
        <mt-cell class="require" title="是否保修范围" @click.native="getLov('bn')" is-link>{{isBn}}</mt-cell>
        <mt-cell title="维修配件"><i class="xs-icon icon-arrow-down"></i></mt-cell>
        <div class="servesParts">
          <div class="Parts" v-for="(item, index) in Product">
            <mt-switch
              @click.native="change(index,switchStatus[index])"
              v-model="switchStatus[index]">
              {{switchStatus[index]?"保内":"保外"}}
            </mt-switch>
            <div class="PartsDetail">
              <div>{{item['KL Translated Name']}}</div>
              <div class="toRed">￥{{item['List Price']}}</div>
              <num-box :index="index" :type="switchStatus[index]" @input="productNumber"></num-box>
            </div>
          </div>
          <div class="Parts" v-show="isBn === '保外'">
            <div style="width: 30%"></div>
            <div class="PartsDetail"><div>上门费</div><div class="toRed">￥{{fee}}</div><div></div></div>
          </div>
          <div class="addBtn">
            <mt-button type="primary" @click.native="toTranslated"><i class="xs-icon icon-add"></i>添加配件</mt-button>
            <mt-button type="primary" v-show="isBn === '保外'" @click.native="getLov('wm')"><i class="xs-icon icon-add" ></i>添加上门费</mt-button>
          </div>
        </div>
        <mt-cell class="require" title="总费用">￥{{allFee}}</mt-cell>
        <mt-cell class="require" title="附件"></mt-cell>
        <div style="background-color: #ffffff">
          <attach ioName="KL Service Request Attachment IO" ref="attach"
                  :attach="attach.list"
                  :edit="attach.edit"
                  :title="attach.title">
          </attach>
        </div>
        <mt-popup v-if="showBox" v-model="showBox" position="bottom">
          <menu-box @my-enter="enter" @my-cancel="cancel" :slots="slots" :type="lovType"></menu-box>
        </mt-popup>
      </div>
    </div>
  </div>
</template>
<script>
import {mapState, mapActions, mapMutations} from 'vuex';
import menuBox from '../../../public/components/cus-menu';
import numBox from '../components/number-box';
const NAMESPACE = 'saveFault';
export default {
  name: NAMESPACE,
  created() {
    let me = this;
    let serviceId = me.$route.query.id;
    if (serviceId) {
      me.getServiceR({
        Id: serviceId,
        callback: function(data) {
          me.ServiceRequest = data;
          if (!me.isBn) {
            let isBn = me.ServiceRequest['Product Warranty Flag'] === 'Y' ? '保内' : '保外';
            console.log(isBn);
            me.setIsBn(isBn);
          }
        }
      });
    }
  },
  data: () => {
    return {
      isSwitch: false,
      value: '',
      showBox: false,
      slots: [{flex: 1, values: [], className: 'slot1', textAlign: 'center'}],
      productData: [],
      switchStatus: [],
      fee: 0,
      allFee: 0,
      one: 1,
      ServiceRequest: {},
      attach: { // 附件
        list: [],
        edit: true,
        title: '相关照片'
      }
    };
  },
  computed: {
    ...mapState(NAMESPACE, ['isBn']),
    ...mapState('searchTrans', ['returnSelect', 'priceId']),
//    ...mapState('detail', ['ServiceRequest']),
    Product() {
      let me = this;
      let arr = [];
      me.productData = me.returnSelect;
      for (let i = 0; i < me.returnSelect.length; i++) {
        if (me.isBn === '保内') {
          arr.push(true);
        } else {
          arr.push(false);
        }
        if (me.productData[i].num === undefined) {
          me.productData[i].num = 0;
        }
      }
      me.switchStatus = arr;
      return me.productData;
    }
  },
  methods: {
    ...mapActions(NAMESPACE, ['addServiceOrder', 'getServiceR']),
    ...mapMutations(NAMESPACE, ['setIsBn']),
    ...mapMutations('searchTrans', ['initSelect']),
    ...mapMutations('detail', ['setPartner']),
    productNumber(val, num, type) {
      let me = this;
      me.productData[num].num = val;
      if (val - 1) {
        if (!me.switchStatus[num]) {
          if (type === 'minus') {
            me.allFee = me.allFee - parseInt(me.productData[num]['List Price'], 0);
          } else {
            me.allFee = me.allFee + parseInt(me.productData[num]['List Price'], 0);
          }
        }
      } else {
        if (me.allFee - me.fee !== 0 && !me.switchStatus[num]) {
          if (type !== 'minus') {
            me.allFee = me.allFee + parseInt(me.productData[num]['List Price'], 0);
          } else {
            if (me.allFee - (parseInt(me.productData[num]['List Price'], 0) * me.switchStatus.length)) {
              me.allFee = me.allFee - parseInt(me.productData[num]['List Price'], 0);
            }
          }
        }
      }
    },
    getSwipeBtn(item) {
      return this.isConfirming ? [{
        content: '删除',
        style: { background: 'red', color: '#fff', 'font-size': '15px', 'line-height': '54px' },
        handler: () => this.deleteFn(item)
      }] : [];
    },
    deleteFn(item) {
      console.lot(item);
    },
    submit() {
      let me = this;
      let lineItems = [];
      let obj = {};
      for (let i = 0;i < me.productData.length; i++) {
        obj = {
          'Id': '1',
          'Product': me.productData[i].Name, // 产品编码
          'Quantity Requested': me.productData[i].num, // 数量
          'KL Warranty Flag': me.switchStatus[i] ? 'Y' : 'N'
        };
        lineItems.push(obj);
      }
      obj = {
        // 订单行
        lineItems: lineItems,
        // 订单头
        ServiceRequestId: me['ServiceRequest'].Id,   // 服务请求ID
        priceId: me.priceId,      // 价格列表ID
        warrantyFlag: me.isBn === '保内' ? 'Y' : 'N',    // 订单头是否保内
        contactId: me['ServiceRequest']['Contact Id'], // 联系人Id
        assetId: me['ServiceRequest']['Asset Id'], // 资产Id
        srNum: me['ServiceRequest']['SR Number'],
        callBack: function(data) {
          me.setPartner(data);
          me.$router.go(-1);
          me.initSelect();
        }
      };
      me.addServiceOrder(obj);
    },
    toTranslated() {
      this.$router.push('searchTrans');
    },
    enter(val, type) {
      let me = this;
      me.showBox = !me.showBox;
      me.allFee = me.allFee - me.fee;
      if (type === 'bn') {
        me.setIsBn(val[0]);
        me.allFee = 0;
        if (me.isBn === '保外') {
          for (let i = 0; i < me.productData.length; i++) {
            if (me.switchStatus[i]) {
              me.allFee += parseInt(me.productData[i]['List Price'], 0) * me.productData[i]['num'];
            }
          }
          me.allFee = me.allFee + me.fee;
        }
      } else {
        me.fee = val[0] === '工作时间' ? 100 : 150;
        me.allFee = me.allFee + me.fee;
      }
    },
    cancel() {
      this.showBox = !this.showBox;
    },
    getLov(type) {
      let me = this;
      me.showBox = true;
      me.lovType = type;
      if (type === 'bn') {
        me.slots[0].values = ['保内', '保外'];
      } else {
        me.slots[0].values = ['工作时间', '其他时间'];
      }
    },
    change(index, type) {
      console.log(index);
      let me = this;
      me.one = me.one + 1;
      if (me.one === 2) {
        if (!me.switchStatus[index]) {
          me.allFee = me.allFee - me.productData[index].num * parseInt(me.productData[index]['List Price'], 0);
        } else {
          me.allFee = me.allFee + me.productData[index].num * parseInt(me.productData[index]['List Price'], 0);
        }
      } else {
        me.one = 1;
      }
    }
  },
  components: {menuBox, numBox}
};
</script>
<style lang="scss">
  .saveFault{
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
  }
</style>
