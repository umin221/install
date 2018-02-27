<template>
  <div>
    <mt-header fixed title="搜索">
      <fallback slot="left"></fallback>
    </mt-header>
    <div class="mint-content">
      <mt-search v-model="value" :result.sync="result" :autofocus="true"></mt-search>
    </div>
  </div>
</template>
<script type="application/javascript">
  export default {
    name: 'search',
    data: () => {
      return {
        result: ['array', 'string', 'inter'],
        value: ''
      };
    },
    methods: {}
  };
</script>
