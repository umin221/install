<!--详情、新增、编辑等页面复用-->
<template>
  <div>
    <mt-header fixed :title="title">
      <fallback slot="left"></fallback>
      <mt-button v-show="read && state==='valid'" slot="right"
                 @click="type = 'edit'">编辑</mt-button>
    </mt-header>

    <div class="mint-content">
      <mt-field class="require" :readonly="read" label="合作伙伴名称" placeholder="请输入名称"></mt-field>
      <mt-field class="require" :readonly="read" label="合作伙伴负责人" placeholder="请输入负责人"></mt-field>
      <mt-field label="联系电话" :readonly="read" placeholder="请输入电话" type="tel"></mt-field>
      <mt-field class="require" :readonly="read" label="移动电话" placeholder="请输入手机号" type="tel"></mt-field>
      <mt-field class="require" :readonly="read" label="详细地址" placeholder="请输入地址"></mt-field>
      <mt-field class="require" :readonly="read" label="合同附件"></mt-field>
    </div>

    <div class="page-button-group">
      <mt-button v-show="type==='add'" size="large" type="primary" @click.native="submitFn">提交</mt-button>
      <mt-button v-show="type==='edit'" size="large" type="primary" @click.native="submitFn">失效</mt-button>
      <mt-button v-show="read && state==='invalid'" size="large" type="primary" @click="type='add'">重新启动</mt-button>
    </div>
  </div>
</template>

<script type="es6">
  export default {
    // 初始化
    created() {
      let param = this.$route.query;
      this.state = param.state;
      this.type = param.type;
    },
    data: () => {
      return {
        type: 'add', // add 新增 / edit 编辑 / read 只读
        state: 'pending' // pending 待审批 / valid 已生效 / invalid 未生效
      };
    },
    computed: {
      read() {
        return this.type === 'read';
      },
      /**
       * 根据当前状态和类型判断标题展示
       * 新建&重新启用界面复用 仅标题不一样
       * 查看&编辑标题一致
       */
      title() {
        let type = this.type;
        return type === 'add' ? (this.state === 'invalid' ? '补充委外合约' : '创建委外团队') : '委外团队详情';
      }
    },
    methods: {
      submitFn() {
        // pending
        this.state = this.state === 'add' ? 'edit' : 'read';
      }
    }
  };
</script>

<style lang="scss">
  .page-button-group {
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: 6px 10px;
    box-sizing: border-box;
  }
</style>
