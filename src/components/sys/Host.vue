// AppComponent.vue

<template>
   <el-card body-style="padding: 8px 20px;">
       <div slot="header" class="clearfix">
            <span>主机信息</span>
            <el-button style="padding: 3px 5px;" type="text" icon="el-icon-refresh" @click="getSysHost"></el-button>
        </div>
        <div v-loading="isLoading" element-loading-text="加载中...">
            <!-- <div class="item">
                <span>主机标识:</span>
                <span class="text">{{id}}</span>
            </div> -->
            <div class="item">
                <span>主机名称:</span>
                <span class="text">{{name}}</span>
            </div>
            <div class="item">
                <span>启动时间:</span>
                <span class="text">{{bootTime}}</span>
            </div>
            <div class="item">
                <span>操作系统:</span>
                <span class="text">{{os}}</span>
            </div>
            <div class="item">
                <span>系统平台:</span>
                <span class="text">{{platform}}</span>
            </div>
            <div class="item">
                <span>平台版本:</span>
                <span class="text">{{platformVersion}}</span>
            </div>
            <div class="item">
                <span>内核版本:</span>
                <span class="text">{{kernelVersion}}</span>
            </div>
            <div class="item">
                <span>系统内存:</span>
                <span class="text">{{memory}}</span>
            </div>
            <div class="item">
                <span>处理器:</span>
                <span class="text">{{cpu}}</span>
            </div>
        </div>
   </el-card>
</template>

<script>
    import Component from 'vue-class-component'
    import BaseComponent from '../BaseComponent.vue'

    @Component({
    })
    export default class Host extends BaseComponent {
        isLoading = false
        id = ""
        name = ""
        bootTime = ""
        os = ""
        platform = ""
        platformVersion = ""
        kernelVersion = ""
        cpu = ""
        memory = ""

        onGetSysHost(code, err, data) {
            this.isLoading = false
            if (code === 0) {
                this.id = data.id;
                this.name = data.name;
                this.bootTime = data.bootTime;
                this.os = data.os;
                this.platform = data.platform;
                this.platformVersion = data.platformVersion;
                this.kernelVersion = data.kernelVersion;
                this.cpu = data.cpu;
                this.memory = data.memory;
            }
        }
        getSysHost() {
            this.isLoading = true
            this.post(this.network.uris.sysHost, null, this.onGetSysHost);
        }

        mounted() {
            this.getSysHost();
        }
    }
</script>

<style scoped lang="scss">
    .item {
        font-size: 13px;
        padding: 2px 0;
    }

    .text {
        font-weight: bold;
        padding-left: 2px;
    }

</style>