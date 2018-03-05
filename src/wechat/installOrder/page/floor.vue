<template>
  <div>
    <mt-header fixed title="楼层信息">
      <fallback slot="left"></fallback>
      <mt-button @click.native="toEditFn" slot="right" >保存</mt-button>
    </mt-header>
    <div class="mint-content building">
      <mt-field label="楼层名称" placeholder="1F"
                @change="addAddress"></mt-field>
      <div style="height: 5px"></div>
      <mt-field label="房间1" placeholder="1001"
                :class="heartVisible"></mt-field>
      <mt-field label="房间2" placeholder="1002"
                :class="heartVisible"></mt-field>
      <mt-field label="房间3" placeholder="1003"
                :class="heartVisible"></mt-field>
      <mt-field label="房间4" placeholder="1004"
                :class="heartVisible"></mt-field>
      <mt-field label="房间5" placeholder="1005"
                :class="heartVisible"></mt-field>
    </div>
    <button-group>
      <mt-button type="primary" class="single"
                 @click.native="addFloor">新增房间</mt-button>
    </button-group>
  </div>
</template>
<style lang="scss">
</style>
<script type="application/javascript">
  import buttonGroup from 'public/components/cus-button-group';
  export default {
    name: 'detail',
    created: () => {
      console.dir(1);
    },
    data: () => {
      return {
        value: '',
        active: 'tab-container'
      };
    },
    beforeRouteEnter(to, from, next) {
      console.dir(2);
      next(vm => {
        let query = vm.$route.query;
        console.dir(query);
      });
    },
    methods: {
    },
    components: {buttonGroup}
  };
</script>
