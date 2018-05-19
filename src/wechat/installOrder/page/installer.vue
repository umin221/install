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
                 v-for="(item, index) in result"
                 @click.native="selectFn(item)"
                 :key="item.id">
          <div class="mint-cell-title co-flex" slot="title">
            <span class="co-f1">姓名: {{item['Last Name']}}</span> <span class="co-f1">{{item['KL Primary Position Type']}}</span>
          </div>
          <div class="mint-cell-sub-title" slot="title">联系电话: {{item['Phone #']}}</div>
          <div class="mint-cell-sub-title" slot="title">合作伙伴名称: {{item.companyName}}</div>
          <div v-show="showSelect(item)" class="selectIcon" slot="title">
            <i class="xs-icon icon-select"></i>
          </div>
        </mt-cell>
      </cus-loadmore>

    </cus-search>
    <button-group>
      <mt-button class="single"
                 @click.native="addContactFn">新增联系人</mt-button>
      <mt-button class="single"
                 @click.native="submitFn">确认授权</mt-button>
    </button-group>
  </div>
</template>
<style>
  .selectIcon{
    position: absolute;
    right: 20px;
    top: 23px;
  }
</style>

<script type="application/javascript">
  import {mapState, mapActions, mapMutations} from 'vuex';
  import cusLoadmore from 'public/components/cus-loadmore';
  import cusSearch from 'public/components/cus-search';
  import cusCell from 'public/components/cus-cell';
  import buttonGroup from 'public/components/cus-button-group';
  import api from '../api/api';
  //
  let loader = function(...args) {
    let me = this;
    let event = args.pop();
    let name = me.value;
    let param = {
      more: args.pop(),
      data: {
        'companyId': me.companyId,
        'Last Name': name
      },
      callback: (data) => {
        me.$refs.result[event](data.length);
      }
    };
    // 获取团队列表
    me.findInstaller(param);
  };

  const NAMESPACE = 'installer';
  export default {
    name: NAMESPACE,
    // 获取默认数据
    created() {
      var self = this;
      let param = this.$route.query;
      self.id = param.id;
      self.companyId = param.companyId;
      loader.call(this, 'onBottomLoaded');
    },
    components: {cusLoadmore, cusSearch, cusCell, buttonGroup},
    data: () => {
      return {
        value: '',
        id: '',
        companyId: '', // 合作伙伴公司
        selectName: {},
        topStatus: ''
      };
    },
    computed: {
      ...mapState(NAMESPACE, ['result'])
    },
    methods: {
      ...mapActions(NAMESPACE, ['findInstaller', 'setResult']),
      ...mapMutations(NAMESPACE, ['selEngineer']),
      /**
       * 搜索回调
       * @param {String} val 搜索值
       */
      searchFn(val) {
        loader.call(this, 'onBottomLoaded');
      },
      showSelect(item) {
        return this.selectName[item['Last Name']];
      },
      /**
       *修改是否选中
       */
      selectFn(item) {
        let flag = !this.selectName[item['Last Name']];
        if (flag) {
          this.$set(this.selectName, item['Last Name'], item);
        } else {
          this.$set(this.selectName, item['Last Name'], null);
          delete this.selectName[item['Last Name']];
        }
      },
      /**
       * Load more
       */
      loadBottomFn() {
        loader.call(this, {
          more: true
        }, 'onBottomLoaded');
      },
      addContactFn() {
        var self = this;
        self.$router.push('contact');
      },
      submitFn() {
        var self = this;
        let select = this.selectName;
        var objList = [];
        for (let i in select) {
          var obj = {};
          obj['Id'] = select[i].Id;
          objList.push(obj);
        }
        console.dir(objList);
        api.get({
          key: 'selIntaller',
          method: 'POST',
          data: {
            'body': {
              'SiebelMessage': {
                'MessageId': '',
                'MessageType': 'Integration Object',
                'IntObjectName': 'Base KL Installation Task',
                'IntObjectFormat': 'Siebel Hierarchical',
                'ViewMode': 'AllView',
                'ListOfBase KL Installation Task': {
                  'KL Installation Task': {
                    'Id': self.id,
                    'ListOfContact': {
                      'Contact': objList
                    }
                  }
                }
              }
            }
          },
          success: function(data) {
            if (!data.ERROR) {
              Toast('授权成功');
              KND.Util.back();
            }
          }
        });
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
