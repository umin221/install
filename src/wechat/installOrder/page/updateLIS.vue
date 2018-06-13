<template>
  <div>
    <mt-header fixed :title="titleVal">
      <fallback slot="left"></fallback>
    </mt-header>
    <div class="mint-content zsBatch">
      <div class="readonly">
        <cus-field label="安装人员"
                   v-model="anName"></cus-field>
        <cus-field label="完成数量"
                   v-model="amount"></cus-field>
      </div>
      <div :class="{'readonly':read}">
        <cus-field label="抽查数量" tag="抽查数量"
                   type="number"
                   v-valid.positiveInteger
                   v-model="line['Spot Check Amount']"></cus-field>
        <cus-field label="合格数量" tag="合格数量"
                   type="number"
                   v-valid.number
                   v-model="line['Qualified Amount']"></cus-field>
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
  import buttonGroup from 'public/components/cus-button-group';
  import cusField from 'public/components/cus-field';
  import api from '../api/api';
  import {mapState, mapActions} from 'vuex';
  import Vue from 'vue';
  import vp from 'public/plugin/validator';
  Vue.use(vp);

  export default {
    name: 'updateLIS',
    created() {
      let param = this.$route.query;
      this.id = param.id;
      this.anName = param.anName;
      this.amount = param.amount;
    },
    data: () => {
      return {
        id: '',
        anName: '',
        amount: '',
        type: 'add', // add 新增 / edit 编辑 / read 只读
        titleVal: '真锁安装抽样',
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
      }
    },
    methods: {
      ...mapActions('app', ['getLov']),
      submitFn() {
        var self = this;
        tools.valid.call(this, () => {
          var lineObj = self.line;
          /* if (lineObj['Spot Check Amount']) { // 抽查数量有值 判断不能大于完成数量
            if (parseInt(lineObj['Spot Check Amount'], 10) > parseInt(self.amount, 10)) {
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
          }*/

          if (lineObj['Spot Check Amount']) { // 抽查数量有值 判断不能大于完成数量
            if (parseInt(lineObj['Spot Check Amount'], 10) > parseInt(self.amount, 10)) {
              Toast('抽查数量不能大于完成数量！');
              return;
            }
          }
          if (lineObj['Qualified Amount']) { // 合格数量有值
            if (!lineObj['Spot Check Amount']) {
              Toast('请填写抽查数量!');
              return;
            }
            if (parseInt(lineObj['Qualified Amount'], 10) > parseInt(lineObj['Spot Check Amount'], 10)) {
              Toast('合格数量不能大于抽查数量！');
              return;
            }
          }
          if (lineObj['Unqualified Solve Amount']) {
            if (!lineObj['Spot Check Amount']) {
              Toast('请填写抽查数量!');
              return;
            }
            if (!lineObj['Qualified Amount']) {
              Toast('请填写合格数量！');
              return;
            }
            var numC = parseInt(lineObj['Spot Check Amount'], 10) - parseInt(lineObj['Qualified Amount'], 10);
            if (parseInt(lineObj['Unqualified Solve Amount'], 10) > numC) {
              Toast('异常处理数量不合理，不能大于抽查数量与合格数量的差值！');
              return;
            }
          }
          if (lineObj['Spot Check Amount'] && lineObj['Qualified Amount']) {
            if ((lineObj['Spot Check Amount'] !== lineObj['Qualified Amount']) && (!lineObj['Unqualified Solve Amount'] || !lineObj['Unqualified Desc'])) {
              Toast('请填写异常处理数量与异常描述！');
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
                  'Id': self.id, // 默认ID
                  'Activity Id': self.itemTask['Activity UID'],
                  'Completed Install Amount': self.amount, // 新增批次返回的ID
                  'Spot Check Amount': lineObj['Spot Check Amount'], // 新增批次返回的ID
                  'Qualified Amount': lineObj['Qualified Amount'], // 新增批次返回的ID
                  'Unqualified Solve Amount': lineObj['Unqualified Solve Amount'], // 新增批次返回的ID
                  'Unqualified Desc': lineObj['Unqualified Desc'], // 新增批次返回的ID
                  'Unqualified Solve Desc': lineObj['Unqualified Solve Desc'] // 新增批次返回的ID
                },
                success: function(data) {
                  if (!data.ERROR) {
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
                        parma.Id = self.itemTask.Id;
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
