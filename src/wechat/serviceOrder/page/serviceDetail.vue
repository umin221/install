<template>
  <div>
    <div class="service-continer">
      <mt-header fixed :title="headTitle">
        <fallback slot="left"></fallback>
        <mt-button slot="right" @click.native="openConfirm">关闭</mt-button>
      </mt-header>

      <div class="mint-content service-detail">
        <div class="detail-title">
          <div class="mt-Detail-title">产品编号：ST101721213<span class="user-state">用户已提交</span></div>
          <div class="mt-Detail-title">产品类型：指纹锁</div>
          <div class="mt-Detail-title">联系人：李先生</div>
          <div class="mt-Detail-title">联系电话：<a href="javascript:void(0);" class="detail-call">13823456789</a></div>
        </div>
        <div class="detail-content">
          <mt-navbar v-model="active">
            <mt-tab-item v-for="tab in tabList" :id="tab.id" :key="tab.id">{{tab.name}}</mt-tab-item>
          </mt-navbar>
          <mt-tab-container v-model="active">
            <mt-tab-container-item id="tab-container1">
              <div class="mt-Detail-info">
                <div>产品条形码：<a href="javascript:void(0);" class="detail-call">ST101721213</a></div>
                <div>产品型号：指纹锁</div>
                <div>申请时间：2017-06-06</div>
                <div>客户预约时间：2017-06-06 14:00:00</div>
                <div>实际预约时间：2017-06-06 14:00:00</div>
                <div>地址：广东省 深圳市 南山区 xxx</div>
                <div>问题说明：
                  <div>门锁打不开</div>
                </div>
                <div>相关照片：
                  <div><img src="" alt="" height="100"></div>
                </div>
              </div>
            </mt-tab-container-item>
            <mt-tab-container-item id="tab-container2">
              <div class="service-record">
                暂无数据
              </div>
            </mt-tab-container-item>
            <mt-tab-container-item id="tab-container3">
                <div class="crm-zyList" v-for="(item, index) in processDate" :key="index">
                  <ul class="content">
                    <li class="bd-radius">
                      <span class="icon"></span>
                    </li>
                    <li style="margin-right: 8px">{{item.option}}</li>
                    <div class="content-div">
                      <div>2018-2-1 20:00</div>
                    </div>
                  </ul>
                </div>
            </mt-tab-container-item>
          </mt-tab-container>
        </div>
      </div>
      <div v-if="!role" class="submitButton">
        <mt-button size="normal" type="danger" >派单</mt-button>
      </div>
      <div v-else-if="role" class="submitButton">
        <mt-button v-if="isCall === 'lxkh'"  size="normal" @click.native="changeBtnStote" type="danger" >电话联系客户</mt-button>
        <div v-else-if="isCall === 'yyjh'" class="callPlan">
          <mt-button size="normal" type="default" @click.native="callSolve" >电话已解决</mt-button>
          <mt-button size="normal" @click.native="clickShow" type="danger" >预约维修计划</mt-button>
        </div>
        <mt-button v-if="isCall === 'gdcz'"  size="normal" @click="popupVisible1 = !popupVisible1" type="danger" >工单操作</mt-button>
      </div>
      <!--弹出日历-->
      <close :showBox1="showBox" @my-enter="boxEnter" @my-close="boxClose" :options1="option"></close>

      <mt-popup v-model="popupVisible" position="bottom" popup-transition="popup-fade" class="mint-popup-1">
        <!--头部按钮-->
        <div class="alertDate">
          <div class="headerButton">
            <div class="cancelBtn" @click="popupVisible = !popupVisible">取消</div>
            <div class="enterBtn" @click="enter">确认</div>
          </div>

          <!--选择年月和日期-->
          <div class="dateContent">
            <div class="month">
              <i class="el-icon-left" v-show="leftBunHide" @click="pickPre(currentYear,currentMonth)"><</i>
              <span>{{ currentYear }} 年 {{ currentMonth }} 月</span>
              <i class="el-icon-right" @click="pickNext(currentYear,currentMonth)">></i>
            </div>
            <!-- 日期 -->
            <div class="bodyDiv">
              <ul class="weekdays">
                <li>周一</li>
                <li>周二</li>
                <li>周三</li>
                <li>周四</li>
                <li>周五</li>
                <li style="color:darkred">周六</li>
                <li style="color:darkred">周日</li>
              </ul>
              <mt-swipe :auto="0" :show-indicators="false" :speed="50" :continuous="false">
                <mt-swipe-item class="days" v-for="(value,index1) in daysUL" :key="index1">
                  <ul>
                    <li  v-for="(day, index) in value" :key="index" @click="pick(day,index+index1*7)">
                      <!--本月-->
                      <span v-if="day.getMonth()+1 != currentMonth" class="other-month" :class="{'selected':isSelected[index+index1*7]}">{{ day.getDate() }}</span>
                      <span v-else :class="{'selected':isSelected[index+index1*7]}">
                      <!--今天-->
                      <span v-if="day.getFullYear() == new Date().getFullYear() && day.getMonth() == new Date().getMonth() && day.getDate() == new Date().getDate()" class="active">{{ day.getDate() }}</span>
                      <span v-else>{{ day.getDate() }}</span>
                      </span>
                    </li>
                  </ul>
                </mt-swipe-item>
              </mt-swipe>
            </div>
          </div>
          <!--选择时间-->
          <div class="timeTable">
            <table>
              <tr v-for="(Am, index1) in am" :key="index1">
                <td v-for="(time, index) in Am.time" :key="index" @click="selectedTime(index+index1*8)" :class="{'selectedT':isTimeSelected[index+index1*8]}">{{time}}</td>
              </tr>
            </table>
          </div>
        </div>
      </mt-popup>

      <!--工单操作-->
      <mt-popup v-model="popupVisible1" position="bottom" popup-transition="popup-fade" class="mint-popup-2">
        <mt-cell v-for="(item, index) in HandleList" :title="item.name" :key="index">
          <mt-button @enter="clickPosition">{{item.key}}</mt-button>
        </mt-cell>
        <div class="cancelHandle" @click="popupVisible1 = !popupVisible1">取消</div>
      </mt-popup>
    </div>
  </div>
</template>
<script>
  import close from './close';
  import { MessageBox } from 'mint-ui';
  export default {
    name: 'serviceDetail',
    created() {
    },
    data: () => {
      return {
        active: 'tab-container1',
        headTitle: '维修工单详情',
        popupVisible: false,
        popupVisible1: false,
        role: true,
        isCall: 'lxkh',
        showBox: false,
        tabList: [
          {name: '基础信息', id: 'tab-container1'},
          {name: '维修记录', id: 'tab-container2'},
          {name: '流程记录', id: 'tab-container3'}
        ],
        option: ['客户不接受维修报价', '已自行解决', '暂不影响使用', '其他'],
        leftBunHide: false,
        processDate: [{
          option: '预约已受理，等待安装师傅预约安装。如有疑问请咨询【0755-88880000】'
        }, {
          option: 'xxx已提交预约申请'
        }],
        currentYear: 1970,   // 年份
        currentMonth: 1,  // 月份
        currentDay: 1,    // 日期
        currentWeek: 1,    // 星期
        firstWeek: 1,
        days: [],
        daysUL: [],
        params: {
          selectDay: '',
          type: ''
        },
        isSelected: [],
        selectIndex: '',
        initAm: '00:00',
        am: [],
        isTimeSelected: [],
        HandleList: [
          {name: '出发', key: '签到'},
          {name: '到达', key: '签到'},
          {name: '记录故障', key: '填写'},
          {name: '完工确认', key: '填写'},
          {name: '结束', key: '确认'}
        ]
      };
    },
    methods: {
      boxClose(msg) {               // 关闭取消事件
        this.showBox = false;
        console.log(msg);
      },
      boxEnter(msg) {               // 关闭确认
        this.showBox = false;
        console.log(msg);
      },
      openConfirm() {               // 点击关闭弹出层
        let self = this;
        self.showBox = true;
      },
      changeBtnStote() {            // 改变按钮状态
        let self = this;
        self.isCall = 'yyjh';
      },
      clickShow() {                 // 点击显示日历
        let self = this;
        self.popupVisible = true;
        if (self.daysUL.length === 0) {
          self.initData(null);
        }
        if (this.am.length === 0) {
          self.initTableTime();
        }
      },
      cancel() {                    // 日历取消事件
        this.popupVisible = false;
      },
      enter() {                     // 日历确定
        this.popupVisible = false;
        this.isCall = 'gdcz';
      },
      pickPre(year, month) {        // 点击切换上个月
        let self = this;
        let mon = new Date().getMonth() + 1;
        let myYear = new Date().getFullYear();
        self.daysUL = [];
        self.isSelected = [];
        const d = new Date(self.formatDate(year, month, 1));
        d.setDate(0);
        self.initData(self.formatDate(d.getFullYear(), d.getMonth() + 1, 1));
        if (mon === self.currentMonth && myYear === self.currentYear) {
          self.leftBunHide = false;
        }
      },
      pickNext(year, month) {     // 点击切换下个月
        let self = this;
        let myMon = new Date().getMonth() + 1;
        self.daysUL = [];
        self.isSelected = [];
        const d = new Date(self.formatDate(year, month, 1));
        d.setDate(42);
        self.initData(self.formatDate(d.getFullYear(), d.getMonth() + 1, 1));
        if (myMon !== self.currentMonth) {
          self.leftBunHide = true;
        }
      },
      pick(date, index) {             // 选择日期
        this.selectIndex = index;
        this.isSelected = [];
        this.params.selectDay = this.formatDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
        console.log(this.params);
        for (let i = 0; i < 42; i++) {
          if (index === i) {
            this.isSelected.push(true);
            continue;
          }
          this.isSelected.push(false);
        }
      },
      formatDate(year, month, day) {
        const y = year;
        let m = month;
        if (m < 10) m = `0${m}`;
        let d = day;
        if (d < 10) d = `0${d}`;
        return `${y}-${m}-${d}`;
      },
      initData(cur) {            // 日历初始化
        let date = '';
        if (cur) {
          date = new Date(cur);
        } else {
          date = new Date();
        }
        this.currentDay = date.getDate();
        this.currentYear = date.getFullYear();
        this.currentMonth = date.getMonth() + 1;
        this.currentWeek = date.getDay();
        date.setDate(1);
        this.firstWeek = date.getDay();
        if (this.firstWeek === 0) {
          this.firstWeek = 7;
        }
        const str = this.formatDate(this.currentYear, this.currentMonth, 1);
        this.days.length = 0;
        for (let i = this.firstWeek - 1; i >= 0; i -= 1) {
          const d = new Date(str);
          d.setDate(d.getDate() - i);
          this.days.push(d);
        }
        if (this.days.length % 7 === 0) {
          this.daysUL.push(this.days);
          this.days = [];
        }

        for (let i = 1; i <= 35 - this.firstWeek; i += 1) {
          const d = new Date(str);
          d.setDate(d.getDate() + i);
          this.days.push(d);
          if (this.days.length % 7 === 0) {
            this.daysUL.push(this.days);
            this.days = [];
          }
        }
      },
      initTableTime() {             // 时间表格初始化
        let arr = [];
        let time = '';
        let obj = {};
        for (let i = 0;i < 6; i++) {
          for (let i = 0;i <= 7;i++) {
            time = this.changeTime(this.initAm);
            arr.push(time);
            this.initAm = time;
          }
          this.initAm = time;
          obj = {time: arr};
          this.am.push(obj);
          obj = {};
          arr = [];
        }
      },
      changeTime(value) {
        let x = '2010-09-28 ' + value;
        let time = new Date(x.replace('-', '/'));
        const b = 30;
        time.setMinutes(time.getMinutes() + b, time.getSeconds(), 0);
        time = time.toString().split(' ')[4].slice(0, 5);
        return time;
      },
      selectedTime(index) {             // 选择时间
        let self = this;
        self.isTimeSelected = [];
        for (let i = 0; i < 48; i++) {
          if (index === i) {
            self.isTimeSelected.push(true);
            continue;
          }
          self.isTimeSelected.push(false);
        }
      },
      callSolve() {
        MessageBox.confirm('远程电话沟通客户已解决，确认提交？?', '').then(action => {
          console.log(1111);
        });
      },
      clickPosition(value1) {
        console.log(value1);
      }
    },
    components: {
      close
    }
  };
</script>
<style lang="scss">
  *{
    margin: 0;
    padding: 0;
  }
  @mixin disFlex (){
    display: flex;
    justify-content:center;
    align-items: center;
  }
  @mixin remove-decoration (){
    text-decoration: none;
    color: lightblue;
  }
  .service-continer{
    position: relative;
    height:100%;
    .service-detail{
      background: #F2F2F2;
      .detail-title{
        position: relative;
        padding: 0.5rem;
        height: 6rem;
        font-size: 0.7rem;
        background: white;
        .mt-Detail-title{
          line-height: 1.5rem;
          .user-state{
            position: absolute;
            top: 0.5rem;
            right: 0.5rem;
            color: red;
          }
          .detail-call{
            @include remove-decoration();
          }
        }
      }
      .detail-content{
        position: relative;
        margin-top: 0.5rem;
        font-size: 0.7rem;
        .mint-tab-container{
          .mint-tab-container-wrap{
            .mint-tab-container-item{
              background: white;
              padding: 0.5rem;
              .crm-zyList {
                overflow: hidden;
              }
              .crm-zyList ul {
                padding-left: 0;
              }
              .crm-zyList ul li {
                list-style: none;
              }
              .crm-zyList .content {
                position: relative;
                border-left: 1px solid #dddddd;
                padding-bottom: 10px;
                margin: 0 30px;
                padding-left: 20px;
              }
              .crm-zyList .content .bd-radius {
                background: #fff;
                position: absolute;
                left: -20px;
                top: 0px;
              }
              .crm-zyList .icon{
                border-radius: 26px;
                background: #2485E2;
                color: #fff;
                padding: 1px 9px;
                margin-left: 11px;
                font-size: 12px;
                top: 10px;
              }
              .crm-zyList .content :nth-of-type(2) {
                font-size: 14px;
                margin-top: 5px;
                color: #999;
                line-height: 27px;
              }
              .content-div {
                border-radius: 5px;
                padding: 10px;
                font-size: 0.15rem;
              }

              .mt-Detail-info{
                div{
                  line-height: 1.5rem;
                  .detail-call{
                    @include remove-decoration();
                  }
                }
              }
              .service-record{
                height: 5rem;
                line-height: 5rem;
                text-align: center;
              }
            }
          }
        }
      }
    }

    /*底部按钮*/
    .submitButton {
      @include disFlex();
      position: fixed;
      bottom: 0;
      width: 100%;
      height: 3rem;
      background: white;
      line-height: 3rem;
      opacity: 0.7;
      button {
        width: 7rem;
        border-radius: 1rem;
      }
    }
    .mint-popup-1{
      width: 100%;
      height: 22rem;
      background: white;
      .alertDate{
        width: 100%;
        .headerButton{
          height: 2rem;
          line-height: 2rem;
          border-bottom: 1px solid gainsboro;
          div{
            color: darkred;
            font-size: 0.7rem;
          }
          .cancelBtn{
            float: left;
            margin-left: 0.5rem;
          }
          .enterBtn{
            float: right;
            margin-right: 0.5rem;
          }
        }
        .dateContent{
          height: 6rem;
          border-bottom: 1px solid gainsboro;
          .month{
            text-align: center;
            line-height: 2rem;
            font-size: 0.7rem;
            i{
              font: 500 1.2rem sans-serif;
              color: #888;
            }
            .el-icon-left{
              float: left;
            }
            .el-icon-right{
              float: right;
            }
          }
          .bodyDiv
          .weekdays{
            display: flex;
            li{
              flex: 1;
              font-size: 0.7rem;
              width:2.7rem;
              list-style-type:none;
              text-align: center;
              line-height:  2rem;
              cursor:pointer;
            }
          }
          .mint-swipe{
            height: 2rem !important;
            .mint-swipe-items-wrap{
              .days{
                ul{
                  display: flex;
                  li{
                    flex: 1;
                    font-size: 0.7rem;
                    width:2.7rem;
                    list-style-type:none;
                    text-align: center;
                    line-height:  2rem;
                    cursor:pointer;
                    .other-month {
                      color: #EEC591;
                    }
                    .active {
                      display: inline-block;
                      width: 2rem;
                      height: 2rem;
                      color: #fff;
                      background-color: #324057;
                    }
                    .selected{
                      display: inline-block;
                      width: 2rem;
                      height: 2rem;
                      color: #fff;
                      background-color: #1E90FF!important;
                    }
                  }
                }
              }
            }
          }
        }
        .timeTable{
          background: gainsboro;
          table{
            width: 100%;
            font-size: 0.7rem;
            margin-top: 0.5rem;
            background: white;
            tr{
              td{
                width: 12.5%;
                height: 2rem;
                text-align: center;
              }
              .selectedT{
                background: gainsboro;
              }
            }
          }
        }
      }
    }

    .mint-popup-2{
      width: 100%;
      .cancelHandle{
        line-height: 2.5rem;
        text-align: center;
        border-top: 1px solid gainsboro;
      }
    }
  }
</style>
