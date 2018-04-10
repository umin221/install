<template>
  <div>
    <mt-header fixed title="项目楼层信息">
      <fallback slot="left"></fallback>
      <mt-button slot="right"
                 v-show="isEdit"
                 v-text="editable ? '保存' : '编辑'"
                 @click.native="editable = !editable"></mt-button>
      <mt-button slot="right"
                 v-show="isSelect"
                 @click.native="selectAll = true;">全选</mt-button>
    </mt-header>
    <div class="mint-content assets" :class="{readonly: !editable}">
      <mt-navbar v-model="selected">
        <mt-tab-item class="xs-icon"
                     v-for="(item, index) in building"
                     :key="index"
                     :id="index"
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
                :class="{'active': room['Serial Number'], 'selected': room['selected']}"
                :key="index"
                @click="roomFn(room)">{{room['Street Address 4']}}</span>
        </div>
      </div>

      <button-group>
        <mt-button class="single"
                   @click.native="addFloorFn">新增楼层</mt-button>
      </button-group>
    </div>

    <mt-actionsheet
      :actions="[{
        name: '扫描',
        method: toScanFn
      },{
        name: '录入',
        method: toFillFn
      }]"
      v-model="sheetVisible">
    </mt-actionsheet>

    <button-group>
      <mt-button class="single"
                 v-show="isSelect"
                 @click.native="toNextFn">下一步</mt-button>
    </button-group>
  </div>
</template>

<script type="es6">
  import {mapState, mapActions, mapMutations} from 'vuex';
  import buttonGroup from 'public/components/cus-button-group';

  // 任务id
  let OrderId;
  let TaskId; // '1-2BSETV8Y'
  // 楼层&房号信息
  let layers = {};
  // 当前最高楼层
  let maxFloor = 0;

  const NAMESPACE = 'assets';
  export default {
    name: NAMESPACE,
    activated() {
      let param = this.$route.query;
      // 订单id & 批次id 2填1
      let orderId = param.OrderId;
      // 批次id & 订单id 2填1
      let taskId = param.TaskId;
      // 页面交互模式
      this.mode = param.mode;
      // 不同批次或订单，清除楼栋
      if (orderId !== OrderId || taskId !== TaskId || this.isEdit) {
        if (this.$parent.transitionName === 'turn-on') this.editable = false;
        // 清空楼栋
        this.clearLayer();
        // 清空选中房号
        this.selectRooms = {};
        // 重置tab选择
        this.selected = 0;
        // 活动id
        OrderId = orderId;
        TaskId = taskId;
        // 查询所有楼栋
        this.queryBuilding({
          data: {
            OrderId: OrderId,
            TaskId: TaskId
          }
        });
      }
    },
    data: () => {
      return {
        selected: 0,
        editable: false,
        // mode = select 移交前的选择房号  mode = edit 编辑楼栋信息
        mode: '',
        // 已选择房号信息
        selectRooms: {},
        // 楼栋全选
        selectAll: false,
        // 底部推出菜单操作
        sheetVisible: false,
        // 底部推出菜单操作对象
        sheetObject: ''
      };
    },
    computed: {
      ...mapState(NAMESPACE, ['layer', 'building']),
      isSelect() {
        return this.mode === 'select';
      },
      isEdit() {
        return this.mode === 'edit';
      },
      /**
       * 重构楼层信息&标记选中状态
       */
      layers() {
        let layer = this.layer;
        layers = {};
        maxFloor = 0;
        for (let i = 0, len = layer.length; i < len; i++) {
          // 房号
          let room = this.markFn(layer[i]);
          // 楼层
          let floor = parseInt(room['Integration Id 3'], 10);
          // 楼层分组
          layers[floor] = layers[floor] || [];
          layers[floor].push(room);
          // 更新最高楼层
          if (floor > maxFloor) maxFloor = floor;
        };
        // 清空全选操作
        this.selectAll = false;
        return layers;
      }
    },
    methods: {
      ...mapMutations(NAMESPACE, ['clearLayer']),
      ...mapActions(NAMESPACE, ['queryBuilding', 'getLayer', 'removeBuilding']),
      /**
       * 编辑楼栋信息
       * 只编辑批次楼栋
       */
      editBuildingFn() {
        this.$router.push({
          name: 'building',
          query: {
            id: TaskId
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
          'Original Order Id': OrderId,
          'KL Activity Id': TaskId,
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
        MessageBox.confirm('是否删除整层？', '请确认').then(() => {
          let floorNum = floor[0]['Integration Id 3'];
          // 只批次编辑楼栋
          this.removeBuilding({
            data: {
              'Object Id': TaskId,
              'BuildingNum': this.selected,
              'FloorNum': floorNum
            },
            success: data => {
              this.getLayer({
                'Original Order Id': OrderId,
                'KL Activity Id': TaskId,
                'Integration Id 2': this.selected
              });
            }
          });
        });
      },
      /**
       * 选中房号 或 选中安装
       * @param {Object} room 必填 房号信息
       */
      roomFn(room) {
        // 编辑状态下不操作房号
        if (!this.isEdit) {
          if (this.isSelect) {
            // 选择资产移交
            if (room.selected) {
              this.$set(room, 'selected', undefined);
              delete this.selectRooms[room.Id];
            } else {
              this.$set(room, 'selected', 'selected');
              this.selectRooms[room.Id] = room;
            };
          } else {
            // 已扫码资产
            if (room['Serial Number']) return;
            // 推出操作菜单
            this.sheetVisible = true;
            this.sheetObject = room;
          };
        }
      },
      /**
       * 标记选中状态
       * @param {Object} room 必填 房号信息
       */
      markFn(room) {
        // 被选中的房号
        let selectRooms = this.selectRooms;
        // 标记被选中的房号
        if (this.selectAll || selectRooms[room.Id]) {
          this.$set(room, 'selected', 'selected');
          selectRooms[room.Id] = room;
        };
        return room;
      },
      /**
       * 安装订单－真锁移交－选择完毕跳转更新批次信息页面
       * @param {Object} room 必填 房号信息
       */
      toNextFn() {
        this.$router.push({
          name: 'yjBatch',
          query: {
            result: JSON.stringify(this.selectRooms)
          }
        });
      },
      /**
       * 扫码填入资产信息
       */
      toScanFn() {
        this.$router.push('detail');
      },
      /**
       * 填入资产信息
       */
      toFillFn() {
        this.$router.push({
          name: 'detail',
          query: {
            room: JSON.stringify(this.sheetObject)
          }
        });
      }
    },
    components: {buttonGroup}

  };
</script>

<style lang="scss">
  .assets {

    .mint-navbar {
      overflow-x: auto;

      &::-webkit-scrollbar {
        display: none;
      }

      .mint-tab-item {
        flex: none;
        min-width: 80px;
      }
    }

    .mint-navbar {
      .mint-tab-item-label:before {
        content: '\A157';
        padding-right: 5px;
      }
    }

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

      &.active {
        border-color: #fff;
        background-color: #7ce87c;
        color: #fff;
      }

      &.selected {
        border-color: #fff;
        background-color: #2a64e8;
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
    &.mint-content {
      padding-bottom: 2rem;
    }

    span.edit-class {
      display: none;
    }
  }
</style>
