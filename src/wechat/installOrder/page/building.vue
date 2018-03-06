<template>
  <div>
    <mt-header fixed title="项目楼层信息">
      <fallback slot="left"></fallback>
      <mt-button @click.native="toEditFn" slot="right" v-text="editClass ? '保存' : '编辑'"></mt-button>
    </mt-header>
    <div class="mint-content building">
      <div class="building-tab-div" >
        <span v-for="(item, index) in buildingList"  :key="index">{{item.val}}</span>
        <span :class="editClass" style="position: absolute;right: 0px;" @click="toBanFn"></span>
      </div>
      <div style="height: 5px"></div>
      <div style="background: white;padding-bottom: 10px;">
        <mt-cell>
          <div slot="title" class="list-text"><span class="list-text-span">1F</span></div><div :class="editClass" @click="toFloorFn"></div>
        </mt-cell>
        <div class="building-div"><span>1001</span><span>1001</span><span>1001</span></div>
      </div>
      <div style="height: 5px"></div>

      <div style="background: white;padding-bottom: 10px;">
        <mt-cell>
          <div slot="title" class="list-text"><span class="list-text-span">1F</span></div>
        </mt-cell>
        <div class="building-div"><span>1001</span><span>1001</span><span>1001</span></div>
      </div>
      <div style="height: 5px"></div>

      <div style="background: white;padding-bottom: 10px;">
        <mt-cell>
          <div slot="title" class="list-text"><span class="list-text-span">1F</span></div>
        </mt-cell>
        <div class="building-div"><span>1001</span><span>1001</span><span>1001</span></div>
      </div>
      <div style="height: 5px"></div>

      <div style="background: white;padding-bottom: 10px;">
        <mt-cell>
          <div slot="title" class="list-text"><span class="list-text-span">1F</span></div>
        </mt-cell>
        <div class="building-div"><span>1001</span><span>1001</span><span>1001</span></div>
      </div>
    </div>
    <button-group>
      <mt-button type="primary" class="single"
                 @click.native="addFloor">新增楼层</mt-button>
    </button-group>
  </div>
</template>
<style lang="scss">
  .building {
    .building-tab-div {
      background: white;
      height:48px;
      line-height: 48px;
    }
    .building-tab-div span{
      width: 100px;
      display: inline-block;
      text-align: center;
      line-height: 48px;
      height: 48px;
      font-size: $font-size-large;
    }
    .building-div {
      height:40px;
      line-height: 40px;
      padding-top: 10px;
      border-top: 1px solid #ccc;
    }
    .building-div span{
      border: 1px solid #ccc;
      border-radius: 20px;
      padding: 5px 20px;
      margin: 0px 10px;
      color: #777;
      font-size: $font-size-default;
    }
    .editClass {
      width: 30px !important;
      font-size: $font-size-default;
      position: absolute;
      right: 0px;
      height: 36px;
      line-height: 36px;
    }
    .editClass::after {
      content: "\E604";
      right: 10px;
      position: absolute;
    }
  }
</style>
<script type="application/javascript">
  import {mapState, mapActions} from 'vuex';
  import buttonGroup from 'public/components/cus-button-group';
  const NameSpace = 'buildingInfo';
  export default {
    name: 'building',
    created() {
      this.calculationFn();
    },
    data: () => {
      return {
        value: '',
        type: '',
        active: 'tab-container'
      };
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        let query = vm.$route.query;
        console.dir(query);
      });
    },
    computed: {
      ...mapState(NameSpace, ['buildingNum', 'layerNum', 'roomNum', 'buildingList']),
      // * 是否显示
      editClass() {
        return this.type === '' ? '' : 'editClass';
      }
    },
    methods: {
      ...mapActions(NameSpace, ['calculationFn']),
      toEditFn() {
        var self = this;
        if (self.type === '') {
          self.type = 'editClass';
        } else {
          self.type = '';
        }
      },
      toBanFn() {
        var self = this;
        self.$router.push({
          name: 'ban'
        });
      },
      toFloorFn() {
        var self = this;
        self.$router.push({
          name: 'floor'
        });

      }
    },
    components: {buttonGroup}

  };
</script>
