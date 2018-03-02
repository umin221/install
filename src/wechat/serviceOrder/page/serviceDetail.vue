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
      <div v-if="!role" class="submitButton">
        <mt-button size="normal" type="danger" @click="toContact" >派单</mt-button>
      </div>
      <button-group>
        <mt-button v-if="isCall === 'lxkh'" type="primary" class="single" @click.native="changeBtnStote"  >电话联系客户</mt-button>
        <div v-else-if="isCall === 'yyjh'" class="callPlan">
          <mt-button  type="primary" class="single flax"  @click.native="callSolve" >电话已解决</mt-button>
          <mt-button type="primary" class="single flax" @click.native="clickShow"  >预约维修计划</mt-button>
        </div>
        <mt-button v-if="isCall === 'gdcz'"  type="primary" class="single" @click="popupVisible1 = !popupVisible1" >工单操作</mt-button>
      </button-group>
      <!--<div v-else-if="role" class="submitButton">-->
        <!--<mt-button v-if="isCall === 'lxkh'"  size="normal" @click.native="changeBtnStote" type="danger" >电话联系客户</mt-button>-->
        <!--<div v-else-if="isCall === 'yyjh'" class="callPlan">-->
          <!--<mt-button size="normal" type="default" @click.native="callSolve" >电话已解决</mt-button>-->
          <!--<mt-button size="normal" @click.native="clickShow" type="danger" >预约维修计划</mt-button>-->
        <!--</div>-->
        <!--<mt-button v-if="isCall === 'gdcz'"  size="normal" @click="popupVisible1 = !popupVisible1" type="danger" >工单操作</mt-button>-->
      <!--</div>-->
      <!--弹出日历-->
      <div v-if="showBox2">
        <mt-popup v-model="showBox2"  position="bottom" popup-transition="popup-fade" class="mint-popup-1">
          <dateControl @my-cancel="cancel" @my-enter="enter"></dateControl>
        </mt-popup>
      </div>

      <close :showBox1="showBox" @my-enter="boxEnter" @my-close="boxClose" :options1="option"></close>

      <!--工单操作-->
      <mt-popup v-model="popupVisible1" position="bottom" popup-transition="popup-fade" class="mint-popup-2">
        <mt-cell class="setOut" title="出发" >
          <mt-button @click="clickPosition('setOut')">签到</mt-button>
        </mt-cell>
        <mt-cell title="到达">
          <mt-button @click="clickPosition('reach')">签到</mt-button>
        </mt-cell>
        <mt-cell title="记录故障">
          <router-link to="saveFault">
            <mt-button>填写</mt-button>
          </router-link>
        </mt-cell>
        <mt-cell title="完工确认">
          <router-link to="saveFault">
            <mt-button>填写</mt-button>
          </router-link>
        </mt-cell>
        <mt-cell class="completeEnd" title="结束">
          <mt-button @click.native="completeEnd">确认</mt-button>
        </mt-cell>
        <div class="cancelHandle" @click="popupVisible1 = !popupVisible1">取消</div>
      </mt-popup>
    </div>
  </div>
</template>
<script>
  import close from './close';
  import dateControl from './dateControl';
  import api from '../api/api';
  import { MessageBox } from 'mint-ui';
  import buttonGroup from 'public/components/cus-button-group';
  export default {
    name: 'serviceDetail',
    created() {
      let me = this;
      me.srNumber = me.$route.query.type;
      me.contactId = me.$route.query.id;
      api.get({
        key: 'getList',
        data: {
          'body': {
            'OutputIntObjectName': 'Base KL Service Request Interface BO',
            'SearchSpec': '[Service Request.SR Number]= "' + me.srNumber + '"'
          }
        },
        success: function(data) {
          let Note = null;
          me.ServiceRequest = data.SiebelMessage['Service Request'] || {};
          Note = me.ServiceRequest['FIN Service Request Notes'];
          if (Note) {
            if (Object.prototype.toString.call(Note) !== '[object Array]') {
              console.log(111);
              me.processDate.push(Note);
            } else {
              me.processDate = Note;
            }
          } else {
            me.processDate = [{Note: '暂无数据'}];
          }
        }
      });
//      api.get({
//        key: 'getDetail',
//        method: 'GET',
//        success: function(data) {
//          me.ServiceRequest = data;
//          console.log(me.ServiceRequest);
//        }
//      });
    },
    data: () => {
      return {
        active: 'tab-container1',
        headTitle: '维修工单详情',
        popupVisible1: false,
        ServiceRequest: {},
        contact: {},
        srNumber: '',
        contactName: '',
        Created: '',
        role: true,
        isCall: 'lxkh',
        showBox: false,
        showBox2: false,
        result: false,
        tabList: [
          {name: '基础信息', id: 'tab-container1'},
          {name: '维修记录', id: 'tab-container2'},
          {name: '流程记录', id: 'tab-container3'}
        ],
        option: ['客户不接受维修报价', '已自行解决', '暂不影响使用', '其他'],
        processDate: [],
        starTime: '',
        endTime: ''
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
        self.showBox2 = true;
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
          me.starTime = val.selectDay + ' ' + me.starTime;
          me.endTime = val.selectDay + ' ' + me.endTime;
          console.log(me.starTime);
          console.log(me.endTime);
        } else {
          MessageBox({
            title: '提示',
            message: '请选择预约开始和结束时间！'
          });
        }
        this.showBox2 = false;
        this.isCall = 'gdcz';
      },
      callSolve() {
        MessageBox.confirm('远程电话沟通客户已解决，确认提交？?', '').then(action => {
          console.log(1111);
        });
      },
      clickPosition(value1) {
        api.get({
          key: 'getaddr',
          data: {
            'datetime': 1511971200,
            'useridlist': ['james', 'paul']
          },
          success: function(data) {
            console.log(data);
          }
        });
      },
      completeEnd() {
        MessageBox({
          title: '提示',
          message: '维修完成您辛苦了！'
        });
      },
      toContact() {
        this.$router.push({
          name: 'contact'
        });
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
    .cus-group-button{
      .callPlan{
        display: flex;
        justify-content: space-around;
        button{
          margin: 0.3rem 0;
          width: 40%;
        }
      }
    }
    /*底部按钮*/
    /*.mint-popup-1{*/
      /*width: 100%;*/
      /*height: 22rem;*/
      /*background: white;*/
      /*.alertDate{*/
        /*width: 100%;*/
        /*.headerButton{*/
          /*height: 2rem;*/
          /*line-height: 2rem;*/
          /*border-bottom: 1px solid gainsboro;*/
          /*div{*/
            /*color: darkred;*/
            /*font-size: 0.7rem;*/
          /*}*/
          /*.cancelBtn{*/
            /*float: left;*/
            /*margin-left: 0.5rem;*/
          /*}*/
          /*.enterBtn{*/
            /*float: right;*/
            /*margin-right: 0.5rem;*/
          /*}*/
        /*}*/
        /*.dateContent{*/
          /*height: 6rem;*/
          /*border-bottom: 1px solid gainsboro;*/
          /*.month{*/
            /*text-align: center;*/
            /*line-height: 2rem;*/
            /*font-size: 0.7rem;*/
            /*i{*/
              /*font: 500 1.2rem sans-serif;*/
              /*color: #888;*/
            /*}*/
            /*.el-icon-left{*/
              /*float: left;*/
            /*}*/
            /*.el-icon-right{*/
              /*float: right;*/
            /*}*/
          /*}*/
          /*.bodyDiv*/
          /*.weekdays{*/
            /*display: flex;*/
            /*li{*/
              /*flex: 1;*/
              /*font-size: 0.7rem;*/
              /*width:2.7rem;*/
              /*list-style-type:none;*/
              /*text-align: center;*/
              /*line-height:  2rem;*/
              /*cursor:pointer;*/
            /*}*/
          /*}*/
          /*.mint-swipe{*/
            /*height: 2rem !important;*/
            /*.mint-swipe-items-wrap{*/
              /*.days{*/
                /*ul{*/
                  /*display: flex;*/
                  /*li{*/
                    /*flex: 1;*/
                    /*font-size: 0.7rem;*/
                    /*width:2.7rem;*/
                    /*list-style-type:none;*/
                    /*text-align: center;*/
                    /*line-height:  2rem;*/
                    /*cursor:pointer;*/
                    /*.other-month {*/
                      /*color: #EEC591;*/
                    /*}*/
                    /*.active {*/
                      /*display: inline-block;*/
                      /*width: 2rem;*/
                      /*height: 2rem;*/
                      /*color: #fff;*/
                      /*background-color: #324057;*/
                    /*}*/
                    /*.selected{*/
                      /*display: inline-block;*/
                      /*width: 2rem;*/
                      /*height: 2rem;*/
                      /*color: #fff;*/
                      /*background-color: #1E90FF!important;*/
                    /*}*/
                  /*}*/
                /*}*/
              /*}*/
            /*}*/
          /*}*/
        /*}*/
        /*.timeTable{*/
          /*background: gainsboro;*/
          /*table{*/
            /*width: 100%;*/
            /*font-size: 0.7rem;*/
            /*margin-top: 0.5rem;*/
            /*background: white;*/
            /*tr{*/
              /*td{*/
                /*width: 12.5%;*/
                /*height: 2rem;*/
                /*text-align: center;*/
              /*}*/
              /*.selectedT{*/
                /*background: gainsboro;*/
              /*}*/
            /*}*/
          /*}*/
        /*}*/
      /*}*/
    /*}*/

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
