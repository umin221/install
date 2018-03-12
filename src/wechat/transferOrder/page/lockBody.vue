<template>
    <div>
      <!--header-->
      <mt-header fixed title="锁芯部分">
        <fallback slot="left"></fallback>
      </mt-header>

      <!--detail-->
      <div class="mint-content">
        <cus-field label="产品名称"
                 :value="form['Sales Type']"
                 is-link></cus-field>
        <cus-field label="开向"
                 :value="form['Last Name']"
                 is-link></cus-field>
        <cus-field label="是否带天地"
                 :value="form['Last Name']"
                 is-link></cus-field>
        <cus-field label="交货日期"
                 :value="form['Last Name']"
                 is-link></cus-field>
        <cus-field label="数量"
                 type="number"
                 :value="form['Last Name']"></cus-field>
        <cus-field label="门材质"
                 :value="form['Last Name']"
                 is-link></cus-field>
        <cus-field label="门厚"
                 :value="form['Last Name']"></cus-field>
        <cus-field label="锁舌导向板规格"
                 :value="form['Last Name']"></cus-field>
        <cus-field label="门扣板规格"
                 :value="form['Last Name']"></cus-field>
        <cus-field label="配件要求"
                 :value="form['Last Name']"></cus-field>
        <cus-field label="备注"
                 type="textarea"
                 :value="form['Last Name']"></cus-field>
      </div>

      <!--buttons-->
      <button-group>
        <mt-button type="primary"
                   @click.native="saveFn">保存</mt-button>
      </button-group>
    </div>
</template>

<script type="es6">
  import cusField from 'public/components/cus-field';
  let NameSpace = 'lock-detail';
  export default {
    name: NameSpace,
    components: {cusField},
    data() {
      return {
        form: {}
      };
    },
    methods: {
      saveFn() {

      }
    }
  };

</script>

<style lang="scss"></style>
