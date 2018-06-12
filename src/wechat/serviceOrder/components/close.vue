<template>
  <div v-if="showBox1" class="close">
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
          <mt-field label="" placeholder="备注" type="textarea" rows="3" v-model="value"></mt-field>

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
  .close .mint-msgbox-message {
    height: 240px;
    overflow: scroll;
  }
  .page-part{
    a{
      text-align: left;
    }
  }
</style>
<script>
  import {mapState, mapActions} from 'vuex';
  const NameSpace = 'close';
  export default {
    name: NameSpace,
    props: ['showBox1'],
    created() {
      let me = this;
      me.getClose();
    },
    data() {
      return {
        value: '',
        value1: ''
      };
    },
    computed: {
      ...mapState(NameSpace, ['option'])
    },
    methods: {
      ...mapActions(NameSpace, ['getClose']),
      enter() {
        if (this.value1) {
          this.$emit('my-enter', this.value1, this.value);
        } else {
          Toast('请选择原因！');
        }
      },
      close() {
        this.$emit('my-close', this.value1, this.value1);
      }
    }
  };
</script>
