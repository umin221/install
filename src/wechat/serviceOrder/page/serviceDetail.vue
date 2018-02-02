<template>
  <div>
    <div class="continer">
      <mt-header fixed :title="headTitle">
        <fallback slot="left"></fallback>
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
              <mt-cell v-for="n in 6" :key="n" :title="'选项 ' + n" />
            </mt-tab-container-item>
          </mt-tab-container>
        </div>
      </div>
      <div class="submitButton">
          <mt-button size="normal" @click.native="clickShow" type="danger" >派单</mt-button>
      </div>
      <!--弹出日历-->



      <mt-popup v-model="popupVisible4" position="bottom" class="mint-popup-4">
        <div class="alertDate">
          <div class="headerButton">
            <div class="cancelBtn">取消</div>
            <div class="enterBtn">确认</div>
          </div>
          <div class="dateContent">
            <div class="month">
              <i class="el-icon-left" @click="pickPre(currentYear,currentMonth)"><</i>
              <span>{{ currentYear }} 年 {{ currentMonth }} 月</span>
              <i class="el-icon-right" @click="pickNext(currentYear,currentMonth)">></i>
            </div>
            <!-- 日期 -->
            <div class="bodyDiv">
              <ul class="weekdays">
                <li>一</li>
                <li>二</li>
                <li>三</li>
                <li>四</li>
                <li>五</li>
                <li style="color:#0A0A0A">六</li>
                <li style="color:#0A0A0A">日</li>
              </ul>
              <mt-swipe :auto="0" :show-indicators="false">
                <mt-swipe-item class="days" v-for="(value,index1) in daysUL">
                  <li @click="pick(day,index+index1*7)" v-for="(day, index) in value" :class="[{'ban':isBan[index+index1*7]},{'xiu':isXiu[index+index1*7]}]" >
                    <!--本月-->
                    <span v-if="day.getMonth()+1 != currentMonth" class="other-month" :class="{'selected':isSelected[index+index1*7]}">{{ day.getDate() }}</span>
                    <span v-else :class="{'selected':isSelected[index+index1*7]}">
                    <!--今天-->
                    <span v-if="day.getFullYear() == new Date().getFullYear() && day.getMonth() == new Date().getMonth() && day.getDate() == new Date().getDate()" class="active">{{ day.getDate() }}</span>
                    <span v-else>{{ day.getDate() }}</span>
                    </span>
                  </li>
                </mt-swipe-item>
              </mt-swipe>
            </div>
          </div>
        </div>
      </mt-popup>

    </div>
  </div>
</template>
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
  .continer{
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
      position: absolute;
      bottom: 1rem;
      width: 100%;
      button {
        width: 200px;
        border-radius: 1rem;
      }
    }
    .mint-popup-4{
      width: 100%;
      height: 20rem;
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
                display: flex;
                width: 100%;
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
            }
          }
        }
      }
    }
  }
</style>
<script>
  export default {
    name: 'serviceDetail',
    created() {
      console.log(this);
    },
    data: () => {
      return {
        active: 'tab-container1',
        headTitle: '维修工单详情',
        popupVisible4: false,
        tabList: [
          {name: '基础信息', id: 'tab-container1'},
          {name: '维修记录', id: 'tab-container2'},
          {name: '流程记录', id: 'tab-container3'}
        ],
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
        isBan: [],
        isXiu: [],
        restDays: {
          year: '',
          month: '',
          day: '',
          resttype: '',
          restdate: ''
        },
        restDaysList: [],
        banList: [],
        xiuList: [],
        selectIndex: ''
      };
    },
    methods: {
      clickShow() {
        this.popupVisible4 = true;
        this.initData(null);
      },
      pickPre(year, month) {
        this.daysUL = [];
        this.isSelected = [];
        const d = new Date(this.formatDate(year, month, 1));
        d.setDate(0);
        this.initData(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1));
      },
      pickNext(year, month) {
        this.daysUL = [];
        this.isSelected = [];
        const d = new Date(this.formatDate(year, month, 1));
        d.setDate(42);
        this.initData(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1));
      },
      formatDate(year, month, day) {
        const y = year;
        let m = month;
        if (m < 10) m = `0${m}`;
        let d = day;
        if (d < 10) d = `0${d}`;
        return `${y}-${m}-${d}`;
      },

      initData(cur) {
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

        // 今天是周日，放在第一行第7个位置，前面6个 这里默认显示一周，如果需要显示一个月，则第二个循环为 i<= 42- this.firstWeek
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
      }
    },
    components: {
    }
  };
</script>
