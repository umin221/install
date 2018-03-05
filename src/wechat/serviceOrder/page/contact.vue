<template>
  <div style="background-color: #ebebeb;">
    <mt-header fixed title="选择工程师">
      <fallback slot="left"></fallback>
    </mt-header>
    <div class="mint-content contact" >
      <loadmore :loadTop="loadTop" ref="load">
        <div class="list-content" v-for="(item,index) in list" :key="index">
          <mt-cell class="multiple">
            <div class="my-cell-sub" slot="title">姓名: {{item['Last Name']}}</div>
            <div class="my-cell-sub" slot="title">工号: {{item['Emp #']}}</div>
            <div class="my-cell-sub" slot="title">部门: {{item['KL Primary Division Name']}}</div>
            <div class="my-cell-sub" slot="title">{{item['Job Title']}}</div>
          </mt-cell>
        </div>
      </loadmore>
    </div>
  </div>
</template>
<style lang="scss">
  .contact{
    .my-cell-sub{
      line-height: 1rem;
    }
  }
</style>
<script type="application/javascript">
  import {mapState, mapActions} from 'vuex';
  import api from '../api/api';
  import loadmore from 'public/components/cus-loadmore';
  const NameSpace = 'index';
  export default {
    name: NameSpace,
    created() {
      let me = this;
      api.get({
        key: 'getUser',
        method: 'GET',
        success: function(data) {
          me.list = data.items;
          console.log(me.list);
        }
      });
    },
    data: () => {
      return {
        list: []
      };
    },
    computed: {
      ...mapState(NameSpace, ['value'])
    },
    methods: {
      ...mapActions(NameSpace, ['getList']),
      loadTop() {
        let me = this;
        console.log(me.$refs.load);
        me.$refs.load.onTopLoaded();
      }, // 底部加载
      loadBottom() {
        let me = this;
        setTimeout(function() {
          me.$refs.load.onBottomLoaded();
        }, 1000);
      },
      toDetail(type, name) {
        this.$router.push({
          name: 'serviceDetail',
          query: {
            type: type,
            id: name
          }
        });
      }
    },
    components: {
      loadmore
    }
  };
</script>
