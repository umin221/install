/** 
* @file 单选列表 
* @author 石 
* @date 2018/3/16 
*/
<template>
  <div class="raido-list">
    <div class="mint-cell-wrapper" v-for='(item,index) in list' :key='index'>
      <div class="mint-cell-title" >
        <!---->
        <label class="mint-radiolist-label" @change="change(item,index)">
          <div class="mint-radio-label">
            <p><span></span>{{item.name}}</p>
          </div>
        </label>
      </div>
      <!---->
    </div>
  </div>
</template>

<script type="es6">
  export default {
    name: 'radioList',
    props: {
      list: Array
    },
    methods: {
      change(item, index) {
        this.$emit('change', item, index);
      }
    }
  };
</script>

<style scoped>
  .raido-list{
    margin-top: .6rem;
  }
  .mint-radiolist-label{
    padding: 0;
    display: flex;
    align-items: center;
  }
  .mint-cell-wrapper{
    padding-right: 0;
  }
  .mint-radio-label {
    margin-left: 10px;
    width: calc(100% - 30px);
    font-size: 0.75rem;
  }
  .mint-radio-label p {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
    line-height: 1rem;
    margin: 8px 0;
  }
  .mint-radio-label .project-name{
    color: #939393;
  }
  .mint-cell-title{
    overflow: hidden;
    border-bottom: 1px solid #eee;
  }
</style>