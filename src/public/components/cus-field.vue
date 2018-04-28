<template>
  <div class="cus-field">
    <mt-field v-if="edit&&!isLink"
      :label="label"
      :placeholder="placeholder"
      :value="currentValue"
      :state="state"
      :type="type"
      @change="changeFn"
      @input="handleInput">
      <slot></slot>
    </mt-field>
    <mt-cell v-else
      :title="label"
      :placeholder="placeholder"
      :value="currentValue"
      :state="state"
      @change="changeFn"
      :isLink="isLink">
      <slot>{{linkPlaceholder}}</slot>
    </mt-cell>
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
        isLink: Boolean,
        state: String
      },
      data() {
        return {
          currentValue: this.value
        };
      },
      computed: {
        linkPlaceholder() {
          let val = this.value;
          return this.isLink && !val ? '请选择' : val;
        }
      },
      methods: {
        handleInput(val) {
          this.currentValue = val;
        },
        changeFn(val) {
          this.$emit('change', val);
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
    };
</script>

<style lang="scss">
  .cus-field {

    &.error {
      border-bottom: 1px solid red;
    }

    &.require {
      .mint-cell-title:before {
        content: "*";
        color: $red-base;
      }
    }

    .mint-cell {
      background-image: none;

      .mint-cell-wrapper {
        padding: 6px 10px;

        .mint-cell-title {
          min-width: 80px;
          color: $gray-minor;
        }

        .mint-cell-value {
          color: $black-base;
        }
      }
    }
  }

  .readonly {
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
