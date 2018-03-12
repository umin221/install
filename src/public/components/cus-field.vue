<template>
  <div class="cus-field">
    <mt-field v-if="edit&&!isLink"
      :label="label"
      :placeholder="placeholder"
      :value="currentValue"
      :type="type"
      @input="handleInput"></mt-field>
    <mt-cell v-else
      :title="label"
      :placeholder="placeholder"
      :value="currentValue"
      :isLink="isLink"></mt-cell>
  </div>
</template>

<script type="es6">
    let NameSpace = 'default';
    export default {
      name: NameSpace,
      props: {
        type: String,
        label: String,
        placeholder: String,
        edit: {
          type: Boolean,
          default: true
        },
        value: String,
        isLink: Boolean
      },
      data() {
          return {
            currentValue: this.value
          }
      },
      methods: {
        handleInput(val) {
          this.currentValue = val;
        }
      },
      watch: {
        value(val) {
          this.currentValue = val;
        },

        currentValue(val) {
          this.$emit('input', val);
        }
      }
    }
</script>

<style lang="scss">
  .cus-field {
    &.require {
      .mint-cell-title:before {
        content: "*";
        color: $red-base;
      }
    }

    .mint-cell {
      background-image: none;
    }

    .mint-cell-wrapper {
      .mint-cell-title {
        flex: 2;
      }

      .mint-cell-value {
        flex: 3;
        word-break: break-all;
      }
    }
  }
</style>
