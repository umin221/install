<!--详情、新增、编辑等页面复用-->
<template>
  <div>
    <mt-header fixed :title="title">
      <fallback slot="left"></fallback>
      <mt-button v-if="form['KL Signed Amount'] && is_edit" slot="right"
                 @click="type = 'edit';is_edit = false">编辑</mt-button>
    </mt-header>

    <div class="mint-content wide-form">
      <div :class="{'readonly':read}">
        <mt-cell title="是否涉及签收" v-if="item['KL Detail Type LIC'] === 'Trompil Lock Sign' ||
          item['KL Detail Type LIC'] === 'Working Drawing Sign'" :class="{disable: !editable}">
          <mt-switch v-if="form['KL Signed Amount']" v-model="box1"></mt-switch>
        </mt-cell>
        <div v-show="box1" :class="{disable: !editable}">
          <mt-field label="签收数量" placeholder="请输入签收数量"
                    :class="heartVisible" v-model="form['KL Signed Amount']"></mt-field>
        </div>
      </div>
      <attach :attach="attach.list"
              :edit="!read"
              :title="title" v-show="box1">
      </attach>
      <div :class="{'readonly':read}">
        <mt-field label="备注说明" type="textarea" v-model="form['Description']"></mt-field>
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
        editable: false,
        box1: true,
        type: 'add', // add 新增 / edit 编辑 / read 只读
        button: {
          list: [{
            text: '提交'
          }]
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
      ...mapState(NameSpace, ['form', 'attach']),
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
        }
        return val;
      }
    },
    methods: {
      ...mapMutations(NameSpace, ['clear']),
      ...mapActions(NameSpace, ['getSign', 'getUPData', 'getTpye']),
      submit() {
        var self = this;
        var item = self.item;
        item.box1 = self.box1;
        if (self.box1) { // 涉及签收 才提交数据  不涉及只更新状态
          self.getUPData(item);
        } else {
          self.getTpye(item);
        }
      },
      submitFn() {
        var item = this.item;
        if (item['KL Detail Type LIC'] === 'Trompil Lock Sign' ||
          item['KL Detail Type LIC'] === 'Working Drawing Sign') { // 提交后可编辑
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
