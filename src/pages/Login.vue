<template>
    <div class="background">
        <div :class="containerClass">
        <div class="form"
            v-loading="isLogining"
            element-loading-text="登录中..."
            element-loading-spinner="el-icon-loading"
            >
            <div class="title">
                <span>{{platformName}}服务管理</span>
            </div>
            <div class="row">
                <el-input ref="account" v-model="accountVal" placeholder="请输入账号" autofocus="true" v-on:input="onInputChanged" @keyup.enter.native="login" :clearable="true">
                    <img slot="prepend" :src="accountIcon" class="icon">
                </el-input>
            </div>
            <div class="row">
                <el-input ref="password" v-model="passwordVal" placeholder="请输入密码" type="password" v-on:input="onInputChanged" @keyup.enter.native="login" :clearable="true">
                    <img slot="prepend" :src="passwordIcon" class="icon">
                </el-input>
            </div>
            <div class="row" v-show="captchaRequired">
                <el-input ref="captcha" v-model="captchaVal" placeholder="请输入验证码" class="captcha-value"  v-on:input="onInputChanged" @keyup.enter.native="login" :clearable="true">
                    <img slot="prepend" :src="captchaIcon" class="icon">
                </el-input>
                <div v-loading="isLoadingCaptcha" class="captcha-image-container">  
                    <el-tooltip class="item" effect="dark" content="点击刷新" placement="right" >
                        <img :src="captchaImg" class="captcha-image" alt="获取验证码失败" @click="updateCaptcha"/>
                    </el-tooltip>
                </div>
            </div>

            <div class="row">
                <span>&nbsp;</span>
                <span class="msg-err">{{errMsg}}</span>
                <el-popover trigger="click" placement="top" title="错误详细信息" :content="errDetail" v-show="errDetailVisible">
                    <el-button slot="reference" type="text">详细信息...</el-button>
                </el-popover>
            </div>
            <div class="row">
                <el-button type="primary" class="btn-login" @click="login">登 录</el-button>
            </div>
        </div>
        </div>
    </div>
</template>

<script>
    import Component from 'vue-class-component'
    import axios from 'axios'
    import JsEncrypt from 'jsencrypt/bin/jsencrypt'
    import Cookie from '../network/Cookie.vue'
    import BaseComponent from '../components/BaseComponent.vue'
    import AccountImage from '../images/icon/account-32.png'
    import PasswordImage from '../images/icon/password-32.png'
    import CaptchaImage from '../images/icon/captcha-32.png'

    @Component
    export default class Login extends BaseComponent {
        platformName = ""
        platformVersion = ""
        accountIcon = AccountImage
        passwordIcon = PasswordImage
        captchaIcon = CaptchaImage
        captchaImg = ""
        captchaId = ""
        captchaRequired = false
        rsaKey = ""
        errMsg = ""
        errDetail = ""
        errDetailVisible = false

        accountVal = ""
        passwordVal = ""
        captchaVal = ""

        isLoadingCaptcha = false
        isLogining = false
        backPath = "/";

        get containerClass() {
            if(this.captchaRequired) {
                return "container container-with-captcha"
            }

            return "container container-without-captcha";
        }

        onInputChanged() {
            this.errMsg = "";
            this.errDetail = "";
            this.errDetailVisible = false;
        }

        onLogin(code, err, data, host) {
            this.isLogining = false;

            if(code === 0) {
                Cookie.setCookie(this.network.cookieApiHost, host);
                Cookie.setCookie(this.network.cookieApiToken, data.token);
                Cookie.setCookie(this.network.cookieApiAccount, data.account);
                this.redirectTo(this.backPath);
            }
            else {
                this.errMsg = err.summary;
                if(this.isNotNullOrEmpty(err.detail)) {
                    this.errDetail = err.detail;
                    this.errDetailVisible = true;
                }
                this.updateCaptcha();

                // 验证码无效
                if(code === 10001) {
                    this.$refs["captcha"].focus();
                    this.$refs["captcha"].select();
                }
                // 账号不存在
                else if(code === 10002) {
                    this.$refs["account"].focus();
                }
                // 密码错误
                else if(code === 10003) {
                    this.$refs["password"].focus();
                }
            }
        }
        login() {
            var accountVal = this.accountVal.trim();
            if(this.isNullOrEmpty(accountVal)) {
                this.errMsg = "账号不能为空";
                this.$refs["account"].focus();
                return;
            }
            var passwordVal = this.passwordVal;
            if(this.isNullOrEmpty(passwordVal)) {
                this.errMsg = "密码不能为空";
                this.$refs["password"].focus();
                return;
            }
            if(this.captchaRequired) {
                var captchaVal = this.captchaVal.trim();
                if(this.isNullOrEmpty(captchaVal)) {
                    this.errMsg = "验证码不能为空";
                    this.$refs["captcha"].focus();
                    return;
                }
            }

            var pwdType = "";
            var pwdVal = passwordVal;
            if(this.rsaKey !== null && this.rsaKey !== "") {
                var jsEncrypt = new JsEncrypt();
                jsEncrypt.setPublicKey(this.rsaKey);
                pwdVal = jsEncrypt.encrypt(passwordVal);
                pwdType = "rsa";
            }  
            var argument = {
                account: accountVal,
                password: pwdVal,
                captchaId: this.captchaId,
                captchaValue: captchaVal,
                encryption: pwdType
            };

            var config = {
                timeout: 15000,
                baseURL: this.network.baseUrl,
                headers: {
                    "Content-Type": "text/plain;charset=utf-8"
                }
            };
            var http = axios.create(config);

            this.isLogining = true;
             http.post(this.network.uris.authLogin, argument)
                .then(this.onLoginResponse)
                .catch(this.onLoginError);
        }

        onLoginResponse(response) {
            var host = "";
            if(response.data.code === 0) {
                if(response.request) {
                    var url = response.request.responseURL;
                    if(url) {
                        var start = url.indexOf("//");
                        if(start !== -1) {
                            var from = start + 2;
                            var end = url.indexOf("/", from);
                            if(end !== -1) {
                                host = url.substring(start + 2, end);
                            }
                            else {
                                host = url.substring(start + 2);
                            }
                        }
                    }
                }
                this.onLogin(0, "", response.data.data, host);
            }
            else {
                this.onLogin(response.data.code, response.data.error, null, host);
            }
        }
        onLoginError(error) {
            var err = {
                summary: "未知错误",
                detail: error.message
            };
            this.onLogin(-1, err, null, "");
        }

        onGetAuthCaptcha(code, err, data) {
            if (code === 0) {
                this.captchaId = data.id;
                this.captchaImg = data.value;
                this.rsaKey = data.rsaKey;
                this.captchaRequired = data.required;
            }
            else {
                this.captchaImg = "";
            }
            this.isLoadingCaptcha = false;
        }
        getAuthCaptcha() {
            var argument = {
                length: 5,
                width: 120,
                height: 40
            };

            this.isLoadingCaptcha = true;
            this.post(this.network.uris.authCaptcha, argument, this.onGetAuthCaptcha);
        }
        updateCaptcha() {
            this.getAuthCaptcha();
        }


        onGetAuthSysInfo(code, err, data) {
            if (code === 0) {
                this.platformName = data.name;
            }
        }
        getAuthSysInfo() {
            this.post(this.network.uris.authSysInfo, null, this.onGetAuthSysInfo);
        }

        mounted() {
            this.getAuthSysInfo();
            this.getAuthCaptcha();

            var routerParams = this.$route.params;
            if(this.$route.params.backPath) {
                this.backPath = this.$route.params.backPath;
            }
        }
    }

</script>

<style lang="scss" scoped>
    .background {
        position: absolute;
        margin: auto;
        top: 0;        
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(15deg, darkblue, skyblue);
    }

    .container {
        position: absolute;
        margin: auto;
        width: 360px;
        //height: 225px !important;
        top: 0;        
        left: 0;
        right: 0;
        bottom: 0;
        padding: 30px;
        border-radius: 10px;
        background-color: white;
        box-shadow: -5px 5px 10px black;
    }
    .container-with-captcha {
        height: 275px;
    }
    .container-without-captcha {
        height: 225px;
    }

    .row {
        margin-top: 10px;
    }
    .title {
        text-align: left;
        font-size: large;
        margin-bottom: 5px;
    }
    .icon {
        height: 60%;
        padding-top: 3px;
    }

    .captcha-image-container {
        display: block;
        float: right;
    }
    .captcha-image {
        display: block;
        float: right;
        width: 120px;
        height: 40px;
        border: 0;
        border-radius: 3px;     
        font-size: small;   
        color: red;
        background-color: lightgray;
        cursor: pointer;
    }
    .captcha-value {
        width: calc(100% - 125px);
    }

    .msg-err {
        color: red;
    }
    .btn-login {
        width: 100%;
        margin-top: 10px;
    }    
    
</style>

