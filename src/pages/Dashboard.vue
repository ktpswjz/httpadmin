// AppComponent.vue

<template>
    <div style="padding: 5px;">
        <el-row :gutter="15">
            <el-col :span="15">
                <appList />
            </el-col>
            <el-col :span="9">
                <service />
                <host style="margin-top: 10px;" />
                <networkInterface style="margin-top: 10px;" />
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import Component from 'vue-class-component'
    import BaseComponent from '../components/BaseComponent.vue'
    import Host from '../components/sys/Host.vue'
    import Service from '../components/service/Service.vue'
    import NetworkInterface from '../components/sys/network/Interface.vue'
    import DiskPartition from '../components/sys/disk/Partition.vue'
    import AppList from '../components/app/List.vue'

    @Component({
        components: {
            host: Host,
            service: Service,
            networkInterface: NetworkInterface,
            diskPartition: DiskPartition,
            appList: AppList
        }
    })
    export default class Dashboard extends BaseComponent {

      mounted() {
      }
    }
</script>

<style scoped lang="scss">
  .el-container {
    padding: 0px;
  }

  .el-header {
    padding: 0;
    font-size: 20px;
    text-align: left;
    line-height: 45px;
    background-color: #f8f8f8;
    border-bottom: 1px solid rgb(230, 230, 230);
  }  

  .el-aside {
    padding: 0;

    .el-menu-nav:not(.el-menu--collapse) {
      width: 200px;
      min-height: 400px;
    }
    .el-menu-nav-switch {
      background-color: #f8f8f8;
      font-size: small;
      text-align: center;
      cursor: pointer;
      padding-top: 3px;
      padding-bottom: 5px;
      border-right: 1px solid rgb(230, 230, 230);
    }
  }
  
  .el-main {
    padding: 0;
    text-align: left;

    .el-main-content {
      padding: 5px 5px;
    }
  }

</style>