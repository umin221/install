<template>
  <div>
    <mt-header fixed :title="titleVal">
      <fallback slot="left"></fallback>
      <mt-button slot="right"
                 @click="journalFn()">日志</mt-button>
    </mt-header>
    <div class="mint-content zsBatch">
      <div :class="{'readonly':read}">
        <cus-field label="完成数量"
                   type="number"
                   :class="heartVisible"
                   v-model="line['Completed Install Amount']"></cus-field>
        <cus-field label="抽查数量"
                   type="number"
                   v-model="line['Spot Check Amount']"></cus-field>
        <cus-field label="合格数量"
                   type="number"
                   v-model="line['Qualified Amoun']"></cus-field>
        <cus-field label="异常数量"
                   type="number"
                   v-model="line['Unqualified Amount']"></cus-field>
        <cus-field label="异常处理数量"
                   type="number"
                   v-model="line['Unqualified Solve Amount']"></cus-field>
        <cus-field label="异常描述"
                   type="textarea"
                   v-model="line['Unqualified Desc']"></cus-field>
        <cus-field label="异常处理描述"
                   type="textarea"
                   v-model="line['Unqualified Solve Desc']"></cus-field>
      </div>
      <button-group>
        <mt-button class="single"
                   @click="submitFn">提交</mt-button>
      </button-group>
    </div>
  </div>
</template>
<style lang="scss">
  .zsBatch {
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
  }
</style>
<script type="application/javascript">
  import buttonGroup from 'public/components/cus-button-group';
  import cusField from 'public/components/cus-field';
  import api from '../api/api';
  import {mapState, mapActions} from 'vuex';
  export default {
    name: 'updateDoor',
    created() {
      let param = this.$route.query;
      this.id = param.id;
    },
    data: () => {
      return {
        id: '',
        type: 'add', // add 新增 / edit 编辑 / read 只读
        titleVal: '挂门进度更新',
        line: {},
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
      ...mapState('index', ['infoUser']),
      // 表单只读
      read() {
        return this.type === 'read';
      },
      // * 是否显示
      heartVisible() {
        return this.type === 'read' ? '' : 'require';
      },
      /**
       * 根据当前状态和类型判断标题展示
       * 新建&重新启用界面复用 仅标题不一样
       * 查看&编辑标题一致
       */
      title() {
        let type = this.type;
        return type === 'add' ? '挂门进度更新' : '挂门进度更新详情';
      }
    },
    methods: {
      ...mapActions('app', ['getLov']),
      journalFn() {
        var self = this;
        self.$router.push({
          name: 'journal',
          query: {
            id: self.id,
            type: 'updateDoor'
          }
        });
      },
      submitFn() {
        var self = this;
        var lineObj = self.line;
        if (!lineObj['Completed Install Amount']) {
          Toast('完成数量不能为空！');
          return;
        }
        api.get({ // 提交详细计划数据
          key: 'setJourna',
          method: 'PUT',
          data: {
            'Id': '0001', // 默认ID
            'Activity Id': self.id,
            'Completed Install Amount': lineObj['Completed Install Amount'], // 新增批次返回的ID
            'Spot Check Amount': lineObj['Spot Check Amount'], // 新增批次返回的ID
            'Qualified Amoun': lineObj['Qualified Amoun'], // 新增批次返回的ID
            'Unqualified Amount': lineObj['Unqualified Amount'], // 新增批次返回的ID
            'Unqualified Solve Amount': lineObj['Unqualified Solve Amount'], // 新增批次返回的ID
            'Unqualified Desc': lineObj['Unqualified Desc'], // 新增批次返回的ID
            'Unqualified Solve Desc': lineObj['Unqualified Solve Desc'] // 新增批次返回的ID
          },
          success: function(data) {
            if (!data.ERROR) {
              lineObj['Completed Install Amount'] = '';
              lineObj['Spot Check Amount'] = '';
              lineObj['Qualified Amoun'] = '';
              lineObj['Unqualified Amount'] = '';
              lineObj['Unqualified Solve Amount'] = '';
              lineObj['Unqualified Desc'] = '';
              lineObj['Unqualified Solve Desc'] = '';
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
                  parma.Id = self.id;
                  api.get({ // 提交数据
                    key: 'getUPData',
                    method: 'PUT',
                    data: parma,
                    success: function(data) {
                      if (!data.ERROR) {
                        Toast('提交成功');
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
    components: {buttonGroup, cusField}
  };
</script>
