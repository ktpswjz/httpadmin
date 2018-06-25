<template>
    <div>
        <appList />
    </div>
</template>

<script>
    import Component from 'vue-class-component'
    import BaseComponent from '../components/BaseComponent.vue'
    import AppList from '../components/app/List.vue'

    @Component({
        components: {
            appList: AppList
        }
    })
    export default class App extends BaseComponent {

    }
</script>

<style scoped lang="scss">

</style>