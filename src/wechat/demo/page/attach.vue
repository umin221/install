<template>
    <div>
      <!--header-->
      <mt-header fixed title="附件demo">
        <fallback slot="left"></fallback>
        <mt-button slot="right" @click="edit=!edit">{{edit ? '完成' : '编辑'}}</mt-button>
      </mt-header>

      <div class="mint-content">
        <cus-attach :attach="attach"
                :edit="edit"
                title="附件demo">
        </cus-attach>
      </div>
    </div>
</template>

<script type="es6">
  import cusAttach from 'public/components/cus-attach';

  let NAMESPACE = 'attach';
  export default {
    name: NAMESPACE,
    components: {cusAttach},
    data() {
      return {
        attach: [{id: 1}],
        edit: false
      };
    }
  };

</script>

<style lang="scss"></style>
