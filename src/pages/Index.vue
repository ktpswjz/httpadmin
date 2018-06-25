// AppComponent.vue

<template>
   <el-container>
        <el-header height="45px">
          <div>
            <el-button class="el-header-title el-header-title-icon" type="text" @click="redirectTo('/')">
              <img :src="dashboardIcon" />
            </el-button>
            <span class="el-header-title">{{platformName}}服务管理</span>

            <el-dropdown class="el-header-menu" trigger="click" @command="logout">
              <span class="el-dropdown-link">
                <span>{{loginAccount}}</span>
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="logout">退出</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-header>
        <el-main>
          <el-container>
            <el-aside width="auto">
              <div>
                <div class="el-menu-nav-switch" @click="menuNavCollapse = !menuNavCollapse">
                  <span v-if="menuNavCollapse">三</span>
                  <span v-else>|||</span>
                </div>
                <el-menu ref="menuNav" class="el-menu-nav" :collapse="menuNavCollapse" :style="menuNavStyle" :router="true">
                  <el-menu-item index="/app">
                    <i class="el-icon-menu"></i>
                    <span slot="title">应用程序</span>
                  </el-menu-item>
                </el-menu>
              </div>
            </el-aside>
            <el-main>
              <div class="el-main-content">
                <router-view/>
              </div>
            </el-main>
          </el-container>
        </el-main>
    </el-container>
</template>

<script>
    import Component from 'vue-class-component'
    import BaseComponent from '../components/BaseComponent.vue'
    import Host from '../components/sys/Host.vue'
    import DashboardImage from '../images/icon/dashboard-40.png'
    import Cookie from '../network/Cookie.vue'

    @Component({
      components: {
        host: Host
      }
    })
    export default class Index extends BaseComponent {
        platformName = "";
        menuNavCollapse = true;
        dashboardIcon = DashboardImage;

        get loginAccount() {
            return Cookie.getCookie(this.network.cookieApiAccount);
        }

        get menuNavStyle() {
            var minHeight = (window.innerHeight - 70) + "px";
            return {
                'min-height': minHeight
            };
        }

        onLogout(code, err, data) {
            if (code === 0) {
                Cookie.delCookie(this.network.cookieApiHost);
                Cookie.delCookie(this.network.cookieApiToken);
                Cookie.delCookie(this.network.cookieApiAccount);
                this.redirectTo("/login");
            }
        }
        logout(command) {
            this.post(this.network.uris.authLogout, null, this.onLogout);
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
        }
    }
</script>

<style scoped lang="scss">
  .el-container {
    padding: 0px;
  }

  .el-header {
    padding: 0;
    font-size: 20px;
    text-align: left;
    line-height: 45px;
    background-color: #f8f8f8;
    border-bottom: 1px solid rgb(230, 230, 230);

    .el-header-title {
      float: left;
    }
    .el-header-title-icon {
      height: 45px;
      padding: 0 12px;
    }
    .el-header-menu {
      float: right;
      padding-right: 5px;
      cursor: pointer;
    }
  }  

  .el-aside {
    display: block;
    padding: 0;
    height: 100%;

    .el-menu-nav {
      //min-height: 200px;
    }
    .el-menu-nav:not(.el-menu--collapse) {
      width: 200px;
    }
    .el-menu-nav-switch {
      background-color: #f8f8f8;
      font-size: small;
      text-align: center;
      cursor: pointer;
      padding-top: 3px;
      padding-bottom: 5px;
      border-right: 1px solid rgb(230, 230, 230);
    }
  }
  
  .el-main {
    padding: 0;
    text-align: left;

    .el-main-content {
      padding: 5px 5px;
    }
  }

</style>