<template>
  <div>
    <mt-header fixed title="常见问题">
      <fallback slot="left"></fallback>
    </mt-header>

    <div class="wrapper faq">
      <div v-for="(item, index) in list">
        <mt-cell class="multiple"
                 :key="index"
                 :title="item.question">
        </mt-cell>
        <div class="answer">{{item['answer']}}</div>
      </div>
    </div>
  </div>
</template>

<script type="es6">
  let NAMESPACE = 'faq';

  export default {
    name: NAMESPACE,
    data() {
      return {
        // faq 文件问题配置
        list: FAQ.list
      };
    }
  };

</script>

<style lang="scss">
  .wrapper.faq {
    .answer {
      background-color: #f1f1f1;
      font-size: 0.65rem;
      padding: 10px;
      text-indent: 20px;
    }
  }
</style>
