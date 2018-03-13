<template>
    <div>
      <!--header-->
      <mt-header fixed title="锁芯部分">
        <fallback slot="left"></fallback>
      </mt-header>

      <!--detail-->
      <div class="mint-content">
        <cus-field label="产品名称"
                 :value="line['Id']"
                 is-link></cus-field>
        <cus-field label="开向"
                 :value="line['KL Hole Direction']"
                 is-link></cus-field>
        <cus-field label="是否带天地"
                 :value="line['KL World Flag']"
                 is-link></cus-field>
        <cus-field label="交货日期"
                 :value="line['Scheduled Ship Date']"
                 is-link></cus-field>
        <cus-field label="数量"
                 type="number"
                 :value="line['Quantity Requested']"></cus-field>
        <cus-field label="门材质"
                 :value="line['KL Door Material Quality']"
                 is-link></cus-field>
        <cus-field label="门厚"
                 :value="line['KL Door Thickness']"></cus-field>
        <cus-field label="锁舌导向板规格"
                 :value="line['KL Guide Plate Specification']"></cus-field>
        <cus-field label="门扣板规格"
                 :value="line['KL Gate Plate Specification']"></cus-field>
        <cus-field label="配件要求"
                 :value="line['KL Parts Requirement']"></cus-field>
        <cus-field label="备注"
                 type="textarea"
                 :value="line['Description']"></cus-field>
      </div>

      <!--buttons-->
      <button-group>
        <mt-button type="primary"
                   @click.native="saveFn">保存</mt-button>
      </button-group>
    </div>
</template>

<script type="es6">
  import {mapActions} from 'vuex';
  import cusField from 'public/components/cus-field';

  let NAMESPACE = 'orderLine';
  export default {
    name: NAMESPACE,
    components: {cusField},
    created() {
      let line = this.$route.query.line;
      if (line) {
        this.line = line;
      }
    },
    data() {
      return {
        line: {
        }
      };
    },
    methods: {
      ...mapActions(NAMESPACE, ['saveOrderLine']),
      saveFn() {
        this.saveOrderLine(this.line);
      }
    }
  };

</script>

<style lang="scss"></style>
