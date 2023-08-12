<template>
    <div class="allsongs_box">
        <!-- 风格 -->
        <div class="select">
            <span class="type">{{ params.type }}</span>
            <el-popover placement="bottom-start" :width="600" trigger="hover">
                <template #reference>
                    <el-button>选择类型<el-icon>
                            <Sort />
                        </el-icon></el-button>
                </template>
                <div class="all">
                    <el-button>
                        <el-link type="danger" @click="$router.push('/find/allsongs/0/0')">全部风格</el-link>
                    </el-button>
                </div>
                <div class="select_item">
                    <el-row :gutter="20">
                        <el-col :span="4" :offset="0">
                            <div class="type_title">
                                <el-icon>
                                    <Comment />
                                </el-icon><span>语种</span>
                            </div>
                        </el-col>
                        <el-col class="style_content" :span="20" :offset="0">
                            <span class="style_items" v-for="it in language.arr" :key="it?.id"><el-link
                                    @click="$router.push('/find/allsongs/' + it?.id + '/0')">{{ it?.label
                                    }}</el-link></span>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="4" :offset="0">
                            <div class="type_title">
                                <el-icon>
                                    <Grid />
                                </el-icon><span>风格</span>
                            </div>
                        </el-col>
                        <el-col class="style_content" :span="20" :offset="0">
                            <span class="style_items" v-for="it in styles.arr" :key="it?.id"><el-link
                                    @click="$router.push('/find/allsongs/' + it?.id + '/0')">{{ it?.label
                                    }}</el-link></span>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="4" :offset="0">
                            <div class="type_title">
                                <el-icon>
                                    <Bicycle />
                                </el-icon><span>场景</span>
                            </div>
                        </el-col>
                        <el-col class="style_content" :span="20" :offset="0">
                            <span class="style_items" v-for="it in scene.arr" :key="it?.id"><el-link
                                    @click="$router.push('/find/allsongs/' + it?.id + '/0')">{{ it?.label
                                    }}</el-link></span>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="4" :offset="0">
                            <div class="type_title">
                                <el-icon>
                                    <Sugar />
                                </el-icon><span>情感</span>
                            </div>
                        </el-col>
                        <el-col class="style_content" :span="20" :offset="0">
                            <span class="style_items" v-for="it in emotion.arr" :key="it?.id"><el-link
                                    @click="$router.push('/find/allsongs/' + it?.id + '/0')">{{ it?.label
                                    }}</el-link></span>
                        </el-col>
                    </el-row>
                </div>
            </el-popover>
            <span style="margin-left: 10px;">共{{ params.total }}首音乐，每页{{ params.page_size }}首</span>
        </div>
        <!-- 内容 -->
        <div class="allsongs_content" style="padding: 0 5px;" v-loading="loading" element-loading-background="white">
            <el-row v-if="params.total > 0 && music_info.arr.length > 0">
                <el-col style="margin: 20px 0;" :lg="{ span: 4 }" :md="{ span: 6 }" :sm="{ span: 8 }" :xs="{ span: 12 }"
                    :offset="0" v-for="(it, index) in music_info.arr" :key="index">
                    <div class="cont_item">
                        <div class="cont_items">
                            <!-- 图片 -->
                            <el-link
                                @click="it?.music_id ? $router.push('/find/songs/' + it?.music_id) : $router.push('/find/songs/' + it?.id)"
                                type="danger" :underline="false" :title="it?.song_name ? it?.song_name : '歌曲名称'">
                                <el-image style="width: 150px; height: 150px;" :src="it?.baner_img" fit="fill"></el-image>
                            </el-link>
                            <div class="control">
                                <!-- 听取人数 -->
                                <span class="hear" title="听取次数">
                                    <el-icon>
                                        <Headset />
                                    </el-icon>
                                    <span>{{ it?.hear ? it?.hear : 0 }}</span>
                                </span>
                                <!-- 播放按钮 -->
                                <span>
                                    <el-icon :style="music_id == it?.music_id ? 'color: red;' : ''" class="icon"
                                        @click="play_add(it?.music_id ? it.music_id : it.id, null, 'play')" title="播放">
                                        <VideoPlay />
                                    </el-icon>
                                </span>
                            </div>
                        </div>
                        <!-- 歌名 -->
                        <div class="song_name">
                            <el-link
                                @click="it?.music_id ? $router.push('/find/songs/' + it?.music_id) : $router.push('/find/songs/' + it?.id)"
                                type="danger" :title="it?.song_name ? it?.song_name : '歌曲名称'">{{
                                    it?.song_name ? it?.song_name : '歌曲名称' }}</el-link>
                        </div>
                    </div>
                </el-col>
            </el-row>
            <div class="songList" v-else>
                <el-empty description="暂无歌曲" />
            </div>
        </div>
        <!-- 分页 -->
        <div class="page_nav">
            <el-pagination v-show="params.total > 0" :current-page="params.page" prev-text="上一页" next-text="下一页"
                v-model:page-size="params.page_size" background layout="prev, pager, next" :total="params.total"
                @current-change="clicks" />
        </div>
    </div>
</template>
<script>
export default {
    name: 'AllSongS'
}
</script>
<script setup>
import { ref, reactive, onMounted, watch, getCurrentInstance, toRefs } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Qs from 'qs'
const router = useRouter();
const route = useRoute();
const { proxy } = getCurrentInstance();
const emit = defineEmits(['getMusic']);
const props = defineProps({
    musicId: {
        type: String
    }
})
const { musicId } = toRefs(props);
// 语种
const language = reactive({
    arr: []
})

// 风格
const styles = reactive({
    arr: []
})

// 场景
const scene = reactive({
    arr: []
})

// 情感
const emotion = reactive({
    arr: []
})
// 所有类型
const alltype = reactive({
    arr: []
})

// 获取类型
const getType = () => {
    proxy.$axios.post('/get_table.php',
        Qs.stringify({
            table: 'music_type'
        }))
        .then((res) => {
            if (res.data.code == 1) {
                const data = res.data.data;
                alltype.arr = [];
                language.arr = [];
                styles.arr = [];
                scene.arr = [];
                emotion.arr = [];
                alltype.arr = data;
                for (var i = 0; i < data.length; i++) {
                    if (i < 5) {
                        language.arr.push({ id: data[i].id, label: data[i].type_name })
                    } else if (i >= 5 && i < 12) {
                        styles.arr.push({ id: data[i].id, label: data[i].type_name })
                    } else if (i >= 12 && i < 20) {
                        scene.arr.push({ id: data[i].id, label: data[i].type_name })
                    } else {
                        emotion.arr.push({ id: data[i].id, label: data[i].type_name })
                    }
                }
                // 获取当前类型、当前页
                getNow_type();
            }
        }).catch((err) => {
            console.log(err);
        })
}

// 获取当前类型、当前页
const getNow_type = () => {
    // 起始数
    params.limit = parseInt(route.params.limit);
    // 当前页
    params.page = params.limit ? parseInt(params.limit / params.page_size + 1) : 1;
    // 当前类型
    for (var i = 0; i < alltype.arr.length; i++) {
        if (route.params.type == 0) {
            params.type = '全部';
            break;
        } else if (route.params.type == alltype.arr[i].id) {
            params.type = alltype.arr[i].type_name;
            break;
        }
    }
}

// 页面的传值
const params = reactive({
    type: '全部',      // 类型
    page_size: 36, // 一页的数量
    page: 1,       // 当前页数
    limit: 0,      // 起始数
    total: 0      // 总条目数
})
// 加载
const loading = ref(false);
// 音乐数据
const music_info = reactive({
    arr: []
})
// 获取数据并显示页面的方法
const getData = () => {
    loading.value = true;
    music_info.arr = [];
    if (musicId.value) {
        music_id.value = musicId.value;
    }
    // 获取当前类型、当前页
    getNow_type();
    setTimeout(() => {
        proxy.$axios.post('/getMusic_type.php',
            Qs.stringify({
                type: route.params.type,
                limit: route.params.limit,
                page_size: params.page_size
            })
        ).then((res) => {
            // console.log(res)
            if (res.data.code == 1) {
                music_info.arr = res.data.data;
                params.total = res.data.total;
                loading.value = false;
            }
        }).catch((err) => {
            console.log(err);
        })
    }, 2000);
}

// 歌曲的
const music_id = ref(0);
// 监听musicId变化
watch(() => musicId.value, (val) => {
    // console.log(val)
    music_id.value = val;
})
// 播放音乐或添加音乐列表
function play_add(id, list_id, type) {
    if (type == 'play') {
        music_id.value = id;
    }
    emit('getMusic', { id, list_id, type });
}

// 点击切换页面方法
const clicks = (n) => {
    // 跳转页面
    params.limit = (n - 1) * params.page_size;
    router.push('/find/allsongs/' + route.params.type + '/' + params.limit);
}

// 页面加载完毕
onMounted(() => {
    // 获取类型
    getType();
    // 获取音乐数据
    getData();
})

// 监听路由变化
watch(() => route.path, (val) => {
    // 重新获取数据
    getData();
})
</script>
<style scoped>
.allsongs_box {
    width: 80%;
    min-height: max-content;
    box-shadow: 0 0 3px rgba(0, 0, 0, .8);
    margin: 0 auto;
    background-color: #ffffff;
    padding: 50px 30px;
}

.select {
    display: flex;
    align-items: center;
    padding: 5px 0;
    border-bottom: 2px solid #C20C0C;
}

.type {
    margin-right: 10px;
    font-size: 25px;
}

.all {
    padding: 10px 0;
    border-bottom: 1px solid rgba(0, 0, 0, .2);
}

.select_item {
    padding: 10px;
}

.select_item .el-row {
    margin: 15px 0;
}

.type_title {
    display: flex;
    align-items: center;
}

.type_title .el-icon {
    margin-right: 10px;
    font-size: 25px;
}

.style_content {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
}

.style_items {
    margin-right: 20px;
}

.cont_item {
    width: 150px;
}

.cont_items {
    width: 150px;
    height: 150px;
    position: relative;
    box-shadow: 0 0 3px black;
}

.control {
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    padding: 5px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
}

.control .el-icon {
    padding: 0 10px;
}

.cont_content .el-col {
    margin: 20px 0;
}

.song_name {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-top: 5px;
}

.icon:hover {
    color: #B90B0B;
}

.icon,
.hear {
    color: rgba(0, 0, 0, .6);
}

.hear {
    display: flex;
    align-items: center;
}

.page_nav {
    margin-top: 10px;
    padding-top: 20px;
    width: 100%;
    display: flex;
    justify-content: center;
    border-top: 1px dashed rgba(0, 0, 0, .3);
}
</style>