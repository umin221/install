<template>
  <div>
    <mt-header fixed :title="titleVal">
      <fallback slot="left"></fallback>
    </mt-header>
    <div class="mint-content batchDetail" :class="{'disable': !editable}">
      <div>
        <mt-cell title="批次">
          <span>{{batchCode}}</span>
        </mt-cell>
        <mt-cell title="计划开始日期"  :value="start_Date"></mt-cell>
        <mt-cell title="计划完成日期" :value="end_Date"></mt-cell>
        <mt-field label="计划开孔数量"
                  :class="heartVisible" v-model="batchNum"></mt-field>
      </div>
      <div class="lock-line" v-show="is_plan">
        <lock-line title="详细计划">
          <mt-cell-swipe v-for="(line, index) in planList" class="lock-line-cell enable" ref="body"
                         @click.native="addPlanList(line)"
                         :key=index
                         is-link>
            <div class="co-flex co-jc" slot="title">
            <span class="co-f1">{{line.Description}}</span>
            <span class="co-f1">{{line.TODO_TYPE}}</span>
          </div>
            <div class="co-flex co-jc" slot="title">
              <span class="co-f1">{{line.Planned}}</span>
              <span class="co-f1">{{line['Planned Completion']}}</span>
            </div>
          </mt-cell-swipe>
        </lock-line>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
  .batchDetail {
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
  import {mapActions} from 'vuex';
  import buttonGroup from 'public/components/cus-button-group';
  import lockLine from '../components/cusLockLine';
  import api from '../api/api';
  export default {
    name: 'batchDetail',
    created() {
      var self = this;
      let param = this.$route.query;
      this.id = param.Id;
      this.option = param.option; // 区分从哪跳转到详情页
      if (this.option === 'approval') {
        this.is_option = true; // 是否审批
      }
      self.titleVal = '批次详情';
      this.getBatch(this.id);
      if (param.type === '') {
        self.is_show = true;
      }
    },
    data: () => {
      return {
        value: '',
        batchCode: '', // 批次
        option: '', // 区分从哪跳转到详情页
        is_plan: true, // 是否显示详细计划
        is_option: false, // 是否审批
        is_show: false, // 是否显示委外、附件    只有替代锁 真锁 才会显示
        start_Date: '',        // 开始时间
        end_Date: '',        // 结束时间
        batchNum: 0, // 数量
        planList: [],
        id: '',
        item: '',
        editable: false,
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
      // * 是否显示
      heartVisible() {
        return this.type === 'read' ? '' : 'require';
      }
    },
    methods: {
      ...mapActions('app', ['getLov']),
      addPlanList(item) {
        this.$router.push({
          name: 'detailPlan',
          query: {
            type: 'read',
            item: item
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
            console.dir(data);
            if (data['KL Detail Type LIC'] === 'Trompil Batch Summary' ||
              data['KL Detail Type LIC'] === 'Lock Body Install Summary' ||
              data['KL Detail Type LIC'] === 'Door Hanging Acc Batch' ||
              data['KL Detail Type LIC'] === 'Substitution Lock Inst Summary' ||
              data['KL Detail Type LIC'] === 'Subst Lock Trans Summary' ||
              data['KL Detail Type LIC'] === 'Lock Installation Summary' ||
              data['KL Detail Type LIC'] === 'Check Before Trans Summary' ||
              data['KL Detail Type LIC'] === 'Transfer Summary') { // 汇总详情不需要获取详细计划数据 也不需要显示
              self.is_plan = false;
              self.titleVal = '汇总详情';
            } else {
              self.getPlanList(id);
            }
            self.batchCode = data.Id; // 批次
            if (data.Planned) {
              self.start_Date = new Date(data.Planned).format('yyyy-MM-dd'); // 开始时间
            }
            if (data['Planned Completion']) {
              self.end_Date = new Date(data['Planned Completion']).format('yyyy-MM-dd') || ''; // 结束时间
            }
            self.batchNum = data['KL Install Amount Requested'] || 0; // 数量
          }
        });
      },
      getPlanList(id) {
        var self = this;
        self.planList = [];
        api.get({ // 提交数据
          key: 'getPlan',
          method: 'GET',
          data: {
            id: id
          },
          success: function(data) {
            if (data.items) {
              self.planList = data.items;
            } else {
              self.planList = KND.Util.toArray(data);
            }
          }
        });
      }
    },
    components: {buttonGroup, lockLine}
  };
</script>
