<template>
  <div class="search">
    <fallback slot="left"></fallback>

    <mt-search v-model.trim="value" ref="search"
               :result.sync="result"
               placeholder="搜索委外团队"
               :autofocus="true">
      <mt-cell
        v-for="item in result"
        :key="item"
        :title="item"
        :value="item">
      </mt-cell>
    </mt-search>
  </div>
</template>

<script type="es6">
  export default {
    name: 'search',
    data: () => {
      return {
        result: ['array', 'string', 'inter'],
        value: ''
      };
    },
    methods: {
      input(val) {
        console.log(val);
      }
    },
    mounted() {
      this.$refs.search.$on('input', (val) => {
        console.log(val);
      })
    }
  };
</script>

<style lang="scss">
  .search {
    .cus-fallback {
      position: absolute;
      height: 52px;
      line-height: 52px;
      background-color: #d9d9d9;
      border: 0;
      z-index: 2;

      button {
        background-color: #d9d9d9;
        box-shadow: none;
      }
    }

    .mint-search {
      top: 0;

      .mint-searchbar-inner {
        text-indent: 26px;
      }
    }
  }
</style>
