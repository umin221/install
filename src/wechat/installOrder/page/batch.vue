<template>
  <div>
    <mt-header fixed title="titleVal">
      <fallback slot="left"></fallback>
    </mt-header>
    <div class="mint-content batch">
      <mt-cell title="批次">
        <span>201712010001</span>
      </mt-cell>
      <mt-cell title="计划开始日期" is-link>
        <span></span>
      </mt-cell>
      <mt-cell title="计划完成日期" is-link>
        <span></span>
      </mt-cell>
      <mt-cell title="计划开孔数量" is-link>
        <span></span>
      </mt-cell>
      <div class="button-cla"><mt-button type="primary" @click.native="handleClick()">提交</mt-button></div>
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
  }
</style>
<script type="application/javascript">
  export default {
    name: 'detail',
    created: () => {
      console.dir(1);
      var self = this;
      self.titleVal = '新建开孔批次';
    },
    data: () => {
      return {
        value: '',
        titleVal: '新建开孔批次',
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
      }
    }
  };
</script>
