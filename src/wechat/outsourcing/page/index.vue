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

      <mt-navbar v-show="navs['valid']" v-model="selected">
        <mt-tab-item v-for="(value, key) in navs"
                     v-text="value.label"
                     :id="key"
                     :key="key"
                     @click.native="!rows.length && loadBottomFn(key)"></mt-tab-item>
      </mt-navbar>

      <!-- tab-container -->
      <mt-tab-container v-model="selected">
        <mt-tab-container-item v-for="(value, key) in navs"
                               :key="key"
                               :id="key">
          <cus-loadmore :ref="key"
                        :param="key"
                        :topStatus="topStatus"
                        @loadTop="loadTopFn"
                        @loadBottom="loadBottomFn">
            <cus-cell class="multiple"
                      v-for="item in rows"
                      :key="item.id"
                      :title="'合作伙伴名称:'+ item.Name"
                      @click.native="toDetailFn(item.Id)"
                     is-link>
              <div class="mint-cell-sub-title" slot="title">负责人: {{item['KL Partner Owner Name']}}</div>
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

  const NAMESPACE = 'index';
  /**
   *
   * @param {String} type 操作列表
   * @param {Boolean} more 是否加载更多
   */
  let loader = function(...args) {
    let me = this;
    let type = args.shift();
    let more = args.shift();
    // 获取团队列表
    me.getPartners({
      type,
      more,
      callback: data => {
        me.$refs[type][0][more ? 'onBottomLoaded' : 'onTopLoaded'](data.length);
      }
    });
  };

  /**
   * 刷新列表
   * @param list
   */
  let refresh = function(list) {
    let me = this;
    list = list.split(',');
    KND.Native.getUserInfo((info) => {
      // 是否主管 非安装工程师，都是主管权限
      me.setManager(info['KL Primary Position Type LIC'] !== 'Field Service Engineer');
      // 获取数据
      for (var i in list) me.loadTopFn(list[i]);
      KND.Session.remove('refresh');
    });
  };

  export default {
    name: NAMESPACE,
    components: {cusLoadmore, cusCell},
    // 数据初始化
    created() {
      refresh.call(this, 'pending');
    },
    // 列表刷新
    activated() {
      // 清空委外详情表单
      this.clear();
      // 清空负责人选择
      this.selEngineer('');
      let list = KND.Session.get('refresh');
      if (list) refresh.call(this, list);
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
      ...mapState(NAMESPACE, ['navs', 'pending', 'valid', 'invalid', 'reject', 'isManager']),
      rows() {
        let type = this.selected;
        return this[type];
      }
    },
    methods: {
      ...mapActions(NAMESPACE, ['getPartners']),
      ...mapMutations(NAMESPACE, ['setManager']),
      ...mapMutations('detail', ['clear']),
      ...mapMutations('engineer', ['selEngineer']),
        // 已失效顶部加载
      loadTopFn(type) {
        loader.call(this, type, false);
      },
      // 待审批底部加载
      loadBottomFn(type) {
        loader.call(this, type, true);
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
