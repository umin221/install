<template>
  <div>
    <mt-header fixed title="标题">
      <fallback slot="left"></fallback>
    </mt-header>

    <mt-cell title="标题文字" is-link>
      <span style="color: green">元素</span>
    </mt-cell>

    <mt-tab-container v-model="active" :swipeable="true">
      <mt-tab-container-item id="tab-container">
        <mt-cell v-for="n in 10" :key="n" title="tab-container 111"></mt-cell>
      </mt-tab-container-item>
    </mt-tab-container>
  </div>
</template>

<script type="application/javascript">
  export default {
    name: 'detail',
    created: () => {
    },
    data: () => {
      return {
        value: '',
        active: 'tab-container'
      };
    }
  };
</script>
