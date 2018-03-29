<template>
  <div>
    <mt-header fixed title="安装订单详情">
      <fallback slot="left"></fallback>
    </mt-header>
    <div class="mint-content mint-content-datail">
        <div class="readonly">
          <mt-field label="订单编码" :value="detailData['Order Number']"></mt-field>
          <mt-field label="项目名称" :value="detailData['KL Agreement Opportunity Name']"></mt-field>
          <mt-field label="销售类型" :value="detailData['KL Delivery Sales Type']"></mt-field>
          <mt-field label="安装数量" :value="detailData['KL Install Amount'] || 0"></mt-field>
          <div slot="title" class="mint-content-div"><div class="mint-content-xt" @click="butXttd">协同团队</div></div>
      </div>
      <toggle>
        <div style="height: 0.5rem;background: #eaeaea;"></div>
        <div class="mint-content-info" style="padding-bottom: 50px;">

          <div class="lock-line">
            <lock-line title="锁体" @click="toLineFn(undefined, 'Lock Body')">
              <mt-cell-swipe v-for="(line, index) in taskDataST" class="lock-line-cell enable" ref="body"
                             v-if="line['KL Product Type LIC']==='Lock Body'"
                             @click.native="toLineFn(line)"
                             :key="line['Id']"
                             :right="getSwipeBtn(line, index)"
                             is-link>
                <div class="co-flex co-jc" slot="title">
                  <span v-show="isConfirming" class="co-f1 icon-copy" @click.stop="copyFn(line)"></span>
                  <span class="co-f2">{{line['KL Product Series Code']}}</span>
                  <span class="co-f2">开向:{{line['KL Hole Direction']}}</span>
                  <span class="co-f2">数量:{{line['Quantity Requested']}}</span>
                </div>
              </mt-cell-swipe>
            </lock-line>
            <lock-line title="面板" @click="toLineFn(undefined, 'Panel')">
              <mt-cell-swipe v-for="(line, index) in taskDataST" class="lock-line-cell enable" ref="panel"
                             v-if="line['KL Product Type LIC'] === 'Panel'"
                             @click.native="toLineFn(line)"
                             :key="line['Id']"
                             :right="getSwipeBtn(line, index)"
                             is-link>
                <div class="co-flex co-jc" slot="title">
                  <span v-show="isConfirming" class="co-f1 icon-copy" @click.stop="copyFn(line)"></span>
                  <span class="co-f2">{{line['KL Product Series Code']}}</span>
                  <span class="co-f2">开向:{{line['KL Hole Direction']}}</span>
                  <span class="co-f2">数量:{{line['Quantity Requested']}}</span>
                </div>
              </mt-cell-swipe>
            </lock-line>
          </div>

        </div>
      </toggle>
      <div style="height: 0.5rem;background: #eaeaea;"></div>
      <div v-show="!isConfirming">
        <div class="content-lc" style="margin-top: 15px">
          <div class="stage_li">
            <div  class="mui-scroll-wrapper mui-segmented-control" style="height: 72px;">
              <div class="mui-scroll" style="height: 65px;overflow: -webkit-paged-x;">
                <a v-for="(item, index) in taskData"  :key="index">
                  <div class="icon" @click="updateState(item['Calculated Activity Status'], item.Id, index)">
                    <span v-show="index!=0"  class="left line" :class="colorClass(item['Calculated Activity Status'])"></span>
                    <span class="point mui-icon" :class="colorClass(item['Calculated Activity Status'])"><span></span></span>
                    <span  class="right line" :class="colorClass(item['Calculated Activity Status'])"></span>
                  </div>
                  <div class="name" :class="colorClass(item['Calculated Activity Status'])" @click="updateTask(index)">{{item['KL Detail Type']}}</div>
                </a>
                <!--<a>
                  <div class="icon" @click="getClose()">
                    <span class="left line p_grey"></span>
                    <span class="point mui-icon p_grey"><span></span></span>

                  </div>
                  <div class="name p_grey">关闭</div>
                </a>-->
              </div>
            </div>
          </div>
        </div>
        <div class="mint-content-info">
          <empty v-show="!taskDataList.length"></empty>
          <div class="crm-zyList" v-for="(taskData, index) in taskDataList" :key="index">
            <ul class="content" @click="routerPage(index, taskData, '')">
              <li class="bd-radius">
                <span class="icon"></span>
              </li>
              <li style="margin-right: 8px">{{taskData['KL Detail Type']}}</li>
              <li style="margin-right: 8px"
                  v-if="taskData['KL Detail Type LIC'] === 'Trompil Lock Sign' ||
                 taskData['KL Detail Type LIC'] === 'Working Drawing Sign' ||
                 (taskData['KL Detail Type LIC'] === 'Ship From Door Factory' && taskData['Calculated Activity Status'] != 'Not Started') ||
                 taskData['KL Detail Type LIC'] === 'Lock Body Sign' ||
                 taskData['KL Detail Type LIC'] === 'Substitution Lock Sign' ||
                taskData['KL Detail Type LIC'] === 'Lock Sign' ||
                taskData['KL Detail Type LIC'] === 'Substitution Lock Trans Return'">
                <span>{{taskData['Planned Completion']}}</span>
                <span>{{taskData.Status}}</span>
              </li>
              <div class="butLi" v-if="taskData['KL Detail Type LIC']==='Trompil Batch Summary' ||
            taskData['KL Detail Type LIC']==='Lock Body Install Summary' ||
            taskData['KL Detail Type LIC']==='Door Hanging Acc Batch' ||
            taskData['KL Detail Type LIC'] === 'Substitution Lock Inst Summary' ||
            taskData['KL Detail Type LIC'] === 'Subst Lock Trans Summary' ||
            taskData['KL Detail Type LIC'] === 'Lock Installation Summary' ||
            taskData['KL Detail Type LIC'] === 'Check Before Trans Summary' ||
            taskData['KL Detail Type LIC'] === 'Transfer Summary'" >
                <span @click.stop="closeTask(taskData)" class="batchClose"></span>
                <span @click.stop="addTask(taskData)" class="batchAdd"></span>
              </div>
              <li style="margin-right: 8px" v-if="taskData['KL Detail Type LIC'] === 'Ship From Door Factory' && taskData['Calculated Activity Status'] === 'Not Started'">
                <span class="mt-switch"><mt-switch v-model="shipmentVal"  @click.native.stop="shipment(taskData)"></mt-switch></span>
              </li>
              <div class="content-div"  v-if="taskData['KL Detail Type LIC']==='Trompil Batch Summary' ||
            taskData['KL Detail Type LIC']==='Lock Body Install Summary' ||
            taskData['KL Detail Type LIC']==='Door Hanging Acc Batch' ||
            taskData['KL Detail Type LIC'] === 'Substitution Lock Inst Summary' ||
            taskData['KL Detail Type LIC'] === 'Subst Lock Trans Summary' ||
            taskData['KL Detail Type LIC'] === 'Lock Installation Summary' ||
            taskData['KL Detail Type LIC'] === 'Check Before Trans Summary' ||
            taskData['KL Detail Type LIC'] === 'Transfer Summary'" v-for="(itemTask, index) in upList(taskData['KL Installation Task'])" :key="index" @click.stop="updateDoor(itemTask,taskData)">
                <div class="readonly">
                  <mt-field label="批次" class="itemTaskId" :value="itemTask.Id"  @click.native.stop="taskClick(itemTask,taskData)"></mt-field>
                  <mt-field label="已完成/计划数量"  class="itemTask" v-if="taskData['KL Detail Type LIC'] === 'Trompil Batch Summary' ||
          taskData['KL Detail Type LIC'] === 'Lock Body Install Summary' ||
          taskData['KL Detail Type LIC'] === 'Substitution Lock Inst Summary' ||
          taskData['KL Detail Type LIC'] === 'Subst Lock Trans Summary' ||
          taskData['KL Detail Type LIC'] === 'Lock Installation Summary' ||
          taskData['KL Detail Type LIC'] === 'Transfer Summary'" :value="taskData['KL Completed Install Amount']+'/'+taskData['KL Install Amount Requested']"><span @click.stop="closeTask(itemTask)" class="batchClose"></span></mt-field>
                  <mt-field label="合格/计划数量" v-if="taskData['KL Detail Type LIC']==='Door Hanging Acc Batch' ||
            taskData['KL Detail Type LIC'] === 'Check Before Trans Summary'" :value="taskData['KL Qualified Amount']+'/'+taskData['KL Spot Check Amount']"></mt-field>
                  <mt-field label="时间" :value="new Date(itemTask['Planned Completion']).format('yyyy-MM-dd')"></mt-field>
                  <mt-field label="状态" :value="itemTask.Status"></mt-field>
                </div>
              </div>
            </ul>
          </div>
        </div>
      </div>

      <button-group v-show="isConfirming">
        <mt-button @click.native="submitFn">确认提交</mt-button>
      </button-group>
    </div>
  </div>
</template>
<style lang="scss">
  .mint-content-datail {
    /*.mint-cell-wrapper {
      font-size: 0.7rem!important;
    }*/
    background: white;
    .mint-cell-title {
    }
    .list-text-span {
      color: #a9acb1;
      margin-right: 0.5rem;
    }
    .mint-content-xl {
      text-align: center;
      color: #0772c1;
      font-size: 0.15rem;
    }
    .xl::before {
      font-family: "mintui";
      content: '\E601';
      font-size: 1rem;
    }
    .mint-content-div {
      width: 98%;
      height: 30px;
      margin-top: 5px;
      text-align: right;
    }
    .mint-content-xt {
      border: 1px solid #cccccc;
      padding: 0.45rem 0.5rem;
      width: 3rem;
      display: initial;
      text-align: center;
      border-radius: 0.25rem;
      color: #0772c1;
      font-size: 0.65rem;
    }
    .mint-sx-div {
      margin-left: 0.5rem;
    }

    /*流程*/
    .crm-zyList {
      overflow: hidden;
    }
    .crm-zyList ul {
      padding-left: 0;
    }
    .crm-zyList ul li {
      list-style: none;
    }
    .crm-zyList ul .butLi {
      position: absolute;
      right: 0px;
      top: 0px;
      line-height: 27px;
      width: 100px;
      height: 27px;
    }
    .crm-zyList ul .butLi span {
      display: inline-block;
      text-align: center;
      width: 45px;
      font-size: 14px !important;
      color: #999 !important;
    }
    .batchClose::before {
      font-family: "kinlong-icon" !important;
      font-style: normal;
      font-size: 1rem;
      content: '\A152';
      color: red;
    }
     .itemTask .batchClose {
       position: absolute;
       width: 45px;
       right: -15px;
       top: -22px;
       text-align: center;
    }
    .butLi .batchAdd::before{
      font-family: "kinlong-icon" !important;
      font-style: normal;
      font-size: 1rem;
      content: '\A153';
      color: #356DFC;
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
    .crm-zyList .icon {
      border-radius: 26px;
      background: #8bc17c;
      color: #fff;
      padding: 1px 7px;
      margin-left: 13px;
      font-size: 12px;
      top: 10px;
    }
    .crm-zyList .content :nth-of-type(2) {
      font-size: 14px;
      margin-top: 5px;
      color: #999;
      line-height: 27px;
    }
    .content li {
      height: 27px;
    }
    .content li span {
      font-size: 14px;
      margin-top: 5px;
      color: #999;
      line-height: 27px;
    }
    .content li :nth-of-type(2), .mt-switch {
      position: absolute;
      top: 23px;
      right: 10px;
    }
    .content-div {
      border: 1px solid #81B92C;
      border-radius: 5px;
      padding: 10px;
      font-size: 0.5rem;
      margin-bottom: 10px;
    }
    /*横线滚动*/
    .stage_li {
      width: 100%;
      position: relative;
    }

    .stage_li > p.title {
      margin: 0;
      padding: 16px 0 17px 15px;
      color: #333;
      font-size: 15px;
      line-height: 15px;
    }

    .stage_li > span.bu_stage {
      position: absolute;
      top: 10px;
      right: 10px;
      color: #d61518;
      font-size: 14px;
      padding-right: 15px;
    }

    .stage_li > span.bu_stage > span {
      font-size: 12px;
      line-height: 20px;
      position: absolute;
      right: 0;
    }

    .stage_li > .mui-scroll-wrapper a {
      display: inline-block !important;
      margin: 0 !important;
      height: 50px;
      width: 74px;
    }

    .stage_li > .mui-scroll-wrapper a > div {
      text-align: center;
    }

    .stage_li > .mui-scroll-wrapper a > div.date {
      font-size: 10px;
      color: #777;
      line-height: 10px;
    }

    .stage_li > .mui-scroll-wrapper a > div.icon {
      height: 28px;
      padding: 7px 0;
      position: relative;
    }

    .stage_li > .mui-scroll-wrapper a > div.icon > span.point {
      width: 14px;
      height: 14px;
      background: #8bc17c;
      border-radius: 7px;
      -webkit-border-radius: 7px;
      -moz-border-radius: 7px;
      font-size: 8px;
      position: absolute;
      left: 30px;
    }

    .stage_li > .mui-scroll-wrapper a > div.icon > span.point > span {
      position: absolute;
      width: 12px;
      height: 12px;
      background: #8bc17c;
      border-radius: 6px;
      -webkit-border-radius: 6px;
      -moz-border-radius: 6px;
      top: 1px;
      left: 1px;
    }

    .stage_li > .mui-scroll-wrapper a > div.icon > span.close {
      background: #d61518 !important;
    }
    .stage_li > .mui-scroll-wrapper a > div.icon > span.approval {
      background: #0772c1 !important;
    }

    .stage_li > .mui-scroll-wrapper a > div.icon > span.close > span {
      background: #fff;
    }

    .stage_li > .mui-scroll-wrapper a > div.icon > span.close > span:before {
      color: #d61518;
      position: absolute;
      top: 2px;
      left: 2px;
      font-size: 8px;
    }
    .stage_li > .mui-scroll-wrapper a > div.icon > span.approval > span {
      background: #0772c1;
    }

    .stage_li > .mui-scroll-wrapper a > div.icon > span.approval > span:before {
      color: #0772c1;
      position: absolute;
      top: 2px;
      left: 2px;
      font-size: 8px;
    }

    .stage_li > .mui-scroll-wrapper a > div.icon > span.finish > span:before {
      content: "\A131";
      color: #8bc17c;
      position: absolute;
      top: 2px;
      left: 1px;
    }

    .stage_li > .mui-scroll-wrapper a > div.icon > span.present {
      background: #8bc17c;
    }

    .stage_li > .mui-scroll-wrapper a > div.icon > span.present > span {
      background: #fff;
    }

    .stage_li > .mui-scroll-wrapper a > div.icon > span.p_grey {
      background: #efefef;
    }

    .stage_li > .mui-scroll-wrapper a > div.icon > span.p_grey > span {
      background: #efefef;
    }

    .stage_li > .mui-scroll-wrapper a > div.icon > span.p_grey {
      background: #efefef !important;
    }

    .stage_li > .mui-scroll-wrapper a > div.icon > span.line {
      position: absolute;
      width: 30px;
      height: 2px;
      display: inline-block;
      background: #8bc17c;
      top: 13px;
    }

    .stage_li > .mui-scroll-wrapper a > div.icon > span.left {
      left: 0;
    }

    .stage_li > .mui-scroll-wrapper a > div.icon > span.right {
      right: 0;
    }

    .stage_li > .mui-scroll-wrapper a > div.name {
      font-size: 12px;
      color: #333;
      line-height: 12px;
    }

    .stage_li > .mui-scroll-wrapper a > div.present {
      color: #8bc17c;
      margin: 0px 6px 0px 6px;
      padding-bottom: 10px;
      border-bottom: 1px solid #0772c1;
    }

    .stage_li > .mui-scroll-wrapper a > div.close {
      color: #d61518;
    }
    .stage_li > .mui-scroll-wrapper a > div.approval {
      color: #0772c1;
    }

    .stage_li > .mui-scroll-wrapper a > div.p_grey {
      color: #cccccc;
    }
    .itemTaskId .mint-cell-value input {
      color: #0772c1;
    }

  }
</style>
<script type="application/javascript">
  import {mapState, mapActions, mapMutations} from 'vuex';
  import api from '../api/api';
  import { MessageBox, Toast } from 'mint-ui';
  import toggle from 'public/components/cus-toggle';
  import lockLine from '../../transferOrder/components/cusLockLine';
  let userInfo = {};
  const NameSpace = 'detail';
  export default {
    name: 'detail',
    components: {toggle, lockLine},
    created() {
      let me = this;
      me.id = me.$route.query.id;
      api.get({
        key: 'getDetail',
        method: 'POST',
        data: {
          'body': {
            'OutputIntObjectName': 'Base Order Entry (Sales)',
            // 'OutputIntObjectName': 'KL Order Sales',
            'SearchSpec': '[Order Entry - Orders.Id]=' + '\'' + me.id + '\''
            // 'SearchSpec': '[Order Entry - Orders.Id]="1-2BSATYIN"'
          }
        },
        success: function(data) {
          console.dir(data.SiebelMessage);
          me.detailData = data.SiebelMessage['Order Entry - Orders'];
          var taskData = me.detailData['KL Installation Task'];
          if (taskData) {
            me.taskData = KND.Util.toArray(taskData);
            console.dir(me.taskData);
            me.pStatus = me.taskData[0]['Calculated Activity Status'];
            if (me.pStatus !== 'Not Started') { // 未开始时不获取子任务数据
              me.taskDataList = KND.Util.toArray(me.taskData[0]['KL Installation Task']);
            }
          }
          me.setTaskDataST(KND.Util.toArray(me.detailData['Order Entry - Line Items']));
          console.dir(me.taskDataST);
        }
      });
      KND.Native.getUserInfo((info) => {
        userInfo = info;
        console.log(userInfo);
      });
    },
    data: () => {
      return {
        type: 'read', // add 新增 / edit 编辑 / read 只读
        id: '',
        detailData: {}, // 详情整体数据
        taskData: '', // 任务集
        taskDataList: '', // 任务集子任务
        pStatus: '', // 父状态
        // is_show_sx: false, // 是否显示面板锁体
        shipmentVal: false, // 发运开关，判断值
        active: 'tab-container'
      };
    },
    computed: {
      ...mapState(NameSpace, ['taskDataST']),
      isConfirming() {
        return this.detailData.Status === '门厂工程师确认中';
      }
    },
    beforeRouteEnter(to, from, next) {
      console.dir(2);
      next(vm => {
        let query = vm.$route.query;
        console.dir(query);
      });
    },
    methods: {
      ...mapMutations('batch', ['clear']),
      ...mapMutations(NameSpace, ['setTaskDataST']),
      ...mapActions(NameSpace, ['getTaskType', 'deleteOrderLine']),
      colorClass(cla) {
        var colorCla = '';
        if (cla === 'Not Started') { // 未开始
          colorCla = 'p_grey';
        } else if (cla === 'In Progress') { // 进行中
          colorCla = 'close';
        } else if (cla === '') { // 审批中
          colorCla = 'approval';
        } else if (cla === 'Completed') { // 完成
          colorCla = 'present';
        }
        return colorCla;
      },
      upList(obj) {
        return KND.Util.toArray(obj);
      },
      updateTask(index) { // 点击任务切换子任务
        let me = this;
        me.taskDataList = [];
        me.pStatus = me.taskData[index]['Calculated Activity Status'];
        if (me.pStatus !== 'Not Started') { // 未开始时不获取子任务数据
          me.taskDataList = KND.Util.toArray(me.taskData[index]['KL Installation Task']);
          console.dir(me.taskDataList);
          if (me.taskDataList.length === 0) {
            me.taskDataList = KND.Util.toArray(me.taskData[index]);
          }
        }
      },
      getClose() { // 关闭整个任务
        let self = this;
        api.get({ // 更改状态
          key: 'getUPStatus',
          method: 'POST',
          data: {
            'body': {
              'ProcessName': 'KL Install Task Close Action Workflow',
              'RowId': self.id
            }
          },
          success: function(data) {
          }
        });
      },
      /* is_show_fun() { // 是否显示锁体面板
        var self = this;
        if (self.is_show_sx) {
          self.is_show_sx = false;
        } else {
          self.is_show_sx = true;
        }
      },*/
      butXttd() { // 跳转协同团队
        let me = this;
        this.$router.push({
          name: 'xttd',
          query: {
            id: me.id,
            userInfo: userInfo
          }
        });
      },
      updateState(status, id, index) { // 任务事件 ；1.还没开始先开始 ； 2.已开始就跳转关闭页面
        var self = this;
        if (status === 'Not Started') {
        // if (index === 0) {
          console.dir('===');
          MessageBox({
            title: '提示',
            message: ' 确认开始进行?',
            showCancelButton: true
          }).then(action => {
            if (action === 'confirm') {
              console.log('abc');
              api.get({
                key: 'getTaskAdd',
                method: 'POST',
                data: {
                  'body': {
                    'ProcessName': 'KL Install Task Start Action Workflow',
                    'RowId': id
                  }

                },
                success: function(data) {
                  Toast({
                    message: '已发起安装替代锁申请，销售审批通过后进行安装。',
                    duration: 5000
                  });
                }
              });
            }
          });
        } else {
          self.$router.push('updateState');
          // 跳转关闭页面更新状态
          this.$router.push({
            name: 'updateState',
            query: {
              id: id
            }
          });
        }
      },
      /*
      * 任务中所有门厂发运
      * */
      shipment(item) {
        var self = this;
        if (self.shipmentVal) {
          return;
        }
        MessageBox({
          title: '提示',
          message: ' 确认提交？数据提交后不可修改。',
          showCancelButton: true
        }).then(action => {
          if (action === 'confirm') {
            api.get({ // 更改按钮状态
              key: 'getUPStatus',
              method: 'POST',
              data: {
                'body': {
                  'ProcessName': 'KL Install Task Submit For Approval Workflow',
                  'RowId': item.Id
                }
              },
              success: function(data) {
              }
            });
          } else {
            self.shipmentVal = false;
          }
        });
      },
      addTask(item) {
        console.dir('0');
        var self = this;
        var itemTask = KND.Util.toArray(item['KL Installation Task'])[0];
        self.getTaskType(itemTask);
        if (item['KL Detail Type LIC'] === 'Lock Installation Summary') { // 真锁批次新增
          if (self.detailData['KL Delivery Sales Type'] === '工程') { // 真锁---工程
            // 跳转真锁安装批次新增页面
            this.$router.push({
              name: 'zsBatch',
              query: {
                type: 'add',
                item: item
              }
            });
          } else { // 真锁---零星
            // 跳转真锁安装批次新增页面
            this.$router.push({
              name: 'sporadic',
              query: {
                type: 'add',
                item: item
              }
            });
          }
        } else if (item['KL Detail Type LIC'] === 'Substitution Lock Inst Summary') { // 替代锁批次
          // 跳转真锁安装批次新增页面
          this.$router.push({
            name: 'zsBatch',
            query: {
              type: 'add',
              item: item
            }
          });
        } else {
          // 跳转统一批次新增页面
          self.clear();
          this.$router.push({
            name: 'batch',
            query: {
              type: 'add',
              item: item
            }
          });
        }
      },
      closeTask(item) { // 关闭当前批次
        console.dir(item);
        var self = this;
        self.$router.push('updateState');
        // 跳转关闭页面更新状态
        this.$router.push({
          name: 'updateState',
          query: {
            id: item.Id
          }
        });
        /*
        api.get({ // 更改状态
          key: 'getUPStatus',
          method: 'POST',
          data: {
            'body': {
              'ProcessName': 'KL Install Task Close Action Workflow',
              'RowId': item.Id
            }
          },
          success: function(data) {
          }
        });*/
      },
      routerPage(index, item, state) { // 子任务事件
        var self = this;
        // 子任务跳转页面
        /*
        * 根据KL Detail Type LIC 判断跳转页面
        * Trompil Lock Sign 开孔锁签收
        * Working Drawing Sign 开孔图纸签收
        * Lock Body Sign 锁体安装签收
        * Substitution Lock Sign 替代锁到货确认
        * Lock Sign 真锁到货
        * Substitution Lock Trans Return 替代锁回收
        * */
        if (item['KL Detail Type LIC'] === 'Trompil Lock Sign' ||
          item['KL Detail Type LIC'] === 'Working Drawing Sign' ||
          item['KL Detail Type LIC'] === 'Lock Body Sign' ||
          item['KL Detail Type LIC'] === 'Substitution Lock Sign' ||
          item['KL Detail Type LIC'] === 'Lock Sign' ||
          item['KL Detail Type LIC'] === 'Substitution Lock Trans Return') {  // 签收页面
          if (userInfo['Person UId'] === item['Primary Owner Id'] && item['Calculated Activity Status'] === 'Not Started') { // 有权限新增
            this.$router.push({ // 新增
              name: 'sign',
              query: {
                type: 'add',
                state: state,
                is_edit: false,
                item: item
              }
            });
          } else if (userInfo['Person UId'] === item['Primary Owner Id'] && (item['Calculated Activity Status'] === 'Completed' || self.pStatus === 'In Progress')) { // 判断是否有权限编辑   登陆者信息与任务负责人匹配 并且状态在进行中已完成则可以编辑
            if ((item['KL Detail Type LIC'] === 'Trompil Lock Sign' || item['KL Detail Type LIC'] === 'Working Drawing Sign') && !item['KL Signed Amount']) { // 开孔签收与图纸签证 不涉及签收不需要查看详情
              console.dir('===');
            } else {
              this.$router.push({ // 编辑
                name: 'sign',
                query: {
                  type: 'read',
                  state: state,
                  is_edit: true,
                  item: item
                }
              });
            }
          } else if (item['Calculated Activity Status'] !== 'Not Started') {
            if ((item['KL Detail Type LIC'] === 'Trompil Lock Sign' || item['KL Detail Type LIC'] === 'Working Drawing Sign') && !item['KL Signed Amount']) { // 开孔签收与图纸签证 不涉及签收不需要查看详情
              console.dir('===');
            } else {
              this.$router.push({ // 只读
                name: 'sign',
                query: {
                  type: 'read',
                  state: state,
                  is_edit: false,
                  item: item
                }
              });
            }
          }
          /* if (item['Calculated Activity Status'] === 'Completed' || item['Calculated Activity Status'] === 'Ignore' || userInfo['Person UId'] !== item['Primary Owner Id'] || self.pStatus !== 'In Progress') { // Completed = 完成 ，Ignore = 忽略
          } else {
          }*/
        } else if (item['KL Detail Type LIC'] === 'Trompil Batch Summary' ||
          item['KL Detail Type LIC'] === 'Lock Body Install Summary' ||
          item['KL Detail Type LIC'] === 'Door Hanging Acc Batch' ||
          item['KL Detail Type LIC'] === 'Substitution Lock Inst Summary' ||
          item['KL Detail Type LIC'] === 'Subst Lock Trans Summary' ||
          item['KL Detail Type LIC'] === 'Lock Installation Summary' ||
          item['KL Detail Type LIC'] === 'Check Before Trans Summary' ||
          item['KL Detail Type LIC'] === 'Transfer Summary') { // 批次页面
          /*
          * Trompil Batch Summary 开孔锁批次
          * Lock Body Install Summary 锁体安装汇总
          * Door Hanging Acc Batch 挂门验收批次
          * Substitution Lock Inst Summary  替代锁安装汇总
          * Subst Lock Trans Summary 替代锁移交
          * Lock Installation Summary 真锁安装汇总
          * Check Before Trans Summary 移交前自检汇总
          * Transfer Summary 移交汇总
          * */
         // self.$router.push('batch');
          this.$router.push({
            name: 'batchDetail',
            query: {
              type: 'read',
              Id: item.Id
            }
          });
        }
      },
      taskClick(item, fItem) { // 子任务数据集事件
        // 跳转批次详情、编辑
        //  && (item['Calculated Activity Status'] === 'Draft' || item['Calculated Activity Status'] === 'Rejected')
        if (userInfo['Person UId'] === item['Primary Owner Id'] && (item['Calculated Activity Status'] === 'Planning' || item['Calculated Activity Status'] === 'Rejected')) { // 草稿=Planning(设定计划)、驳回状态=Rejected 要编辑提交 并且有权限的人才可做此操作
          this.clear();
          var itemTask = KND.Util.toArray(fItem['KL Installation Task'])[0];
          this.getTaskType(itemTask);
          this.$router.push({ // 编辑
            name: 'batch',
            query: {
              type: 'edit',
              item: item
            }
          });
        } else {
          this.$router.push({
            name: 'batchDetail',
            query: {
              type: 'read',
              Id: item.Id
            }
          });
        }
      },
      updateDoor(item, fItem) {
        var self = this;
        var typePage = ''; // 区分跳转什么更新页面 updateDoor/updateDoorNext
        // 根据状态跳转更新还是日志页面
        if (item['Calculated Activity Status'] === 'Completed') { // 已完成=Completed、已忽略=Ignore 跳转日志不能再修改
          if (fItem['KL Detail Type LIC'] === 'Lock Installation Summary') { // 真锁批次 完成状态先跳转日志   日志页面与其他日志页面不共用
            self.$router.push({
              name: 'journalLIS',
              query: {
                id: item.Id,
                fItem: fItem,
                type: false // 是否可以更新
              }
            });
          } else { // 其他批次都是跳转 更新页面
            if (fItem['KL Detail Type LIC'] === 'Subst Lock Trans Summary' || fItem['KL Detail Type LIC'] === 'Check Before Trans Summary') {
              typePage = 'updateDoorNext';
            } else {
              typePage = 'updateDoor';
            }
            self.$router.push({
              name: 'journal',
              query: {
                id: item.Id,
                fItem: fItem,
                type: typePage
              }
            });
          }
        } else { // 更新 只有状态进行中=In Progress、审批通过=Approved 是责任人才能更新
          // 详情
          if (fItem['KL Detail Type LIC'] === 'Lock Installation Summary') { // 真锁批次 编辑跳转日志  判断日志页面有没有权限更新
            var is_deit = false;
            if (userInfo['Person UId'] === item['Primary Owner Id'] && (item['Calculated Activity Status'] === 'In Progress' || item['Calculated Activity Status'] === 'Approved')) {
              is_deit = true;
            }
            self.$router.push({
              name: 'journalLIS',
              query: {
                id: item.Id,
                fItem: fItem,
                type: is_deit // 是否可以更新
              }
            });
          } else { // 其他批次的更新 统一
            if (userInfo['Person UId'] === item['Primary Owner Id'] && (item['Calculated Activity Status'] === 'In Progress' || item['Calculated Activity Status'] === 'Approved')) { // 当前登录人与批次负责人相等并且状态是进行中才能更新
              if (fItem['KL Detail Type LIC'] === 'Subst Lock Trans Summary' || fItem['KL Detail Type LIC'] === 'Check Before Trans Summary') {
                self.$router.push({
                  name: 'updateDoorNext',
                  query: {
                    type: 'add',
                    id: item.Id
                  }
                });
              } else {
                self.$router.push({
                  name: 'updateDoor',
                  query: {
                    type: 'add',
                    fItem: fItem,
                    id: item.Id
                  }
                });
              }
            } else { // 没有权限更新和不是负责人只能看日志
              if (fItem['KL Detail Type LIC'] === 'Subst Lock Trans Summary' || fItem['KL Detail Type LIC'] === 'Check Before Trans Summary') {
                typePage = 'updateDoorNext';
              } else {
                typePage = 'updateDoor';
              }
              self.$router.push({
                name: 'journal',
                query: {
                  id: item.Id,
                  fItem: fItem,
                  type: typePage
                }
              });
            }
          }

        }
      },
      // 提交安装订单
      submitFn() {
        api.get({
          key: 'submit',
          data: {
            id: this.detailData.Id
          },
          success(data) {
            tools.success(data, {
              back: true,
              successTips: '提交成功'
            });
          }
        });
      },

      // 右滑删除
      getSwipeBtn(line, index) {
        return true ? [{
          content: '删除',
          style: { background: 'red', color: '#fff', 'font-size': '15px', 'line-height': '54px' },
          handler: () => this.deleteFn(line, index)
        }] : [];
      },
      // 订单行
      toLineFn(line = {}, type) {
        let me = this;
        let order = me.detailData;
        console.log(order);
        // 是否面板
        let isPanel = (line['KL Product Type LIC'] || type) === 'Panel';
        // 填充订单id，保存编辑行时需要
        line['Order Header Id'] = order.Id;
        me.$router.push({
          path: 'orderLine',
          query: {
            line: JSON.stringify(line),
            isPanel: isPanel,
            editable: me.isConfirming // this.editable
          }
        });
      },
      // Delete Install Order Line
      deleteFn(line, index) {
        this.deleteOrderLine({
          id: line.Id,
          index: index
        });
      },
      // Copy line
      copyFn(line) {
        MessageBox.confirm('复制此订单行记录？', '请确认').then(action => {
          let isPanel = line['KL Product Type LIC'] === 'Panel';
          delete line.Id;
          this.$router.push({
            path: 'orderLine',
            query: {
              line: JSON.stringify(line),
              isPanel: isPanel,
              editable: true
            }
          });
        });
      }
    }
  };
</script>
