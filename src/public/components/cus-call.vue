<template>
  <div>
    <mt-actionsheet cancelText="取消"
                    :actions="actions"
                    v-model="currentValue">
    </mt-actionsheet>
  </div>
</template>

<script type="es6">
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
        actions: [{
          name: '拨号：' + this.number,
          method: () => {
            call(this.number);
          }
        }],
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
    }
  };

</script>

<style lang="scss"></style>
