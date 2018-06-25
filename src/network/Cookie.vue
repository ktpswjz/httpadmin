<script>
    import {Base64} from 'js-base64';

    function getCookie(name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg)) {
            return fromBase64((arr[2]));
        }

        return null;
    };

    function setCookie (name, value) {
        document.cookie = name + "=" + toBase64(value);
    };

    function delCookie (name) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1000);
        var val = getCookie(name);
        if (val !== null) {
            document.cookie = name + "=;expires=" + exp.toGMTString();
        }        
    };

    function toBase64(value) {
        if(value) {
            if(value === "") {
                return value;
            }

            return Base64.encode(value);
        }

        return null;
    }
    function fromBase64(value) {
        if(value) {
            if(value === "") {
                return value;
            }

            return Base64.decode(value);
        }

        return null;
    }

    export default {
        getCookie,
        setCookie,
        delCookie
    }
</script>
