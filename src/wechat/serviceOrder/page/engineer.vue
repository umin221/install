<!--选择联系人-->
<template>
  <div>
    <cus-search placeholder="请输入姓名"
                v-model="value"
                :show="true">

      <cus-loadmore ref="result"
                  :loadBottom="loadBottomFn"
                  :topStatus="topStatus">
        <mt-cell class="multiple"
                  v-for="item in result"
                  :key="item.id"
                  @click.native="selectFn(item)"
                  is-link>
          <div class="mint-cell-title" slot="title">姓名: {{item['Last Name']}}</div>
          <div class="mint-cell-sub-title" slot="title">工号: {{item['Emp #']}}</div>
          <div class="mint-cell-sub-title" slot="title">部门: {{item['KL Primary Division Name']}}</div>
        </mt-cell>
      </cus-loadmore>

    </cus-search>
  </div>
</template>

<script type="application/javascript">
  import {mapState, mapActions, mapMutations} from 'vuex';
  import cusLoadmore from 'public/components/cus-loadmore';
  import cusSearch from 'public/components/cus-search';
  import cusCell from 'public/components/cus-cell';
//  import { MessageBox } from 'mint-ui';
  //
  let loader = function(...args) {
    let me = this;
    let event = args.pop();
    let name = me.value;
    let param = {
      more: args.pop(),
      data: {
        'position': '产品安装工程师||产品安装主管',
        'Last Name': name
      },
      callback: (data) => {
        me.$refs.result[event](data.length);
      }
    };
    // 获取团队列表
    me.findContact(param);
  };

  const NAMESPACE = 'contact';
  export default {
    name: 'search',
    // 获取默认数据
    created() {
      loader.call(this, 'onBottomLoaded');
    },
    components: {cusLoadmore, cusSearch, cusCell},
    data: () => {
      return {
        value: '',
        topStatus: ''
      };
    },
    computed: {
      ...mapState(NAMESPACE, ['result', 'select'])
    },
    methods: {
      ...mapActions(NAMESPACE, ['findContact', 'setContact']),
      ...mapActions('index', ['getList']),
      ...mapMutations(NAMESPACE, ['selContact']),
      /**
       * 搜索回调
       * @param {String} val 搜索值
       */
      searchFn(val) {
        loader.call(this, 'onBottomLoaded');
      },
      /**
       * select
       * @param {Object} item 用户选择结果
       */
      selectFn(item) {
        let me = this;
        MessageBox.confirm('是否指派给该工程师！', '').then(action => {
          let params = {
            id: me.$route.query.id,
            empId: item['Id'],
            empFullName: item['KL Employee Full Name']
          };
          this.setContact(params);
          me.$router.push('/');
        });
      },
      /**
       * Load more
       */
      loadBottomFn() {
        loader.call(this, {
          more: true
        }, 'onBottomLoaded');
      }
    }
  };
</script>

<style lang="scss">
  .mint-cell {
    .mint-cell-title {
      width: auto;
    }
  }
</style>
