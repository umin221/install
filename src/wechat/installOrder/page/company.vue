<!--选择联系人-->
<template>
  <div>
    <cus-search placeholder="请合作伙伴名称"
                v-model="value"
                :show="true">

      <cus-loadmore ref="result"
                  :loadBottom="loadBottomFn"
                  :topStatus="topStatus">
        <mt-cell class="multiple"
                 v-for="item in result"
                 @click.native="selectFn(item)"
                 :key="item.id">
          <div class="mint-cell-title co-flex" slot="title">
            <span class="co-f1">合作伙伴名称: {{item['Name']}}</span>
          </div>
          <div class="mint-cell-sub-title" slot="title">负责人: {{item['KL Partner Owner Name']}}</div>
          <div class="mint-cell-sub-title" slot="title">负责人联系电话: {{item['Main Phone Number']}}</div>
          <div v-show="showSelect(item)" class="selectIcon" slot="title">
            <i class="xs-icon icon-select"></i>
          </div>
        </mt-cell>
      </cus-loadmore>

    </cus-search>
    <button-group>
      <mt-button class="single"
                 @click.native="submitFn">确认</mt-button>
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
  import api from '../api/api';

  let loader = function(...args) {
    let me = this;
    let event = args.pop();
    let name = me.value;
    let param = {
      more: args.pop(),
      data: {
        'Last Name': name
      },
      callback: (data) => {
        me.$refs.result[event](data.length);
      }
    };
    // 获取团队列表
    me.findCompany(param);
  };

  const NAMESPACE = 'company';
  export default {
    name: NAMESPACE,
    // 获取默认数据
    created() {
      var self = this;
      let param = this.$route.query;
      self.id = param.id;
      self.insId = param.insId; // 记录联系人ID  有值 保存公司的时候清空、测不清空
      loader.call(this, 'onBottomLoaded');
    },
    components: {cusLoadmore, cusSearch, cusCell},
    data: () => {
      return {
        value: '',
        id: '', // 批次id
        insId: '', // 记录联系人ID
        item: '',
        selectName: '',
        topStatus: ''
      };
    },
    computed: {
      ...mapState(NAMESPACE, ['result', 'select'])
    },
    methods: {
      ...mapActions(NAMESPACE, ['findCompany']),
      ...mapMutations(NAMESPACE, ['selEngineer']),
      ...mapActions('batch', ['getPcObj']),
      showSelect(item) {
        var self = this;
        if (item.Name === self.selectName) {
          return true;
        } else {
          return false;
        }
      },
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
        this.selectName = item.Name;
        this.item = item;
        this.selEngineer(item);
        // this.$router.back();
      },
      submitFn() { // 新增合作伙伴
        var self = this;
        var parma = {
          'Id': self.id,
          'KL Partner Id': this.item.Id
        };
        api.get({ // 提交数据
          key: 'getUPData',
          method: 'PUT',
          data: parma,
          success: function(data) {
            if (!data.ERROR) {
              Toast('保存成功');
              self.item.is_company = true;
              self.getPcObj(self.item); // 保存store
              if (self.insId) {
                api.get({
                  key: 'selIntaller',
                  method: 'POST',
                  data: {
                    'body': {
                      'SiebelMessage': {
                        'MessageId': '',
                        'MessageType': 'Integration Object',
                        'IntObjectFormat': 'Siebel Hierarchical',
                        'ListOfBase KL Installation Task': {
                          'KL Installation Task': {
                            'Id': self.id,
                            'ListOfContact': {}
                          }
                        }
                      }
                    }
                  },
                  success: function(data) {
                    KND.Util.back();
                  }
                });
              } else {
                KND.Util.back();
              }
            }
          }
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
