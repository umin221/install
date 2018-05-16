<template>
  <div>
    <div class="service-continer">
      <mt-header fixed :title="headTitle" >
        <fallback slot="left"></fallback>
        <mt-button  slot="right"
                     @click.native="openConfirm"
                     v-if="role === 'install'&& BtnStatu">关闭</mt-button>
      </mt-header>


      <div class="mint-content service-detail">
        <div class="detail-title">
          <div class="mt-Detail-title"><span class="label-title">服务单编号</span>{{ServiceRequest['SR Number']}}<span class="user-state">{{Action['Status']}}</span></div>
          <div class="mt-Detail-title"><span class="label-title">联系电话</span>
            <a href="javascript:void(0);"
               class="detail-call i"
               @click="call = !call">
              <i class="xs-icon icon-call"
                 style="font-size: 0.75rem">
                {{ServiceRequest['KL Contact Mobile Phone']||ServiceRequest['Contact Business Phone']}}
              </i>
            </a></div>
          <div v-if="role === 'install'" class="mt-Detail-title" ><span class="label-title">优先级</span>{{ServiceRequest['Priority']}}</div>
          <div class="mt-Detail-title"><span class="label-title">联系人</span>{{ServiceRequest['Contact Last Name']}}</div>
          <div v-if="role === 'custom'"   class="mt-Detail-title"><span class="label-title"> 服务类型</span>{{ServiceRequest['SR Type']}}</div>
        </div>
        <div class="detail-content">
          <mt-navbar v-model="active">
            <mt-tab-item v-for="tab in tabList" :id="tab.id" :key="tab.id">{{tab.name}}</mt-tab-item>
          </mt-navbar>
          <mt-tab-container v-model="active">
            <mt-tab-container-item id="tab-container1" class="marginB">
              <div class="mt-Detail-info">
                <div><span>客户预约时间</span>{{toDate(ServiceRequest['KL Customer Appointment Time'])}}</div>
                <!--<div><span>实际预约时间</span>{{toDate(Action['Planned'])}}</div>-->
                <div><span>用户故障说明</span>{{ServiceRequest['Sub-Area']}}</div>
                <div><span>产品条形码</span><a href="javascript:void(0);" class="detail-call">{{ServiceRequest['KL SN']}}</a></div>
                <div><span>产品型号</span>{{ServiceRequest['KL Lock Body Model']}} {{ServiceRequest['KL Lock Model']}}</div>
                <div><span>申请时间</span>{{toDate(ServiceRequest['Created'])}}</div>
                <div><span>地址</span>{{ServiceRequest['KL Province']}}
                  {{ServiceRequest['KL City']}}
                  {{ServiceRequest['KL Town']}}
                  {{ServiceRequest['KL Address']}}
                </div>
                <div><span>问题说明</span>
                  <p class="Description">
                    {{ServiceRequest['Description']||ServiceRequest['Complaint Description']}}
                  </p>
                  <!--Complaint Description-->
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
              <toggle v-if="allChildService.length"
                      v-for="(item, index) in allChildService"
                      :type="true"
                      :key="item.Id"
                      :label="item['SR Number']">
                <div>
                  <toggle :title="false"
                          label="故障记录"
                          @ck="showAttach({id:item.Id, index:index, type:'Problem Record',len:ProblemRecord[index].list.length})">
                    <ul class="failure-record">
                      <li><span>产品序列号</span>{{item['KL SN']}}</li>
                      <!--<li>详细地址：-->
                        <!--{{ServiceRequest['KL Province']}}-->
                        <!--{{ServiceRequest['KL City']}}-->
                        <!--{{ServiceRequest['KL Town']}}-->
                        <!--{{ServiceRequest['KL Address']}}-->
                      <!--</li>-->
                      <li><span>产品类型</span>{{item['KL Product Model']}}</li>
                      <li><span>故障描述</span>{{item['KL Responsbility']}}</li>
                      <li><span>故障现象</span>{{item['SR Rootcause']}}</li>
                      <attach ioName="KL Service Request Attachment IO" ref="attach"
                              :attach="ProblemRecord[index].list"
                              :edit="ProblemRecord[index].edit"
                              :title="ProblemRecord[index].title">
                      </attach>
                    </ul>
                  </toggle>
                  <toggle :title="false"
                          label="完工确认单"
                          @ck="showAttach({id:item.Id, index:index, type:'Job Sheet',len:JobSheet[index].list.length})">
                    <empty v-show="!item['KL Child SR Order']"></empty>
                    <div v-if="item['KL Child SR Order']">
                      <div class="enter-order">
                        <div>保修期</div>
                        <div>产品名称</div>
                        <div>数量</div>
                      </div>
                      <div class="enter-order"
                           v-for="(oItem, index) in childItem(item['KL Child SR Order']['KL Child SR Order Item'])"
                           :key="index"
                           v-if="item['KL Child SR Order']['KL Child SR Order Item']">
                        <div>{{oItem['KL Warranty Flag'] === "Y" ? '保内': '保外'}}</div>
                        <div>{{oItem['KL Product Name Join']}}</div>
                        <div>{{oItem['Quantity Requested']}}</div>
                      </div>
                      <div class="enter-order">
                        <div>总金额：{{item['KL Child SR Order']['Order Total']}}</div>
                      </div>
                      <attach ioName="KL Service Request Attachment IO" ref="attach"
                              :attach="JobSheet[index].list"
                              :edit="JobSheet[index].edit"
                              :title="JobSheet[index].title">
                      </attach>
                    </div>
                  </toggle>
                </div>
              </toggle>
              <toggle
                v-if="ServiceRequest['Action']"
                :type="true"
                :label="ServiceRequest['SR Number']">
                <div>
                  <toggle :title="false"
                          label="故障记录">
                    <ul class="failure-record">
                      <li><span>产品序列号</span>{{ServiceRequest['KL SN']}}</li>
                      <li><span>详细地址</span>
                        {{ServiceRequest['KL Province']}}
                        {{ServiceRequest['KL City']}}
                        {{ServiceRequest['KL Town']}}
                        {{ServiceRequest['KL Address']}}
                      </li>
                      <li><span>产品类型</span>{{ServiceRequest['KL Product Model']}}</li>
                      <li><span>故障描述</span>{{ServiceRequest['KL Responsbility']}}</li>
                      <li><span>故障现象</span>{{ServiceRequest['SR Rootcause']}}</li>
                      <attach ioName="KL Service Request Attachment IO" ref="attach"
                              :attach="attach1.list"
                              :edit="attach1.edit"
                              :title="attach1.title">
                      </attach>
                    </ul>
                  </toggle>
                  <toggle :title="false" label="完工确认单">
                    <empty v-show="!ServiceRequest['Order Entry - Orders']"></empty>
                    <div v-if="ServiceRequest['Order Entry - Orders']">
                      <div class="enter-order">
                        <div>保修期</div>
                        <div>产品名称</div>
                        <div>数量</div>
                      </div>
                      <div v-if="orderEntry['Order Entry - Line Items']">
                        <div  v-for="(item, index) in orderEntryItem">
                          <div class="enter-order">
                            <div>{{item['KL Warranty Flag'] === "Y" ? "保内": "保外"}}</div>
                            <div>{{item['KL Product Name Join']}}</div>
                            <div>{{item['Quantity Requested']}}</div>
                          </div>
                        </div>
                      </div>
                      <div class="enter-order">
                        <div>总金额：{{orderEntry['Order Total']}}</div>
                      </div>
                      <attach ioName="KL Service Request Attachment IO" ref="attach"
                              :attach="attach2.list"
                              :edit="attach2.edit"
                              :title="attach2.title">
                      </attach>
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
                    <div>{{toDate(item.Created)}}</div>
                  </div>
                </ul>
              </div>
            </mt-tab-container-item>
          </mt-tab-container>
        </div>
      </div>

      <!--客服派单按钮-->
      <button-group v-if="role === 'custom'&& BtnStatu === 'status4'">
        <mt-button class="single"
                   @click.native="toContact" >派单</mt-button>
      </button-group>

      <!--工程师接单按钮-->
      <button-group v-if="role === 'install'">
        <mt-button v-show="BtnStatu === 'status1'&& !callEnd"
                   class="single"
                   @click.native="changeBtnStote">电话联系客户</mt-button>
        <div v-show="BtnStatu === 'status2' || callEnd"
             class="callPlan">
          <mt-button   class="single flax" type="primary"
                       @click.native="callSolve" >电话已解决</mt-button>
          <mt-button  class="single flax"
                      @click.native="clickShow"  >预约维修计划</mt-button></div>
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
      <cus-call :number="ServiceRequest['KL Contact Mobile Phone']||ServiceRequest['Contact Business Phone']" v-model="call"></cus-call>

      <!--工单操作-->
      <mt-popup v-model="popupVisible1" position="bottom" popup-transition="popup-fade" class="mint-popup-2">
        <mt-cell class="setOut xs-icon icon-setout addralgin" title="出发" :value="Action['KL Departure Location']" >
          <mt-button v-if="Action['Status INT']==='Appointed'&&!clickStatus" @click.native="clickPosition('setOut')">签到</mt-button>
          <mt-spinner v-if="Action['Status INT']==='Appointed'&&clickStatus"
                      style="margin-right: 1.7rem;"
                      type="fading-circle"
                      color="#26a2ff"></mt-spinner>
        </mt-cell>
        <mt-cell class="xs-icon icon-reach addralgin" title="到达" :value="Action['MeetingLocation']">
          <mt-button v-if="Action['Status INT']==='Departed'&&!clickStatus2" @click="clickPosition('reach')">签到</mt-button>
          <mt-button v-else-if="Action['Status INT']==='Appointed'" style="background: gainsboro">签到</mt-button>
          <mt-spinner v-if="Action['Status INT']==='Departed'&&clickStatus2"
                      style="margin-right: 1.7rem;"
                      type="fading-circle"
                      color="#26a2ff"></mt-spinner>
        </mt-cell>

        <!--工单操作 记录故障-->
<!--        <mt-cell class="xs-icon icon-saver" title="记录故障">
          <div v-if="!ServiceRequest['KL Child Service Request']">
            <mt-button v-if="Action['Status INT']==='Arrived'&& ServiceRequest['SR Rootcause']"
                       @click="fillIn('ServiceRequest')">已填写</mt-button>
            <mt-button v-else-if="Action['Status INT']==='Arrived' && !ServiceRequest['SR Rootcause']"
                       @click="clickPosition('comEnter')">填写</mt-button>
            <mt-button v-else style="background: gainsboro">填写</mt-button>
          </div>
          <div v-else>
            <mt-button v-if="childService['SR Rootcause']"
                       @click="fillIn('childService')">已填写</mt-button>
            <mt-button v-else
              @click.native="childCom(childService)">填写</mt-button>
          </div>
        </mt-cell>-->

        <!--工单操作 完工确认-->
<!--        <mt-cell class="xs-icon icon-finish" title="完工确认">
          <div v-if="!ServiceRequest['KL Child Service Request']">
            <mt-button v-if="Action['Status INT']==='Arrived'&& ServiceRequest['SR Rootcause'] && !ServiceRequest['KL Parent SR Complete Flag']"
                       @click.native="clickPosition('failureRecord')">填写</mt-button>
            <mt-button v-else-if="ServiceRequest['KL Parent SR Complete Flag']"
                       @click.native="moreOrder">再记一单</mt-button>
            <mt-button v-else style="background: gainsboro">填写</mt-button>
          </div>
          <div v-else>
            <mt-button v-if="childService['SR Rootcause'] && childService['KL Status LIC'] !== 'Completed'"
                       @click.native="childRecord(childService)">填写</mt-button>
            <mt-button v-else-if="childService['KL Status LIC'] === 'Completed'"
                       @click.native="moreOrder">再记一单</mt-button>
            <mt-button v-else style="background: gainsboro">填写</mt-button>
          </div>
        </mt-cell>-->

        <!--工单操作 结束-->
<!--        <mt-cell class="completeEnd xs-icon icon-ending" title="结束">
          <div v-if="!ServiceRequest['KL Child Service Request']">
            <mt-button v-if="ServiceRequest['KL Parent SR Complete Flag']"
                       @click.native="clickPosition('end')">确认</mt-button>
            <mt-button v-else style="background: gainsboro">确认</mt-button>
          </div>
          <div v-else>
            <mt-button v-if="childService['KL Status LIC'] === 'Completed'"
                       @click.native="clickPosition('end')">确认</mt-button>
            <mt-button v-else style="background: gainsboro">确认</mt-button>
          </div>
        </mt-cell>-->

        <div class="work-order">
          <!--子服务请求-->
          <div class="child-work-order"
                v-for="(item, index) in allChildService">
            <!--子服务请求标题-->
            <sr-title :srNum="item['SR Number']"
                      :name="item['Contact Last Name']"
                      :iscomple="item['KL Status LIC'] === 'Completed'"></sr-title>
            <!--子服务请求 记录故障-->
            <div v-if="item['KL Status LIC'] !== 'Completed'">
              <mt-cell class="xs-icon icon-saver" title="记录故障">
                <mt-button v-if="Action['Status INT']==='Arrived'&& item['SR Rootcause']"
                           @click="fillIn(item.Id)">已填写</mt-button>
                <mt-button v-else-if="Action['Status INT']==='Arrived' && !item['SR Rootcause']"
                           @click="childCom(item)">填写</mt-button>
                <mt-button v-else style="background: gainsboro">填写</mt-button>
              </mt-cell>
              <!--子服务请求 完工确认-->
              <mt-cell class="xs-icon icon-finish" title="完工确认">
                <mt-button v-if="Action['Status INT']==='Arrived'&& item['SR Rootcause']"
                           @click.native="childRecord(item)">填写</mt-button>
                <mt-button v-else style="background: gainsboro">填写</mt-button>
              </mt-cell>
            </div>
          </div>

          <!--父服务请求标题-->
          <sr-title :srNum="ServiceRequest['SR Number']"
                    :name="ServiceRequest['Contact Last Name']"
                    :iscomple="ServiceRequest['KL Parent SR Complete Flag'] === 'Y'"></sr-title>
          <!--父服务请求-->
          <div class="parent-work-order" v-if="!ServiceRequest['KL Parent SR Complete Flag']">
            <!--父服务请求 记录故障-->
            <mt-cell class="xs-icon icon-saver" title="记录故障">
              <mt-button v-if="Action['Status INT']==='Arrived'&& ServiceRequest['SR Rootcause']"
                         @click="fillIn(ServiceRequest.Id)">已填写</mt-button>
              <mt-button v-else-if="Action['Status INT']==='Arrived' && !ServiceRequest['SR Rootcause']"
                         @click="clickPosition('comEnter')">填写</mt-button>
              <mt-button v-else style="background: gainsboro">填写</mt-button>
            </mt-cell>
            <!--父服务请求 完工确认-->
            <mt-cell class="xs-icon icon-finish" title="完工确认">
              <mt-button v-if="Action['Status INT']==='Arrived'&& ServiceRequest['SR Rootcause'] && !ServiceRequest['KL Parent SR Complete Flag']"
                         @click.native="clickPosition('failureRecord')">填写</mt-button>
              <mt-button v-else style="background: gainsboro">填写</mt-button>
            </mt-cell>
          </div>
        </div>
        <!--再记一单&&结束工单-->
        <mt-cell class="completeEnd">
          <mt-button @click.native="moreOrder" style="margin-right: 1rem;">再记一单</mt-button>
          <mt-button v-if="Action['Status INT']==='Arrived'"
                      @click.native="clickPosition('end')">结束</mt-button>
          <mt-button v-else style="background: gainsboro">确认</mt-button>
        </mt-cell>
        <div class="cancelHandle"
             style="color: red;"
             @click="popupVisible1 = !popupVisible1">取消</div>
      </mt-popup>
    </div>
  </div>
</template>
<script>
  import {mapState, mapActions, mapMutations} from 'vuex';
  import { Toast } from 'mint-ui';
  import close from '../components/close';
  import cusCall from 'public/components/cus-call';
  import toggle from '../components/detail-toggle';
  import dateControl from '../components/dateControl';
  import srTitle from '../components/srOrder-title';
  // name
  const NameSpace = 'detail';
  //
  let geocoder = null;
   // 经纬度转换地址
  const getAaaress = (function() {
    return function(callback) {
      KND.Native.getLocation({
        success(data) {
          let newLatitude = data.latitude;
          let newLongitude = data.longitude;
          geocoder = new qq.maps.Geocoder({
            complete: function(result) {
              console.log(result);
              let addtess = result.detail.addressComponents;
              let addrDetail = addtess.province + addtess.city + addtess.district + addtess.town + addtess.village + addtess.street + addtess.streetNumber;
              callback(addrDetail);
            }
          });
          let latLng = new qq.maps.LatLng(newLatitude, newLongitude);
          geocoder.getAddress(latLng);
        }
      });
    };
  })();
  //
  export default {
    name: NameSpace,
    created() {
      // 调用获取位置方法
      let me = this;
      me.srNumber = me.$route.query.type;
      me.getDetail(me.srNumber);
      me.setRole({meg: me.loginMeg, role: me.role});
      me.queryMedias({
        data: {
          'IOName': 'KL Service Request Attachment IO',
          'SearchSpec': {
            'Service Request Attachment.Activity Id': me.$route.query.srId
          }
        },
        success: data => {
          let attach = KND.Util.toArray(data['SiebelMessage']['Service Request Attachment']);
          if (attach) {
            for (let i = 0; i < attach.length; i++) {
              if (attach[i]['KL SR Att Type'] === '客户上传附件') {
                me.attach.list.push(attach[i]);
              }
              if (attach[i]['KL SR Att Type'] === '故障问题记录') {
                me.attach1.list.push(attach[i]);
              }
              if (attach[i]['KL SR Att Type'] === '维修单据') {
                me.attach2.list.push(attach[i]);
              }
            }
          }
        }
      });
      let list = KND.Session.get('popupVisible');
      if (list) {
        me.popupVisible1 = true;
        KND.Session.remove('popupVisible');
      }
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
        clickStatus: false,
        clickStatus2: false,
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
        },
        attach2: { // 完工确认 附件
          list: [],
          edit: false,
          title: '附件：维修单据存档'
        }
      };
    },
    computed: {
      ...mapState('index', ['loginMeg', 'role']),
      ...mapState(NameSpace, ['ServiceRequest', 'Action', 'processDate', 'Statu', 'BtnStatu', 'ProblemRecord', 'JobSheet', 'tabList', 'orderEntry', 'orderEntryItem', 'childService', 'allChildService'])
    },
    methods: {
      ...mapActions('app', ['upload', 'queryMedias']),
      ...mapActions(NameSpace, ['getDetail', 'getCloseReason', 'setStatus', 'setContact', 'getMapAddress', 'addChildService']),
      ...mapMutations(NameSpace, ['setRole', 'setAttachs']),
      ...mapMutations('saveFault', ['initSelect']),
      toDate(time) {
        if (time) {
          return KND.Util.format(time, 'yyyy-MM-dd hh:mm:ss');
        } else {
          return '';
        }
      },
      childItem(item) {
        return KND.Util.toArray(item);
      },
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
        let myDate = new Date().format('MM/dd/yyyy hh:mm:ss');
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
          if (myDate > me.starTime) {
            Toast('预约时间必须大于当前时间');
            me.showBox2 = false;
            return;
          }
          if (me.BtnStatu === 'status2') {
            let parms = {
              'Object Id': me.ServiceRequest.Id,
              'ActivityId': me.Action.Id,
              'inStatus': me.Statu['预约'],
              'starTime': me.starTime,
              'endTime': me.endTime,
              'key': 'getAppoint'
            };
            me.setStatus({
              parms: parms,
              srNum: me.srNumber,
              callback: data => {
                Toast('预约成功');
              },
              error: data => {
                Toast(data);
              }
            });
          }
          me.showBox2 = false;
          me.callEnd = false;
        } else {
          Toast('请选择预约开始和结束时间');
          me.showBox2 = false;
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
        if (value1 === 'setOut') {
          me.clickStatus = true;
          getAaaress(function(data) {
            parms = {
              'Object Id': me.ServiceRequest.Id,
              'ActivityId': me.Action.Id,
              'key': 'getDepart',
              'type': 'setOut',
              'KL Departure Location': data || '出发地址'
            };
            me.setStatus({
              parms: parms,
              srNum: me.srNumber,
              error: data => {
                Toast(data);
                me.clickStatus = false;
              }
            });
          });
//          parms = {
//            'Object Id': me.ServiceRequest.Id,
//            'ActivityId': me.Action.Id,
//            'key': 'getDepart',
//            'type': 'setOut',
//            'KL Departure Location': '出发地址'
//          };
//          me.setStatus({parms: parms, srNum: me.srNumber});
        } else if (value1 === 'reach') {
          me.clickStatus2 = true;
          getAaaress(function(data) {
            console.log(data);
            parms = {
              'Object Id': me.ServiceRequest.Id,
              'ActivityId': me.Action.Id,
              'key': 'getDepart',
              'type': 'reach',
              'MeetingLocation': data || '上门地址'
            };
            me.setStatus({
              parms: parms,
              srNum: me.srNumber,
              error: data => {
                Toast(data);
                me.clickStatus2 = false;
              }});
          });
//          parms = {
//            'Object Id': me.ServiceRequest.Id,
//            'ActivityId': me.Action.Id,
//            'key': 'getDepart',
//            'type': 'reach',
//            'MeetingLocation': '上门地址'
//          };
//          me.setStatus({parms: parms, srNum: me.srNumber});
        } else if (value1 === 'end') {
          getAaaress(function(data) {
            console.log(data);
            parms = {
              'Object Id': me.ServiceRequest.Id,
              'ActivityId': me.Action.Id,
              'key': 'getDone',
              'DoneLoc': data || '完成地址'
            };
            me.setStatus({parms: parms, srNum: me.srNumber});
            me.popupVisible1 = !me.popupVisible1;
          });
//          parms = {
//            'Object Id': me.ServiceRequest.Id,
//            'ActivityId': me.Action.Id,
//            'key': 'getDone',
//            'DoneLoc': '完成地址'
//          };
//          me.setStatus({parms: parms, srNum: me.srNumber});
        }
        if (value1 === 'failureRecord') {
          this.initSelect();
          this.$router.push({
            name: 'saveFault',
            query: {
              Service: this.ServiceRequest,
              id: this.ServiceRequest.Id,
              type: 'parent',
              name: 'serviceDetail'
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
        MessageBox.confirm('新建后无法删除，是否再记一单', '提示').then(action => {
          let me = this;
          let params = {
            parentId: me.ServiceRequest['Id'],
            contactId: me.ServiceRequest['Contact Id'],
            lastName: me.ServiceRequest['Contact Last Name'],
            locationId: me.ServiceRequest['Personal Location Id'],
            srNumber: me.ServiceRequest['SR Number']
          };
          me.addChildService(params);
        });
      },
      fillIn(id) {
        let me = this;
        me.$router.push({
          name: 'comEnter',
          query: {
            id: id,
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
        me.initSelect();
        me.$router.push({
          name: 'saveFault',
          query: {
            Service: child,
            id: child.Id,
            type: 'child',
            name: 'serviceDetail'
          }
        });
      },
//      changeMy() {              // 主管接单
//        let me = this;
//        MessageBox.confirm('确认维修责任人更新为你吗？', '提示').then(action => {
//          let params = {
//            id: me.ServiceRequest['Id'],
//            empId: me.loginMeg['Id'],
//            empFullName: me.loginMeg['KL Employee Full Name'],
//            type: 'Dispatch',
//            srNum: me.ServiceRequest['SR Number']
//          };
//          me.setContact(params);
//        });
//      },
//      completeEnd() {
//        MessageBox({
//          title: '提示',
//          message: '维修完成您辛苦了！'
//        });
//      },
      toContact() {
        this.$router.push({
          name: 'engineer',
          query: {
            id: this.ServiceRequest['Id']
          }
        });
      },
      showAttach(form) {
        let me = this;
        let arr = [];
        console.log(form.len);
        if (!form.len) {
          me.queryMedias({
            data: {
              'IOName': 'KL Service Request Attachment IO',
              'SearchSpec': {
                'Service Request Attachment.Activity Id': form.id,
                'Service Request Attachment.KL SR Att Type': 'LookupValue("KL_SR_ATT_TYPE", "' + form.type + '")'
              }
            },
            success: data => {
              arr = KND.Util.toArray(data['SiebelMessage']['Service Request Attachment']);
              form.type = form.type.replace(/\s+/g, '');
              me.setAttachs({
                index: form.index,
                data: arr,
                type: form.type
              });
            }
          });
        }
      }
    },
    components: {close, dateControl, toggle, cusCall, srTitle}
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
    padding: 0!important;
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
          .label-title{
            display: inline-block;
            width: 5rem;
            color: grey;
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
                padding-left: 0.5rem;
                div{
                  line-height: 1.5rem;
                  span{
                    display: inline-block;
                    width: 5rem;
                    font-size: 0.7rem;
                    color: gray;
                  }
                  .detail-call{
                    @include remove-decoration();
                  }
                  .Description{
                    width: 100%;
                    height: auto;
                    word-wrap: break-word;
                    word-break: break-all;
                    overflow: hidden;
                    font-size: 0.75rem;
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
      width: 100%;
      background-color: white !important;
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
            /*border-radius: 0.6rem;*/
          }
        }
      }
      .work-order{
        max-height: 12rem;
        overflow: auto;
        .parent-work-order{
        }
      }
      .setOut{
        /*border-radius: 0.5rem 0.5rem 0 0;*/
      }
      .completeEnd{
        .mint-cell-wrapper{
          .mint-cell-value{
            width: 100%;
            -webkit-justify-content: center;
            justify-content:center;
            -moz-box-pack: center;
            -webkit--moz-box-pack:center;
            box-pack:center;
          }
        }
        /*border-radius: 0 0 0.5rem 0.5rem;*/
      }
      .cancelHandle{
        line-height: 2.5rem;
        text-align: center;
        border-top: 1px solid gainsboro;
        background-color: #ffffff;
        /*margin: 0.5rem 0;*/
        /*border-radius: 0.5rem;*/
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
      font-size: 0.65rem;
      span{
        display: inline-block;
        width: 4rem;
        color: grey;
      }
    };
  }
  .enter-order {
    display: flex;
    margin-top: 10px;
    font-size: 0.65rem;
    div{
     width: 25%;
      text-align: center;
    }
  }
  .icon-setout>.mint-cell-wrapper:before{
    content: '\A159';
    margin-right: 10px;
    color: $theme-color;
  }
  .icon-reach>.mint-cell-wrapper:before{
    content: '\A160';
    margin-right: 12px;
    color: $theme-color;
    font-size: 25px;
  }
  .icon-saver>.mint-cell-wrapper:before{
    content: '\A161';
    margin-right: 10px;
    color: $theme-color;
    font-size: 22px;
  }
  .icon-finish>.mint-cell-wrapper:before{
    content: '\A162';
    margin-right: 10px;
    color: $theme-color;
    font-size: 24px;
  }
  .icon-ending>.mint-cell-wrapper:before{
    content: '\A163';
    margin-right: 11px;
    color: $theme-color;
    font-size: 24px;
  }
  .addralgin>.mint-cell-wrapper>.mint-cell-title>span{
    display: block;
    width: 60px;
  }
  .addralgin>.mint-cell-wrapper>.mint-cell-value>span{
    line-height: 17px;
  }
</style>
