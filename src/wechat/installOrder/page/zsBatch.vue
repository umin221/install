<template>
  <div>
    <mt-header fixed :title="titleVal">
      <fallback slot="left"></fallback>
    </mt-header>
    <div class="mint-content zsBatch">
      <mt-cell title="批次">
        <span>201712010001</span>
      </mt-cell>
      <mt-cell title="计划开始日期" is-link>
        <span></span>
      </mt-cell>
      <mt-cell title="计划完成日期" is-link>
        <span></span>
      </mt-cell>
      <mt-cell title="是否委外" is-link>
        <span></span>
      </mt-cell>
      <mt-cell title="委外负责人" is-link>
        <span></span>
      </mt-cell>
      <mt-cell title="真锁实物交接日期" is-link>
        <span></span>
      </mt-cell>
      <mt-cell>
        <div slot="title" class="list-text"><span style="color:red">*</span>附件：签收单据归档</div>
      </mt-cell>
      <div class="button-cla"><mt-button type="primary" @click.native="handleClick()">下一步</mt-button></div>
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
  export default {
    name: 'detail',
    created: () => {
      console.dir(1);
    },
    data: () => {
      return {
        value: '',
        titleVal: '新建安装批次',
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
