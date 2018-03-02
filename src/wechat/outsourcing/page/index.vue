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
        <mt-tab-item id="pending"
          @click.native="!pending && getPartners('待审批')">待审批</mt-tab-item>
        <mt-tab-item id="valid"
          @click.native="!valid && getPartners('有效')">已生效</mt-tab-item>
        <mt-tab-item id="invalid"
          @click.native="!invalid && getPartners('失效')">已失效</mt-tab-item>
      </mt-navbar>

      <!-- tab-container -->
      <mt-tab-container v-model="selected">
        <mt-tab-container-item id="pending">
          <loadmore ref="load" :loadTop="loadTop" :loadBottom="loadBottom" :topStatus="topStatus" :allLoaded="true">
            <cus-cell class="multiple"
                     :key="item.id"
                     :title="'合作伙伴名称:'+ item.Name"
                     @click.native="toDetail(item.Id)"
                     v-for="item in pending"
                     is-link>
              <div class="mint-cell-sub-title" slot="title">合作伙伴负责人: {{item['KL Partner Owner Name']}}</div>
              <div class="mint-cell-sub-title" slot="title">联系电话: {{item['Main Phone Number']}}</div>
            </cus-cell>
          </loadmore>
        </mt-tab-container-item>

        <mt-tab-container-item id="valid">
          <loadmore ref="load" :loadTop="loadTop" :loadBottom="loadBottom" :topStatus="topStatus" :allLoaded="true">
            <cus-cell class="multiple"
                     :key="item.id"
                     :title="'合作伙伴名称:'+ item.Name"
                     @click.native="toDetail(item.Id)"
                     v-for="item in valid"
                     is-link>
              <div class="mint-cell-sub-title" slot="title">合作伙伴负责人: {{item['KL Partner Owner Name']}}</div>
              <div class="mint-cell-sub-title" slot="title">联系电话: {{item['Main Phone Number']}}</div>
            </cus-cell>
          </loadmore>
        </mt-tab-container-item>

        <mt-tab-container-item id="invalid">
          <cus-cell class="multiple"
                   :key="item.id"
                   :title="'合作伙伴名称:'+ item.Name"
                   @click.native="toDetail(item.Id)"
                   v-for="item in invalid"
                   is-link>
            <div class="mint-cell-sub-title" slot="title">合作伙伴负责人: {{item['KL Partner Owner Name']}}</div>
            <div class="mint-cell-sub-title" slot="title">联系电话: {{item['Main Phone Number']}}</div>
          </cus-cell>
        </mt-tab-container-item>
      </mt-tab-container>

    </div>

  </div>
</template>

<script type="es6">
  import {mapState, mapActions} from 'vuex';
  import loadmore from 'public/components/cus-loadmore';
  import cusCell from 'public/components/cus-cell';

  const NameSpace = 'index';
  export default {
    name: NameSpace,
    components: {loadmore, cusCell},
    // 数据初始化
    created() {
      this.getPartners();
    },
    data: () => {
      return {
        // 活跃tab
        selected: 'pending',
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
    computed: {
      ...mapState(NameSpace, ['pending', 'valid', 'invalid']),
    },
    methods: {
      ...mapActions(NameSpace, ['getPartners']),
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
      toDetail(id) {
        // 跳转详情
        this.$router.push({
          name: 'detail',
          query: {
            type: 'read',
            state: this.selected,
            id: id
          }
        });
      }
    }
  };
</script>
