<!--详情、新增、编辑等页面复用-->
<template>
  <div>
    <mt-header fixed :title="title">
      <fallback slot="left"></fallback>
      <mt-button v-if="is_edit" slot="right"
                 @click="type = 'edit'">编辑</mt-button>
    </mt-header>

    <div class="mint-content wide-form">
      <div :class="{'readonly':read}">
        <mt-cell title="是否涉及签收"
                 v-if="item['KL Detail Type LIC'] === 'Trompil Lock Sign' ||
                       item['KL Detail Type LIC'] === 'Working Drawing Sign'"
                 :class="{disable: !editable}">
                <mt-switch v-model="box1"></mt-switch>
        </mt-cell>
        <div v-show="box1" :class="{disable: !editable}">
          <mt-field v-if="item['KL Detail Type LIC'] !== 'Working Drawing Sign'" :label="labelText"
                    placeholder="请输入数量"
                    :class="heartVisible"
                    type="number"
                    v-model="form['KL Signed Amount']">

          </mt-field>
        </div>
      </div>
      <attach ioName="KL Action Attachment" ref="attach"
              :attach="attach.list"
              :edit="!read"
              :title="attach.title"
              v-show="box1">
      </attach>
      <div :class="{'readonly':read}" v-show="box1">
        <mt-field label="备注说明" type="textarea" v-model="Description"></mt-field>
      </div>
    </div>
    <button-group>
      <mt-button class="single" v-show="!read"
                 @click.native="submitFn">提交</mt-button>
    </button-group>
  </div>
</template>

<script type="es6">
  import {mapState, mapActions, mapMutations} from 'vuex';
  import titleGroup from 'public/components/cus-title-group';
  import buttonGroup from 'public/components/cus-button-group';

  // Right button
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
    var self = this;
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
        Comment: self.Description,
        IOName: 'KL Action Attachment'
      },
      success: callback
    }) : callback(id);
  };
  const NameSpace = 'sign';
  export default {
    name: 'sign',
    // 初始化
    created() {
      let param = this.$route.query;
      this.state = param.state;
      this.type = param.type;
      this.is_edit = param.is_edit;
      this.id = param.item.Id;
      this.item = param.item;
      console.dir('=====' + this.id);
      // 获取详情
      if (this.type === 'read') {
        this.getSign(this.item);
        this.queryMedias({
          data: {
            'IOName': 'KL Action Attachment',
            'SearchSpec': {
              'Action Attachment.Activity Id': param.item.Id
            }
          },
          success: data => {
            this.attach.list = KND.Util.toArray(data['SiebelMessage']['Action Attachment']);
            if (this.attach.list[0]) {
              this.Description = this.attach.list[0].Comment;
            }
          }
        });
        /* if (this.form['KL Signed Amount']) {
          this.box1 = true;
        } else {
          this.box1 = false;
        }*/
      } else {
        this.editable = true;
        this.clear();
      }
    },
    data: () => {
      return {
        id: '',
        item: '',
        is_edit: false,
        labelText: '签收数量',
        editable: false,
        Description: '', // 附件备注
        box1: true,
        type: 'add', // add 新增 / edit 编辑 / read 只读
        button: {
          list: [{
            text: '提交'
          }]
        },
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
        var self = this;
        let item = this.item;
        var val = '';
        if (item['KL Detail Type LIC'] === 'Trompil Lock Sign') {
          val = '开孔锁签收';
        } else if (item['KL Detail Type LIC'] === 'Working Drawing Sign') {
          val = '开孔图纸签收';
        } else if (item['KL Detail Type LIC'] === 'Lock Body Sign') {
          val = '锁体安装签收';
        } else if (item['KL Detail Type LIC'] === 'Substitution Lock Sign') {
          val = '替代锁到货确认';
        } else if (item['KL Detail Type LIC'] === 'Lock Sign') {
          val = '真锁到货';
        } else if (item['KL Detail Type LIC'] === 'Substitution Lock Trans Return') {
          val = '替代锁回收';
          self.labelText = '回收数量';
        }
        return val;
      }
    },
    methods: {
      ...mapActions('app', ['upload', 'queryMedias']),
      ...mapMutations(NameSpace, ['clear']),
      ...mapActions(NameSpace, ['getSign', 'getUPData', 'getTpye', 'setItemObj']),
      submit() {
        var self = this;
        var item = self.item;
        this.setItemObj(item);
        item.box1 = self.box1;
        // 提交图片
        let uploadAttach = id => {
          _upload.call(self, self.$refs.attach.getServerIds(), id);
        };
        if (self.type === 'add') { // 新增
          if (self.box1) { // 涉及签收 才提交数据  不涉及只更新状态
            if (self.form['KL Signed Amount'] || item['KL Detail Type LIC'] === 'Working Drawing Sign') {
              // self.getUPData(item);
              // 新增签收
              self.getUPData(data => {
                console.dir(data.items.Id);
                if (self.attach.list.length > 0) {
                  uploadAttach(data.items.Id);
                }
                self.getTpye();
              });
            } else {
              Toast('签收数量不能为空！');
            }
          } else {
            self.getTpye();
          }
        } else { // 编辑  提交后能编辑的只有附件可以修改  附件只能增加不能把原来的删除
          uploadAttach(self.id);
          KND.Util.back();
        }
      },
      submitFn() {
        var self = this;
        var item = this.item;
        if (item['KL Detail Type LIC'] === 'Trompil Lock Sign' ||
          item['KL Detail Type LIC'] === 'Working Drawing Sign') { // 提交后可编辑
          if (self.type === 'edit' && !self.Description) {
            Toast('重新编辑，备注不能为空！');
            return;
          }
          this.submit();
        } else { // 提交后不可编辑
          MessageBox({
            title: '提示',
            message: ' 确认提交？一经提交不可修改',
            showCancelButton: true
          }).then(action => {
            if (action === 'confirm') {
              this.submit();
            }
          });
        }
      }
    },
    components: {titleGroup, buttonGroup}
  };
</script>

<style lang="scss">
  .wide-form {
    .mint-cell-title {
      width: 130px;
    }
  }

  .mint-content {
    margin-bottom: 2.8rem;
  }
</style>
