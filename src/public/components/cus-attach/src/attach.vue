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
      <div v-for="(item, $index) in localIds">
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
        localIds: [],
        actions: [{
          name: '拍照',
          method: () => {
            console.log('调用拍照');
          }
        }, {
          name: '选图',
          method: () => {
            console.log('调用选图');
          }
        }],
        sheetVisible: false
      };
    },
    computed: {
      empty() {
        return !this.edit && !this.attach.length;
      }
    },
    methods: {
      /**
       * 添加图片/拍照
       */
      addFn() {
        // this.sheetVisible = true;
        wx.chooseImage({
          count: 1, // 默认9
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: function(res) {
            var localIds = res.localIds; // 返回选定照片的本地ID列表，
            // andriod中localId可以作为img标签的src属性显示图片；
            // 而在IOS中需通过上面的接口getLocalImgData获取图片base64数据，从而用于img标签的显示
            console.log(localIds);
          }
        });
      },
      /**
       * 上传本地图片
       */
      uploadLocalIds() {
        wx.uploadImage({
          localId: this.localIds, // 需要上传的图片的本地ID，由chooseImage接口获得
          isShowProgressTips: 1, // 默认为1，显示进度提示
          success: function(res) {
            var serverId = res.serverId; // 返回图片的服务器端ID
            console.log(serverId);
          }
        });
      },
      /**
       * 删除图片
       */
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
