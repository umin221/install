/**
* @file 签到记录
* @author  石
* @date  2018/3/14
*/
<template>
  <div id='signRecord'>
    <mt-header fixed :title="headTitle">
      <fallback slot="left"></fallback>
    </mt-header>
    <div class="mint-content">
        <cus-loadmore ref="pending"
                        @loadTop='pendingLoadTopFn'
                        @loadBottom="pendingLoadBottomFn"
                        :topStatus="topStatus">
            <div class="list">
             <div class="date">
                 <p>2017-5-12</p>
             </div>
             <div class='activity_list'>
                <ul>
                    <li class='content'>
                    <p>
                        <span>09:35</span>
                        <span>领创天誉华庭</span>
                    </p>
                    <p class="address">广东省深圳市福田区农轩路55号</p>
                    <span class='point'></span>
                    <div class='line_left'></div>
                    </li>
                    <li class='content'>
                    <p>
                        <span>09:35</span>
                        <span>领创天誉华庭</span>
                    </p>
                    <p class="address">广东省深圳市福田区农轩路55号</p>
                    <span class='point'></span>
                    <div class='line_left'></div>
                    </li>
                </ul>
            </div>
            </div>
            <div class="list">
             <div class="date">
                 <p>2017-5-12</p>
             </div>
             <div class='activity_list'>
                <ul>
                    <li class='content'>
                    <p>
                        <span>09:35</span>
                        <span>领创天誉华庭</span>
                    </p>
                    <p class="address">广东省深圳市福田区农轩路55号</p>
                    <span class='point'></span>
                    <div class='line_left'></div>
                    </li>
                    <li class='content'>
                    <p>
                        <span>09:35</span>
                        <span>领创天誉华庭</span>
                    </p>
                    <p class="address">广东省深圳市福田区农轩路55号</p>
                    <span class='point'></span>
                    <div class='line_left'></div>
                    </li>
                </ul>
            </div>
            </div>            
          </cus-loadmore>
    </div>
  </div>
</template>
<script>
  import cusLoadmore from 'public/components/cus-loadmore';
  // import { mapState } from 'vuex';
  // const NAMESPACE = 'index';
  export default {
    components: {cusLoadmore},
    name: 'signRecord',
    data() {
      return {
        headTitle: '我的签到记录',
        topStatus: 'loading'
      };
    },
    created() {
    },
    computed: {
    },
    methods: {
      // 顶部
      pendingLoadTopFn() {
        console.log('top');
        this.topStatus = 'drop';
      },
      // 底部
      pendingLoadBottomFn() {
        console.log('bottom');
      }
    }
  };

</script>

<style scoped lang="scss">
*{
    margin: 0;
    padding: 0;
}
.mint-content{
    background: #fff;
}

.list {
    width: 90%;
    margin: 0 5%;
  .date {
    text-align: center;
    font-size: 0.75rem;
    color: #777;
    border-bottom: 1px solid #e8e8e8;
    justify-content: center;
    align-items: center;
    margin: 20px 0;
    p {
      padding: 0;
      background: #fff;
      display: block;
      width: 120px;
      margin: 0 auto;
      margin-bottom: -10px;
    }
  }
}
.activity_list {
  margin-top: 15px;
  ul li {
    list-style: none;
    position: relative;
    padding-bottom: 15px;
    p {
      margin: 7px 0 0 0;
      padding-left: 42px;
      color: #777;
      font-size: 0.75rem;
      line-height: 22px;
    }
    p.address {
      color: #333;
    }
    span.point {
        position: absolute;
        width: 11px;
        height: 11px;
        background: #75c86f;
        border-radius: 5px;
        top: 5px;
        left: 22px;
        z-index: 2;
    }
    div.line_left {
        position: absolute;
        width: 1px;
        height: 100%;
        background: #ddd;
        top: 10px;
        left: 27px;
    }
  }
}
.activity_list> ul> li.content:last-child > div.line_left{
    display: none;
}
</style>
