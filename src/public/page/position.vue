<template>
  <lazy :time="450">
    <div class="find-position">
      <iframe id="mapPage" frameborder=0
        src="http://apis.map.qq.com/tools/locpicker?policy=1&search=1&type=1&key=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77&referer=myapp">
      </iframe>
    </div>
  </lazy>
</template>

<script type="es6">
  import lazy from 'public/components/cus-lazy';

  /**
   * 解析区、县
   * @param result
   */
  let resolveTown = (result, adds) => {
    let mark = '区';
    let arr = adds.split(mark);
    if (arr.length === 1) {
      mark = '县';
      arr = adds.split(mark);
      // 没有区、县 或者 区县长度大于5
      if (arr.length === 1 || arr[0].length > 5) {
        result.address = adds;
        return;
      }
    };
    // 区
    result.town = arr.shift() + mark;
    // 详细地址
    result.address = arr.join(mark);
  };

  /**
   * 解析详细地址
   * @param result 用户选点结果
   * @returns {*}
   */
  let resolveAddress = result => {
    let adds = result.poiaddress.split(result.cityname);
    if (adds.length === 2) {
      let province = adds.shift();
      // 解析区、县
      resolveTown(result, adds.shift());
      // 省
      result.province = province.replace('省', '');
    } else {
      console.error(result);
    }
    return result;
  };

  window.addEventListener('message', function(event) {
    // 接收位置信息，用户选择确认位置点后选点组件会触发该事件，回传用户的位置信息
    let loc = event.data;
    if (loc && loc.module === 'locationPicker') { // 防止其他应用也会向该页面post信息，需判断module是否为'locationPicker'
      KND.Event.emit('setPosition', resolveAddress(loc));
      KND.Util.back();
    }
  }, false);

  let NAMESPACE = 'default';
  export default {
    name: NAMESPACE,
    components: {lazy},
    data() {
      return {};
    }
  };

</script>

<style lang="scss">

  @mixin full-screen() {
    height: 100%;
    width: 100%;
    overflow: hidden;
  }

  .find-position {
    @include full-screen;

    iframe {
      @include full-screen;
    }
  }
</style>
