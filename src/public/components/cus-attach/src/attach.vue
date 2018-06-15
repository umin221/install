<template>
  <div class="cus-attach-container">

    <title-group v-if="title">{{title}}</title-group>

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
        <span v-if="convertType(item['AgreeFileExt'])" class="content pdf xs-icon"
              :class="convertType(item['AgreeFileExt'])"
              :data-src="convertImgSrc(item)"
              @click="previewFileFn(item)"></span>
        <img v-else :src="convertImgSrc(item)"
             @click="previewImageFn($index)"/>
      </div>
    </div>
  </div>
</template>

<script type="es6">
  /**
   * 附件组件
   * 1.展示图片
   *  －未保存至siebel，手机拍照或图库图片上传到腾讯服务器，通用预览插件服务（企业微信ios无法预览本地图片）
   *  －已保存至siebel，siebel 返回来的图片
   * 2.新增图片
   *  －未保存至siebel，调用拍照，上传企业微信
   *  －保存至siebel，业务关联业务id，调用通用上传接口
   * 3.删除图片
   *  -未保存至siebel，直接删除与siebel无对接
   *  -已保存至siebel，组件提示确认操作并调用siebel执行删除操作
   * 3.获取图片
   *  －未保存至siebel，返回企业微信的mediaIds列表
   *  －已保存至siebel，返回siebel图片列表
   */
  import {mapActions} from 'vuex';
  import titleGroup from '../../cus-title-group.vue';
  let downloadFromSiebel = (`${config.proxy}/webchat/download/external/downloadattachment?url=${config.attachServer}/siebel-rest/v1.0/service/Workflow Process Manager/RunProcess`);
  // 企业微信 与 公众号 非同一个下载接口
  let downloadFromWechat = config.appNo === 'wechat' ? `${config.host}/weixin-service/authorized/download_media?media_id=` : `${config.proxy}/webchat/api/local/downloadmedia?appNO=${config.appNo}&media_id=`;
  // 附件类型转换
  const EXT2TYPE = {doc: 'doc', docx: 'doc', xls: 'xls', xlsx: 'xls', pdf: 'pdf', jpg: ''};

  export default {
    name: 'cus-attach',
    props: {
      attach: {
        type: Array,
        default: data => []
      },
      edit: Boolean,
      title: String,
      ioName: String
    },
    computed: {
      empty() {
        return !this.edit && !this.attach.length;
      }
    },
    methods: {
      ...mapActions('app', ['removeAttach']),
      /**
       * 添加图片/拍照
       * response res.localIds 选择图片的id集合
       */
      addFn() {
        let me = this;
        KND.Native.chooseImage({
          success: function(res) {
            console.log(res);
            // andriod中localId可以作为img标签的src属性显示图片；
            // 而在IOS中需通过上面的接口getLocalImgData获取图片base64数据，从而用于img标签的显示
            let localIds = res.localIds;
            for (var i in localIds) {
              console.log(localIds[i]);
              me.uploadLocalIds(localIds[i]);
            }
          }
        });
      },
      /**
       * 上传本地图片
       * @param {String} localId 必填 图片localId
       * @response {String} res.serverId 1sb9A-V1qJt4tcfiKMM4UzpjMHuBHMMIIgYKl96OQ1_pBe8h0xte9G6aTPNjEQaYI 返回图片的服务器端ID
       */
      uploadLocalIds(localId) {
        let me = this;
        KND.Native.uploadImage({
          localId: localId,
          success: function(res) {
            console.log(res);
            me.attach.unshift({
              localId: localId,
              serverId: res.serverId
            });
          }
        });
      },
      /**
       * 获取组件中上传至腾讯服务器（临时）所有的文件 serverId
       * @param {String} exp 必填 文件扩展名
       */
      getServerIds() {
        let attach = this.attach;
        return Array.prototype.filter.call(attach, (i) => {
          return i.serverId;
        });
      },
      /**
       * 附件类型转换
       * @param {String} exp 必填 文件扩展名
       */
      convertType(exp) {
        return EXT2TYPE[exp];
      },
      /**
       * 图片预览地址转换
       * @param {Object} item 必填 文件属性
       */
      convertImgSrc(item) {
        item.src = encodeURI(item.serverId ? (downloadFromWechat + item.serverId) : (`${downloadFromSiebel}&IOName=${this.ioName}&Object Id=${item.Id}&ProcessName=KL Attachment Query Process`));
        return item.src;
      },
      /**
       * 预览文件 PDF、DOC、EXL
       * @param {Object} item 必填 文件属性
       */
      previewFileFn(item) {
        KND.Native.previewFile({
          url: item.src,
          name: item.AgreeFileName,
          size: item.AgreeFileSize
        });
      },
      /**
       * 预览图片
       * @param {String} index 必填 图片角标
       */
      previewImageFn(index) {
        let arr = [];
        Array.prototype.map.call(this.attach, item => {
          if (item.src) arr.push(item.src);
          return false;
        });
        KND.Native.previewImage({
          current: arr[index],
          urls: arr
        });
      },
      /**
       * 删除图片
       * @param {String} index 必填 图片角标
       */
      deleteFn(index) {
        let me = this;
        let file = me.attach[index];
        let remove = i => me.attach.splice(i, 1);
        MessageBox.confirm('删除后无法还原?', '请确认').then(action => {
          if (file.Id) {
            me.removeAttach({
              data: {
                PrimaryRowId: file.Id,
                IOName: me.ioName
              },
              success: result => {
                remove(index);
              }
            });
          } else {
            remove(index);
          }
        });
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

          &.content.xs-icon {
            position: static;
            display: inline-block;
            font-size: 2rem;
          }

          &.pdf:before {
            content: '\A179';
            color: #f23827;
          }

          &.xls:before {
            content: '\A180';
            color: #37a146;
          }

          &.doc:before {
            content: '\A181';
            color: #2f7bff;
          }

          &.ppt:before {
            content: '\A182';
            color: #ff8a00;
          }
        }

        img {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 8px;
          border: 1px solid #eaeaea;
        }

      }
    }
  }
</style>
