<template>
  <div>
    <mt-header fixed :title="titleVal">
      <fallback slot="left"></fallback>
    </mt-header>
    <div class="mint-content zsBatch">
      <div :class="{'readonly':read}">
        <mt-field label="批次"></mt-field>
        <mt-cell title="计划开始日期" :class="heartVisible" @click.native="open('picker','Planned')" :value="planObj.Planned" is-link></mt-cell>
        <mt-cell title="计划完成日期" :class="heartVisible" @click.native="open('picker', 'Planned Completion')" :value="planObj['Planned Completion']" is-link></mt-cell>
        <cus-field label="完成数量"
                   type="number"
                   :class="heartVisible"
                   v-model="planObj['Completed Install Amount']"></cus-field>
        <mt-cell title="是否委外" :class="heartVisible">
          <mt-switch v-model="box1"></mt-switch>
        </mt-cell>
        <div v-show="box1">
          <mt-field is-link label="委外安装员"
                    :class="heartVisible" :value="planObj.isPrimaryMVGPosition"></mt-field>
          <mt-field is-link label="合作伙伴名称"></mt-field>
          <mt-cell title="真锁交接日期" @click.native="open('picker', 'Planned Completion')" :value="planObj['Planned Completion']" is-link></mt-cell>
        </div>
      </div>
      <div v-show="box1">
        <attach :attach="attach.list"
                :edit="!read"
                :title="title">
        </attach>
      </div>
      <div class="lock-line">
        <lock-line title="详细计划" @click="addPlanList('add')">
          <mt-cell-swipe v-for="(line, index) in planList" class="lock-line-cell enable" ref="body"
                         @click.native="addPlanList('read')"
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
      <button-group>
        <mt-button class="single"
                   @click.native="nextClick">下一步</mt-button>
      </button-group>
      <mt-datetime-picker
        ref="picker"
        v-model="pickerVisible"
        type="date"
        year-format="{value} 年"
        month-format="{value} 月"
        date-format="{value} 日"
        class="datetime"
        @confirm="handleChangePlan">
      </mt-datetime-picker>
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
  import lockLine from '../components/cusLockLine';
  import {mapState} from 'vuex';

  let right = [{
    content: '删除',
    style: { background: 'red', color: '#fff', 'font-size': '15px', 'line-height': '54px' },
    handler: () => this.$messagebox('delete')
  }];
  const NameSpace = 'zsBatch';

  export default {
    name: 'zsBatch',
    created() {
      let param = this.$route.query;
      this.item = param.item;
    },
    data: () => {
      return {
        value: '',
        pickerVisible: true,
        planObj: {},
        box1: true,
        type: 'add', // add 新增 / edit 编辑 / read 只读
        titleVal: '新建安装批次',
        item: '',
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
      ...mapState('batch', ['planList']),
      ...mapState(NameSpace, ['form', 'attach']),
      // 表单只读
      read() {
        return this.type === 'read';
      },
      right() {
        return this.state === 'valid' ? right : [];
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
        return type === 'add' ? (this.state === 'invalid' ? '补充委外合约' : '开孔锁签收') : '开孔锁签收详情';
      }
    },
    methods: {
      open(picker, key) {
        this.timeKey = key;
        this.$refs[picker].open();
      },
      handleChangePlan(value) {
        let me = this;
        var key = me.timeKey;
        me.planObj[key] = value.format('MM/dd/yyyy');
        console.dir(me.planObj);
        // me.startDate = value.format('MM/dd/yyyy'); // 后台存值格式
      },
      nextClick() {
        var self = this;
        this.$router.push({
          name: 'buildingInfo',
          query: {
            type: 'add',
            item: self.item
          }
        });
      }
    },
    components: {buttonGroup, cusField, lockLine}
  };
</script>
