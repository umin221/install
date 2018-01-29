<template>
  <div>
    <mt-header fixed title="Cell">
      <fallback slot="left"></fallback>
    </mt-header>
    <div style="margin-top: 60px">
      <mt-cell title="标题文字"></mt-cell>
      <mt-cell title="标题文字" value="说明文字"></mt-cell>
      <mt-cell title="标题文字" icon="more" value="带 icon"></mt-cell>
      <mt-cell title="标题文字" icon="more">
        <span>icon 是图片</span>
        <img slot="icon" width="24" height="24">
      </mt-cell>
      <mt-cell title="标题文字" is-link value="带链接"></mt-cell>
      <mt-cell title="标题文字" is-link>
        <span style="color: green">这里是元素</span>
      </mt-cell>
      <mt-cell title="标题文字">
        <mt-button size="small" type="primary" icon="back">按钮</mt-button>
      </mt-cell>

      <mt-cell title="标题" label="描述信息" is-link></mt-cell>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Cell'
  };
</script>
