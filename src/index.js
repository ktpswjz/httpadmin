// index.js

import Vue from 'vue'
import {
    Message,
    Container,
    Header,
    Aside,
    Main,
    Input,
    Tree,
    Collapse,
    CollapseItem,
    Tabs,
    TabPane,
    Select,
    Option,
    Button,
    Badge,
    Loading,
    Dialog,
    Tooltip,
    Menu,
    Submenu,
    MenuItem,
    MenuItemGroup,
    Card,
    Progress,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Row,
    Col,
    Popover
} from 'element-ui'
import VueClipboard from 'vue-clipboard2'
import App from './App'
import router from './router'
import Network from './network/Network.vue'

Vue.use(VueClipboard)
//Vue.use(ElementUI)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Input)
Vue.use(Tree)
Vue.use(Collapse)
Vue.use(CollapseItem)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Select)
Vue.use(Option)
Vue.use(Button)
Vue.use(Badge)
Vue.use(Loading)
Vue.use(Dialog)
Vue.use(Tooltip)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Card)
Vue.use(Progress)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Row)
Vue.use(Col)
Vue.use(Popover)

Vue.prototype.network = Network
Vue.prototype.$message = Message

 /* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})