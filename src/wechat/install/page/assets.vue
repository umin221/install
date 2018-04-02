<template>
  <div>
    <mt-header fixed title="项目楼层信息">
      <fallback slot="left"></fallback>
      <mt-button @click.native="editable = !editable" slot="right" v-text="editable ? '保存' : '编辑'"></mt-button>
    </mt-header>
    <div class="mint-content assets" :class="{readonly: !editable}">
      <mt-navbar v-model="selected">
        <mt-tab-item v-for="(item, index) in assets"
                     :key="index"
                     :id="item.BuildingNum"
                     @click.native="getLayerFn(item.BuildingNum)">{{item.BuildingName}}</mt-tab-item>
        <span class="edit-class xs-icon icon-edit" @click="editBuildingFn"></span>
      </mt-navbar>
      <div style="height: 5px"></div>
      <div style="background: white;margin-bottom: 5px;"  v-for="(floor, index) in layers"  :key="index" >
        <mt-cell-swipe :right="[{
                        content: '删除',
                        style: { background: 'red', color: '#fff' },
                        handler: () => deleteBuildingFn(floor)
                      }]">
          <div slot="title" class="list-text"><span class="list-text-span">{{floor[0]['Street Address 3']}}</span></div>
          <span class="edit-class xs-icon icon-edit" @click="editFloorFn(floor)"></span>
        </mt-cell-swipe>
        <div class="assets-div co-flex co-wp">
          <span v-for="(room, index) in floor"
                :class="{'fill-green': room['Product Model No']}"
                :key="index"
                @click="roomFn(room)">{{room['Street Address 4']}}</span>
        </div>
      </div>

      <button-group>
        <mt-button class="single" @click.native="addFloorFn">新增楼层</mt-button>
      </button-group>
    </div>
  </div>
</template>

<script type="es6">
  import {mapState, mapActions} from 'vuex';
  import buttonGroup from 'public/components/cus-button-group';

  // 任务id
  let activityId = '1-2BSETV8Y';
  // 楼层&房号信息
  let layers = {};
  // 当前最高楼层
  let maxFloor = 0;

  const NAMESPACE = 'assets';
  export default {
    name: NAMESPACE,
    created() {
      // 查询所有楼栋
      this.queryBuilding({
        data: {
          id: activityId
        }
      });
    },
    data: () => {
      return {
        selected: '1',
        editable: false,
        type: ''
      };
    },
    computed: {
      ...mapState(NAMESPACE, ['layer', 'assets']),
      /**
       * 重构楼层信息
       */
      layers() {
        let layer = this.layer;
        layers = {};
        maxFloor = 0;
        for (let i = 0, len = layer.length; i < len; i++) {
          //
          let floor = parseInt(layer[i]['Integration Id 3'], 10);
          layers[floor] = layers[floor] || [];
          layers[floor].push(layer[i]);
          // 更新最高楼层
          if (floor > maxFloor) maxFloor = floor;
        };
        return layers;
      }
    },
    methods: {
      ...mapActions(NAMESPACE, ['queryBuilding', 'getLayer', 'deleteBuilding']),
      /**
       * 编辑楼栋信息
       */
      editBuildingFn() {
        this.$router.push({
          name: 'building',
          query: {
            id: activityId
          }
        });
      },
      /**
       * 编辑楼层&房号信息
       * @param {Object} floor 必填 楼层&房号信息
       */
      editFloorFn(floor) {
        this.$router.push({
          name: 'floor',
          query: {
            floor: JSON.stringify(floor)
          }
        });
      },
      /**
       * 获取楼栋信息
       * @param {String} code 必填 楼栋编号
       */
      getLayerFn(code) {
        this.getLayer({
          'KL Activity Id': activityId,
          'Integration Id 2': code
        });
      },
      /**
       * 添加楼层
       * @param {String} code 必填 楼栋编号
       */
      addFloorFn() {
        // 获取当前最大楼层
        let floor = layers[maxFloor];
        let newFloor = [];
        // 添加房号
        let addRoom = rm => {
          let now = KND.Util.now();
          let room = Object.assign({}, rm);
          // 楼层编码自增
          let floorCode = maxFloor + 1;
          // 楼层编码自增
          room['Integration Id 3'] = floorCode;
          // 楼层自增
          room['Street Address 3'] = room['Street Address 3'].replace(maxFloor, floorCode);
          // 房号楼层自增
          room['Street Address 4'] = room['Street Address 4'].replace(maxFloor, floorCode);
          // 房号id 唯一即可
          room['Personal Address Id'] = now;
          // 关联资产
          room['ListOfKL Install Order Asset'] = {
            'KL Install Order Asset': {
              'Original Order Id': room['Original Order Id'],
              'KL Activity Id': room['KL Activity Id'],
              'Id': now
            }
          };
          return room;
        };
        // 构造新楼层
        for (let i = 0, len = floor.length; i < len; i++) {
          newFloor.push(addRoom(floor[i]));
        };
        this.$router.push({
          name: 'floor',
          query: {
            floor: JSON.stringify(newFloor)
          }
        });
      },
      /**
       * 删除楼层
       * @param {Object} floor 楼层
       */
      deleteBuildingFn(floor) {
        let floorNum = floor[0]['Integration Id 3'];
        this.deleteBuilding({
          data: {
            'Object Id': activityId,
            'BuildingNum': this.selected,
            'FloorNum': floorNum
          },
          success: data => {
            this.getLayer({
              'KL Activity Id': activityId,
              'Integration Id 2': this.selected
            });
          }
        });
      },
      /**
       * 点击房号 扫码安装
       * @param {Object} room 必填 房号信息
       */
      roomFn(room) {
        console.log(room);
      }
    },
    components: {buttonGroup}

  };
</script>

<style lang="scss">
  .assets {
    .assets-div {
      padding: 5px 0;
      border-top: 1px solid #eaeaea;
    }
    .assets-div span{
      border: 1px solid #eaeaea;
      border-radius: 10px;
      margin: 5px 6px;
      width: 65px;
      line-height: 22px;
      text-align: center;
      color: #777;
      font-size: $font-size-default;

      &.fill-green {
        background-color: #7ce87c;
        color: #fff;
      }
    }
    .edit-class {
      width: 30px;
      font-size: $font-size-default;
      position: absolute;
      right: 0px;
      height: 36px;
      line-height: 36px;
    }

    .mint-cell-swipe-button {
      line-height: 34px;
    }
  }

  .readonly {
    span.edit-class {
      display: none;
    }
  }
</style>
