<template>
  <div>
    <mt-header fixed :title="titleVal">
      <fallback slot="left"></fallback>
    </mt-header>
    <div class="mint-content scanCode">
      <mt-cell is-link >
        <div slot="title" class="list-text"><span style="color:red">*</span>省市区</div>
      </mt-cell>
      <mt-cell title="安装详细地址"></mt-cell>
      <mt-field label=""  type="textarea" rows="4"></mt-field>
      <mt-cell>
        <div slot="title" class="list-text"><span style="color:red">*</span>产品条形码</div>
      </mt-cell>
      <mt-cell is-link >
        <div slot="title" class="list-text"><span style="color:red">*</span>产品型号</div>
      </mt-cell>
      <div class="button-cla"><mt-button @click.native="handleClick()">提交</mt-button></div>
    </div>
  </div>
</template>
<style lang="scss">
  .scanCode {
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
        titleVal: '扫码录入',
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
      handleClick() {
        console.dir('提交');
      }
    }
  };
</script>
