<template>
   <el-collapse value="partition">
       <el-collapse-item name="partition">
            <template slot="title">
                 <span style="font-size: 16px; padding-left: 18px;">磁盘分区信息</span>
            </template>
            <div v-loading="isLoading" element-loading-text="加载中..."  style="font-size: 12px; padding: 0 18px;">
                <div v-for="(item, index) in partitons" :key="index" >
                    <div v-if="item.total !== '0B'" style="padding-bottom: 5px;">                
                        <div>
                            <span>{{item.path}}</span>
                        </div>
                        <div>
                            <el-tooltip placement="top">
                                <div slot="content">
                                    <div class="item">
                                        <span>挂载点:</span>
                                        <span class="text">{{item.path}}</span>
                                    </div>
                                    <div class="item">
                                        <span>文件系统:</span>
                                        <span class="text">{{item.fileSystem}}</span>
                                    </div>
                                    <div class="item">
                                        <span>文件系统类型:</span>
                                        <span class="text">{{item.fileSystemType}}</span>
                                    </div>
                                    <div class="item">
                                        <span>容量:</span>
                                        <span class="text">{{item.total}}</span>
                                    </div>
                                    <div class="item">
                                        <span>已用:</span>
                                        <span class="text">{{item.used}}</span>
                                    </div>
                                    <div class="item">
                                        <span>可用:</span>
                                        <span class="text">{{item.free}}</span>
                                    </div>
                                </div>
                                <el-progress v-if="item.usedPercent > 90"
                                    :text-inside="true" 
                                    :stroke-width="14" 
                                    :percentage="parseInt(item.usedPercent.toFixed(0))"
                                    status="exception">
                                </el-progress>
                                <el-progress v-else
                                    :text-inside="true" 
                                    :stroke-width="14" 
                                    :percentage="parseInt(item.usedPercent.toFixed(0))">
                                </el-progress>
                            </el-tooltip>
                        </div>
                    </div>
                </div>
            </div>
       </el-collapse-item>
   </el-collapse>
</template>

<script>
    import Component from 'vue-class-component'
    import BaseComponent from '../../BaseComponent.vue'

    @Component({
    })
    export default class Partition extends BaseComponent {
        isLoading = false
        partitons = new Array(0)

        onGetDiskPartitions(code, err, data) {
            this.isLoading = false

            if (code === 0) {
                this.partitons = data;
            }
            else {
                this.partitons = new Array(0)
            }
        }
        getDiskPartitions() {
            this.isLoading = true
            this.post(this.network.uris.sysDiskPartitions, null, this.onGetDiskPartitions);
        }

        mounted() {
            this.getDiskPartitions();
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

    .selector {
        float: right;        
    }
</style>