<template>
  <div>
    <mt-header fixed :title="title">
      <fallback slot="left"></fallback>
      <mt-button slot="right"
                 @click="journalFn()">日志</mt-button>
    </mt-header>
    <div class="mint-content zsBatch">
      <div :class="{'readonly':read}">
        <cus-field label="完成数量" tag="完成数量"
                   type="number"
                   v-valid.require.number
                   v-model="line['Completed Install Amount']"></cus-field>
        <cus-field label="抽查数量" tag="抽查数量"
                   type="number"
                   v-valid.number
                   v-model="line['Spot Check Amount']"></cus-field>
        <cus-field label="合格数量" tag="合格数量"
                   type="number"
                   v-valid.number
                   v-model="line['Qualified Amount']"></cus-field>
        <!--<cus-field label="异常数量"
                   type="number"
                   v-model="line['Unqualified Amount']"></cus-field>-->
        <cus-field label="异常处理数量" tag="异常处理数量"
                   type="number"
                   v-valid.number
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
  import Vue from 'vue';
  import vp from 'public/plugin/validator';
  import buttonGroup from 'public/components/cus-button-group';
  import cusField from 'public/components/cus-field';
  import api from '../api/api';
  import {mapState, mapActions} from 'vuex';
  Vue.use(vp);
  export default {
    name: 'updateDoor',
    created() {
      // let param = this.$route.query;
      this.item = this.itemTask;
      this.id = this.item.Id;
    },
    data: () => {
      return {
        id: '',
        item: '',
        type: 'add', // add 新增 / edit 编辑 / read 只读
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
      ...mapState('detail', ['itemTask']),

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
        let item = this.item;
        var val = '';
        if (item['KL Detail Type LIC'] === 'Trompil Batch') {
          val = '开孔进度更新';
        } else if (item['KL Detail Type LIC'] === 'Lock Body Install') {
          val = '锁体进度更新';
        } else if (item['KL Detail Type LIC'] === 'Door Hanging Acc Batch') {
          val = '挂门进度更新';
        } else if (item['KL Detail Type LIC'] === 'Substitution Lock Inst Batch') {
          val = '替代锁进度更新';
        } else if (item['KL Detail Type LIC'] === 'Check Before Transfer Batch') {
          val = '全检进度更新';
        }
        return val;
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
        tools.valid.call(this, () => {
          var lineObj = self.line;
          if (lineObj['Spot Check Amount']) { // 抽查数量有值 判断不能大于完成数量
            if (parseInt(lineObj['Spot Check Amount'], 10) > parseInt(lineObj['Completed Install Amount'], 10)) {
              Toast('抽查数量不能大于完成数量！');
              return;
            }
          }
          if (lineObj['Qualified Amount']) {
            if (parseInt(lineObj['Qualified Amount'], 10) > parseInt(lineObj['Spot Check Amount'], 10)) {
              Toast('合格数量不能大于抽查数量！');
              return;
            }
          }
          if (lineObj['Unqualified Solve Amount']) {
            var numC = parseInt(lineObj['Spot Check Amount'], 10) - parseInt(lineObj['Qualified Amount'], 10);
            if (parseInt(lineObj['Unqualified Solve Amount'], 10) > numC) {
              Toast('异常处理数量不合理，不能大于抽查数量与合格数量的差值！');
              return;
            }
          }
          MessageBox({
            title: '提示',
            message: ' 确认提交？一经提交不可修改',
            showCancelButton: true
          }).then(action => {
            if (action === 'confirm') {
              api.get({ // 提交详细计划数据
                key: 'setJourna',
                method: 'PUT',
                data: {
                  'Id': '0001', // 默认ID
                  'Activity Id': self.id,
                  'Completed Install Amount': lineObj['Completed Install Amount'], // 新增批次返回的ID
                  'Spot Check Amount': lineObj['Spot Check Amount'], // 新增批次返回的ID
                  'Qualified Amount': lineObj['Qualified Amount'], // 新增批次返回的ID
                  'Unqualified Solve Amount': lineObj['Unqualified Solve Amount'], // 新增批次返回的ID
                  'Unqualified Desc': lineObj['Unqualified Desc'], // 新增批次返回的ID
                  'Unqualified Solve Desc': lineObj['Unqualified Solve Desc'] // 新增批次返回的ID
                },
                success: function(data) {
                  if (!data.ERROR) {
                    lineObj['Completed Install Amount'] = '';
                    lineObj['Spot Check Amount'] = '';
                    lineObj['Qualified Amount'] = '';
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
                              KND.Util.back();
                            }
                          }
                        });
                      }
                    });
                  }
                }
              });
            }
          });
        });
      }
    },
    components: {buttonGroup, cusField}
  };
</script>
