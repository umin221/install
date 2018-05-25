<template>
  <div>
    <mt-header fixed :title="titleVal">
      <fallback slot="left"></fallback>
    </mt-header>
    <div class="mint-content journal editable">
      <div class="lock-line">
        <empty v-if="!processDate.length"></empty>
        <lock-line :title="item['Item Type Display Name']" v-for="(item, index) in processDate" :key="index">
          <div class="crm-zyList" v-for="(itemTask, index) in upList(item['UInbox Item Task'])" :key="index">
            <ul class="content">
              <li class="bd-radius">
                <span class="icon"></span>
              </li>
              <li style="color: #888;line-height: 40px;font-size: 0.8rem;">{{new Date(itemTask['End Working Time']).format('yyyy-MM-dd')}}
              </li>
              <div class="content-div">
                <div>审批人：{{itemTask['Task Owner Full Name']}}</div>
              </div>
              <div class="content-div">
                <div>审批状态：{{itemTask['Action']}}</div>
              </div>
              <div class="content-div">
                <div>审批意见：{{itemTask['KL Request Description']}}</div>
              </div>
              <div class="singleBnt" v-if="is_show(itemTask)">
                <div class="single"
                     @click="submitFn(itemTask, 'Rejected')">驳回</div>
                <div class="single" style="margin-left: 20px"
                     @click="submitFn(itemTask, 'Approved')">确认</div>
              </div>
            </ul>
          </div>
        </lock-line>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
  .journal {
    background: white;
    .lock-line {
      margin-top: 10px;

      .lock-line-cell {
        background-color: $bg-light;
      }
      .co-flex {
        line-height: 30px;
      }
    }
    .icon-add-circle:before {
      content: ''!important;
    }
    .singleBnt {
      text-align: center;
      height: 30px;
      margin-top: 10px;
      color: #5a5a5a;
      font-size: 0.7rem;
    }
    .singleBnt .single {
      width: 85px;
      left: 10px;
      float: left;
      text-align: center;
      border: 1px solid #00599f;
      border-radius: 5px;
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
    .crm-zyList .content {
      position: relative;
      border-left: 1px solid #dddddd;
      padding-bottom: 10px;
      margin: 0 30px;
      padding-left: 20px;
    }
    .crm-zyList .journalName {
      position: absolute;
      right: 0px;
    }
    .crm-zyList .content .bd-radius {
      background: #fff;
      position: absolute;
      left: -20px;
      top: 0px;
    }
    .crm-zyList .icon{
      border-radius: 26px;
      background: #8bc17c;
      color: #fff;
      padding: 1px 7px;
      margin-left: 13px;
      font-size: 12px;
      top: 10px;
    }
    .crm-zyList .content {
      margin-top: 5px;
      line-height: 27px;
    }
    .content-div {
      border-radius: 5px;
      font-size: 0.7rem;
    }
  }
</style>
<script type="application/javascript">
  import api from '../api/api';
  import lockLine from '../components/cusLockLine';
  let userInfo = {};

  export default {
    name: 'approval',
    created() {
      var self = this;
      self.titleVal = '审批记录';
      let param = this.$route.query;
      this.id = param.id;
      this.type = param.type;
      this.getApproval();
      KND.Native.getUserInfo((info) => {
        userInfo = info;
        console.log(userInfo);
      });
    },
    data: () => {
      return {
        value: '',
        processDate: [],
        editable: false,
        titleVal: '审批记录'
      };
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        let query = vm.$route.query;
        console.dir(query);
      });
    },
    computed: {
    },
    components: {lockLine},
    methods: {
      upList(obj) {
        return KND.Util.toArray(obj);
      },
      is_show(itemTask) {
        if (userInfo['Id'] === itemTask['Task Owner Id'] && itemTask['Active Flag'] === 'Y') {
          return true;
        } else {
          return false;
        }
      },
      submitFn(itemTask, type) {
        var self = this;
        if (type === 'Approved') {
          api.get({
            key: 'setApproval',
            method: 'POST',
            data: {
              'body': {
                'Object Id': itemTask['Item Object Id'],
                'InboxItemId': itemTask['Item Id'],
                'InboxTaskId': itemTask['Id'],
                'ActionLIC': type,
                'KL Request Description': '',
                'ProcessName': 'KL Sparts Order Approval Action Main Workflow'
              }
            },
            success: function(data) {
              if (!data.ERROR) {
                Toast('审批成功');
                self.getApproval();
              }
            }
          });
        } else {
          MessageBox.prompt('请填写驳回原因').then(({ value, action }) => {
            if (value) {
              api.get({
                key: 'setApproval',
                method: 'POST',
                data: {
                  'body': {
                    'Object Id': itemTask['Item Object Id'],
                    'InboxItemId': itemTask['Item Id'],
                    'InboxTaskId': itemTask['Id'],
                    'ActionLIC': type,
                    'KL Request Description': value,
                    'ProcessName': 'KL Sparts Order Approval Action Main Workflow'
                  }
                },
                success: function(data) {
                  if (!data.ERROR) {
                    Toast('审批成功');
                    self.getApproval();
                  }
                }
              });
            } else {
              Toast('请填写驳回原因');
            }
          });
        }
      },
      getApproval() {
        var self = this;
        api.get({ // 提交数据
          key: 'getApproval',
          method: 'POST',
          data: {
            'body': {
              'OutputIntObjectName': 'Base UInbox Item History',
              'SearchSpec': '[UInbox Item.Item Object Id]=' + '"' + self.id + '"'

            }
          },
          success: function(data) {
            if (data.SiebelMessage['UInbox Item']) {
              self.processDate = KND.Util.toArray(data.SiebelMessage['UInbox Item']);
            }
          }
        });
      }
    }
  };
</script>
