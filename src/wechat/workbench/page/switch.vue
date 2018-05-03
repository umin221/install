<template>
    <div>
      <mt-header fixed title="切换用户">
        <fallback slot="left"></fallback>
      </mt-header>

      <div class="mint-content">
        <mt-cell class="multiple"
                 :key="u.userID"
                 v-for="u in list"
                 @click.native="switchFn(u)"
                 is-link>
          <div class="mint-cell-title" slot="title">{{u['userID']}}</div>
          <div class="mint-cell-sub-title" slot="title">{{u['area']}}_{{u['position']}}_{{u['name']}}</div>
        </mt-cell>
      </div>
    </div>
</template>

<script type="es6">
  let NameSpace = 'default';
  export default {
    name: NameSpace,
    data() {
      return {
        list: [{
          userID: '16043202', position: '安装主管', area: '华东安装四组', name: '张世虎'
        }, {
          userID: '18020016', position: '产品安装工程师', area: '华东安装四组', name: '刘家军'
        }, {
          userID: '17023092', position: '产品安装工程师', area: '华东安装四组', name: '刘耀'
        }, {
          userID: '16043218', position: '安装主管', area: '北方安装一组', name: '谢应发'
        }, {
          userID: '17023093', position: '产品安装工程师', area: '北方安装一组', name: '贾思杰'
        }, {
          userID: '16093008', position: '产品安装工程师', area: '北方安装一组', name: '王照勇'
        }, {
          userID: '16033164', position: '安装主管', area: '南方安装一组', name: '叶亮'
        }, {
          userID: '16033168', position: '产品安装工程师', area: '南方安装一组', name: '曹庆红'
        }, {
          userID: '17023097', position: '产品安装工程师', area: '南方安装一组', name: '丁圣'
        }, {
          userID: '16043215', position: '门厂技术主管（代）', area: '门厂技术组', name: '胡清秀'
        }, {
          userID: '17053018', position: '门厂技术工程师', area: '门厂技术组', name: '韦吉辉'
        }, {
          userID: '17080257', position: '门厂技术工程师', area: '门厂技术组', name: '覃仕权'
        }, {
          userID: '1651', position: '部长（代）', area: '', name: '郭利勤'
        }, {
          userID: '14083015', position: '部长（代）', area: '', name: '胡成涛'
        }, {
          userID: '10080387', position: '部长（代）', area: '', name: '林陈根'
        }, {
          userID: '13070453', position: '部长（代）', area: '', name: '周憧'
        }, {
          userID: '16113009', position: '客服主管', area: '', name: '袁静'
        }, {
          userID: '13030172', position: '安装支持主管（代）', area: '产品安装一组（华东）', name: '张长虹'
        }, {
          userID: '18010047', position: '安装支持专员', area: '产品安装一组（华东）', name: '周振威'
        }, {
          userID: '18010174', position: '安装支持专员', area: '产品安装一组（华东）', name: '刘振伟'
        }, {
          userID: '15063016', position: '安装支持主管（代）', area: '产品安装二组（北方）', name: '李志勇'
        }, {
          userID: '14030364', position: '安装支持专员', area: '产品安装二组（北方）', name: '荣誉'
        }, {
          userID: '17070706', position: '安装支持专员', area: '产品安装二组（北方）', name: '魏春婷'
        }, {
          userID: '11040118', position: '安装支持主管（代）', area: '产品安装三组（南方）', name: '刘继莲'
        }, {
          userID: '17043013', position: '安装支持专员', area: '产品安装三组（南方）', name: '王翠仪'
        }, {
          userID: '17023089', position: '安装支持专员', area: '产品安装三组（南方）', name: '刘辉'
        }, {
          userID: '12070429', position: '项目支持主管（代）', area: '产品安装支持组', name: '周红娟'
        }, {
          userID: '18010049', position: '项目支持专员', area: '产品安装支持组', name: '周理永'
        }, {
          userID: '17070565', position: '技术支持专员', area: '技术支持组', name: '全俊龙'
        }, {
          userID: '14080088', position: '客服专员', area: '产品安装支持组', name: '张沙沙'
        }, {
          userID: '17080258', position: '客服专员', area: '产品安装支持组', name: '许壁填'
        }, {
          userID: 'IM01', position: '产品安装主管', area: '00000010', name: 'IM01'
        }, {
          userID: 'IE01', position: '产品安装工程师', area: '00000001', name: 'IE01'
        }, {
          userID: 'DE01', position: '门厂技术工程师', area: '00000040', name: 'DE01'
        }]
      };
    },
    methods: {
      switchFn(user) {
        KND.Native.userID = user.userID;
        KND.Util.back();
      }
    }
  };

</script>

<style lang="scss"></style>
