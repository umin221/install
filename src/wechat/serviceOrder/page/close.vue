<template>
  <div v-if="showBox1">
    <div class="v-modal" style="z-index: 2000;" ></div>
    <div class="mint-msgbox-wrapper" style="position: absolute; z-index: 2009;">
      <div class="mint-msgbox" style="">
        <div class="mint-msgbox-header">
          <div class="mint-msgbox-title">异常关闭原因</div>
        </div>
        <div class="mint-msgbox-content">
          <div class="mint-msgbox-message">

            <mt-radio
              class="page-part"
              v-model="value1"
              :options="option">
            </mt-radio>

          </div>
          <div class="mint-msgbox-input" style="display: none;">
            <input placeholder="" type="text">
            <div class="mint-msgbox-errormsg" style="visibility: hidden;"></div>
          </div>
        </div>
        <div class="mint-msgbox-btns">
          <button class="mint-msgbox-btn mint-msgbox-cancel" @click="close">取消</button>
          <button class="mint-msgbox-btn mint-msgbox-confirm" @click="enter">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
  .page-part{
    a{
      text-align: left;
    }
  }
</style>
<script>
  import api from '../api/api';
  export default {
    name: 'close',
    props: ['showBox1'],
    created() {
      let me = this;
      api.get({
        url: 'data/List Of Values/List Of Values/?searchspec=Active="Y" AND Language="CHS" AND Type="FIN_NO_SALE_REASON"',
        method: 'GET',
        success: function(data) {
          for (let i = 0;i < data.items.length;i++) {
            me.option.push(data.items[i].Value);
          }
        }
      });
    },
    data() {
      return {
        value1: '',
        option: []
      };
    },
    methods: {
      enter() {
        this.$emit('my-enter', this.value1);
      },
      close() {
        this.$emit('my-close', this.value1);
      }
    }
  };
</script>
