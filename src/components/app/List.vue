<template>
    <el-card body-style="padding: 8px 20px;">
        <div slot="header" class="clearfix">
            <span>应用程序</span>
            <el-tooltip content="刷新" placement="right">
                <el-button style="padding: 3px 5px" type="text" icon="el-icon-refresh" @click="getApp" />
            </el-tooltip>

            <el-tooltip content="上传" placement="bottom-end">
                <el-button style="float: right; padding: 3px 0" type="text" icon="el-icon-upload" @click="showUploadDialog" />
            </el-tooltip>
            <el-tooltip content="删除" placement="left" v-show="deleteVisible">
                <el-button v-if="deleting" style="float: right; padding: 3px 8px" type="text" icon="el-icon-loading" />
                <el-button v-else style="float: right; padding: 3px 8px" type="text" icon="el-icon-delete" @click="deleteApp" />
            </el-tooltip>
        </div>
        <div>
            <el-container>
                <el-aside v-loading="isLoading" element-loading-text="加载中...">
                    <el-tree ref="appTree"
                             node-key="path"
                             :data="apps"
                             :props="appProps"
                             :highlight-current="true"
                             :default-expand-all="true"
                             @node-click="onNodeClick">
                        <span class="tree-node-folder" slot-scope="{ node, data }">
                          <span v-if="data.type === 0" class="tree-node">
                            <span class="tree-node-catalog">
                              <i class="el-icon-star-off"></i>
                              <span>{{data.name}}</span>
                            </span>
                          </span>
                          <span v-if="data.type === 1" class="tree-node">
                            <span class="tree-node-app">
                              <i class="el-icon-star-on"></i>
                              <span>{{data.name}}</span>
                            </span>
                          </span>
                        </span>
                    </el-tree>
                </el-aside>
                <el-main>
                    <div v-show="detailVisible">
                        <div class="item">
                            <span>访问地址:</span>
                            <span class="text">
                                <a :href="detail.url" target="_blank">
                                    {{detail.url}}
                                </a>
                            </span>
                            <el-tooltip content="复制访问地址" placement="top">
                                <el-button style="padding: 0 5px; margin-left: 5px;"
                                           type="text" icon="el-icon-document" size="small"
                                           v-clipboard:copy="detail.url"/>
                            </el-tooltip>
                        </div>
                        <div class="item">
                            <span>应用路径:</span>
                            <span class="text">{{detail.path}}</span>
                        </div>
                        <div class="item">
                            <span>上传时间:</span>
                            <span class="text">{{detail.uploadTime}}</span>
                        </div>
                        <div class="item">
                            <span>上传者:</span>
                            <span class="text">{{detail.uploadUser}}</span>
                        </div>
                        <div class="item">
                            <span>版本号:</span>
                            <span class="text">{{detail.version}}</span>
                        </div>
                        <div class="item">
                            <span>说明:</span>
                            <span class="text">{{detail.remark}}</span>
                        </div>
                    </div>
                </el-main>
            </el-container>
            <uploadDialog ref="uploadDialog" v-on:onClosed="onUploadDialogClosed" v-on:onUploaded="onUploadedApp" />
        </div>
    </el-card>
</template>

<script>
    import Component from 'vue-class-component'
    import BaseComponent from '../BaseComponent.vue'
    import UploadDialog from './Upload.vue';

    @Component({
        components: {
            uploadDialog: UploadDialog
        }
    })
    export default class List extends BaseComponent {
        appProps = {
            children: 'children',
            label: 'name'
        }
        apps = []
        detailVisible = false
        detail = {
            path: "",
            url: "",
            version: "",
            uploadTime: "",
            uploadUser: "",
            remark: ""
        }
        isLoading = false;
        deleteVisible = false;
        deleting = false;

        onNodeClick(data) {
            this.deleteVisible = true;
            this.detail.path = data.path;
            if(data.type === 0) {
                this.detailVisible = false;
                return;
            }

            this.detail.url = data.url;
            this.detail.version = data.version;
            this.detail.uploadTime = data.uploadTime;
            this.detail.uploadUser = data.uploadUser;
            this.detail.remark = data.remark;

            this.detailVisible = true
        }

        onUploadDialogClosed(appPath) {
            if(appPath !== "") {
                this.$refs.appTree.setCurrentKey(appPath);
                var node = this.$refs.appTree.getCurrentNode();
                if(node) {
                    this.onNodeClick(node);
                }
            }
        }
        onUploadedApp(appPath) {
            this.getApp();
        }

        onGetApp(code, err, data) {
            this.detail.path = "";
            this.detail.url = "";
            this.detail.version = "";
            this.detail.uploadTime = "";
            this.detail.uploadUser = "";
            this.detail.remark = "";

            if (code === 0) {
                this.apps = data
            }
            else if (code !== 20001) {
                this.error(err.summary);
            }
            this.isLoading = false;
        }
        getApp() {
            this.deleteVisible = false;
            this.detailVisible = false;
            this.isLoading = true;
            this.post(this.network.uris.appTree, null, this.onGetApp);
        }

        onDeleteApp(code, err, data) {
            if (code === 0) {
                this.getApp();
            }
            else if (code !== 20001) {
                this.error(err.summary);
            }
            this.deleting = false;
        }
        deleteApp() {
            var argument = {
                path: this.detail.path
            };
            this.deleting = true;
            this.post(this.network.uris.appDelete, argument, this.onDeleteApp);
        }

        showUploadDialog() {
            var version = "";
            var remark = "";
            if(this.detailVisible) {
                version = this.detail.version;
                remark = this.detail.remark;
            }
            this.$refs.uploadDialog.showDialog(this.detail.path, version, remark);
        }

        mounted() {
            this.getApp();
        }
    }
</script>

<style scoped lang="scss">
    .el-container {
        padding: 0;
    }

    .el-aside {
        color: rgb(51, 51, 51);
        text-align: left;
        font-size: 18px;
        padding: 0;
    }

    .el-main {
        color: rgb(51, 51, 51);
        text-align: left;
        padding: 0 10px;
    }

    .tree-node-folder {
        font-size: medium;
    }

    .tree-node-app {
        font-size: medium;
        font-weight: bold;
        font-style: italic;
    }

    .item {
        font-size: 13px;
        padding-bottom: 5px;
    }

    .text {
        font-weight: bold;
        padding-left: 2px;
    }

    a:link {
        text-decoration: none;
    }
    a:visited {
        text-decoration: none;
    }
    a:hover {
        text-decoration: none;
    }
    a:active {
        text-decoration: none;
    }
</style>