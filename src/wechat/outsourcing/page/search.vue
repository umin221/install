<template>
  <mt-search v-model="value" :result.sync="result" :autofocus="true"></mt-search>
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
