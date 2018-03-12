<!--委外团队列表-->
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
          @click.native="!pending.length && loadBottomFn({status:'待审批', list:'pending'})">待审批</mt-tab-item>
        <mt-tab-item id="valid"
          @click.native="!valid.length && loadBottomFn({status:'已生效', list:'valid'})">已生效</mt-tab-item>
        <mt-tab-item id="invalid"
          @click.native="!invalid.length && loadBottomFn({status:'已失效', list:'invalid'})">已失效</mt-tab-item>
      </mt-navbar>

      <!-- tab-container -->
      <mt-tab-container v-model="selected">
        <mt-tab-container-item id="pending">
          <cus-loadmore ref="pending"
                        @loadTop="loadTopFn"
                        @loadBottom="loadBottomFn"
                        :param="{status: '待审批', list: 'pending'}"
                        :topStatus="topStatus">
            <cus-cell class="multiple"
                      @click.native="toDetailFn(item.Id)"
                     :key="item.id"
                     :title="'合作伙伴名称:'+ item.Name"
                     v-for="item in pending"
                     is-link>
              <div class="mint-cell-sub-title" slot="title">合作伙伴负责人: {{item['KL Partner Owner Name']}}</div>
              <div class="mint-cell-sub-title" slot="title">联系电话: {{item['Main Phone Number']}}</div>
            </cus-cell>
          </cus-loadmore>
        </mt-tab-container-item>

        <mt-tab-container-item id="valid">
          <cus-loadmore ref="valid"
                        @loadTop="loadTopFn"
                        @loadBottom="loadBottomFn"
                        :param="{status: '已生效', list: 'valid'}"
                        :topStatus="topStatus">
            <cus-cell class="multiple"
                      @click.native="toDetailFn(item.Id)"
                     :key="item.id"
                     :title="'合作伙伴名称:'+ item.Name"
                     v-for="item in valid"
                     is-link>
              <div class="mint-cell-sub-title" slot="title">合作伙伴负责人: {{item['KL Partner Owner Name']}}</div>
              <div class="mint-cell-sub-title" slot="title">联系电话: {{item['Main Phone Number']}}</div>
            </cus-cell>
          </cus-loadmore>
        </mt-tab-container-item>

        <mt-tab-container-item id="invalid">
          <cus-loadmore ref="invalid"
                        @loadTop="loadTopFn"
                        @loadBottom="loadBottomFn"
                        :param="{status: '已失效', list: 'invalid'}"
                        :topStatus="topStatus">
            <cus-cell class="multiple"
                      @click.native="toDetailFn(item.Id)"
                      :key="item.id"
                      :title="'合作伙伴名称:'+ item.Name"
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

<script type="application/javascript">
  import {mapState, mapActions} from 'vuex';
  import cusLoadmore from 'public/components/cus-loadmore';
  import cusCell from 'public/components/cus-cell';

  const NAMESPACE = 'index';
  // mapp
  let mapp = config.mapp['status'];
  //
  let loader = function(...args) {
    let me = this;
    let event = args.pop();
    let list = args.pop();
    let param = Object.extend({
      callback: (data) => {
        me.$refs[list][event](data.length);
      }
    }, args.pop());
    // 获取团队列表
    me.getPartners(param);
  };

  export default {
    name: NAMESPACE,
    components: {cusLoadmore, cusCell},
    // 数据初始化
    created() {
      this.loadBottomFn({
        status: '待审批',
        list: 'pending'
      });
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
      ...mapState(NAMESPACE, ['pending', 'valid', 'invalid'])
    },
    methods: {
      ...mapActions(NAMESPACE, ['getPartners']),
      // 已失效顶部加载
      loadTopFn(param) {
        loader.call(this, {
          data: {
            'KL Partner Status': mapp[param.status]
          }
        }, param.list, 'onTopLoaded');
      },
      // 待审批底部加载
      loadBottomFn(param) {
        loader.call(this, {
          data: {
            'KL Partner Status': mapp[param.status]
          },
          more: true
        }, param.list, 'onBottomLoaded');
      },
      // 跳转搜索
      toSearchFn() {
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
