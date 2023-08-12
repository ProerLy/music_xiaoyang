<template>
    <div>
        <el-menu router text-color="#636466" active-text-color="#E6A23C" :default-active="active.activePath"
            mode="horizontal" class="el-menu-demo nav">
            <el-menu-item index="/find/tuijian">
                <el-icon>
                    <Headset />
                </el-icon>
                <span>推荐</span>
            </el-menu-item>
            <el-menu-item :index="'/find/toplist/' + $route.params.id" @click="$router.push('/find/toplist/1')">
                <el-icon>
                    <DataLine />
                </el-icon>
                <span>排行榜</span>
            </el-menu-item>
            <el-menu-item :index="'/find/allsongs/' + $route.params.type + '/' + $route.params.limit"
                @click="$router.push('/find/allsongs/0/0')">
                <el-icon>
                    <List />
                </el-icon>
                <span>全部歌曲</span>
            </el-menu-item>
        </el-menu>
        <router-view :musicId="musicId" @getMusic="getMusic" v-slot="{ Component }">
            <transition name="find">
                <component :is="Component" />
            </transition>
        </router-view>
    </div>
</template>
<script>
export default {
    name: 'FindPage'
}
</script>
<script setup>
import { reactive, watch, onMounted, toRefs } from 'vue'
import { useRoute } from 'vue-router'
import { getData as _getdtl, setData as _setdtl } from '@/assets/js'
const route = useRoute();
const emit = defineEmits(['getMusic', 'getMusic_list']);
const props = defineProps({
    musicId: {
        type: String
    }
})
const { musicId } = toRefs(props);
// 获取子组件传递的音乐数据
const getMusic = (data) => {
    emit('getMusic', data);
}

// 排行榜的id
const active = reactive({
    activePath: ''
})

// 获取高亮
const getLight = (val) => {
    active.activePath = decodeURI(val);
}

// 监听路由变化
watch(() => route.path, (val) => {
    // 获取高亮
    getLight(val);
})

// 页面渲染完毕
onMounted(() => {
    // 获取高亮
    getLight(route.path);
})
</script>
<style scoped>
.nav {
    padding: -10px 0;
    height: 40px;
    padding: 5px 0;
}

.flex-grow {
    flex-grow: 1;
}
</style>