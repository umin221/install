<template>
  <div>
    <mt-cell v-if="edit" ref="cell"
      :title="label"
      :placeholder="placeholder"
      :isLink="isLink"></mt-cell>
    <mt-field v-else ref="field"
      :label="label"
      :placeholder="placeholder"
      :type="type"></mt-field>
  </div>
</template>

<script type="es6">
    let NameSpace = 'default';
    export default {
      name: NameSpace,
      props: {
        type: String,
        label: String,
        model: String,
        placeholder: String,
        edit: Boolean,
        isLink: Boolean,
        attr: Object
      },
      data() {
          return {}
      },
      watch: {
        attr: {
          immediate: true,
          handler(attrs) {
            this.$nextTick(() => {
              const target = [this.$refs.field];
              target.forEach(el => {
                if (!el || !attrs) return;
                Object.keys(attrs).map(name => el.setAttribute(name, attrs[name]));
              });
            });
          }
        }
      }
    }
</script>

<style lang="scss"></style>
