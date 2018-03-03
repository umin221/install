<!--详情、新增、编辑等页面复用-->
<template>
  <div>
    <mt-header fixed :title="title">
      <fallback slot="left"></fallback>
      <mt-button v-show="read && isValid" slot="right"
                 @click="type = 'edit'">编辑</mt-button>
    </mt-header>

    <div class="mint-content wide-form">
      <div :class="{'readonly':read}">
        <mt-field label="涉及开孔锁签收" placeholder="是"
                  :class="heartVisible"></mt-field>
        <mt-field label="签收数量" placeholder="请输入签收数量"
                  :class="heartVisible"></mt-field>
        <mt-field label="备注说明" type="textarea" rows="4"></mt-field>
      </div>
      <attach :attach="attach.list"
              :edit="!read"
              :title="title">
      </attach>
    </div>

    <button-group>
      <mt-button type="primary" class="single"
                 @click.native="submitFn">提交</mt-button>
    </button-group>
  </div>
</template>

<script type="es6">
  import {mapState, mapActions} from 'vuex';
  import titleGroup from 'public/components/cus-title-group';
  import buttonGroup from 'public/components/cus-button-group';

  // Right button
  let right = [{
    content: '删除',
    style: { background: 'red', color: '#fff', 'font-size': '15px', 'line-height': '54px' },
    handler: () => this.$messagebox('delete')
  }];

  const NameSpace = 'sign';
  export default {
    // 初始化
    created() {
      let param = this.$route.query;
      this.state = param.state;
      this.type = param.type;
      // 获取详情
     // this.getSign(param.id);
    },
    data: () => {
      return {
        type: 'add', // add 新增 / edit 编辑 / read 只读
        state: 'pending', // pending 待审批 / valid 已生效 / invalid 未生效
        button: {
          list: [{
            text: '提交'
          }]
        }
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
      // 已生效
      isValid() {
        return this.state === 'valid';
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
      ...mapActions(NameSpace, ['getSign']),
      submitFn() {
        // pending
        this.state = this.state === 'add' ? 'edit' : 'read';
      }
    },
    components: {titleGroup, buttonGroup}
  };
</script>

<style lang="scss">
  .wide-form {
    .mint-cell-title {
      width: 130px;
    }
  }

  .mint-content {
    margin-bottom: 2.8rem;
  }
</style>
