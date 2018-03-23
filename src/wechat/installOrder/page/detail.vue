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
        <div class="mint-content-info">
          <mt-cell>
            <div slot="title" class="list-text"><span class="list-text-span">面板部分</span></div>
          </mt-cell>
          <div class="mint-sx-div">
            <mt-cell   @click.native="getLock(item.Id, item['KL Product Type'], item)" is-link v-for="item in taskDataST" :key="item.id" v-if="item['KL Product Type']=='面板'"  :title="item['KL Product Series Code']">
              <span style="width: 120px">开向：{{item['KL Hole Direction']}}</span>
              <span>数量：{{item['Quantity Requested']}}</span>
            </mt-cell>
          </div>
          <mt-cell>
            <div slot="title" class="list-text"><span class="list-text-span">锁体部分* 真锁</span></div>
          </mt-cell>
          <div class="mint-sx-div">
            <mt-cell  @click.native="getLock(item.Id, item['KL Product Type'], item)" is-link v-for="item in taskDataST" :key="item.id" v-if="item['KL Product Type']=='锁体'"  :title="item['KL Product Series Code']">
              <span style="width: 120px">开向：{{item['KL Hole Direction']}}</span>
              <span>数量：{{item['Quantity Requested']}}</span>
            </mt-cell>
          </div>
        </div>
      </toggle>
      <div style="height: 0.5rem;background: #eaeaea;"></div>
      <div class="content-lc" style="margin-top: 15px">
        <div class="stage_li">
          <div  class="mui-scroll-wrapper mui-segmented-control" style="height: 72px;">
            <div class="mui-scroll" style="height: 65px;overflow: -webkit-paged-x;">
              <a v-for="(item, index) in taskData"  :key="index">
                <div class="icon" @click="updateState(item.Status, item.Id, index)">
                  <span v-show="index!=0"  class="left line l_grey"></span>
                  <span class="point mui-icon"><span></span></span>
                  <span  class="right line l_grey"></span>
<!--
                  <span v-if="item.length!= index" class="right mui-icon l_grey"></span>
-->
                </div>
                <div class="name present" @click="updateTask(index)">{{item['KL Detail Type']}}</div>
              </a>
              <a>
                <div class="icon" @click="getClose()">
                  <span class="left line l_grey"></span>
                  <span class="point mui-icon p_grey"><span></span></span>

                </div>
                <div class="name grey">关闭</div>
              </a>
              <!--<a>
                <div class="icon">

                  <span class="point mui-icon"><span></span></span>
                  <span class="right line l_grey"></span>
                </div>
                <div class="name present">2222
                </div>
              </a><a>
              <div class="icon">
                <span class="left line l_grey"></span>
                <span class="point mui-icon p_grey"><span></span></span>
                <span class="right line l_grey"></span>
              </div>
              <div class="name grey">
                投标阶段
              </div>
            </a>
              <a>
              <div class="icon">
                <span class="left line l_grey"></span>
                <span class="point mui-icon close"><span></span></span>
                <span class="right line l_grey"></span>
              </div>
              <div class="name grey">
                投标阶段
              </div>
            </a>
              <a>
              <div class="icon">
                <span class="left line l_grey"></span>
                <span class="point mui-icon p_grey"><span></span></span>

              </div>
              <div class="name grey">
                商务谈判
              </div>
            </a>-->
            </div>
          </div>
        </div>
      </div>
      <div class="mint-content-info">
        <empty v-show="!taskDataList.length"></empty>
        <div class="crm-zyList" v-for="(item, index) in taskDataList" :key="index">
          <ul class="content" @click="routerPage(index, item, '')">
            <li class="bd-radius">
              <span class="icon"></span>
            </li>
            <li style="margin-right: 8px">{{item['KL Detail Type']}}</li>
            <li style="margin-right: 8px"
                v-if="item['KL Detail Type LIC'] === 'Trompil Lock Sign' ||
                 item['KL Detail Type LIC'] === 'Working Drawing Sign' ||
                 (item['KL Detail Type LIC'] === 'Ship From Door Factory' && item['Calculated Activity Status'] != 'Not Started') ||
                 item['KL Detail Type LIC'] === 'Lock Body Sign' ||
                 item['KL Detail Type LIC'] === 'Substitution Lock Sign' ||
                item['KL Detail Type LIC'] === 'Lock Sign' ||
                item['KL Detail Type LIC'] === 'Substitution Lock Trans Return'">
              <span>{{item['Planned Completion']}}</span>
              <span>{{item.Status}}</span>
            </li>
            <div class="butLi" v-if="item['KL Detail Type LIC']==='Trompil Batch Summary' ||
            item['KL Detail Type LIC']==='Lock Body Install Summary' ||
            item['KL Detail Type LIC']==='Door Hanging Acc Batch' ||
            item['KL Detail Type LIC'] === 'Substitution Lock Inst Summary' ||
            item['KL Detail Type LIC'] === 'Subst Lock Trans Summary' ||
            item['KL Detail Type LIC'] === 'Lock Installation Summary' ||
            item['KL Detail Type LIC'] === 'Check Before Trans Summary' ||
            item['KL Detail Type LIC'] === 'Transfer Summary'" >
              <span @click.stop="closeTask(item)" class="batchClose"></span>
              <span @click.stop="addTask(item)" class="batchAdd"></span>
            </div>
            <li style="margin-right: 8px" v-if="item['KL Detail Type LIC'] === 'Ship From Door Factory' && item['Calculated Activity Status'] === 'Not Started'">
              <span class="mt-switch"><mt-switch v-model="shipmentVal"  @click.native.stop="shipment(item)"></mt-switch></span>
            </li>
            <div class="content-div"  v-if="item['KL Detail Type LIC']==='Trompil Batch Summary' ||
            item['KL Detail Type LIC']==='Lock Body Install Summary' ||
            item['KL Detail Type LIC']==='Door Hanging Acc Batch' ||
            item['KL Detail Type LIC'] === 'Substitution Lock Inst Summary' ||
            item['KL Detail Type LIC'] === 'Subst Lock Trans Summary' ||
            item['KL Detail Type LIC'] === 'Lock Installation Summary' ||
            item['KL Detail Type LIC'] === 'Check Before Trans Summary' ||
            item['KL Detail Type LIC'] === 'Transfer Summary'" v-for="(itemTask, index) in upList(item['KL Installation Task'])" :key="index" @click.stop="updateDoor(itemTask,item)">
              <div class="readonly">
                <mt-field label="批次" class="itemTaskId" :value="itemTask.Id"  @click.native.stop="taskClick(itemTask)"></mt-field>
                <mt-field label="已完成/计划数量"  class="itemTask" v-if="item['KL Detail Type LIC'] === 'Trompil Batch Summary' ||
          item['KL Detail Type LIC'] === 'Lock Body Install Summary' ||
          item['KL Detail Type LIC'] === 'Substitution Lock Inst Summary' ||
          item['KL Detail Type LIC'] === 'Subst Lock Trans Summary' ||
          item['KL Detail Type LIC'] === 'Lock Installation Summary' ||
          item['KL Detail Type LIC'] === 'Transfer Summary'" :value="item['KL Completed Install Amount']+'/'+item['KL Install Amount Requested']"><span @click.stop="closeTask(itemTask)" class="batchClose"></span></mt-field>
                <mt-field label="合格/计划数量" v-if="item['KL Detail Type LIC']==='Door Hanging Acc Batch' ||
            item['KL Detail Type LIC'] === 'Check Before Trans Summary'" :value="item['KL Qualified Amount']+'/'+item['KL Spot Check Amount']"></mt-field>
                <mt-field label="时间" :value="new Date(itemTask['Planned Completion']).format('yyyy-MM-dd')"></mt-field>
                <mt-field label="状态" :value="itemTask.Status"></mt-field>
               </div>
            </div>
          </ul>
        </div>
      </div>
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
      font-size: 0.15rem;
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
      width: 60px;
      height: 27px;
    }
    .crm-zyList ul .butLi span {
      display: inline-block;
      text-align: center;
      width: 25px;
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
      position: relative;
       width: 25px;
      right: -9px;
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

    .stage_li > .mui-scroll-wrapper a > div.icon > span.l_grey {
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

    .stage_li > .mui-scroll-wrapper a > div.grey {
      color: #cccccc;
    }
    .itemTaskId .mint-cell-value input {
      color: #0772c1;
    }

  }
</style>
<script type="application/javascript">
  import api from '../api/api';
  import { MessageBox, Toast } from 'mint-ui';
  import toggle from 'public/components/cus-toggle';
  let userInfo = {};
  export default {
    name: 'detail',
    components: {toggle},
    created() {
      let me = this;
      me.id = me.$route.query.id;
      api.get({
        key: 'getDetail',
        method: 'POST',
        data: {
          'body': {
            // 'OutputIntObjectName': 'Base Order Entry (Sales)',
            'OutputIntObjectName': 'KL Order Sales',
            'SearchSpec': '[Order Entry - Orders.Id]=' + '\'' + me.id + '\''
            // 'SearchSpec': '[Order Entry - Orders.Id]="1-2BSATYIN"'
          }
        },
        success: function(data) {
          console.dir(data.SiebelMessage);
          me.detailData = data.SiebelMessage['Order Entry - Orders'];
          me.taskData = KND.Util.toArray(me.detailData['KL Installation Task']);
          console.dir(me.taskData);
          me.pStatus = me.taskData[0]['Calculated Activity Status'];
          if (me.pStatus !== 'Not Started') { // 未开始时不获取子任务数据
            me.taskDataList = KND.Util.toArray(me.taskData[0]['KL Installation Task']);
          }
          me.taskDataST = KND.Util.toArray(me.detailData['Order Entry - Line Items']);
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
        detailData: '', // 详情整体数据
        taskData: '', // 任务集
        taskDataList: '', // 任务集子任务
        taskDataST: '', // 面板锁体
        pStatus: '', // 父状态
        // is_show_sx: false, // 是否显示面板锁体
        shipmentVal: false, // 发运开关，判断值
        active: 'tab-container'
      };
    },
    beforeRouteEnter(to, from, next) {
      console.dir(2);
      next(vm => {
        let query = vm.$route.query;
        console.dir(query);
      });
    },
    methods: {
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
      getLock(id, type, item) { // 面板锁体详情事件
        // 跳转面板锁体详情
        this.$router.push({
          name: 'lock',
          query: {
            id: id,
            type: type,
            item: item
          }
        });
      },
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
        if (status === '未开始') {
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
        if (item['KL Detail Type LIC'] === 'Lock Installation Summary') { // 真锁批次新增
          if (self.detailData['KL Delivery Sales Type'] !== '工程') { // 真锁---工程
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
        });
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
          if (item['Calculated Activity Status'] === 'Completed' || item['Calculated Activity Status'] === 'Ignore' || userInfo['Person UId'] !== item['Primary Owner Id'] || self.pStatus !== 'In Progress') { // Completed = 完成 ，Ignore = 忽略
            /* if (userInfo['Person UId'] === item['Primary Owner Id']) { // 判断是否有权限编辑   登陆者信息与任务负责人匹配则可以编辑
              this.$router.push({ // 编辑
                name: 'sign',
                query: {
                  type: 'edit',
                  item: item
                }
              });
            } else {*/
            this.$router.push({ // 只读
              name: 'sign',
              query: {
                type: 'read',
                state: state,
                item: item
              }
            });
            // }
          } else {
            this.$router.push({ // 新增
              name: 'sign',
              query: {
                type: 'add',
                state: state,
                item: item
              }
            });
          }
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
        }
      },
      taskClick(item) { // 子任务数据集事件
        // 跳转批次详情、编辑
        this.$router.push({
          name: 'batch',
          query: {
            type: 'edit',
            item: item
          }
        });
      },
      updateDoor(item, fItem) {
        var self = this;
        var typePage = ''; // 区分跳转什么更新页面 updateDoor/updateDoorNext
        // 根据状态跳转更新还是日志页面
        if (item['Calculated Activity Status'] === 'Completed') { // 已完成 跳转日志
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
        } else { // 更新 只有状态进行中 是责任人才能更新
          // 详情
          if (fItem['KL Detail Type LIC'] === 'Lock Installation Summary') { // 真锁批次 编辑跳转日志  判断日志页面有没有权限更新
            var is_deit = false;
            if (userInfo['Person UId'] === item['Primary Owner Id'] && item['Calculated Activity Status'] === 'In Progress') {
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
            if (userInfo['Person UId'] === item['Primary Owner Id'] && item['Calculated Activity Status'] === 'In Progress') { // 当前登录人与批次负责人相等并且状态是进行中才能更新
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
      }
    }
  };
</script>
