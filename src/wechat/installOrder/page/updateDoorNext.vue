<template>
  <div>
    <mt-header fixed :title="title">
      <fallback slot="left"></fallback>
      <mt-button slot="right"
                 @click="journalFn()">日志</mt-button>
    </mt-header>
    <div class="mint-content zsBatch">
      <div :class="{'readonly':read}">
        <cus-field label="完成数量"
                   type="number"
                   :class="heartVisible"
                   v-model="line['Completed Install Amount']"></cus-field>
        <cus-field label="备注说明"
                   type="textarea"
                   v-model="line['Description']"></cus-field>
      </div>
      <attach ioName="KL Action Attachment" ref="attach"
              :attach="attach.list"
              :edit="!read"
              :title="attach.title">
      </attach>
      <button-group>
        <mt-button class="single"
                   @click="submitFn">提交</mt-button>
      </button-group>
    </div>
  </div>
</template>
<style lang="scss">
  .zsBatch {
    .button-cla {
      margin-top: 2.5rem;
      width: 100%;
      text-align: center;
    }
    .mint-button--normal {
      display: inline-block;
      padding: 0 12px;
      width: 5rem;
    }
    input {
      text-align: right!important;
    }
  }
</style>
<script type="application/javascript">
  import {mapState, mapActions} from 'vuex';
  import buttonGroup from 'public/components/cus-button-group';
  import cusField from 'public/components/cus-field';
  import api from '../api/api';
  let right = [{
    content: '删除',
    style: { background: 'red', color: '#fff', 'font-size': '15px', 'line-height': '54px' },
    handler: () => this.$messagebox('delete')
  }];
  /**
   * 附件上传
   * @param {Array} serverIds 企业微信临时素材id => mediaId
   * @param {String} id 业务id
   */
  let _upload = function(serverIds, id) {
    // 成功回调
    let callback = data => {
      tools.success(data, {
        back: false,
        successTips: '提交成功'
      });
    };
    // 上传附件
    serverIds ? this.upload({
      data: {
        MediaId: serverIds,
        Id: id,
        IOName: 'KL Action Attachment'
      },
      success: callback
    }) : callback(id);
  };
  const NameSpace = 'updateDoorNext';
  export default {
    name: 'updateDoorNext',
    created() {
      let param = this.$route.query;
      this.item = param.item;
      this.id = param.item.Id;
      console.dir('=====' + this.id);
    },
    data: () => {
      return {
        id: '',
        item: '',
        type: 'add', // add 新增 / edit 编辑 / read 只读
        titleVal: '',
        line: {},
        active: 'tab-container',
        attach: { // 附件
          list: [],
          edit: false,
          title: '附件'
        }
      };
    },
    beforeRouteEnter(to, from, next) {
      console.dir(2);
      next(vm => {
        let query = vm.$route.query;
        console.dir(query);
      });
    },
    computed: {
      ...mapState(NameSpace, ['form']),
      // 表单只读
      read() {
        return this.type === 'read';
      },
      right() {
        return this.state === 'valid' ? right : [];
      },
      // * 是否显示
      heartVisible() {
        return this.type === 'read' ? '' : 'require';
      },
      /**
       * 根据当前状态和类型判断标题展示
       * 新建&重新启用界面复用 仅标题不一样
       * 查看&编辑标题一致
       */
      title() {
        let item = this.item;
        var val = '';
        if (item['KL Detail Type LIC'] === 'Substitution Lock Trans Batch') {
          val = '移交进度更新';
        } else {
          val = '替代锁回收';
        }
        return val;
      }
    },
    methods: {
      ...mapActions('app', ['upload', 'queryMedias']),
      journalFn() {
        var self = this;
        self.$router.push({
          name: 'journal',
          query: {
            id: self.id,
            type: 'updateDoorNext'
          }
        });
      },
      submitFn() {
        var self = this;
        var lineObj = self.line;
        if (!lineObj['Completed Install Amount']) {
          Toast('完成数量不能为空！');
          return;
        }
        api.get({ // 提交详细计划数据
          key: 'setJourna',
          method: 'PUT',
          data: {
            'Id': '0002', // 默认ID
            'Activity Id': self.id,
            'Completed Install Amount': lineObj['Completed Install Amount']
          },
          success: function(data) {
            if (!data.ERROR) {
              // 提交图片
              let uploadAttach = id => {
                _upload.call(self, self.$refs.attach.getServerIds(), id);
              };
              if (self.attach.list.length > 0) {
                uploadAttach(data.items.Id);
              }
              Toast('提交成功');
              lineObj['Completed Install Amount'] = '';
              lineObj.Description = '';
            }
          }
        });
      }
    },
    components: {buttonGroup, cusField}
  };
</script>
