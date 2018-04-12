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
                  type="number"
                  placeholder="请输入联系电话"
                  v-model.trim="Contact_Phone"></mt-field>
        <mt-field label="物业联系人"
                  type="text"
                  id="contactText"
                  :attr="isCall"
                  placeholder="请输入联系人"
                  v-model="Contact_Name"
                  class="textRight require"></mt-field>
      </div>
      <attach ioName="KL Action Attachment" ref="attach"
              :attach="attach.list"
              :edit="!read"
              :title="attach.title">
      </attach>
      <div :class="{'readonly':read}">
        <mt-field label="备注说明" type="textarea" v-model="Description"></mt-field>
      </div>
      <ul class="search-list">
        <li v-for="(item, index) in search" :key="item.Id" @click="selectCaLL(item)">{{item['Work Phone #']}} {{item['Last Name']}}</li>
      </ul>
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
      top: 9.8rem;
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
  const textCall = (function() {
    return function(callNum) {
      let phoneReg = new RegExp('^[1][3,4,5,7,8][0-9]{9}$');
      let workPhoneReg = new RegExp('^(([0\\+]\\d{2,3})?(0\\d{2,3}))(\\d{7,8})((\\d{3,}))?$');
      return (phoneReg.test(callNum) || workPhoneReg.test(callNum));
    };
  })();
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
    },
    data: () => {
      return {
        value: '',
        assetsLeng: '',
        assetsObj: {},
        batchCode: '', // 批次
        Contact_Id: '', // id
        Contact_Phone: '',     // 联系电话
        Contact_Name: '',   // 报修联系人
        Description: '', // 备注
        batchNum: 100, // 数量
        isCall: {},
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
        me.Contact_Id = val['Id'];
        me.Contact_Phone = val['Work Phone #'];
        me.Contact_Name = val['Last Name'];
        me.isCall = {disabled: true};
        me.isEdit = {disabled: true};
        me.isClick = true;
        me.removeSearch();
      },
      toSaveFn() {
        var self = this;
        var aId = '';
        if (self.type === 'add') {
          aId = self.item.Id;
        } else if (self.type === 'edit') {
          aId = self.item['Parent Activity Id'];
        }
        var parma = {
          'KL Property Contact Name': self.Contact_Name, // 物业联系人
          'KL Property Contact Cellular Phone': self.Contact_Phone, // 物业联系人电话
          'Id': self.batchCode,
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
                  Toast('保存成功');
                }
              }
            });
          }
        });
      },
      submitFn() {
        var self = this;
        if (!self.Contact_Phone) {
          Toast('联系人电话不能为空！');
          return;
        }
        if (textCall(self.Contact_Phone)) {
          MessageBox({
            title: '提示',
            message: '联系电话格式错误请重新输入！'
          });
          self.Contact_Phone = '';
          return;
        }
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
        console.dir('0==========');
        console.dir(assetsList);
        api.get({ // 更新工程真锁移交
          key: 'setUpyj',
          method: 'POST',
          data: {
            'body': {
              'ContactName': self.Contact_Name,
              'ContactPhone': self.Contact_Phone,
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
                      }
                    }
                  });
                }
              });
            }

          }
        });
      }
    },
    components: {buttonGroup}
  };
</script>
