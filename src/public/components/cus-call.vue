<template>
  <div>
    <mt-actionsheet cancelText="取消"
                    :actions="[{
                      name: '拨号：' + this.number,
                      method: callFn
                    }]"
                    v-model="currentValue">
    </mt-actionsheet>
  </div>
</template>

<script type="es6">
  /* eslint-disable */
  let call = function(number) {
    console.log('拨号：' + number);
    let a = document.createElement('a');
    a.href = 'tel:' + number;
    a.style.visibility = 'hidden';
    document.body.appendChild(a);
    a.click();
  };

  export default {
    name: 'cus-call',
    props: {
      value: Boolean,
      number: String
    },
    data() {
      return {
        currentValue: false
      };
    },
    watch: {
      currentValue(val) {
        this.$emit('input', val);
      },

      value(val) {
        this.currentValue = val;
      }
    },

    methods: {
      callFn() {
        call(this.number);
      }
    }
  };

</script>

<style lang="scss"></style>
