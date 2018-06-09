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
        <cus-field label="批次名称" tag="批次名称"
                   placeholder="请输入"
                   v-valid.require
                   v-model="batchName"></cus-field>
      </div>
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
  import {mapState, mapActions} from 'vuex';
  import Vue from 'vue';
  import vp from 'public/plugin/validator';
  import buttonGroup from 'public/components/cus-button-group';
  import cusField from 'public/components/cus-field';
  import lockLine from '../components/cusLockLine';
  import api from '../api/api';
  const NameSpace = 'batch';
  Vue.use(vp);
  export default {
    name: 'batch',
    created() {
      var self = this;
      let param = this.$route.query;
      self.state = param.state;
      self.type = param.type;
      self.item = param.item;
      if (self.type === 'add') {
        if (self.pcObj.Id) { // 批次页面新增保存有数据
          self.id = self.pcObj.Id;
          self.batchCode = self.pcObj.Id; // 新增保存的ID
          self.batchName = self.pcObj['KL Task Batch Name']; // 批次名称
        }
      } else if (self.type === 'edit') {
        if (self.pcObj.Id) { // 批次页面新增保存有数据
          self.id = self.pcObj.Id;
          self.batchCode = self.pcObj.Id; // 新增保存的ID
          self.batchName = self.pcObj['KL Task Batch Name']; // 批次名称
        } else {
          self.getBatch(self.item.Id);
          self.id = self.item.Id;
          self.batchCode = self.item.Id; // 详情的ID
        }
      }
    },
    data: () => {
      return {
        value: '',
        batchCode: '', // 批次
        batchName: '', // 名称
        planList: [],
        item: '',
        id: '', // 记录新增后的批次ID
        type: 'edit', // add 新增 / edit 编辑 / read 只读
        editable: true,
        titleVal: '新建批次',
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
      ...mapState('detail', ['itemTask']),
      ...mapState(NameSpace, ['pcObj']),
      // 表单只读
      read() {
        return this.type === 'read';
      },
      // * 是否显示
      heartVisible() {
        return this.type === 'read' ? '' : 'require';
      }
    },
    methods: {
      ...mapActions('app', ['getLov', 'upload']),
      ...mapActions(NameSpace, ['getPcObj']),
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
              self.batchName = data['KL Task Batch Name']; // 数量
              self.getPcObj(data); // 保存store
            }
          }
        });
      },
      toSaveFn(num) { // num = 2 只是保存
        var self = this;
        tools.valid.call(this, () => {
          var aId = '';
          if (self.type === 'add') {
            aId = self.item.Id;
          } else if (self.type === 'edit') {
            aId = self.item['Parent Activity Id'];
          }
          var parma = {
            'KL Task Batch Name': self.batchName,
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
                    Toast('保存成功');
                    KND.Util.back();
                  }
                }
              });
            }
          });
        });
      }
    },
    components: {buttonGroup, lockLine, cusField}
  };
</script>
