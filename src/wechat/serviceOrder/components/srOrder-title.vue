<template>
  <div class="work-order-title" :class="{comple: iscomple}">
    <div class="linear"></div>
    <div class="text">{{srNum1}}</div>
    <div class="linear"></div>
    <div :class="{text: name1, linear: !name1}">{{name1}}</div>
    <div class="linear"></div>
  </div>
</template>
<style lang="scss">
  .work-order-title{
    position: relative;
    display: flex;
    .linear{
      height:10px;
      width: 100%;
      background-image: linear-gradient(0deg, #d9d9d9, #d9d9d9 15%, transparent 15%);
    }
    .text{
      font-size: 14px;
      color: grey;
      width: 100%;
      text-align: center;
      margin: 0 10px;
    }
  }
  .comple:after{
    content: '已完工';
    color: green;
    position: absolute;
    font-size: 0.75rem;
    transform: translateX(0%) rotate(-30deg);
    right: 5px;
    z-index: 100;
  }
</style>
<script>
  const NameSpace = 'title';
  export default {
    name: NameSpace,
    props: ['srNum', 'name', 'iscomple'],
    created() {
    },
    data() {
      return {
      };
    },
    computed: {
      srNum1() {
        return this.srNum;
      },
      name1() {
        return this.name;
      }
    },
    methods: {
    }
  };
</script>
