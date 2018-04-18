<template>
  <div>
    <mt-header fixed title="楼层信息">
      <fallback slot="left"></fallback>
      <mt-button @click.native="saveFn" slot="right" >保存</mt-button>
    </mt-header>
    <div class="mint-content building">
      <mt-field label="楼层名称" v-model="floorName"></mt-field>
      <div style="height: 5px"></div>
      <mt-cell-swipe v-for="(room, index) in floor"
                     :title="'房号'+ room['KL Room Number']"
                     :right="[{
                        content: '删除',
                        style: { background: 'red', color: '#fff' },
                        handler: () => removeFn(room, index)
                      }]"
                     :key="index">
        <input type="text" class="mint-field-core" v-model="room['Street Address 4']"/>
      </mt-cell-swipe>
      <button-group>
        <mt-button class="single"
                   @click.native="addRoomFn(floorName)">新增房间</mt-button>
      </button-group>
    </div>
  </div>
</template>
<style lang="scss">
  .mint-field-core {
    text-align: right;
  }
</style>
<script type="es6">
  import {mapActions} from 'vuex';
  import buttonGroup from 'public/components/cus-button-group';

  /**
   * 格式化提交房号数据格式
   * @param data 待格式化数组
   * @param floorName 楼层名字
   * @returns {Array}
   */
  let format = (data, floorName) => {
    // 格式化结果
    let arr = [];
    for (let i = 0, len = data.length; i < len; i++) {
      let item = data[i];
      // 房号
      let roomName = item['Street Address 4'];
      arr.push({
        'Province': item['Province'],
        'Country': item['Country'],
        'Street Address 2': item['Street Address 2'],
        'KL Building Number': item['KL Building Number'],
        'KL Room Number': item['KL Room Number'],
        'KL Floor Number': item['KL Floor Number'],
        'City': item['City'],
        'Street Address': item['Street Address'],
        'Id': item['Personal Address Id'],
        'Street Address 4': roomName,
        'Street Address 3': floorName,
        'ListOfKL Install Order Asset': item['ListOfKL Install Order Asset']
      });
    }
    return arr;
  };

  const NAMESPACE = 'floor';
  export default {
    name: NAMESPACE,
    created() {
      let param = this.$route.query;
      // 楼层房号信息
      this.floor = KND.Util.parse(param.floor);
      // 楼层名字
      this.floorName = this.floor[0]['Street Address 3'];
      // 按编号排序
      // floor.sort((a, b) => a['KL Building Number'] > b['KL Building Number']);
    },
    data: () => {
      return {
        floor: '',
        floorName: ''
      };
    },
    methods: {
      ...mapActions(NAMESPACE, ['upsertRoom', 'removeRoom']),
      // 更新房号&楼层信息
      saveFn() {
        this.upsertRoom(format(this.floor, this.floorName));
      },
      // 添加新房号
      addRoomFn(floorName) {
        let now = KND.Util.now();
        let floor = this.floor;
        // 构造新房号
        let room = Object.assign({}, floor[floor.length - 1]);
        // 房号编码自增
        room['KL Room Number'] = parseInt(room['KL Room Number'], 10) + 1;
        // 房号自增
        room['Street Address 4'] = parseInt(room['Street Address 4'], 10) + 1;
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
        floor.push(room);
      },
      // 删除房号
      removeFn(room, index) {
        if (room['Serial Number']) {
          Toast({
            message: '已绑定智能锁设备，不允许删除',
            position: 'bottom'
          });
          return;
        };
        MessageBox.confirm('是否删除这个房间？', '请确认').then(() => {
          let remove = () => this.floor.splice(index, 1);
          console.log(room);
          // 有如下字段，表示为本地对象 未提交服务器
          room['ListOfKL Install Order Asset'] ? remove() : this.removeRoom({
            data: { id: room.Id },
            success: data => {
              remove();
              // 标记楼栋资产刷新
              KND.Session.set('refreshAssets', true);
            }
          });
        });
      }
    },
    components: {buttonGroup}
  };
</script>
