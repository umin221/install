<template>
  <div>
    <mt-header fixed title="安装订单详情">
      <fallback slot="left"></fallback>
    </mt-header>
    <div class="mint-content mint-content-datail">
      <div class="mint-content-info">
        <mt-cell>
          <div slot="title" class="list-text"><span class="list-text-span">订单编码</span><span>AZ11111000</span></div>
          <div slot="title" class="list-text"><span class="list-text-span">项目名称</span><span>西南药都生态城-龙泉花园</span></div>
          <div slot="title" class="list-text"><span class="list-text-span">销售类型</span><span>工程</span></div>
          <div slot="title" class="list-text"><span class="list-text-span">安装数量</span><span>500</span></div>
          <div slot="title" class="mint-content-div"><div class="mint-content-xt" @click="butXttd">协同团队</div></div>
          <div slot="title" class="mint-content-xl" @click="is_show_fun">收起</div>
          <div slot="title" class="mint-content-xl xl" @click="is_show_fun"></div>
        </mt-cell>
      </div>
      <div style="height: 0.5rem;background: #eaeaea;" v-show="is_show_sx"></div>
      <div class="mint-content-info" v-show="is_show_sx">
        <mt-cell>
        <div slot="title" class="list-text"><span class="list-text-span">锁芯部分</span></div>
      </mt-cell>
        <div class="mint-sx-div">
          <mt-cell title="SZ6010指纹锁"  @click.native="getList" is-link>
            <span style="width: 120px">开向：左内开</span>
            <span>数量：200</span>
          </mt-cell>
          <mt-cell title="SZ6011指纹锁"  @click.native="getList" is-link>
            <span style="width: 120px">开向：左内开</span>
            <span>数量：100</span>
          </mt-cell>
        </div>
        <mt-cell>
          <div slot="title" class="list-text"><span class="list-text-span">锁体部分* 真锁</span></div>
        </mt-cell>
        <div class="mint-sx-div">
          <mt-cell title="SZ6010指纹锁"  @click.native="getList" is-link>
            <span style="width: 120px">开向：左内开</span>
            <span>数量：200</span>
          </mt-cell>
        </div>
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
  .mint-content-datail {
    .mint-cell-title {
    }
    .list-text-span {
      color: #a9acb1;
      margin-right: 0.5rem;
    }
    .mint-content-xl {
      text-align: center;
      color: #A2BBFC;
      font-size: 0.15rem;
    }
    .xl::before {
      font-family: "mintui";
      content: '\E601';
      font-size: 1rem;
    }
    .mint-content-div{
      width: 100%;
      height: 30px;
      text-align: right;
    }
    .mint-content-xt {
      border: 1px solid #cccccc;
      padding: 0.45rem 0.5rem;
      width: 3rem;
      display: initial;
      text-align: center;
      border-radius: 0.25rem;
      color: #A2BBFC;
      font-size: 0.15rem;
    }
    .mint-sx-div {
      margin-left: 0.5rem;
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
        is_show_sx: true,
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
