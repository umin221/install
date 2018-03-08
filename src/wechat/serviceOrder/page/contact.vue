<template>
  <div style="background-color: #ebebeb;">
    <mt-header fixed title="选择工程师">
      <fallback slot="left"></fallback>
    </mt-header>
    <div class="mint-content contact" >
      <div style="display: flex;justify-content: center;">
        <input type="text" v-model="searchValue" style="width: 60%; height: 1.5rem;border: none;margin: 0.5rem;border-radius: 1rem;" placeholder="请输入姓名关键字">
        <mt-button size="small" type="primary" style="margin-top: 0.4rem;" @click.native="search">搜索</mt-button>
      </div>
      <loadmore :loadTop="loadTop" ref="load">
        <div class="list-content" v-for="(item,index) in list" :key="index">
          <mt-cell class="multiple" @click.native="selected(item,index)">
            <div class="my-cell-sub" slot="title">姓名: {{item['Last Name']}}</div>
            <div class="my-cell-sub" slot="title">工号: {{item['Emp #']}}</div>
            <div class="my-cell-sub" slot="title">部门: {{item['KL Primary Division Name']}}</div>
            <div class="my-cell-sub" slot="title">{{item['Job Title']}}</div>
          </mt-cell>
          <i v-show="item.select" class="xs-icon icon-select"></i>
        </div>
      </loadmore>
      <buttonGroup>
        <mt-button type="primary" class="single" @click.native="haveEnter" >确认分配</mt-button>
      </buttonGroup>
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
  import buttonGroup from 'public/components/cus-button-group';
  const NameSpace = 'index';
  export default {
    name: NameSpace,
    created() {
    },
    data: () => {
      return {
        list: [],
        searchValue: '',
        isSelect: []
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
      },
      search() {
        let me = this;
        api.get({
          key: 'getUser',
          method: 'POST',
          data: {
            'body': {
              'OutputIntObjectName': 'Base KL Employee Interface BO',
              'SearchSpec': '[Employee.Last Name]="' + me.searchValue + '"'
            }
          },
          success: function(data) {
            if (data.SiebelMessage.Employee) {
              me.list = KND.Util.toArray(data.SiebelMessage.Employee);
              for (let i = 0; i < me.list.length;i++) {
                me.list[i].select = false;
              }
              console.log(me.list);
            }
          }
        });
      },
      haveEnter() {
      },
      selected(value) {
        let me = this;
        console.log(value);
        console.log(me.$route);
        api.get({
          key: 'getRunProcess',
          method: 'POST',
          data: {
            'body': {
              'Object Id': me.$route.query.id,
              'function': 'Dispatch',
              'empId': value['Id'],
              'ifRefresh': 'N',
              'empFullName': value['KL Employee Full Name'],
              'ProcessName': 'KL SR Pick Owner Process'
            }
          },
          success: function(data) {
            console.log(data);
          }
        });
      }
    },
    components: {
      loadmore,
      buttonGroup
    }
  };
</script>
