<template>
    <div>
      <!--header-->
      <mt-header fixed title="安装交接单关闭">
        <fallback slot="left"></fallback>
      </mt-header>

      <div class="mint-content">
        <mt-field placeholder="请输入关闭原因" type="textarea" rows="4" v-model="content"></mt-field>
      </div>

      <!--buttons-->
      <button-group>
        <mt-button @click.native="submitFn">提交</mt-button>
      </button-group>
    </div>
</template>

<script type="es6">
  import {mapActions} from 'vuex';

  let NAMESPACE = 'close';
  export default {
    name: NAMESPACE,
    data() {
      return {
        content: ''
      };
    },
    methods: {
      ...mapActions('detail', ['close']),
      submitFn() {
        this.close();
      }
    }
  };

</script>

<style lang="scss"></style>
