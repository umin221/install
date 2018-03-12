<template>
  <div>
    <div class="service-continer">
      <mt-header fixed :title="headTitle">
        <fallback slot="left"></fallback>
        <mt-button slot="right" @click.native="openConfirm">关闭</mt-button>
      </mt-header>

      <div class="mint-content service-detail">
        <div class="detail-title">
          <div class="mt-Detail-title">服务单编号：{{ServiceRequest['SR Number']}}<span class="user-state">{{ServiceRequest.Status}}</span></div>
          <div class="mt-Detail-title">优先级：{{ServiceRequest['Priority']}}</div>
          <div class="mt-Detail-title">联系人：{{ServiceRequest['Contact Last Name']}}</div>
          <div class="mt-Detail-title">联系电话：<a href="javascript:void(0);" class="detail-call">{{ServiceRequest['Contact Business Phone']}}</a></div>
        </div>
        <div class="detail-content">
          <mt-navbar v-model="active">
            <mt-tab-item v-for="tab in tabList" :id="tab.id" :key="tab.id">{{tab.name}}</mt-tab-item>
          </mt-navbar>
          <mt-tab-container v-model="active">
            <mt-tab-container-item id="tab-container1">
              <div class="mt-Detail-info">
                <div>产品条形码：<a href="javascript:void(0);" class="detail-call">{{ServiceRequest['KL SN']}}</a></div>
                <div>产品型号：{{ServiceRequest['KL Product Model']}}</div>
                <div>申请时间：{{ServiceRequest['Created']}}</div>
                <div>客户预约时间：{{ServiceRequest['CEM Planned Start Date']}}</div>
                <div>实际预约时间：{{ServiceRequest['CEM Planned Start Date']}}</div>
                <div>地址：{{ServiceRequest['Personal City']}}{{ServiceRequest['Personal Street Address']}}</div>
                <div>用户故障说明：{{ServiceRequest['Sub-Area']}}</div>
                <div>问题说明：
                  <div>{{ServiceRequest['Description']}}</div>
                </div>
                <div>相关照片：
                  <div><img src="" alt="" height="100"></div>
                </div>
              </div>
            </mt-tab-container-item>
            <mt-tab-container-item id="tab-container2">
              <div class="service-record" v-if="ServiceRequest['Status'] !== '未开始'">
                <div>单据编号{{ServiceRequest['SR Number']}}
                  <i :class="[icon,iconDown]" @click="openOrder"></i>
                  <ul v-show="isOpenOrder">
                    <li>故障记录</li>
                    <li>产品序列号：{{ServiceRequest['KL SN']}}</li>
                    <li>详细地址：{{ServiceRequest['KL SN']}}</li>
                    <li>产品类型：{{ServiceRequest['KL Product Model']}}</li>
                    <li>故障描述：{{ServiceRequest['Sub-Area']}}</li>
                    <li>故障现象：{{ServiceRequest['Area']}}</li>
                    <li>照片附件</li>
                  </ul>
                  <ul v-show="isOpenOrder">
                    <li>完工确认单</li>
                  </ul>
                </div>
              </div>
              <div v-else style="line-height: 5rem;text-align: center">暂无数据</div>
            </mt-tab-container-item>
            <mt-tab-container-item id="tab-container3">
              <div class="crm-zyList" v-for="(item, index) in processDate" :key="index">
                <ul class="content">
                  <li class="bd-radius">
                    <span class="icon"></span>
                  </li>
                  <li style="margin-right: 8px">{{item.Note}}</li>
                  <div class="content-div">
                    <div>{{item.Created}}</div>
                  </div>
                </ul>
              </div>
            </mt-tab-container-item>
          </mt-tab-container>
        </div>
      </div>
      <button-group v-if="loginMeg['Job Title'] === '400'&& BtnStatu === 'status4'">
        <mt-button type="primary" class="single" @click.native="toContact" >派单</mt-button>
      </button-group>
      <button-group v-if="loginMeg['Job Title'] === 'install'">
        <mt-button v-show="BtnStatu === 'status1' && !callEnd" type="primary" class="single" @click.native="changeBtnStote"  >电话联系客户</mt-button>
        <div v-show="BtnStatu === 'status2' || callEnd" class="callPlan">
          <mt-button  type="primary" class="single flax"  @click.native="callSolve" >电话已解决</mt-button>
          <mt-button type="primary" class="single flax" @click.native="clickShow"  >预约维修计划</mt-button>
        </div>
        <mt-button v-show="BtnStatu === 'status3'"  type="primary" class="single" @click="popupVisible1 = !popupVisible1" >工单操作</mt-button>
      </button-group>
      <!--弹出日历-->
      <div v-if="showBox2">
        <mt-popup v-model="showBox2"  position="bottom" popup-transition="popup-fade" class="mint-popup-1">
          <dateControl @my-cancel="cancel" @my-enter="enter"></dateControl>
        </mt-popup>
      </div>

      <close :showBox1="showBox" @my-enter="boxEnter" @my-close="boxClose"></close>

      <!--工单操作-->
      <mt-popup v-model="popupVisible1" position="bottom" popup-transition="popup-fade" class="mint-popup-2">
        <mt-cell class="setOut" title="出发" >
          <mt-button @click="clickPosition('setOut')">签到</mt-button>
        </mt-cell>
        <mt-cell title="到达">
          <mt-button @click="clickPosition('reach')">签到</mt-button>
        </mt-cell>
        <mt-cell title="记录故障">
          <router-link to="comEnter">
            <mt-button>填写</mt-button>
          </router-link>
        </mt-cell>
        <mt-cell title="完工确认">
          <router-link to="saveFault">
            <mt-button >填写</mt-button>
          </router-link>
        </mt-cell>
        <mt-cell class="completeEnd" title="结束">
          <mt-button @click.native="clickPosition('end')">确认</mt-button>
        </mt-cell>
        <div class="cancelHandle" @click="popupVisible1 = !popupVisible1">取消</div>
      </mt-popup>
    </div>
  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex';
  import close from './close';
  import dateControl from './dateControl';
  import { MessageBox } from 'mint-ui';
  import buttonGroup from 'public/components/cus-button-group';
  //
  const NameSpace = 'detail';
  //
  export default {
    name: NameSpace,
    created() {
      let me = this;
      me.srNumber = me.$route.query.type;
      me.contactId = me.$route.query.id;
      this.getDetail(me.srNumber);
    },
    data: () => {
      return {
        active: 'tab-container1',
        headTitle: '维修工单详情',
        popupVisible1: false,
        icon: 'xs-icon',
        iconDown: 'icon-arrow-down',
        isOpenOrder: false,
        contact: {},
        srNumber: '',
        contactName: '',
        Created: '',
        role: true,
        showBox: false,
        showBox2: false,
        result: false,
        tabList: [
          {name: '基础信息', id: 'tab-container1'},
          {name: '维修记录', id: 'tab-container2'},
          {name: '流程记录', id: 'tab-container3'}
        ],
        starTime: '',
        endTime: '',
        callEnd: false
      };
    },
    computed: {
      ...mapState('index', ['loginMeg']),
      ...mapState(NameSpace, ['ServiceRequest', 'processDate', 'Statu', 'BtnStatu'])
    },
    methods: {
      ...mapActions(NameSpace, ['getDetail', 'getCloseReason', 'setStatus']),
      boxClose(msg) {               // 关闭取消事件
        this.showBox = false;
      },
      boxEnter(msg) {               // 关闭确认
        let self = this;
        self.showBox = false;
        if (msg) {
          let Action = KND.Util.isArray(self.ServiceRequest.Action) ? self.ServiceRequest.Action[0] : self.ServiceRequest.Action;
          let obj = {
            srId: self.ServiceRequest['Id'],
            actionId: Action['Id'],
            closeMsg: msg
          };
          self.getCloseReason(obj);
        }
      },
      openConfirm() {               // 点击关闭弹出层
        let self = this;
        self.showBox = true;
      },
      changeBtnStote() {            // 改变按钮状态
        let self = this;
        self.callEnd = true;
      },
      clickShow() {                 // 点击显示日历
        let self = this;
        self.showBox2 = true;
        let parms = {
          'Object Id': self.ServiceRequest.Id,
          'ActivityId': self.ServiceRequest.Action.Id,
          'inStatus': self.Statu['接单'],
          'key': 'getAccept'
        };
        if (self.BtnStatu === 'status2') {
          self.setStatus(parms);
        }
      },
      cancel(val) {                    // 日历取消事件
        this.showBox2 = false;
        console.log(val);
      },
      enter(val) {                     // 日历确定
        let me = this;
        if (val.Time1.time && val.Time2.time) {
          if (val.Time1.key <= val.Time2.key) {
            me.starTime = val.Time1.time;
            me.endTime = val.Time2.time;
          } else {
            me.starTime = val.Time2.time;
            me.endTime = val.Time1.time;
          }
          me.starTime = val.selectDay + ' ' + me.starTime + ':00';
          me.endTime = val.selectDay + ' ' + me.endTime + ':00';
          this.showBox2 = false;
          console.log(me.starTime);
          console.log(me.endTime);
        } else {
          MessageBox({
            title: '提示',
            message: '请选择预约开始和结束时间！'
          });
        }
      },
      callSolve() {
        MessageBox.confirm('远程电话沟通客户已解决，确认提交？?', '').then(action => {
          console.log(1111);
        });
      },
      clickPosition(value1) {
        let self = this;
        let parms = {
          'Object Id': self.ServiceRequest.Id,
          'ActivityId': self.ServiceRequest.Action.Id,
          'inStatus': ''
        };
        if (value1 === 'setOut') {
          parms['inStatus'] = self.Statu['接单'];
        } else if (value1 === 'reach') {
          parms['inStatus'] = self.Statu['上门'];
        } else if (value1 === 'end') {
          parms['inStatus'] = self.Statu['完成'];
        }
        self.setStatus(parms);
      },
      completeEnd() {
        MessageBox({
          title: '提示',
          message: '维修完成您辛苦了！'
        });
      },
      toContact() {
        this.$router.push({
          name: 'engineer',
          query: {
            id: this.ServiceRequest['Id']
          }
        });
      },
      openOrder() {
        if (this.iconDown === 'icon-arrow-down') {
          this.iconDown = 'icon-arrow-up';
          this.isOpenOrder = true;
        } else {
          this.iconDown = 'icon-arrow-down';
          this.isOpenOrder = false;
        }
      }
    },
    components: {
      close,
      dateControl,
      buttonGroup
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
      height: 84%;
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
        height: 80%;
        background-color: #ffffff;
        overflow: auto;
        .mint-tab-container{
          .mint-tab-container-wrap{
            .mint-tab-container-item{
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
              .service-record>div{
                border-bottom: 1px solid gray;
                line-height: 2rem;
                text-align: left;
                i{
                  float: right;
                  margin-right: 1rem;
                }
              }
            }
          }
        }
      }
    }
    .cus-group-button{
      .callPlan{
        display: flex;
        justify-content: space-around;
        button{
          width: 7rem;
        }
      }
    }
    .mint-popup-2{
      width: 90%;
      background-color: inherit !important;
      .mint-cell{
        padding: 0 0.5rem;
        line-height: 2.5rem;
        .mint-cell-wrapper {
          line-height: inherit;
          .mint-cell-value .mint-button {
            height: 1.25rem;
            background-color: $theme-color;
            color: #ffffff;
            font-size: 0.75rem;
            width: 4rem;
            border-radius: 0.6rem;
          }
        }
      }
      .setOut{
        border-radius: 0.5rem 0.5rem 0 0;
      }
      .completeEnd{
        border-radius: 0 0 0.5rem 0.5rem;
      }
      .cancelHandle{
        line-height: 2.5rem;
        text-align: center;
        border-top: 1px solid gainsboro;
        background-color: #ffffff;
        margin: 0.5rem 0;
        border-radius: 0.5rem;
      }
    }
  }
</style>
