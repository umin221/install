<template>
  <div>
    <div class="service-continer">
      <mt-header fixed :title="headTitle" >
        <fallback slot="left"></fallback>
        <mt-button  slot="right"
                     @click.native="openConfirm"
                     v-if="role === 'install'&& BtnStatu !== 'status5' && BtnStatu ">关闭</mt-button>
      </mt-header>


      <div class="mint-content service-detail">
        <div class="detail-title">
          <div class="mt-Detail-title">服务单编号：{{ServiceRequest['SR Number']}}<span class="user-state">{{Action['Status']}}</span></div>
          <div v-if="role === 'install'" class="mt-Detail-title" >优先级：{{ServiceRequest['Priority']}}</div>
          <div class="mt-Detail-title">联系人：{{ServiceRequest['Contact Last Name']}}</div>
          <div v-if="role === 'custom'"   class="mt-Detail-title">服务类型：{{ServiceRequest['SR Type']}}</div>
          <div class="mt-Detail-title">联系电话：
            <a href="javascript:void(0);"
               class="detail-call i"
              @click="call = !call">
            <i class="xs-icon icon-call"
                  style="font-size: 0.75rem">
              {{ServiceRequest['Contact Business Phone']}}
              </i>
            </a></div>
        </div>
        <div class="detail-content">
          <mt-navbar v-model="active">
            <mt-tab-item v-for="tab in tabList" :id="tab.id" :key="tab.id">{{tab.name}}</mt-tab-item>
          </mt-navbar>
          <mt-tab-container v-model="active">
            <mt-tab-container-item id="tab-container1" class="marginB">
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
                <attach ioName="KL Service Request Attachment IO" ref="attach"
                        :attach="attach.list"
                        :edit="attach.edit"
                        :title="attach.title">
                </attach>
              </div>
            </mt-tab-container-item>
            <mt-tab-container-item id="tab-container2" class="marginB">
              <empty v-show="!ServiceRequest['Action'] && !allChildService.length"></empty>
              <toggle v-if="ServiceRequest['Action']" :type="true" :label="ServiceRequest['SR Number']">
                <div>
                  <toggle :title="false" label="故障记录">
                    <ul class="failure-record">
                      <li>产品序列号：{{ServiceRequest['KL SN']}}</li>
                      <li>详细地址：{{ServiceRequest['Personal Street Address']}}</li>
                      <li>产品类型：{{ServiceRequest['KL Product Model']}}</li>
                      <li>故障描述：{{ServiceRequest['Sub-Area']}}</li>
                      <li>故障现象：{{ServiceRequest['Area']}}</li>
                      <attach ioName="KL Service Request Attachment IO" ref="attach"
                              :attach="attach1.list"
                              :edit="attach1.edit"
                              :title="attach1.title">
                      </attach>
                    </ul>
                  </toggle>
                  <toggle :title="false" label="完工确认单">
                    <empty v-show="!orderEntry.length"></empty>
                    <div  v-for="(item, index) in orderEntry">
                      <div v-if="item['Order Entry - Line Items']">
                        <div class="enter-order">
                          <div>保修期</div>
                          <div>产品名称</div>
                          <div>数量</div>
                        </div>
                        <div class="enter-order">
                          <div>{{item['Order Entry - Line Items']['KL Warranty Flag'] === "N" ? '保内': '保外'}}</div>
                          <div>{{item['Order Entry - Line Items']['KL Product Name Join']}}</div>
                          <div>{{item['Order Entry - Line Items']['Quantity Requested']}}</div>
                        </div>
                        <div class="enter-order">
                          <div>总金额：{{item['Order Total']}}</div>
                        </div>
                      </div>
                    </div>
                  </toggle>
                </div>
              </toggle>
              <toggle v-if="allChildService.length"
                      v-for="(item, index) in allChildService"
                      :type="true"
                      :key="item.Id"
                      :label="item['SR Number']">
                <div>
                  <toggle :title="false" label="故障记录">
                    <ul class="failure-record">
                      <li>产品序列号：{{item['KL SN']}}</li>
                      <li>详细地址：{{item['Personal Street Address']}}</li>
                      <li>产品类型：{{item['KL Product Model']}}</li>
                      <li>故障描述：{{item['Sub-Area']}}</li>
                      <li>故障现象：{{item['Area']}}</li>
                      <attach ioName="KL Service Request Attachment IO" ref="attach"
                              :attach="attach.list"
                              :edit="attach.edit"
                              :title="attach.title">
                      </attach>
                    </ul>
                  </toggle>
                  <toggle :title="false" label="完工确认单">
                    <div v-if="item['KL Child SR Order']">
                      <div class="enter-order">
                        <div>保修期</div>
                        <div>产品名称</div>
                        <div>数量</div>
                      </div>
                      <div class="enter-order">
                        <div>{{item['KL Child SR Order']['KL Child SR Order Item']['KL Warranty Flag'] === "Y" ? '保内': '保外'}}</div>
                        <div>{{item['KL Child SR Order']['KL Child SR Order Item']['KL Product Name Join']}}</div>
                        <div>{{item['KL Child SR Order']['KL Child SR Order Item']['Quantity Requested']}}</div>
                      </div>
                      <div class="enter-order">
                        <div>总金额：{{item['KL Child SR Order']['Order Total']}}</div>
                      </div>
                    </div>
                  </toggle>
                </div>
              </toggle>
            </mt-tab-container-item>
            <mt-tab-container-item id="tab-container3" class="marginB">
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
      <button-group v-if="role === 'custom'&& BtnStatu === 'status4'">
        <mt-button class="single" @click.native="toContact" >派单</mt-button>
      </button-group>
      <button-group v-if="role === 'install'">
        <div v-show="BtnStatu === 'status5'" class="callPlan">
          <mt-button  class="single flax"  @click.native="changeMy" >接单</mt-button>
          <mt-button type="primary" class="single flax" @click.native="toContact">派单</mt-button>
        </div>
        <mt-button v-show="BtnStatu === 'status1'&& !callEnd"  class="single" @click.native="changeBtnStote"  >电话联系客户</mt-button>
        <div v-show="BtnStatu === 'status2' || callEnd" class="callPlan">
          <mt-button   class="single flax" type="primary"  @click.native="callSolve" >电话已解决</mt-button>
          <mt-button  class="single flax" @click.native="clickShow"  >预约维修计划</mt-button>
        </div>
        <mt-button v-show="BtnStatu === 'status3'"  class="single" @click="popupVisible1 = !popupVisible1" >工单操作</mt-button>
      </button-group>
      <!--弹出日历-->
      <div v-if="showBox2">
        <mt-popup v-model="showBox2"  position="bottom" popup-transition="popup-fade" class="mint-popup-1">
          <dateControl @my-cancel="cancel" @my-enter="enter"></dateControl>
        </mt-popup>
      </div>
      <!--关闭盒子-->
      <close :showBox1="showBox" @my-enter="boxEnter" @my-close="boxClose"></close>
      <!--打电话-->
      <cus-call :number="ServiceRequest['Contact Business Phone']" v-model="call"></cus-call>
      <!--工单操作-->
      <mt-popup v-model="popupVisible1" position="bottom" popup-transition="popup-fade" class="mint-popup-2">
        <mt-cell class="setOut" title="出发" :value="Action['KL Departure Location']" >
          <mt-button v-if="Action['Status']==='已预约'" @click="clickPosition('setOut')">签到</mt-button>
        </mt-cell>
        <mt-cell title="到达" :value="Action['MeetingLocation']">
          <mt-button v-if="Action['Status']==='已出发'" @click="clickPosition('reach')">签到</mt-button>
          <mt-button v-else-if="Action['Status']==='已预约'" style="background: gainsboro">签到</mt-button>
        </mt-cell>
        <mt-cell title="记录故障">
          <div v-if="!ServiceRequest['KL Child Service Request']">
            <mt-button v-if="Action['Status']==='已上门'&& ServiceRequest['SR Rootcause']"
                       @click="fillIn('ServiceRequest')">已填写</mt-button>
            <mt-button v-else-if="Action['Status']==='已上门' && !ServiceRequest['SR Rootcause']"
                       @click="clickPosition('comEnter')">填写</mt-button>
            <mt-button v-else style="background: gainsboro">填写</mt-button>
          </div>
          <div v-else>
            <mt-button v-if="childService['SR Rootcause']"
                       @click="fillIn('childService')">已填写</mt-button>
            <mt-button v-else
              @click.native="childCom(childService)">填写</mt-button>
          </div>
        </mt-cell>
        <mt-cell title="完工确认">
          <div v-if="!ServiceRequest['KL Child Service Request']">
            <mt-button v-if="Action['Status']==='已上门'&& ServiceRequest['SR Rootcause'] && ServiceRequest['Status'] !== '已完成'"
                       @click.native="clickPosition('failureRecord')">填写</mt-button>
            <mt-button v-else-if="ServiceRequest['Status'] === '已完成'"
                       @click.native="moreOrder">再记一单</mt-button>
            <mt-button v-else style="background: gainsboro">填写</mt-button>
          </div>
          <div v-else>
            <mt-button v-if="childService['SR Rootcause'] && childService['Status'] !== '已完成'"
                       @click.native="childRecord(childService)">填写</mt-button>
            <mt-button v-else-if="childService['Status'] === '已完成'"
                       @click.native="moreOrder">再记一单</mt-button>
            <mt-button v-else style="background: gainsboro">填写</mt-button>
          </div>
        </mt-cell>
        <mt-cell class="completeEnd" title="结束">
          <mt-button v-if="ServiceRequest['Status'] === '已完成'" @click.native="clickPosition('end')">确认</mt-button>
          <mt-button v-else style="background: gainsboro">确认</mt-button>
        </mt-cell>
        <div class="cancelHandle" @click="popupVisible1 = !popupVisible1">取消</div>
      </mt-popup>
    </div>
  </div>
</template>
<script>
  import {mapState, mapActions, mapMutations} from 'vuex';
  import { MessageBox } from 'mint-ui';
  import close from '../components/close';
  import cusCall from 'public/components/cus-call';
  import toggle from '../components/detail-toggle';
  import dateControl from '../components/dateControl';
  //
  const NameSpace = 'detail';
  //
  export default {
    name: NameSpace,
    created() {
      let me = this;
      me.srNumber = me.$route.query.type;
      me.getDetail(me.srNumber);
      me.setRole({meg: me.loginMeg, role: me.role});
      console.log(me.$route.query.srId);
      me.queryMedias({
        data: {
          'IOName': 'KL Service Request Attachment IO',
          'SearchSpec': {
            'Service Request Attachment.Activity Id': me.$route.query.srId
          }
        },
        success: data => {
          me.attach.list = KND.Util.toArray(data['SiebelMessage']['Service Request Attachment']);
        }
      });
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
        showBox: false,
        showBox2: false,
        result: false,
        starTime: '',
        endTime: '',
        callEnd: false,
        AppointEnd: false,
        call: false,
        phoneNum: '',
        attach: { // 客户上传的 附件
          list: [],
          edit: false,
          title: '相关照片'
        },
        attach1: { // 故障记录 附件
          list: [],
          edit: false,
          title: '附件：维修单据存档'
        }
      };
    },
    computed: {
      ...mapState('index', ['loginMeg', 'role']),
      ...mapState(NameSpace, ['ServiceRequest', 'Action', 'processDate', 'Statu', 'BtnStatu', 'tabList', 'starAddress', 'visitAddress', 'endAddress', 'orderEntry', 'childService', 'allChildService'])
    },
    methods: {
      ...mapActions('app', ['upload', 'queryMedias']),
      ...mapActions(NameSpace, ['getDetail', 'getCloseReason', 'setStatus', 'setContact', 'getMapAddress', 'addChildService']),
      ...mapMutations(NameSpace, ['setRole']),
      boxClose(msg) {               // 关闭取消事件
        this.showBox = false;
      },
      boxEnter(msg) {               // 关闭确认
        let me = this;
        me.showBox = false;
        if (msg) {
          let obj = {
            srId: me.ServiceRequest['Id'],
            actionId: me.Action['Id'],
            closeMsg: msg
          };
          me.getCloseReason(obj);
          me.$router.go(-1);
        }
      },
      openConfirm() {               // 点击关闭弹出层
        let me = this;
        me.showBox = true;
      },
      changeBtnStote() {            // 改变按钮状态
        let me = this;
        me.callEnd = true;
        me.call = true;
      },
      clickShow() {                 // 点击显示日历
        let me = this;
        me.showBox2 = true;
        // 改变为接单状态
        if (me.BtnStatu === 'status1') {
          let parms = {
            'Object Id': me.ServiceRequest.Id,
            'ActivityId': me.Action.Id,
            'inStatus': me.Statu['接单'],
            'key': 'getAccept'
          };
          me.setStatus({parms: parms, srNum: me.srNumber});
        }
      },
      cancel(val) {                    // 日历取消事件
        this.showBox2 = false;
        console.log(val);
      },
      enter(val) {                     // 日历确定
        let me = this;
          // 判断开始结束时间
        if (val.Time1.time && val.Time2.time) {
          if (val.Time1.key <= val.Time2.key) {
            me.starTime = val.Time1.time;
            me.endTime = val.Time2.time;
          } else {
            me.starTime = val.Time2.time;
            me.endTime = val.Time1.time;
          }
          // 转换时间格式
          me.starTime = new Date(val.selectDay + ' ' + me.starTime + ':00').format('MM/dd/yyyy hh:mm:ss');
          me.endTime = new Date(val.selectDay + ' ' + me.endTime + ':00').format('MM/dd/yyyy hh:mm:ss');
          if (me.BtnStatu === 'status2') {
            let parms = {
              'Object Id': me.ServiceRequest.Id,
              'ActivityId': me.Action.Id,
              'inStatus': me.Statu['预约'],
              'starTime': me.starTime,
              'endTime': me.endTime,
              'key': 'getAppoint'
            };
            me.setStatus({parms: parms, srNum: me.srNumber});
          }
          me.showBox2 = false;
          me.callEnd = false;
        } else {
          MessageBox({
            title: '提示',
            message: '请选择预约开始和结束时间！'
          });
        }
      },
      callSolve() {
        let me = this;
        MessageBox.confirm('远程电话沟通客户已解决，确认提交？', '').then(action => {
          let obj = {
            srId: me.ServiceRequest['Id'],
            actionId: me.Action['Id'],
            closeMsg: '工程师电话解决'
          };
          me.getCloseReason(obj);
          me.$router.go(-1);
        });
      },
      clickPosition(value1) {
        let me = this;
        let parms = {};
        let statu = me.Action['Status'];
        if (value1 === 'setOut') {
          KND.Native.getLocation({
            success(data) {
              me.getMapAddress({
                LngLat: data,
                type: 'starAddress'
              });
            }
          });
          parms = {
            'Object Id': me.ServiceRequest.Id,
            'ActivityId': me.Action.Id,
            'key': 'getDepart',
            'KL Departure Location': me.starAddress ? me.starAddress : '出发地址',
            'type': 'setOut'
          };
        } else if (value1 === 'reach') {
          KND.Native.getLocation({
            success(data) {
              console.log(data);
              me.getMapAddress({
                LngLat: data,
                type: 'visitAddress'
              });
            }
          });
          parms = {
            'Object Id': me.ServiceRequest.Id,
            'ActivityId': me.Action.Id,
            'key': 'getDepart',
            'MeetingLocation': me.visitAddress ? me.visitAddress : '上门地址',
            'type': 'reach'
          };
        } else if (value1 === 'end') {
          KND.Native.getLocation({
            success(data) {
              console.log(data);
              me.getMapAddress({
                LngLat: data,
                type: 'endAddress'
              });
            }
          });
          parms = {
            'Object Id': me.ServiceRequest.Id,
            'ActivityId': me.Action.Id,
            'key': 'getDone',
            'DoneLoc': me.endAddress ? me.endAddress : '完成地址'
          };
          me.popupVisible1 = !me.popupVisible1;
        }
        if ((value1 === 'setOut' && statu === '已预约') || (value1 === 'reach' && statu === '已出发') || (value1 === 'end' && statu === '已上门')) {
          me.setStatus({parms: parms, srNum: me.srNumber});
        }
        if (value1 === 'failureRecord') {
          this.$router.push({
            name: 'saveFault',
            query: {
              id: this.ServiceRequest['Id']
            }
          });
        }
        if (value1 === 'comEnter') {
          this.$router.push({
            name: 'comEnter',
            query: {
              id: this.ServiceRequest['Id'],
              statu: this.ServiceRequest['Status']
            }
          });
        }
      },
      moreOrder() {
        let me = this;
        let params = {
          parentId: me.ServiceRequest['Id'],
          contactId: me.ServiceRequest['Contact Id'],
          lastName: me.ServiceRequest['Contact Last Name'],
          locationId: me.ServiceRequest['Personal Location Id'],
          srNumber: me.ServiceRequest['SR Number']
        };
        me.addChildService(params);
      },
      fillIn(key) {
        let me = this;
        me.$router.push({
          name: 'comEnter',
          query: {
            id: me[key]['Id'],
            type: 'save'
          }
        });
      },
      childCom(child) {
        let me = this;
        me.$router.push({
          name: 'comEnter',
          query: {
            id: child['Id'],
            type: 'child'
          }
        });
      },
      childRecord(child) {
        let me = this;
        me.$router.push({
          name: 'saveFault',
          query: {
            id: child['Id']
          }
        });
      },
      changeMy() {              // 主管接单
        let me = this;
        MessageBox.confirm('确认维修责任人更新为你吗？', '提示').then(action => {
          let params = {
            id: me.ServiceRequest['Id'],
            empId: me.loginMeg['Id'],
            empFullName: me.loginMeg['KL Employee Full Name'],
            type: 'Dispatch',
            srNum: me.ServiceRequest['SR Number']
          };
          me.setContact(params);
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
          name: 'engineer',
          query: {
            id: this.ServiceRequest['Id']
          }
        });
      }
    },
    components: {close, dateControl, toggle, cusCall}
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
  .marginB{
    margin-bottom: 40px;
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
        font-size: $font-size-default;
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
        font-size: $font-size-default;
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
                font-size: 0.75rem;
              }
              .mt-Detail-info{
                div{
                  line-height: 1.5rem;
                  .detail-call{
                    @include remove-decoration();
                  }
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
            width: 5rem;
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
  .record-title{
    line-height: 1.5rem;
    font-size: $font-size-large;
    background-color: $bg-cancel;
  }
  .failure-record{
    list-style: none;
    padding-left: 1rem;
    li{
      line-height: 1.5rem;
    };
  }
  .enter-order {
    display: flex;
    margin-top: 10px;
    div{
     width: 25%;
      text-align: center;
    }
  }
</style>
