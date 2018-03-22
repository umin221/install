<template>
  <div class="search">
    <cus-search v-model="value"
                placeholder="请输入订单号或者负责人">

        <cus-loadmore ref="result"
                      @loadBottom="loadBottomFn"
                      :topStatus="topStatus">
          <cus-cell class="multiple"
                    :key="item.id"
                    :title="'维修订单号:'+ item['Order Number']"
                    v-for="item in result"
                    @click.native="toDetail(item['Order Number'])"
                    is-link>
            <div class="mint-cell-sub-title" slot="title">订单总额:{{item['Order Total']}}</div>
          </cus-cell>
        </cus-loadmore>

    </cus-search>
  </div>
</template>

<script type="es6">
  import {mapState, mapActions} from 'vuex';
  import cusLoadmore from 'public/components/cus-loadmore';
  import cusSearch from 'public/components/cus-search';
  import cusCell from 'public/components/cus-cell';
  //
  const NAMESPACE = 'searchList';
  let loader = function(...args) {
    let me = this;
    let event = args.pop();
    let list = args.pop();
    let param = Object.extend(true, {
      callback: (data) => {
        me.$refs[list][event](data.length);
      }
    }, args.pop() || {});
    me.getSearchList(param);
  };
  export default {
    name: NAMESPACE,
    components: {cusLoadmore, cusSearch, cusCell},
    data: () => {
      return {
        value: '',
        topStatus: ''
      };
    },
    computed: {
      ...mapState(NAMESPACE, ['result'])
    },
    methods: {
      ...mapActions(NAMESPACE, ['getSearchList']),
      searchFn(val) {
        console.log(val);
        this.value = val;
        this.getSearchList({orNumber: val});
      },
      toDetail(orNumber) {
        this.$router.push({
          name: 'detail',
          query: {
            type: orNumber
          }
        });
      },
      loadBottomFn(param) {
        let me = this;
        loader.call(this, {
          orNumber: me.value,
          more: true}, 'result',
        'onBottomLoaded');
      }
    }
  };
</script>
