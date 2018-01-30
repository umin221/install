<template>
  <div>
    <mt-header fixed title="委外人员管理">
      <fallback slot="left"></fallback>
      <router-link to="search" slot="right">
        <mt-button>
          <i class="xs-icon icon-search"></i>
        </mt-button>
      </router-link>
      <router-link :to="toAdd" slot="right">
        <mt-button>
          <i class="xs-icon icon-add"></i>
        </mt-button>
      </router-link>
    </mt-header>

    <div class="mint-content">

      <mt-navbar v-model="selected">
        <mt-tab-item id="pending">待审批</mt-tab-item>
        <mt-tab-item id="valid">已生效</mt-tab-item>
        <mt-tab-item id="invalid">已失效</mt-tab-item>
      </mt-navbar>

      <!-- tab-container -->
      <mt-tab-container v-model="selected">
        <mt-tab-container-item id="pending">
          <loadmore ref="load" :loadTop="loadTop" :loadBottom="loadBottom" :topStatus="topStatus" :allLoaded="true">
            <mt-cell class="multiple"
                     :key="item.id"
                     @click.native="toDetail"
                     v-for="item in pendingList"
                     is-link>
              <div class="mint-cell-title" slot="title">合作伙伴名称: {{item.title}}</div>
              <div class="mint-cell-sub-title" slot="title">合作伙伴负责人: {{item.contact}}</div>
              <div class="mint-cell-sub-title" slot="title">联系电话: {{item.phone}}</div>
            </mt-cell>
          </loadmore>
        </mt-tab-container-item>

        <mt-tab-container-item id="valid">
          <loadmore ref="load" :loadTop="loadTop" :loadBottom="loadBottom" :topStatus="topStatus" :allLoaded="true">
            <mt-cell class="multiple"
                     :key="item.id"
                     @click.native="toDetail"
                     v-for="item in validList"
                     is-link>
              <div class="mint-cell-title" slot="title">合作伙伴名称: {{item.title}}</div>
              <div class="mint-cell-sub-title" slot="title">合作伙伴负责人: {{item.contact}}</div>
              <div class="mint-cell-sub-title" slot="title">联系电话: {{item.phone}}</div>
            </mt-cell>
          </loadmore>
        </mt-tab-container-item>

        <mt-tab-container-item id="invalid">
          <mt-cell class="multiple"
                   :key="item.id"
                   @click.native="toDetail"
                   v-for="item in invalidList"
                   is-link>
            <div class="mint-cell-title" slot="title">合作伙伴名称: {{item.title}}</div>
            <div class="mint-cell-sub-title" slot="title">合作伙伴负责人: {{item.contact}}</div>
            <div class="mint-cell-sub-title" slot="title">联系电话: {{item.phone}}</div>
          </mt-cell>
        </mt-tab-container-item>
      </mt-tab-container>

    </div>

  </div>
</template>

<script type="es6">
  import {mapActions} from 'vuex';
  import loadmore from 'public/components/cus-loadmore';
  import api from '../api/api';

  const NameSpace = 'index';
  export default {
    name: NameSpace,
    // 数据初始化
    created() {
      let me = this;
      api.get({
        key: 'getList',
        success: function(data) {
          me.pendingList = data.pendingList;
          me.validList = data.validList;
          me.invalidList = data.invalidList;
        }
      });
    },
    data: () => {
      return {
        // 活跃tab
        selected: 'pending',
        // 数据列表
        pendingList: '',
        validList: '',
        invalidList: '',
        // 下拉状态
        topStatus: '',
        // 跳转新增
        toAdd: {
          path: '/detail',
          query: {
            type: 'add'
          }
        }
      };
    },
    methods: {
      ...mapActions(NameSpace, ['getList']),
      // 顶部加载
      loadTop() {
        var me = this;
        console.log('top ');
        me.$refs.load.onTopLoaded();
      },
      // 底部加载
      loadBottom() {
        var me = this;
        setTimeout(function() {
          console.log('bottom ');
          me.$refs.load.onBottomLoaded();
        }, 1000);
      },
      // 跳转详情
      toDetail() {
        // 跳转详情
        this.$router.push({
          name: 'detail',
          query: {
            type: 'read',
            state: this.selected
          }
        });
      }
    },
    components: {loadmore}
  };
</script>
