<template>
  <div>
    <mt-header fixed title="安装订单详情">
      <fallback slot="left"></fallback>
    </mt-header>
    <div class="mint-content mint-content-datail">
      <div class="mint-content-info">
        <mt-cell>
          <div slot="title" class="list-text"><span>订单编码:</span><span>AZ11111000</span></div>
          <div slot="title" class="list-text"><span>项目名称:</span><span>西南药都生态城-龙泉花园</span></div>
          <div slot="title" class="list-text"><span>销售类型:</span><span>工程</span></div>
          <div slot="title" class="list-text"><span>安装数量:</span><span>500</span></div>
          <div slot="title" class="mint-content-xl" @click="is_show_fun"></div>
          <div class="mint-content-xt" @click="butXttd">协同团队</div>
        </mt-cell>
      </div>
      <div style="height: 0.5rem;background: #eaeaea;" v-show="is_show_sx"></div>
      <div class="mint-content-info" v-show="is_show_sx">
        <mt-cell>
          <div slot="title" class="list-text"><span>订单编码:</span><span>AZ11111000</span></div>
          <div slot="title" class="list-text"><span>项目名称:</span><span>西南药都生态城-龙泉花园</span></div>
          <div slot="title" class="list-text"><span>销售类型:</span><span>工程</span></div>
          <div slot="title" class="list-text"><span>安装数量:</span><span>500</span></div>
        </mt-cell>
      </div>
      <div style="height: 0.5rem;background: #eaeaea;"></div>
      <div class="mint-content-info">
        <mt-cell>
        </mt-cell>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
  .mint-content-xl {
    text-align: center;
  }
  .mint-content-xl::before {
    font-family: "mintui";
    content: '\E601';
    font-size: 1rem;
  }
  .mint-content-xt {
    border: 1px solid #000000;
    padding: 0.25rem 0.5rem;
    position: absolute;
    right: 0.5rem;
    border-radius: 0.25rem;
    color: #000000;
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
        is_show_sx: false,
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
      is_show_fun() {
        var self = this;
        if (self.is_show_sx) {
          self.is_show_sx = false;
        } else {
          self.is_show_sx = true;
        }
      },
      butXttd() {
        var self = this;
        self.$router.push('xttd');
      }
    }
  };
</script>
