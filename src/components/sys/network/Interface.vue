<template>
   <el-card body-style="padding: 8px 20px;">
       <div slot="header" class="clearfix">
            <span>网卡信息</span>
            <el-select v-model="nic" value-key="name" placeholder="请选择网卡" class="selector" size="mini">
                <el-option v-for="(item, index) in nics"
                    :key="index"
                    :value="item"
                    :label="item.name">
                </el-option>
            </el-select>
        </div>
        <div v-loading="isLoading" element-loading-text="加载中...">
            <div v-if="nic !== null">
                <div class="item">
                    <span>网卡名称:</span>
                    <span class="text">{{nic.name}}</span>
                </div>
                <div class="item">
                    <span>最大传输单元:</span>
                    <span class="text">{{nic.mtu}}</span>
                </div>
                <div class="item">
                    <span>MAC地址:</span>
                    <span class="text">{{nic.macAddr}}</span>
                </div>
                <div class="item">
                    <span>IP地址:</span>
                    <span class="text" v-for="(addr, index) in nic.ipAddrs" :key="index">
                        <span v-if="isIpV4(addr)">{{addr}}&nbsp;</span>
                    </span>
                </div>
                <div class="item">
                    <span>状态:</span>
                    <span class="text" v-for="(flag, index) in nic.flags" :key="index">
                        {{flag}}&nbsp;
                    </span>
                </div>
            </div>
        </div>
   </el-card>
</template>

<script>
    import Component from 'vue-class-component'
    import BaseComponent from '../../BaseComponent.vue'

    @Component({
    })
    export default class Interface extends BaseComponent {
        isLoading = false
        nics = new Array(0)
        nic = null

        isIpV4(ip) {
            if(ip.indexOf(":") === -1) {
                return true;
            }
            return false;
        }

        onGetNetworkInterfaces(code, err, data) {
            this.isLoading = false
            this.nics = new Array(0);
            this.nic = null;

            if (code === 0) {
                var count = data.length;
                for (var i = 0; i < count; i++) {
                    if(this.isNullOrEmpty(data[i].macAddr)) {
                        continue;
                    }
                    this.nics.push(data[i])
                }

                if (this.nics.length > 0) {
                    this.$nextTick(function(){
                        this.nic = this.nics[this.nics.length-1];
                    });
                }
            }
        }
        getNetworkInterfaces() {
            this.isLoading = true
            this.post(this.network.uris.sysNetworkInterfaces, null, this.onGetNetworkInterfaces);
        }

        mounted() {
            this.getNetworkInterfaces();
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