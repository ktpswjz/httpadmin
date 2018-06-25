<script>
import axios from 'axios'
import BaseUrl from './BaseUrl.vue'
import Uris from './Uris.vue'
import Cookie from './Cookie.vue'
import HttpHandler from './HttpHandler.vue'

const baseUrl = BaseUrl.apiUrl
const uris = Uris.uris
const cookieApiHost = "adminapihost"
const cookieApiToken = "adminapitoken"
const cookieApiAccount = "adminapiaccount"

function post(uri, argument, handler, interceptor) {
    var token =  Cookie.getCookie(cookieApiToken);
    var config = {
        timeout: 30000,
        baseURL: baseUrl,
        headers: {
            "Content-Type": "text/plain;charset=utf-8",
            "token": token
        }
    };
    var httpHandler = HttpHandler.create(handler);
    var http = axios.create(config);
    if(interceptor) {
        http.interceptors.response.use(interceptor, 
        function (error) {
            return Promise.reject(error);
        });
    }

    http.post(uri, argument).then(httpHandler.onResponse).catch(httpHandler.onError);
}

function upload(uri, argument, handler, interceptor, uploadProgress) {
    var token =  Cookie.getCookie(cookieApiToken);
    var config = {
        timeout: 300000,
        baseURL: baseUrl,
        onUploadProgress: uploadProgress,
        headers: {
            "Content-Type": "multipart/form-data",
            "token": token
        }
    };
    var httpHandler = HttpHandler.create(handler);
    var http = axios.create(config);
    if(interceptor) {
        http.interceptors.response.use(interceptor,
            function (error) {
                return Promise.reject(error);
            });
    }

    http.post(uri, argument).then(httpHandler.onResponse).catch(httpHandler.onError);
}


export default {
    uris,
    post,
    upload,
    baseUrl,
    cookieApiHost,
    cookieApiToken,
    cookieApiAccount
}
</script>
