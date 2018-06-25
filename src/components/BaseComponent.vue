<template>  
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class BaseComponent extends Vue {
    isNullOrEmpty(val) {
        if(val === undefined || val === null || val === "") {
            return true
        }
        return false;
    }
    
    isNotNullOrEmpty(val) {
        if(this.isNullOrEmpty(val)) {
            return false
        }
        return true
    }

    alert(msgVal, msgType = "info") {
        this.$message({
                showClose: true,
                message: msgVal,
                type: msgType
            });
    }
    info(msg) {
        this.alert(msg, "info");
    }
    success(msg) {
        this.alert(msg, "success");
    }
    warning(msg) {
        this.alert(msg, "warning");
    }
    error(msg) {
        this.alert(msg, "error");
    }

    redirectTo(path) {
        if(this.isNullOrEmpty(path)) {
            return;
        }
        this.$router.push({ path: path });
    }

    syntaxHighlight(json) {
        if (typeof json != 'string') {
            json = JSON.stringify(json, undefined, 4);
        }

        json = json.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>');
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
            var sty = "color: darkorange;"  // number
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    sty = "color: red;"     // key
                } else {
                    sty = "color: green;"   // string
                }
            } else if (/true|false/.test(match)) {
                sty = "color: blue;"    // boolean
            } else if (/null/.test(match)) {
                sty = "color: magenta;" // null
            }
            return '<span style="' + sty + '">' + match + '</span>';
        });
    }

    onInterceptor(response) {
        if(response.data) {
            // 无效凭证，需要登录
            if(response.data.code === 20001) {
                var path = "/";
                var fromPath = this.$router.history.current.path;
                if(fromPath) {
                    path = fromPath;
                }
                this.$router.push({ name: "Login", params: {backPath: path} });
            }
        }

        return response;
    }

    // example
    // uri: "/user/info"
    // arument: {id: "111212323"}
    // handler: function(code, error, data){ }
    post(uri, argument, handler) {
        this.network.post(uri, argument, handler, this.onInterceptor);
    }

    // example
    // uri: "/user/info"
    // arument: {id: "111212323"}
    // handler: function(code, error, data){ }
    // uploadProgress: function(progressEvent) {
    //   var percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total );
    // }
    upload(uri, argument, handler, uploadProgress) {
        this.network.upload(uri, argument, handler, this.onInterceptor, uploadProgress);
    }
}
</script>
