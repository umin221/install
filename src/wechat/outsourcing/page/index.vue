<template>
  <div>
    <mt-header fixed title="委外人员管理">
      <fallback slot="left"></fallback>
      <mt-button @click.native="toSearchFn" slot="right">
        <i class="xs-icon icon-search"></i>
      </mt-button>
      <!--<router-link :to="toAdd" >-->
      <mt-button @click.native="toDetailFn" slot="right">
        <i class="xs-icon icon-add"></i>
      </mt-button>
      <!--</router-link>-->
    </mt-header>

    <div class="mint-content">

      <mt-navbar v-model="selected">
        <mt-tab-item id="pending"
          @click.native="!pending.length && pendingLoadBottomFn()">待审批</mt-tab-item>
        <mt-tab-item id="valid"
          @click.native="!valid.length && validLoadBottomFn()">已生效</mt-tab-item>
        <mt-tab-item id="invalid"
          @click.native="!invalid.length && invalidLoadBottomFn()">已失效</mt-tab-item>
      </mt-navbar>

      <!-- tab-container -->
      <mt-tab-container v-model="selected">
        <mt-tab-container-item id="pending">
          <cus-loadmore ref="pending"
                        :loadTop="pendingLoadTopFn"
                        :loadBottom="pendingLoadBottomFn"
                        :topStatus="topStatus">
            <cus-cell class="multiple"
                     :key="item.id"
                     :title="'合作伙伴名称:'+ item.Name"
                     @click.native="toDetailFn(item.Id)"
                     v-for="item in pending"
                     is-link>
              <div class="mint-cell-sub-title" slot="title">合作伙伴负责人: {{item['KL Partner Owner Name']}}</div>
              <div class="mint-cell-sub-title" slot="title">联系电话: {{item['Main Phone Number']}}</div>
            </cus-cell>
          </cus-loadmore>
        </mt-tab-container-item>

        <mt-tab-container-item id="valid">
          <cus-loadmore ref="valid"
                        :loadTop="validLoadTopFn"
                        :loadBottom="validLoadBottomFn"
                        :topStatus="topStatus">
            <cus-cell class="multiple"
                     :key="item.id"
                     :title="'合作伙伴名称:'+ item.Name"
                     @click.native="toDetailFn(item.Id)"
                     v-for="item in valid"
                     is-link>
              <div class="mint-cell-sub-title" slot="title">合作伙伴负责人: {{item['KL Partner Owner Name']}}</div>
              <div class="mint-cell-sub-title" slot="title">联系电话: {{item['Main Phone Number']}}</div>
            </cus-cell>
          </cus-loadmore>
        </mt-tab-container-item>

        <mt-tab-container-item id="invalid">
          <cus-loadmore ref="invalid"
                        :loadTop="invalidLoadTopFn"
                        :loadBottom="invalidLoadBottomFn"
                        :topStatus="topStatus">
            <cus-cell class="multiple"
                      :key="item.id"
                      :title="'合作伙伴名称:'+ item.Name"
                      @click.native="toDetailFn(item.Id)"
                      v-for="item in invalid"
                      is-link>
              <div class="mint-cell-sub-title" slot="title">合作伙伴负责人: {{item['KL Partner Owner Name']}}</div>
              <div class="mint-cell-sub-title" slot="title">联系电话: {{item['Main Phone Number']}}</div>
            </cus-cell>
          </cus-loadmore>

        </mt-tab-container-item>
      </mt-tab-container>

    </div>

  </div>
</template>

<script type="es6">
  import {mapState, mapActions, mapMutations} from 'vuex';
  import cusLoadmore from 'public/components/cus-loadmore';
  import cusCell from 'public/components/cus-cell';

  // 每页加载条数
  const COUNT = config.pageSize;
  //
  let loader = function(...args) {
    let me = this;
    let event = args.pop();
    let list = args.pop();
    let param = args.pop();
    me.getPartners(Object.assign({
      callback: (data) => {
        me.$refs[list][event](data.length < COUNT);
      }
    }, param));
  }

  const NameSpace = 'index';
  export default {
    name: NameSpace,
    components: {cusLoadmore, cusCell},
    // 数据初始化
    created() {
      loader.call(this, 'pending', 'onBottomLoaded');
    },
    data: () => {
      return {
        // 活跃tab
        selected: 'pending',
        // 下拉状态
        topStatus: ''
      };
    },
    computed: {
      ...mapState(NameSpace, ['pending', 'valid', 'invalid']),
    },
    methods: {
      ...mapActions(NameSpace, ['getPartners']),
      ...mapMutations('app', ['setTransitionName']),
      // 待审批顶部加载
      pendingLoadTopFn() {
        loader.call(this, 'pending', 'onTopLoaded');
      },
      // 有效顶部加载
      validLoadTopFn() {
        loader.call(this, {
          status: '有效',
        }, 'valid', 'onTopLoaded');
      },
      // 失效顶部加载
      invalidLoadTopFn() {
        loader.call(this, {
          status: '失效',
        }, 'invalid', 'onTopLoaded');
      },
      // 待审批底部加载
      pendingLoadBottomFn() {
        loader.call(this, {
          more: true
        }, 'pending', 'onBottomLoaded');
      },
      // 有效底部加载
      validLoadBottomFn() {
        loader.call(this, {
          more: true,
          status: '有效',
        }, 'valid', 'onBottomLoaded');
      },
      // 失效底部加载
      invalidLoadBottomFn() {
        loader.call(this, {
          more: true,
          status: '失效',
        }, 'invalid', 'onBottomLoaded');
      },
      // 跳转搜索
      toSearchFn() {
        this.setTransitionName(['turn-up', 'turn-down']);
        this.$router.push('search');
      },
      // To detail or create
      toDetailFn(id) {
        let query = typeof id === 'string' ? {
          // detail
          type: 'read',
          state: this.selected,
          id: id
        } : {
          // create
          type: 'add'
        };
        this.$router.push({
          name: 'detail',
          query: query
        });
      }
    }
  };
</script>
