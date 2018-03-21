<template>
  <div>
    <mt-header fixed :title="titleVal">
      <fallback slot="left"></fallback>
    </mt-header>
    <div class="mint-content zsBatch">
      <div :class="{'readonly':read}">
        <mt-field label="批次" placeholder="是"
                  :class="heartVisible"></mt-field>
        <mt-field is-link label="计划开始日期" placeholder="请输入签收数量"
                  :class="heartVisible"></mt-field>
        <mt-field is-link label="计划完成日期" placeholder="请输入签收数量"
                  :class="heartVisible"></mt-field>
        <mt-field label="是否委外" placeholder="请输入签收数量"
                  :class="heartVisible"></mt-field>
        <mt-field is-link label="委外安装员" placeholder="请输入签收数量"
                  :class="heartVisible"></mt-field>
        <mt-field is-link label="真锁交接日期" placeholder="请输入签收数量"
                  :class="heartVisible"></mt-field>

      </div>
      <attach :attach="attach.list"
              :edit="!read"
              :title="title">
      </attach>
      <button-group>
        <mt-button type="primary" class="single"
                   @click.native="nextClick">下一步</mt-button>
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
  import {mapState} from 'vuex';

  let right = [{
    content: '删除',
    style: { background: 'red', color: '#fff', 'font-size': '15px', 'line-height': '54px' },
    handler: () => this.$messagebox('delete')
  }];
  const NameSpace = 'zsBatch';

  export default {
    name: 'zsBatch',
    created: () => {
      let param = this.$route.query;
      this.item = param.item;
      console.dir(1);
    },
    data: () => {
      return {
        value: '',
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
    components: {buttonGroup}
  };
</script>
