<template>
  <div>
    <mt-header fixed :title="titleVal">
      <fallback slot="left"></fallback>
      <mt-button slot="right" @click.native="editKey = false">编辑</mt-button>
    </mt-header>
    <div class="mint-content sign">
      <mt-cell is-link>
        <div slot="title" class="list-text"><span style="color:red">*</span>是否涉及开孔锁签收<input placeholder="是"/></div>
      </mt-cell>
      <mt-field label="签收数量" placeholder="1" type="number"></mt-field>
      <mt-field label="备注说明"  type="textarea" rows="4"></mt-field>
      <mt-cell>
        <div slot="title" class="list-text"><span style="color:red">*</span>附件：签收单据归档</div>
      </mt-cell>
      <div class="button-cla"><mt-button type="primary" @click.native="handleClick()">提交</mt-button></div>
    </div>
  </div>
</template>
<style lang="scss">
  .sign {
    .mint-cell-value textarea{
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
        editKey: true,
        titleVal: '开孔锁签收',
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
