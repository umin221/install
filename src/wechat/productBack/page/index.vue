<template>
  <div style="background-color: #ebebeb;">
    <mt-header fixed title="配件退入">
      <fallback slot="left"></fallback>
      <mt-button @click.native="toAdd" slot="right">
        <i class="xs-icon icon-add"></i>
      </mt-button>
    </mt-header>
    <div class="mint-content">
      <mt-navbar v-model="selected">
        <mt-tab-item id="pending"
                     @click.native="!pending.length && loadBottomFn({status:'待处理', list:'pending'})">待处理</mt-tab-item>
        <mt-tab-item id="valid"
                     @click.native="!valid.length && loadBottomFn({status:'处理中', list:'valid'})">处理中</mt-tab-item>
        <mt-tab-item id="invalid"
                     @click.native="!invalid.length && loadBottomFn({status:'已完成', list:'invalid'})">已完成</mt-tab-item>
      </mt-navbar>
      <mt-tab-container v-model="selected">
        <mt-tab-container-item id="pending">
          <loadmore ref="pending"
                    :allLoaded="true"
                    @loadTop="loadTopFn"
                    :topStatus="topStatus"
                    @loadBottom="loadBottomFn"
                    :param="{status:'待处理', list:'pending'}">
            <cus-cell
              class="multiple border-bottom"
              :title="'退入编号'+ item['Order Number']"
              v-for="(item,index) in pending"
              @click.native="toDateil(item.Id)"
              :key="index"
              is-link>
              <div class="mint-cell-sub-title" slot="title">领用人: {{item['KL Primary Owner']}}</div>
              <div class="mint-cell-sub-title" slot="title">申请领用日期: {{item['Order Date']}}</div>
            </cus-cell>
          </loadmore>
        </mt-tab-container-item>
        <mt-tab-container-item id="valid">
          <loadmore ref="valid"
                    :allLoaded="true"
                    @loadTop="loadTopFn"
                    :topStatus="topStatus"
                    @loadBottom="loadBottomFn"
                    :param="{status:'处理中', list:'valid'}">
            <cus-cell
              class="multiple"
              :title="'退入编号'+ item['Order Number']"
              @click.native="toDateil(item.Id)"
              v-for="(item,index) in valid"
              :key="index"
              is-link>
              <div class="mint-cell-sub-title" slot="title">领用人: {{item['KL Primary Owner']}}</div>
              <div class="mint-cell-sub-title" slot="title">申请领用日期: {{item['Order Date']}}</div>
            </cus-cell>
          </loadmore>
        </mt-tab-container-item>
        <mt-tab-container-item id="invalid">
          <loadmore ref="invalid"
                    :allLoaded="true"
                    @loadTop="loadTopFn"
                    :topStatus="topStatus"
                    @loadBottom="loadBottomFn"
                    :param="{status:'已完成', list:'invalid'}">
            <cus-cell
              class="multiple"
              :title="'退入编号'+ item['Order Number']"
              @click.native="toDateil(item.Id)"
              v-for="(item,index) in invalid"
              :key="index"
              is-link>
            <div class="mint-cell-sub-title" slot="title">退入人: {{item['KL Primary Owner']}}</div>
              <div class="mint-cell-sub-title" slot="title">申请退入日期: {{item['Order Date']}}</div>
            </cus-cell>
          </loadmore>
        </mt-tab-container-item>
      </mt-tab-container>
    </div>
  </div>
</template>
<script type="application/javascript">
  import {mapState, mapActions, mapMutations} from 'vuex';
  import loadmore from 'public/components/cus-loadmore';
  import cusCell from 'public/components/cus-cell';
  //
  const NameSpace = 'index';
  let loader = function(...args) {
    let me = this;
    let event = args.pop();
    let list = args.pop();
    let param = Object.extend(true, {
      callback: (data) => {
        me.$refs[list][event](data.length);
      }
    }, args.pop() || {});
    // 获取团队列表
    me.getList(param);
  };
  export default {
    name: NameSpace,
    created() {
      let me = this;
      KND.Native.getUserInfo((info) => {
        config.userInfo = info;
        // 是否主管 非安装工程师，都是主管权限
        me.setManager(info['KL Primary Position Type LIC'] !== 'Field Service Engineer');
        me.loadBottomFn({
          status: '待处理',
          list: 'pending'
        });
      });
    },
    data: () => {
      return {
        selected: 'pending',
        topStatus: '',
        isSelect: []
      };
    },
    computed: {
      ...mapState(NameSpace, ['pending', 'valid', 'invalid'])
    },
    methods: {
      ...mapActions(NameSpace, ['getList']),
      ...mapActions('app', ['getLov']),
      ...mapMutations(NameSpace, ['setManager']),
      ...mapMutations('add', ['initSelect']),
      toDateil(id) {
        this.$router.push({
          name: 'detail',
          query: {
            Id: id
          }
        });
      },
      toAdd() {
        this.initSelect();
        this.$router.push('add');
      },
      loadTopFn(param) {
        loader.call(this, {
          data: {
            'Status': param.status
          }
        }, param.list, 'onTopLoaded');
      }, // 底部加载
      loadBottomFn(param) {
        loader.call(this, {
          data: {
            'Status': param.status
          },
          more: true
        }, param.list, 'onBottomLoaded');
      }
    },
    components: {loadmore, cusCell}
  };
</script>
<style lang="scss">
  .productForm{
    line-height: 1.5rem;
  }
  .border-bottom{
    border-bottom: 1px solid #dcdcdc;
  }
</style>
