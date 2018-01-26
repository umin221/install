<template>
  <div>
    <mt-header fixed title="demo">
      <fallback slot="left">返回</fallback>
    </mt-header>

    <list-loading></list-loading>

  </div>
</template>

<script type="application/javascript">
  import listLoading from 'public/components/list-loading';

  export default {
    name: 'list-loading',
    components: listLoading
  };
</script>
