
<template>
    <el-card body-style="padding: 8px 20px;">
        <div slot="header" class="clearfix">
            <span>服务信息</span>
            <el-button style="padding: 3px 5px;" type="text" icon="el-icon-refresh" @click="getInfo"></el-button>
        </div>
        <div v-loading="isLoading" element-loading-text="加载中...">
            <div class="item">
                <span>服务名称:</span>
                <span class="text">{{info.name}}</span>
            </div>
            <div class="item">
                <span>启动时间:</span>
                <span class="text">{{info.bootTime}}</span>
            </div>
            <div class="item">
                <span>版本号:</span>
                <span class="text">{{info.version}}</span>
            </div>
        </div>
    </el-card>
</template>

<script>
    import Component from 'vue-class-component'
    import BaseComponent from '../BaseComponent.vue'

    @Component({
    })
    export default class Service extends BaseComponent {
        isLoading = false
        info = {
            name: "",
            version: "",
            bootTime: "",
            remark: ""
        }

        onGetInfo(code, err, data) {
            this.isLoading = false
            if (code === 0) {
                this.info.name = data.name;
                this.info.bootTime = data.bootTime;
                this.info.version = data.version;
                this.info.remark = data.remark;
            }
        }
        getInfo() {
            this.isLoading = true
            this.post(this.network.uris.svcInfo, null, this.onGetInfo);
        }

        mounted() {
            this.getInfo();
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