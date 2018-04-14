<template>
  <div>
    <mt-header fixed :title="titleVal">
      <fallback slot="left"></fallback>
      <mt-button @click.native="toSaveFn(2)" slot="right" v-text="">保存</mt-button>
    </mt-header>
    <div class="mint-content batch" :class="{'disable': !editable}">
      <div>
        <mt-cell title="批次">
          <span>{{batchCode}}</span>
        </mt-cell>
        <cus-field label="计划开始日期" tag="计划开始日期"
                   @click.native="open('picker')"
                   v-model="start_Date"
                   v-valid.require
                   is-link></cus-field>
        <cus-field label="计划完成日期" tag="计划完成日期"
                  @click.native="open('pickerEnd')"
                  v-model="end_Date"
                  v-valid.require
                  is-link></cus-field>
        <cus-field label="安装数量" tag="安装数量"
                   placeholder="请输入"
                   v-valid.require
                  v-model="batchNum"></cus-field>
        <mt-cell title="是否委外" :class="heartVisible">
          <mt-switch v-model="box1"></mt-switch>
        </mt-cell>
        <cus-field label="合作伙伴" tag="合作伙伴"
                    v-if="box1"
                    @click.native="selectCompany"
                    v-model="companyName"
                    is-link></cus-field>
        <div v-if="box1">
          <cus-field label="真锁交接日期" tag="真锁交接日期"
                      v-if="showZs"
                      @click.native="open('deliveryTime')"
                      v-model="delivery_Time"
                      v-valid.require
                      is-link></cus-field>
        </div>
      </div>
      <div class="lock-line" v-show="box1">
        <lock-line title="委外安装员" @click="addInstaller('')">
          <mt-cell-swipe v-for="(installer, index) in installerList" class="lock-line-cell enable" ref="body" :key=index>
            <div class="co-flex co-jc" slot="title">
              <span class="co-f1">{{installer['Last Name']}}</span>
              <span class="co-f1">{{installer['Work Phone #']}}</span>
            </div>
          </mt-cell-swipe>
        </lock-line>
      </div>
      <div class="lock-line">
        <lock-line title="详细计划" @click="addPlanFn('')">
          <mt-cell-swipe v-for="(line, index) in planList" class="lock-line-cell enable" ref="body"
                         @click.native="addPlanFn(line)"
                         :right="getSwipeBtn(line, index)"
                         :key=index
                         is-link>
            <div class="co-flex co-jc" slot="title">
              <span class="co-f1">{{line.Description}}</span>
              <span class="co-f1">{{line['KL Detail Type']}}</span>
            </div>
            <div class="co-flex co-jc" slot="title">
              <span class="co-f1" >{{new Date(line.Planned).format('yyyy-MM-dd hh:mm:ss')}}</span>
              <span class="co-f1">{{new Date(line['Planned Completion']).format('yyyy-MM-dd hh:mm:ss')}}</span>
            </div>
          </mt-cell-swipe>
        </lock-line>
      </div>
      <attach ioName="KL Action Attachment" ref="attach"
              :attach="attach.list"
              :edit="!read"
              :title="attach.title"
              v-show="box1">
      </attach>
      <button-group>
        <mt-button class="single"
                   v-show="showZs"
                   @click.native="nextPageFn">下一步</mt-button>
        <mt-button class="single"
                   v-show="!showZs"
                   @click.native="submitFn">提交</mt-button>
      </button-group>
      <mt-datetime-picker
        ref="picker"
        v-model="pickerVisible"
        type="date"
        :startDate="sDate"
        year-format="{value} 年"
        month-format="{value} 月"
        date-format="{value} 日"
        class="datetime"
        @confirm="handleChange">
      </mt-datetime-picker>
      <mt-datetime-picker
        ref="pickerEnd"
        type="date"
        :startDate="eDate"
        year-format="{value} 年"
        month-format="{value} 月"
        date-format="{value} 日"
        class="datetime"
        @confirm="handleChangeEnd">
      </mt-datetime-picker>
      <mt-datetime-picker
        ref="deliveryTime"
        type="date"
        :startDate="sDate"
        year-format="{value} 年"
        month-format="{value} 月"
        date-format="{value} 日"
        class="datetime"
        @confirm="handleChangedeliveryTime">
      </mt-datetime-picker>
    </div>
  </div>
</template>
<style lang="scss">
  .batch {
    .button-cla {
      margin-top: 2.5rem;
      width: 100%;
      text-align: center;
    }
    .mint-button--normal {
      display: inline-block;
      padding: 0 12px;
      width: 5rem;
    }
    input {
      text-align: right!important;
    }

    .lock-line {
      margin-top: 10px;

      .lock-line-cell {
        background-color: $bg-light;
      }
      .co-flex {
        line-height: 30px;
      }
    }
  }
  .disable .cus-lock.icon-add-circle:before {
    color: white!important;
  }
</style>
<script type="application/javascript">
  import Vue from 'vue';
  import vp from 'public/plugin/validator';
  import cusField from 'public/components/cus-field';
  import {mapState, mapActions} from 'vuex';
  import buttonGroup from 'public/components/cus-button-group';
  import lockLine from '../components/cusLockLine';
  import api from '../api/api';
  const NameSpace = 'zsBatch';
  Vue.use(vp);
  let today = new Date();
  /**
   * 附件上传
   * @param {Array} serverIds 企业微信临时素材id => mediaId
   * @param {String} id 业务id
   */
  let _upload = function(serverIds, id) {
    // 成功回调
    let callback = data => {
      tools.success(data, {
        back: false,
        successTips: '提交成功'
      });
    };
    // 上传附件
    serverIds ? this.upload({
      data: {
        MediaId: serverIds,
        Id: id,
        IOName: 'KL Action Attachment'
      },
      success: callback
    }) : callback(id);
  };
  export default {
    name: NameSpace,
    created() {
      var self = this;
      let param = this.$route.query;
      self.state = param.state;
      self.type = param.type;
      self.item = param.item;
      self.orderID = param.orderID;
      if (self.type === 'add') {
        if (self.pcObj.Id) { // 批次页面新增保存有数据
          self.id = self.pcObj.Id;
          self.batchCode = self.pcObj.Id; // 新增保存的ID
          self.start_Date = new Date(self.pcObj.Planned).format('yyyy-MM-dd'); // 开始时间
          self.end_Date = new Date(self.pcObj['Planned Completion']).format('yyyy-MM-dd'); // 结束时间
          self.delivery_Time = new Date(self.pcObj['KL Delivery Time']).format('yyyy-MM-dd'); // 结束时间
          self.startDate = new Date(self.start_Date).format('MM/dd/yyyy'); // 后台存值格式
          self.endDate = new Date(self.end_Date).format('MM/dd/yyyy');
          if (self.delivery_Time) {
            self.deliveryTime = new Date(self.delivery_Time).format('MM/dd/yyyy');
          }
          self.batchNum = self.pcObj['KL Install Amount Requested']; // 数量
          self.companyId = self.pcObj['KL Partner Id'];
          self.companyName = self.pcObj['KL Partner Name'];
          self.getPlanList(self.batchCode); // 详细计划
          self.getInstallerList(self.batchCode); // 委外联系人
          self.getQueryMedias(self.batchCode); // 附件

        }
      } else if (self.type === 'edit') {
        if (self.pcObj.Id) { // 批次页面新增保存有数据
          self.id = self.pcObj.Id;
          self.batchCode = self.pcObj.Id; // 新增保存的ID
          self.start_Date = new Date(self.pcObj.Planned).format('yyyy-MM-dd'); // 开始时间
          self.end_Date = new Date(self.pcObj['Planned Completion']).format('yyyy-MM-dd'); // 结束时间
          self.delivery_Time = new Date(self.pcObj['KL Delivery Time']).format('yyyy-MM-dd'); // 结束时间
          self.startDate = new Date(self.start_Date).format('MM/dd/yyyy'); // 后台存值格式
          self.endDate = new Date(self.end_Date).format('MM/dd/yyyy');
          self.deliveryTime = new Date(self.delivery_Time).format('MM/dd/yyyy') || '';
          self.batchNum = self.pcObj['KL Install Amount Requested']; // 数量
          self.companyId = self.pcObj['KL Partner Id'];
          self.companyName = self.pcObj['KL Partner Name'];
          self.getPlanList(self.batchCode); // 详细计划
          self.getInstallerList(self.batchCode); // 委外联系人
          self.getQueryMedias(self.batchCode); // 附件

        } else {
          self.getBatch(self.item.Id);
          self.id = self.item.Id;
          self.batchCode = self.item.Id; // 详情的ID
          self.getPlanList(self.item.Id); // 详细计划
          self.getInstallerList(self.item.Id); // 委外联系人
          self.getQueryMedias(self.item.Id); // 附件

        }
      }
    },
    data: () => {
      return {
        value: '',
        batchCode: '', // 批次
        start_Date: '',        // 开始时间
        startDate: '',
        end_Date: '',        // 结束时间
        endDate: '',
        deliveryTime: '',
        delivery_Time: '',
        batchNum: '', // 数量
        companyName: '', // 合作伙伴名称
        companyId: '', // 合作伙伴id
        isPrimaryMVGPosition: '',
        pickerVisible: today,
        sDate: today,
        eDate: today,
        box1: true,
        planList: [],
        installerList: [],
        item: '',
        orderID: '', // 订单id
        id: '', // 记录新增后的批次ID
        type: 'edit', // add 新增 / edit 编辑 / read 只读
        editable: true,
        titleVal: '新建批次',
        attach: { // 附件
          list: [],
          edit: false,
          title: '附件'
        },
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
    computed: {
      ...mapState('detail', ['itemTask', 'showZs']),
      ...mapState('batch', ['pcObj']),
      // 表单只读
      read() {
        return this.type === 'read';
      },
      // * 是否显示
      heartVisible() {
        return this.type === 'read' ? '' : 'require';
      },
      title() {
      }
    },
    methods: {
      ...mapActions('app', ['getLov', 'upload', 'queryMedias']),
      ...mapActions('batch', ['getPcObj', 'delete']),
      getSwipeBtn(line, index) {
        return this.editable ? [{
          content: '删除',
          style: { background: 'red', color: '#fff', 'font-size': '15px', 'line-height': '54px' },
          handler: () => this.deleteFn(line, index)
        }] : [];
      },
      deleteFn(line, index) {
        this.delete({
          id: line.Id,
          index: index
        });
      },
      open(picker) {
        var self = this;
        self.eDate = new Date(self.start_Date);
        self.$refs[picker].open();
      },
      handleChange(value) {
        let me = this;
        me.start_Date = value.format('yyyy/MM/dd');
        me.startDate = value.format('MM/dd/yyyy'); // 后台存值格式
      },
      handleChangeEnd(value) {
        let me = this;
        me.end_Date = value.format('yyyy/MM/dd');
        me.endDate = value.format('MM/dd/yyyy');
      },
      handleChangedeliveryTime(value) {
        let me = this;
        me.delivery_Time = value.format('yyyy/MM/dd');
        me.deliveryTime = value.format('MM/dd/yyyy');
      },
      selectCompany() {
        var self = this;
        var insId = '';
        if (self.installerList.length > 0) {
          insId = self.installerList[0].Id;
        };
        if (self.id) { // 有批次直接跳转
          self.$router.push({
            name: 'company',
            query: {
              type: 'add',
              id: self.id,
              insId: insId,
              item: ''
            }
          });
        } else {
          this.toSaveFn('4');
        }
      },
      nextPageFn() {
        var self = this;
        if (!self.id) {
          Toast('请先保存批次信息！');
          return;
        }
        // 提交图片
        let uploadAttach = id => {
          _upload.call(self, self.$refs.attach.getServerIds(), id);
        };
        if (self.attach.list.length > 0) {
          uploadAttach(self.id);
        }
        /* if (self.box1) {
          if (!self.companyId) {
            Toast('合作伙伴不能为空，请选择！');
            return;
          }
          if (self.installerList.length === 0) {
            Toast('委外联系人不能为空，请选择！');
            return;
          }
        }
        if (self.planList.length === 0) {
          Toast('详细计划不能为空！');
          return;
        }*/
        this.$router.push({
          name: 'buildingInfo',
          query: {
            type: 'add',
            id: self.id,
            orderID: self.orderID
          }
        });
      },
      getPlanList(id) {
        var self = this;
        self.planList = [];
        api.get({ // 获取详细计划数据
          key: 'getDetail',
          method: 'POST',
          data: {
            'body': {
              'OutputIntObjectName': 'Base KL Installation Task Detail Plan',
              'SearchSpec': '[KL Installation Task Detail Plan.Parent Activity Id]=' + '"' + id + '"'
            }
          },
          success: function(data) {
            self.planList = KND.Util.toArray(data.SiebelMessage['KL Installation Task Detail Plan']);
            console.dir(self.planList);
          }
        });
      },
      getInstallerList(id) { // 联系人
        var self = this;
        self.installerList = [];
        api.get({ // 提交数据
          key: 'getInstaller',
          method: 'POST',
          data: {
            'body': {
              'OutputIntObjectName': 'Base KL Installation Task',
              'PrimaryRowId': id
            }
          },
          success: function(data) {
            self.installerList = KND.Util.toArray(data.SiebelMessage['KL Installation Task']['Contact']);
          }
        });
      },
      getQueryMedias(id) {
        this.queryMedias({
          data: {
            'IOName': 'KL Action Attachment',
            'SearchSpec': {
              'Action Attachment.Activity Id': id
            }
          },
          success: data => {
            this.attach.list = KND.Util.toArray(data['SiebelMessage']['Action Attachment']);
          }
        });
      },
      getBatch(id) {
        var self = this;
        api.get({ // 批次详情
          key: 'findBatchById', // 'findBatchById',
          data: {
            id: id
          },
          success: data => {
            if (!data.ERROR) {
              console.dir(data);
              self.batchCode = data.Id; // 批次
              self.start_Date = new Date(data.Planned).format('yyyy-MM-dd'); // 开始时间
              self.end_Date = new Date(data['Planned Completion']).format('yyyy-MM-dd'); // 结束时间
              self.delivery_Time = new Date(data['KL Delivery Time']).format('yyyy-MM-dd') || ''; // 结束时间
              self.startDate = new Date(self.start_Date).format('MM/dd/yyyy'); // 后台存值格式
              self.endDate = new Date(self.end_Date).format('MM/dd/yyyy');
              self.deliveryTime = new Date(self.delivery_Time).format('MM/dd/yyyy') || '';
              self.batchNum = data['KL Install Amount Requested'] || 0; // 数量
              self.companyId = data['KL Partner Id'];
              self.companyName = data['KL Partner Name'];
              self.getPcObj(data); // 保存store
            }
          }
        });
      },
      addInstaller() { // 选择委外安装员
        var self = this;
        if (self.companyId) {
          if (self.id) { // 有批次直接跳转
            self.$router.push({
              name: 'installer',
              query: {
                type: 'add',
                id: self.id,
                companyId: self.companyId,
                item: ''
              }
            });
          } else {
            this.toSaveFn('3');
          }
        } else {
          Toast('请先选择合作伙伴');
        }
      },
      addPlanFn(obj) {
        var self = this;
        if (self.id) { // 有批次直接跳转
          let planType = self.itemTask['KL Detail Type']; // 取统一批次
          this.$router.push({
            name: 'detailPlan',
            query: {
              type: 'add',
              planType: planType,
              id: self.id,
              item: obj
            }
          });
        } else {  // 先保存批次
          this.toSaveFn('1');
        }
      },
      toSaveFn(num) { // num=1 保存并跳转详细计划  num = 2 只是保存 不跳转 num=3 保存跳转选择委外安装员  num=4 合作公司 num=5 提交
        var self = this;
        tools.valid.call(this, () => {
          var aId = '';
          if (self.type === 'add') {
            aId = self.item.Id;
          } else if (self.type === 'edit') {
            aId = self.item['Parent Activity Id'];
          }
          if (self.deliveryTime === 'aN/aN/NaN') {
            self.deliveryTime = '';
          }
          var parma = {
            'Planned': self.startDate,
            'Planned Completion': self.endDate,
            'KL Delivery Time': self.deliveryTime,
            'KL Install Amount Requested': self.batchNum,
            'Id': self.batchCode || '10001',
            'KL Detail Type': self.item['KL Detail Type'],
            'Parent Activity Id': aId
          };
          var Status = '';
          self.getLov({ // 取类型值
            data: {
              'Type': 'EVENT_STATUS',
              'Name': 'Planning'
            },
            success: data => {
              Status = KND.Util.toArray(data.items)[0].Value;
              parma.Status = Status;
              parma['KL Detail Type'] = self.itemTask['KL Detail Type']; // 取默认第一个批次的 类型、Template Id
              parma['Template Id'] = self.itemTask['Template Id'];
              parma['Order Id'] = self.itemTask['Order Id'];
              api.get({ // 提交数据
                key: 'getUPData',
                method: 'PUT',
                data: parma,
                success: function(data) {
                  if (!data.ERROR) {
                    self.id = data.items.Id; // 新增批次返回的ID
                    self.batchCode = data.items.Id; // 新增批次返回的ID
                    self.getPcObj(data.items); // 保存store
                    // 提交图片
                    let uploadAttach = id => {
                      _upload.call(self, self.$refs.attach.getServerIds(), id);
                    };
                    uploadAttach(self.id);
                    if (num === '1' || num === 2 || num === '5') { // 保存或者详细计划时不选择委外 则把之前的数据清空
                      // 判断是否选择委外
                      var insId = ''; // 判断是否有委外联系人  有则清空
                      if (self.installerList.length > 0) {
                        insId = self.installerList[0]['Party UId'];
                      };
                      if (!self.box1) {
                        if (self.companyId) { // 清空合作伙伴
                          self.companyId = '';
                          self.companyName = '';
                          var parma = {
                            'Id': self.id,
                            'KL Partner Id': ''
                          };
                          api.get({ // 提交数据
                            key: 'getUPData',
                            method: 'PUT',
                            data: parma,
                            success: function(data) {
                            }
                          });
                        }
                        if (insId) { // 清空联系人
                          api.get({
                            key: 'selIntaller',
                            method: 'POST',
                            data: {
                              'body': {
                                'SiebelMessage': {
                                  'MessageId': '',
                                  'MessageType': 'Integration Object',
                                  'IntObjectFormat': 'Siebel Hierarchical',
                                  'ListOfBase KL Installation Task': {
                                    'KL Installation Task': {
                                      'Id': self.batchCode,
                                      'ListOfContact': {}
                                    }
                                  }
                                }
                              }
                            },
                            success: function(data) {
                              if (!data.ERROR) {
                                self.installerList = [];
                              }
                            }
                          });
                        }
                      }
                      if (num === '1') {
                        let planType = self.itemTask['KL Detail Type']; // 取统一批次
                        self.$router.push({
                          name: 'detailPlan',
                          query: {
                            type: 'add',
                            planType: planType,
                            id: self.batchCode,
                            item: ''
                          }
                        });
                      } else if (num === '5') {
                        api.get({ // 更改按钮状态
                          key: 'getUPStatus',
                          method: 'POST',
                          data: {
                            'body': {
                              'ProcessName': 'KL Install Task Submit For Approval Workflow',
                              'RowId': self.id
                            }
                          },
                          success: function(data) {
                            if (!data.ERROR) {
                              Toast('提交成功');
                              KND.Util.back();
                            }
                          }
                        });
                      }
                    } else if (num === '3') {
                      this.$router.push({
                        name: 'installer',
                        query: {
                          type: 'add',
                          id: self.id,
                          item: ''
                        }
                      });
                    } else if (num === '4') {
                      self.$router.push({
                        name: 'company',
                        query: {
                          type: 'add',
                          id: self.id,
                          item: ''
                        }
                      });
                    } else {
                      Toast('保存成功');
                    }
                  }
                }
              });
            }
          });
        });
      },
      submitFn() {
        var self = this;
        if (!self.id) {
          Toast('请先保存批次信息！');
          return;
        }
        if (self.box1) {
          if (!self.companyId) {
            Toast('合作伙伴不能为空，请选择！');
            return;
          }
          if (self.installerList.length === 0) {
            Toast('委外联系人不能为空，请选择！');
            return;
          }
          if (self.attach.list.length === 0) {
            Toast('附件不能为空，请上传！');
            return;
          }
        }
        if (self.planList.length === 0) {
          Toast('详细计划不能为空！');
          return;
        }
        // 提交图片
        let uploadAttach = id => {
          _upload.call(self, self.$refs.attach.getServerIds(), id);
        };
        if (self.attach.list.length > 0) {
          uploadAttach(self.id);
        }
        MessageBox({
          title: '提示',
          message: ' 确认提交？一经提交不可修改',
          showCancelButton: true
        }).then(action => {
          if (action === 'confirm') {
            self.toSaveFn(5);
          }
        });
      }
    },
    components: {buttonGroup, lockLine, cusField}
  };
</script>
