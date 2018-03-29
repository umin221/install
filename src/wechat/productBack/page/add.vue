<template>
  <div id="add-product-use">
      <mt-header fixed title="新建退入申请">
      <fallback slot="left"></fallback>
    </mt-header>
    <div class="mint-content product-use">
        <div class="add-parts-list">
          <div class="add-btn" @click="selectPart">
            <i class="xs-icon icon-add"></i>
            <span>添加配件</span>
          </div>
        </div>
        <div class="parts-list">
            <mt-cell-swipe v-for='(item, index) in partList' :key='index' class="cell-swipe"  style=" word-break: break-all; padding:5px 0;"
            :right="operation(index)"
            :title="'配件编码：' + item.type"
            :label="'配件名称：' + item.name">
                <div class="operation">
                    <span class="add" @click="addSum(index)">+</span>
                    <span class="num">{{item.sum}}</span>
                    <span class="subtract" @click="subtractSum(index)">-</span>
                </div>
            </mt-cell-swipe>
            
        </div>
        <div class="margin10" @click="selectProject">
        <a class="mint-cell require mint-field">
        <span class="mint-cell-mask"></span>
        <div class="mint-cell-left"></div> 
        <div class="mint-cell-wrapper">
            <div class="mint-cell-title"><!----> 
                <span class="mint-cell-text">工程替代锁所属项目</span>
            </div> 
            <div class="mint-cell-value is-link" style="justify-content: flex-end;">
                <span style="margin-right: 5px;">{{project.name}}</span>
            </div> 
            <i class="mint-cell-allow-right"></i>
        </div> 
        <div class="mint-cell-right"></div>
        </a>
    </div>
     <!-- <mt-cell class="border-top" title="选择领用时间"  @click.native='openPicker'>
         <span style="margin-right:5px;">{{formatDate()}}</span>
         <span class="xs-icon icon-time"></span>
    </mt-cell> -->
    <mt-cell class="border-top" title="退入说明"></mt-cell>
    <div class="desc">
        <textarea placeholder="可在这录入您的附件需求..."></textarea>
    </div>
     <button-group class="singBtn">
      <mt-button class="submitBtn" type="primary" @click.native="handleSave">保存</mt-button>
    </button-group>
    <!-- <mt-datetime-picker
        ref="picker"
        v-model="pickerValue"
        type="date"
        year-format="{value} 年"
        month-format="{value} 月"
        date-format="{value} 日"
        @confirm="handleConfirm"
        >
      </mt-datetime-picker> -->
    </div>
  </div>
</template>
<script>
import {mapState, mapActions} from 'vuex';
import { CellSwipe, Toast, DatetimePicker } from 'mint-ui';
import buttonGroup from 'public/components/cus-button-group';

const NAMESPACE = 'add';

export default {
  components: {CellSwipe, buttonGroup, DatetimePicker},
  data() {
    return {
      pickerValue: ''
    };
  },
  created() {
    this.pickerValue = this.time.year + '-' + this.time.month + '-' + this.time.day;
  },
  computed: {
    ...mapState(NAMESPACE, ['partList', 'project', 'time', 'descript'])
  },
  methods: {
    ...mapActions(NAMESPACE, ['setPartList', 'setProject', 'setTime', 'setDescript', 'setpartNum', 'deletePart']),
    // 格式日期
    formatDate() {
      let y = this.time.year;
      let m = this.time.month;
      if (m < 10) m = `0${m}`;
      let d = this.time.day;
      if (d < 10) d = `0${d}`;
      return `${y}-${m}-${d}`;
    },
    // 跳转配件选择
    selectPart() {
      this.$router.push('./selectParts');
    },
    // 跳转项目选择
    selectProject() {
      this.$router.push('./selectProject');
    },
    operation(index) {
      return [
        {
          content: '删除',
          style: { background: 'red', color: '#fff', fontSize: '0.75rem' },
          handler: () => this.deleteParts(index)
        }
      ];
    },
    // 数量加
    addSum(index) {
      var sum = this.partList[index].sum;
      var sumVal = sum + 1;
      this.partList[index].sum = sumVal;
      // this.setpartNum(index, sumVal);
    },
    // 数量减
    subtractSum(index) {
      var sum = this.partList[index].sum;
      if (sum <= 1) {
        Toast('数量不能少于1');
        return;
      }
      var sumVal = sum - 1;
      this.partList[index].sum = sumVal;
      // this.setpartNum(index, sumVal);
    },
    // 删除配件
    deleteParts(index) {
      this.deletePart(index);
    },
    // 打开日期面板
    openPicker() {
      this.$refs.picker.open();
    },
    // 确认日期选择
    handleConfirm(date) {
      var orgDate = new Date(date);
      var time = {
        year: orgDate.getFullYear(),
        month: orgDate.getMonth() + 1,
        day: orgDate.getDate()
      };
      this.setTime(time);
      console.log(date);
    },
    // 保存
    handleSave() {
      if (!this.project.id) {
        Toast('请选择所属项目');
      }
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
    border-radius:20px;
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
