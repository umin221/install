<template>
  <div class="cus-search">
    <fallback slot="left"></fallback>

    <search :value="currentValue"
               :result.sync="result"
               :placeholder="placeholder"
               :autofocus="true"
               :show="show"
               @keyup.enter.native="searchFn"
               @search="searchFn"
               @input="handleInput">
      <slot>
        <mt-cell
          v-for="item in result"
          :key="item.title"
          :title="item.title"
          :value="item.value">
        </mt-cell>
      </slot>

      </mt-cell>
    </search>
  </div>
</template>

<script type="es6">
  import search from './search.vue';

  export default {
    name: 'cus-search',
    components: {search},
    props: {
      result: Array,
      placeholder: String,
      attr: Object,
      show: Boolean,
      value: String
    },
    data: () => {
      return {
        currentValue: ''
      };
    },
    watch: {
      value(val) {
        this.currentValue = val;
      },
      currentValue(val) {
        this.$emit('input', val);
      }
    },
    methods: {
      handleInput(val) {
        this.currentValue = val;
      },
      searchFn() {
        let val = this.currentValue;
        if (val.length) {
          this.$parent.searchFn(val);
        }
      }
    }
  };
</script>

<style lang="scss">
  .cus-search {
    .cus-fallback {
      position: absolute;
      line-height: 2.2rem;
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

      .mint-searchbar {
        padding: 0.3rem 10px;

        .mint-searchbar-inner {
          height: 1.4rem;
          padding: 0.2rem 6px;

          input {
            font-size: $font-size-default;
          }
        }

        .mint-searchbar-cancel {
            font-size: $font-size-default;
        }
      }
    }
  }
</style>
