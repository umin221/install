<template>
  <div>
    <mt-header fixed title="状态更新">
      <fallback slot="left"></fallback>
    </mt-header>
    <div class="mint-content updateState">
      <mt-cell>
        <div slot="title" class="list-text"><span style="color:red">*</span>关闭原因</div>
      </mt-cell>
      <mt-field label="" placeholder="请输入关闭原因" type="textarea" rows="8" v-model="value"></mt-field>
      <button-group>
        <mt-button class="single"
                   @click.native="handleClick">提交</mt-button>
      </button-group>
    </div>
  </div>
</template>
<style lang="scss">
  .updateState {
    .mint-cell-value textarea{
      border: 1px solid #d9d9d9;
      border-radius: 0.1rem;
      margin-top: 0.5rem;
    }
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
  }
</style>
<script type="application/javascript">
  import buttonGroup from 'public/components/cus-button-group';
  import api from '../api/api';
  export default {
    name: 'updateState',
    created() {
      console.dir(1);
      let param = this.$route.query;
      this.id = param.id;
      console.dir('this.id' + this.id);
    },
    data: () => {
      return {
        value: '',
        id: ''
      };
    },
    beforeRouteEnter(to, from, next) {
      console.dir(2);
      next(vm => {
        let query = vm.$route.query;
        console.dir(query);
      });
    },
    methods: {
      handleClick() {
        var self = this;
        if (self.value) {
          api.get({
            key: 'getUPStatus',
            method: 'POST',
            data: {
              'body': {
                'ProcessName': 'KL Install Task Close Action Workflow',
                'RowId': self.id
              }
            },
            success: function(data) {
              if (!data.ERROR) {
                Toast('提交成功');
                self.$router.back();
              }
            }
          });
        } else {
          Toast('关闭原因不能为空！');
        }
      }
    },
    components: {buttonGroup}

  };
</script>
