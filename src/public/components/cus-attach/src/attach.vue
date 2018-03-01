<template>
  <div class="cus-attach-container">

    <title-group v-if="title">合同附件</title-group>

    <empty v-show="empty" tips="暂无附件"></empty>

    <div v-show="!empty" class="cus-attach co-flex co-wp">
      <div v-show="edit"
        @click="addFn">
        <img src="../assets/add.png"/>
      </div>
      <div v-for="(item, $index) in attach">
        <span class="xs-icon"
          :class="{'icon-delete': edit}"
          @click="deleteFn($index)"></span>
        <img src="../assets/tt.png"/>
      </div>
    </div>

    <mt-actionsheet
      :actions="actions"
      v-model="sheetVisible">
    </mt-actionsheet>
  </div>
</template>

<script type="es6">
  import titleGroup from '../../cus-title-group';

  export default {
    name: 'cus-attach',
    props: {
      attach: Array,
      edit: Boolean,
      title: String
    },
    data: () => {
      return {
        actions: [{
          name: '拍照',
          method: () => {
            console.log('调用拍照');
          }
        },{
          name: '选图',
          method: () => {
            console.log('调用选图');
          }
        }],
        sheetVisible: false
      }
    },
    computed: {
      empty() {
        return !this.edit && !this.attach.length;
      }
    },
    methods: {
      // 添加文件
      addFn() {
        this.sheetVisible = true;
      },
      // 删除文件
      deleteFn(index) {
        this.attach.splice(index, 1);
      }
    },
    components: {titleGroup}
  };
</script>

<style lang="scss">
  .cus-attach-container {
    background-color: #fff;

    .cus-attach {
      font-size: $font-size-small;
      color: $gray-minor;
      padding: 10px;

      div {
        position: relative;
        text-align: center;
        padding: 5px 0;
        width: 25%;

        span {
          position: absolute;
          top: -8px;
          right: 2px;
        }

        img {
          width: 2.5rem;
          height: 2.5rem;
        }

      }
    }
  }
</style>
