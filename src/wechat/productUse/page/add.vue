<template>
  <div id="add-product-use">
      <mt-header fixed title="新建领用申请">
      <fallback slot="left"></fallback>
    </mt-header>
    <div class="mint-content product-use">
      <div class="add-parts-list">
        <div class="add-btn" @click="selectPart">
        <i class="xs-icon icon-add"></i>
        <span>添加配件</span>
        </div>
        <div class="add-btn" @click="searchPart" style="margin-left: 20px">
          <i class="xs-icon icon-add"></i>
          <span>搜索配件</span>
        </div>
      </div>
      <div class="parts-list">
          <mt-cell-swipe v-for='(item, index) in partList' :key='index' class="cell-swipe"  style=" word-break: break-all; padding:5px 0;"
          :right="operation(index)"
          :title="'配件编码：' + item.Name"
          :label="'配件名称：' + item['KL Translated Name']">
              <div class="operation">
                <num-box :index="index" :number="item.num" :type="true" @input="productNumber"></num-box>
              </div>
          </mt-cell-swipe>
      </div>
      <div class="margin10" @click="selectProject" v-if="isProject">
        <a class="mint-cell require mint-field">
          <span class="mint-cell-mask"></span>
          <div class="mint-cell-left"></div>
          <div class="mint-cell-wrapper" >
              <div class="mint-cell-title">
                  <span class="mint-cell-text">工程替代锁所属项目</span>
              </div>
              <div class="mint-cell-value is-link" v-if="project.Id" style="justify-content: flex-end;">
                  <span style="margin-right: 5px;">{{project['KL Agreement Opportunity Name']}}</span>
              </div>
              <i class="mint-cell-allow-right"></i>
          </div>
        <div class="mint-cell-right"></div>
        </a>
        <!--isProject-->
      </div>

      <!--<mt-cell class="require"-->
                <!--title="工程替代锁所属项目"-->
                <!--:value="project['KL Agreement Opportunity Name']"-->
                <!--@click.native='selectProject'></mt-cell>-->
      <!--<mt-cell class="border-top" title="选择领用时间"  @click.native='openPicker'>-->
         <!--<span style="margin-right:5px;">{{formatDate()}}</span>-->
         <!--<span class="xs-icon icon-time"></span>-->
      <!--</mt-cell>-->
    <mt-cell class="border-top" title="领用说明"></mt-cell>
    <div class="desc">
        <textarea placeholder="可在这录入您的附件需求,最多输入200字..."
                  maxlength="200"
                  rows="4"
                  style="font-size: 0.75rem;"
                  v-model="Description"></textarea>
    </div>
     <button-group class="singBtn">
      <mt-button class="submitBtn" @click.native="handleSave">保存</mt-button>
    </button-group>
    <!--<mt-datetime-picker-->
        <!--ref="picker"-->
        <!--v-model="pickerValue"-->
        <!--:start-date="new Date()"-->
        <!--type="date"-->
        <!--year-format="{value} 年"-->
        <!--month-format="{value} 月"-->
        <!--date-format="{value} 日"-->
        <!--@confirm="handleConfirm"-->
        <!--&gt;-->
      <!--</mt-datetime-picker>-->
    </div>
  </div>
</template>
<script>
import {mapState, mapActions, mapMutations} from 'vuex';
import { CellSwipe, Toast, DatetimePicker } from 'mint-ui';
import buttonGroup from 'public/components/cus-button-group';
import numBox from '../components/number-box.vue';
import cusCell from 'public/components/cus-cell';
import cusField from '../../../public/components/cus-field';

const NAMESPACE = 'add';

export default {
  components: {CellSwipe, buttonGroup, DatetimePicker, numBox, cusCell, cusField},
  data() {
    return {
      isProject: false,
      orderId: '',
      Description: ''
    };
  },
  created() {
    let me = this;
    let query = me.$route.query;
    if (query.id && !me.id) {
      console.log(query);
      me.setId(query.id);
      me.Description = query.Description;
    } else {
      me.Description = KND.Session.get('DescriptionUse') || '';
      KND.Session.remove('DescriptionUse');
    }
    me.isProjected();
  },
  computed: {
    ...mapState(NAMESPACE, ['partList', 'project', 'id']),
    ...mapState('selectParts', ['selected'])
  },
  methods: {
    ...mapActions(NAMESPACE, ['setPartList', 'setProject', 'setTime', 'setDescript', 'setpartNum', 'deletePart', 'addServiceOrder']),
    ...mapMutations(NAMESPACE, ['initSelect', 'setId']),
    /*
    * 左滑 删除
    * */
    operation(index) {
      return [
        {
          content: '删除',
          style: { background: 'red', color: '#fff', fontSize: '0.75rem' },
          handler: () => this.deleteParts(index)
        }
      ];
    },
    /*
    * 跳转 配件选择 ------分类
    * */
    selectPart() {
      KND.Session.set('DescriptionUse', this.Description);
      this.$router.push('./selectParts');
    },
    /*
   * 跳转 配件选择-----搜索
   * */
    searchPart() {
      KND.Session.set('DescriptionUse', this.Description);
      this.$router.push('./searchPart');
    },
    /*
    * 跳转 项目选择
    * */
    selectProject() {
      KND.Session.set('DescriptionUse', this.Description);
      this.$router.push('./selectProject');
    },
    /*
    * 删除 配件
    * */
    deleteParts(index) {
      let me = this;
      me.deletePart(index);
      me.isProjected();
    },
    /*
    * 加减 运算
    * */
    productNumber(val, num) {
      let me = this;
      me.partList[num].num = val;
      console.log(me.partList[num].num);
    },
    isProjected() {
      let me = this;
      me.isProject = false;
      if (me.partList.length) {
        for (let i = 0; i < me.partList.length; i++) {
          var codeName = me.partList[i]['KL Product Specification'].substring(0, 5);
          console.dir('==========' + codeName);
          if (codeName === '工程替代锁') {
//        if (me.partList[i]['KL Product Series Code'] === '工程替代锁') {
            me.isProject = true;
          }
        }
      }
    },
    handleSave() {
      let me = this;
      let obj = {};
      let lineItems = [];
      /* if (me.isProject) {
        if (!me.project.Id) {
          Toast('请选择所属项目');
          return;
        }
      }*/
      if (me.partList.length) {
        for (let i = 0;i < me.partList.length; i++) {
          if (me.partList[i].num < 1) {
            Toast('请填写正确的数量');
            return;
          }
          var partListId = '';
          if (me.id && me.partList[i].lineId) { // 编辑并且有行ID
            partListId = me.partList[i].lineId;
          } else {
            partListId = i + 1;
          }
          obj = {
            'Id': partListId,
            'Product': me.partList[i].Name, // 产品编码
            'Quantity Requested': me.partList[i].num // 数量
          };
          lineItems.push(obj);
        }
        obj = {
          // 订单行
          lineItems: lineItems,
          // 订单头
          installId: me.project.Id,
          installName: me.project['KL Agreement Opportunity Name'],
          Description: me.Description,
          callBack: function(data) {
            Toast(data);
            me.$router.go(-1);
          }
        };
        me.addServiceOrder(obj);
      } else {
        Toast('请选择配件');
        return;
      };
    }
  }
};
</script>
<style scoped lang="scss">
  *{
    margin: 0;
    padding: 0;
  }
  .add-parts-list{
    background: #fff;
    align-items: center;
    text-align: center;
    margin-bottom: 10px;
    justify-content: center;
    display: flex;
  }
  .add-btn {
    background: #00599f;
    font-size: .75rem;
    line-height: 35px;
    color: #fff;
    width: 120px;
    margin: 8px 0;
    .icon-add{
      font-size: .55rem;
    }
  }
  .operation{
      display: flex;
    span{
      min-width: 29px;
      text-align: center;
      line-height: 29px;
      border: 1px solid #eee;
    }
    .num{
      border-left: none;
      border-right: none;
    }
    .add, .subtract{
      width: 29px;
      height: 29px;
      text-align: center;
      display: block;
      font-size: 1rem;
    }
  }
  .cell-swipe{
    border-bottom: 1px solid #eee;
    word-break: break-all;
    padding:5px 0;
  }
  .mint-field .mint-cell-title {
    width: auto;
    padding-left: 10px;
  }
  .margin10{
    margin-top: 10px;
  }
  .border-top{
      border-top: 1px solid #eee;
      color: #777;
  }
  .desc{
     background: #fff;
     textarea{
         border: none;
         width: 100%;
         padding: 10px;
         box-sizing: border-box;
         outline: none;
     }
  }
</style>
