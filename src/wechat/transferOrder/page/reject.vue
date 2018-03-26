<template>
    <div>
      <!--header-->
      <mt-header fixed title="安装交接单驳回">
        <fallback slot="left"></fallback>
      </mt-header>

      <div class="mint-content">
        <mt-field placeholder="请输入驳回原因" type="textarea" rows="4" v-model="content"></mt-field>
      </div>

      <!--buttons-->
      <button-group>
        <mt-button @click.native="rejectFn">提交</mt-button>
      </button-group>
    </div>
</template>

<script type="es6">
  import {mapActions} from 'vuex';

  const NAMESPACE = 'reject';
  export default {
    name: NAMESPACE,
    data() {
      return {
        content: ''
      };
    },
    methods: {
      ...mapActions('detail', ['reject']),
      rejectFn() {
        this.reject();
      }
    }
  };

</script>

<style lang="scss"></style>
