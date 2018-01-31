<template>
  <div>
    <mt-header fixed title="状态更新">
      <fallback slot="left"></fallback>
    </mt-header>
    <div class="mint-content updateState">
      <mt-cell>
        <div slot="title" class="list-text"><span style="color:red">*</span>关闭原因</div>
      </mt-cell>
      <mt-field label="" placeholder="请输入关闭原因" type="textarea" rows="8"></mt-field>
      <div class="button-cla"><mt-button type="primary" @click.native="handleClick()">提交</mt-button></div>
    </div>
  </div>
</template>
<style lang="scss">
  .updateState {
    .mint-cell-value {
      border: 1px solid #d9d9d9;
      border-radius: 0.1rem;
      margin-top: 0.5rem;
    }
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
  }
</style>
<script type="application/javascript">
  export default {
    name: 'detail',
    created: () => {
      console.dir(1);
    },
    data: () => {
      return {
        value: '',
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
    methods: {
      butXttd() {
        var self = this;
        self.$router.go('/xttd');
      },
      handleClick() {
        history.go(-1);
      }
    }
  };
</script>
