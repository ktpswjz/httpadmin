<template>
    <el-dialog
        title="上传应用程序"
        width="45%"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        @closed="onClosed">
        <div>
            <el-input class="row" ref="inputFile" v-model="form.file" placeholder="请选择文件" readonly="true">
                <template slot="prepend">文件</template>
                <el-button slot="append" icon="el-icon-more" @click="selectFile" :disabled="uploading"></el-button>
            </el-input>
            <el-input class="row" :disabled="uploading" ref="inputPath" v-model="form.path" placeholder="请输入路径，如test或group/item" v-on:input="clearErrorMessage">
                <template slot="prepend">路径</template>
            </el-input>
            <el-input class="row" :disabled="uploading" ref="inputVersion" v-model="form.version" placeholder="请输入版本号，如1.0.1.0" v-on:input="clearErrorMessage">
                <template slot="prepend">版本</template>
            </el-input>
            <el-input class="row" :disabled="uploading" v-model="form.remark">
                <template slot="prepend">说明</template>
            </el-input>
            <el-progress v-show="uploadProgressVisible" :percentage="percentCompleted" :status="uploadStatus"/>
            <div>
                <span class="msg-err">{{errMsg}}</span>
                <span>&nbsp;</span>
            </div>
        </div>
        <input class="input-file" ref="fileSelector" type="file" accept=".zip, .tar, .gz" v-on:input="onFileSelected"/>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">关 闭</el-button>
            <el-button type="primary" :disabled="uploading" @click="uploadFile">上 传</el-button>
        </span>
    </el-dialog>
</template>

<script>
    import Component from 'vue-class-component'
    import BaseComponent from '../BaseComponent.vue'

    @Component({
    })
    export default class Upload extends BaseComponent {
        dialogVisible = false
        form = {
            file: "",
            path: "",
            version: "",
            remark: ""
        }
        percentCompleted = 0;
        uploadStatus = "";
        uploadProgressVisible = false;
        uploading = false;
        uploadedPath = "";
        errMsg = "";

        showDialog(path, version, remark) {
            this.form.path = path;
            this.form.version = version;
            this.form.remark = remark;
            this.form.file = "";
            this.percentCompleted = 0;
            this.uploadStatus = "";
            this.uploadProgressVisible = false;
            this.uploading = false;
            this.errMsg = "";
            if(this.$refs.fileSelector) {
                this.$refs.fileSelector.value = "";
            }
            this.dialogVisible = true;
        }
        onClosed() {
            this.$emit("onClosed", this.uploadedPath);
        }

        onFileSelected() {
            this.form.file = this.$refs.fileSelector.value;
            this.clearErrorMessage();
        }
        selectFile() {
            this.$refs.fileSelector.click();
        }
        clearErrorMessage() {
            this.percentCompleted = 0;
            this.uploadStatus = "";
            this.uploadProgressVisible = false;
            this.uploading = false;
            this.errMsg = "";
        }

        onUploadingFile(evt) {
            this.percentCompleted = Math.round( (evt.loaded * 100) / evt.total );
        }
        onUploadedFile(code, err, data) {
            if (code === 0) {
                this.uploadStatus = "success";
                this.uploadedPath = data;
                this.$emit("onUploaded", this.uploadedPath);
            }
            else {
                this.errMsg = err.summary + ":" + err.detail;
                this.uploadStatus = "exception";
            }
            this.uploading = false;
        }
        uploadFile() {
            if(this.form.file === "") {
                this.errMsg = "请选择文件";
                this.$refs.inputFile.select();
                return;
            }
            if(this.form.path === "") {
                this.errMsg = "请输入路径";
                this.$refs.inputPath.select();
                return;
            }
            if(this.form.version === "") {
                this.errMsg = "请输入版本号";
                this.$refs.inputVersion.select();
                return;
            }

            var formData = new FormData();
            formData.append("path", this.form.path);
            formData.append("version", this.form.version);
            formData.append("remark", this.form.remark);
            formData.append("file", this.$refs.fileSelector.files[0]);

            this.clearErrorMessage();
            this.uploadProgressVisible = true;
            this.uploading = true;
            this.upload(this.network.uris.appUpload, formData, this.onUploadedFile, this.onUploadingFile);
        }
    }
</script>

<style scoped>
    .row {
        margin-bottom: 3px;
    }
    .input-file {
        display: none;
    }
    .msg-err {
        color: red;
    }
</style>