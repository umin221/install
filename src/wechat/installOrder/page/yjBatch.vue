<template>
  <div>
    <mt-header fixed :title="titleVal">
      <fallback slot="left"></fallback>
<!--
      <mt-button @click.native="toSaveFn(2)" slot="right" v-text="">保存</mt-button>
-->
    </mt-header>
    <div class="mint-content batch">
      <div>
        <mt-cell title="批次">
          <span>{{itemTask.Id}}</span>
        </mt-cell>
        <mt-cell title="移交数量">
          <span>{{assetsLeng}}</span>
        </mt-cell>
        <mt-field label="联系电话"
                  placeholder="请输入联系电话"
                  v-show="is_contact"
                  v-model.trim="Contact_Phone"></mt-field>
        <ul class="search-list">
          <li v-for="(item, index) in search" :key="item.Id" @click="selectCaLL(item)">{{item['Last Name']}} {{showPhone(item)}} </li>
        </ul>
        <mt-field label="物业联系人"
                  type="text"
                  id="contactText"
                  :attr="isCall"
                  placeholder="请输入联系人"
                  v-show="is_contact"
                  v-model="Contact_Name"
                  class="textRight require"></mt-field>
      </div>
      <attach ioName="KL Action Attachment" ref="attach"
              :attach="attach.list"
              :edit="!read"
              :title="attach.title">
      </attach>
      <!--<div :class="{'readonly':read}">
        <mt-field label="备注说明" type="textarea" v-model="Description"></mt-field>
      </div>-->
      <button-group>
        <mt-button class="single"
                   @click.native="submitFn">提交</mt-button>
      </button-group>
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
    .search-list{
      z-index: 1;
      position: absolute;
      margin-top: 1px;
      background: white;
      list-style: none;
      box-shadow: 1px 1px 5px #ededed;
      -webkit-box-shadow: 1px 1px 5px #ededed;
    }
    .search-list>li{
      line-height: 1.5rem;
      text-align: center;
      color: #777;
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
  import {mapState, mapActions, mapMutations} from 'vuex';
  import buttonGroup from 'public/components/cus-button-group';
  import api from '../api/api';
  /**
   * 附件上传
   * @param {Array} serverIds 企业微信临时素材id => mediaId
   * @param {String} id 业务id
   */
  let _upload = function(serverIds, id) {
    var self = this;
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
        Comment: self.Description,
        IOName: 'KL Action Attachment'
      },
      success: callback
    }) : callback(id);
  };
  const NameSpace = 'yjBatch';
  const delay = (function() {
    let timer = 0;
    return function(callback, ms) {
      clearTimeout(timer);
      timer = setTimeout(callback, ms);
    };
  })();
  const setAttrButt = (function() {
    return function(id, type) {
      let parent = document.getElementById(id);
      let child = parent.getElementsByTagName(type);
      child[0].removeAttribute('disabled');
    };
  })();
 /* const textCall = (function() {
    console.dir('==');
  })();*/
  export default {
    name: NameSpace,
    created() {
      var self = this;
      let param = this.$route.query;
      self.state = param.state;
      self.assetsObj = KND.Util.parse(param.result);
      for (let i in self.assetsObj) {
        console.dir(i);
        self.assetsLeng ++;
      }
      console.dir(self.itemTask);
      /* if (self.itemTask['KL Property Contact Id']) { // 有物业联系人则不需选择
        console.dir('物业联系人');
        self.is_contact = false;
        self.Contact_Id = self.itemTask['KL Property Contact Id'];
        self.Contact_Phone = self.itemTask['KL Property Contact Cellular Phone'];
        self.Contact_Name = self.itemTask['KL Property Contact Name'];
        self.isCall = {disabled: true};
        self.isEdit = {disabled: true};
        self.isClick = true;
        self.removeSearch();
      }*/
    },
    data: () => {
      return {
        value: '',
        assetsLeng: '',
        assetsObj: {},
        batchCode: '', // 批次
        Contact_Id: '', // id
        is_contact: true, // 是否显示选择物业  已存在不显示
        Contact_Phone: '',     // 联系电话
        Contact_Name: '',   // 报修联系人
        Description: '', // 备注
        batchNum: 100, // 数量
        isCall: {},
        arr: [],
        CellPhone: '', // 移动电话
        WorkPhone: '', // 工作电话
        orderID: '', // 订单id
        titleVal: '真锁移交',
        attach: { // 附件
          list: [],
          edit: false,
          title: '附件'
        },
        active: 'tab-container'
      };
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        let query = vm.$route.query;
        console.dir(query);
      });
    },
    computed: {
      ...mapState('yjBatch', ['search']),
      ...mapState('detail', ['itemTask']),
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
    watch: {
      Contact_Phone() {
        delay(() => {
          if (!this.isCall.disabled && this.isClick) {
            this.isClick = false;
          }
          if (!this.isClick) {
            this.fetchData();
            setAttrButt('contactText', 'input');
          } else {
            this.isCall = {};
            this.isEdit = {};
          }
          console.log(this.isClick);
        }, 500);
      }
    },
    methods: {
      ...mapActions('app', ['getLov', 'upload']),
      ...mapActions(NameSpace, ['getSearch']),
      ...mapMutations(NameSpace, ['removeSearch']),
      open(picker) {
        this.$refs[picker].open();
      },
      phone(callNum) {
        var self = this;
        var phoneReg = new RegExp('^[1][3,4,5,7,8][0-9]{9}$');
        var workPhoneReg = new RegExp('^(([0\\+]\\d{2,3})?(0\\d{2,3}))(\\d{7,8})((\\d{3,}))?$');
        if (phoneReg.test(callNum)) {
          self.CellPhone = callNum;
        }
        if (workPhoneReg.test(callNum)) {
          self.WorkPhone = callNum;
        }
        return (phoneReg.test(callNum) || workPhoneReg.test(callNum));
      },
      showPhone(item) {
        var arrList = [];
        if (item['Cellular Phone #']) {
          arrList.push(item['Cellular Phone #']);
        }
        if (item['Work Phone #']) {
          arrList.push(item['Work Phone #']);
        }
        return arrList.join('/');
      },
      async fetchData(val) {
        let me = this;
        if (me.Contact_Phone.length > 4) {
          me.getSearch(me.Contact_Phone);
        } else {
          me.removeSearch();
        }
      },
      selectCaLL(val) {
        console.log(val);
        let me = this;
        me.Contact_Phone = ''; // 清空
        me.arr = [];
        me.Contact_Id = val['Id'];
        if (val['Cellular Phone #']) {
          me.arr.push(val['Cellular Phone #']);
        }
        if (val['Work Phone #']) {
          me.arr.push(val['Work Phone #']);
        }
        me.Contact_Phone = me.arr.join('/');
        me.Contact_Name = val['Last Name'];
        me.isCall = {disabled: true};
        me.isEdit = {disabled: true};
        me.isClick = true;
        me.removeSearch();
      },
      submitFn() {
        var self = this;
        if (!self.Contact_Phone) {
          Toast('联系人电话不能为空！');
          return;
        }
        if (self.Contact_Id) { //
          console.dir('--');
          self.CellPhone = self.arr[0];
          self.WorkPhone = self.arr[1];
        } else {
          if (!self.phone(self.Contact_Phone)) {
            MessageBox({
              title: '提示',
              message: '联系电话格式错误请重新输入！'
            });
            self.Contact_Phone = '';
            return;
          }
        }
        if (self.attach.list.length > 0) {
          var newDate = new Date().format('MM/dd/yyyy hh:mm:ss');
          var assetsList = [];
          var assetsObj = self.assetsObj;
          console.dir(assetsObj);
          for (let i in assetsObj) {
            var obj = {};
            obj.Id = assetsObj[i].Id;
            obj['KL Transfer Activity Id'] = self.itemTask.Id;
            obj['Install Date'] = newDate;
            assetsList.push(obj);
          }
          if (assetsList.length > 0) {
            console.dir('0==========');
            console.dir(assetsList);
            api.get({ // 更新工程真锁移交
              key: 'setUpyj',
              method: 'POST',
              data: {
                'body': {
                  'ContactId': self.Contact_Id,
                  'ContactName': self.Contact_Name,
                  'CellPhone': self.CellPhone,
                  'WorkPhone': self.WorkPhone,
                  'Amount': self.assetsLeng,
                  'ProcessName': 'KL Install Order Asset Lock Transfer Process',
                  'SiebelMessage': {
                    'MessageId': '',
                    'MessageType': 'Integration Object',
                    'IntObjectName': 'KL Install Order',
                    'IntObjectFormat': 'Siebel Hierarchical',
                    'ListOfKL Install Order': {
                      'Order Entry - Orders': {
                        'Id': self.itemTask['Order Id'], // 订单ID
                        'ListOfKL Install Order Asset': {
                          'KL Install Order Asset': assetsList
                        }
                      }
                    }
                  }
                }
              },
              success: function(data) {
                if (!data.ERROR) {
                  // 提交图片
                  let uploadAttach = id => {
                    _upload.call(self, self.$refs.attach.getServerIds(), id);
                  };
                  if (self.attach.list.length > 0) {
                    uploadAttach(self.itemTask.Id);
                  }
                  // 更新状态
                  var Status = '';
                  self.getLov({ // 取类型值
                    data: {
                      'Type': 'EVENT_STATUS',
                      'Name': 'In Progress'
                    },
                    success: data => {
                      Status = KND.Util.toArray(data.items)[0].Value;
                      var parma = {};
                      parma.Status = Status;
                      parma.Id = self.itemTask.Id;
                      api.get({ // 提交数据
                        key: 'getUPData',
                        method: 'PUT',
                        data: parma,
                        success: function(data) {
                          if (!data.ERROR) {
                            Toast('提交成功');
                            // 标记楼栋资产刷新
                            KND.Session.set('refreshAssets', true);
                            self.$router.go(-2);
                          }
                        }
                      });
                    }
                  });
                }

              }
            });
          } else {
            Toast('请选择楼栋！');
          }
        } else {
          Toast('请上传附件，附件不能为空！');
        }
      }
    },
    components: {buttonGroup}
  };
</script>
