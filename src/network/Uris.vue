<script>
    const uris = {
        // 获取平台信息
        authSysInfo: '/auth/sys/info',

        // 获取验证码
        authCaptcha: '/auth/captcha',
        // 用户登录
        authLogin: '/auth/login',
        // 退出登录
        authLogout: '/api/logout',

        // 系统信息-获取主机信息
        sysHost: '/api/sys/host',
        // 系统信息-获取网卡信息
        sysNetworkInterfaces: '/api/sys/network/interfaces',
        // 系统信息-获取磁盘分区信息
        sysDiskPartitions: '/api/sys/disk/partitions',

        // 服务信息-获取当前服务信息
        svcInfo: '/api/svc/info',

        // 上传应用程序
        appUpload: '/api/app/upload',
        // 获取应用程序列表
        appTree: '/api/app/tree',
        // 删除应用程序
        appDelete: '/api/app/delete',
    }

    export default {
        uris
    }
</script>
