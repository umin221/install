<template>
  <lazy :time="450">
    <div class="find-position">
      <iframe id="mapPage" frameborder=0
              src="http://apis.map.qq.com/tools/locpicker?search=1&type=1&key=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77&referer=myapp">
      </iframe>
    </div>
  </lazy>
</template>

<script type="es6">
  import lazy from 'public/components/cus-lazy';

  window.addEventListener('message', function(event) {
    // 接收位置信息，用户选择确认位置点后选点组件会触发该事件，回传用户的位置信息
    let loc = event.data;
    if (loc && loc.module === 'locationPicker') { // 防止其他应用也会向该页面post信息，需判断module是否为'locationPicker'
      KND.Event.emit('setPosition', loc);
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
