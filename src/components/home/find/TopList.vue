<template>
    <div class="top_content">
        <el-row>
            <el-col class="left_list" :span="6" :offset="0">
                <el-menu router class="el-menu-vertical-demo" :default-active="defltPath">
                    <el-menu-item :index="'/find/toplist/' + it.id" v-for="it in toplists.arr" :key="it.id">
                        <el-row>
                            <el-col :span="8" :offset="0">
                                <div class="top_image">
                                    <img style="width: 40px; height: 40px;" :src="it.banner_img" />
                                </div>
                            </el-col>
                            <el-col :span="16" :offset="0">
                                <div class="top_title">
                                    <span>{{ it.type_name }}</span>
                                    <span>{{ it.update_time }}</span>
                                </div>
                            </el-col>
                        </el-row>
                    </el-menu-item>
                </el-menu>
            </el-col>
            <el-col class="right_list" :span="18" :offset="0">
                <el-row>
                    <!-- 音乐图片 -->
                    <el-col class="image" :span="8" :offset="0">
                        <el-image :src="topList_info.info.banner_img" fit="fill"></el-image>
                    </el-col>
                    <!-- 音乐信息 -->
                    <el-col class="info" :span="16" :offset="0">
                        <div class="songlist_info">
                            <div class="songlist_name">
                                {{ topList_info.info.type_name }}
                            </div>
                            <div class="update_time">
                                <el-icon color="rgba(0,0,0,.6)" size="16">
                                    <Clock />
                                </el-icon><span>更新时间：<small>{{ topList_info.info.update_time }}</small></span>
                            </div>
                        </div>
                        <!-- 播放、添加播放列表 -->
                        <div class="control">
                            <el-button-group>
                                <el-button type="primary" size="mini"
                                    @click="play_add(topList_info.list[0].music_id, topList_info.info.toplist_id, 'toplist', 'play')"
                                    title="播放"><el-icon>
                                        <VideoPlay />
                                    </el-icon>播放</el-button>
                                <el-button type="primary" size="mini"
                                    @click="play_add(null, topList_info.info.toplist_id, 'toplist', 'add')"
                                    title="添加播放列表"><el-icon>
                                        <Plus />
                                    </el-icon></el-button>
                            </el-button-group>
                            <el-button title="收藏全部" @click="add_collect(topList_info.info.toplist_id, 0)">
                                <el-icon>
                                    <FolderAdd />
                                </el-icon>收藏全部
                            </el-button>
                        </div>
                    </el-col>
                    <h3 class="songlist_list">
                        <span class="title">歌曲列表</span>
                        <small>{{ topList_info.total }}共首</small>
                    </h3>
                    <!-- 歌曲列表 -->
                    <table v-if="topList_info.total > 0" cellspacing="0">
                        <tr>
                            <th></th>
                            <th>歌曲名称</th>
                            <th>时长</th>
                            <th>歌手</th>
                        </tr>
                        <tr v-for="(it, index) in topList_info.list" :key="index">
                            <td>
                                <div class="controls">
                                    <span class="index">{{ index + 1 }}</span>
                                    <el-link :underline="false" @click="$router.push('/find/songs/' + it?.music_id + '')">
                                        <el-image style="width: 50px; height: 50px; margin: 0 10px;" :src="it?.baner_img"
                                            fit="fill"></el-image>
                                    </el-link>
                                    <el-icon :style="music_id == it?.music_id ? 'color: red;' : ''" size="15px"
                                        @click="play_add(it?.music_id, null, null, 'play')" class="icon" title="播放">
                                        <VideoPlay />
                                    </el-icon>
                                </div>
                            </td>
                            <td>
                                <!-- 歌名 -->
                                <el-link class="song_name" type="danger"
                                    @click="$router.push('/find/songs/' + it?.music_id + '')">
                                    <span>{{ it?.song_name ? it.song_name : '歌曲名称' }}</span>
                                </el-link>
                            </td>
                            <td>
                                <span class="time">{{ it?.time ? it.time : '0:00' }}</span>
                                <div class="control_s">
                                    <!-- 加入播放列表 -->
                                    <el-icon class="icon" size="22px" @click="play_add(it?.music_id, null, null, 'add')"
                                        title="加入播放列表">
                                        <Plus style="margin-left: 5px;" />
                                    </el-icon>
                                    <!-- 加入收藏 -->
                                    <el-icon class="icon" size="22px" @click="add_collect(it?.music_id, 1)" title="收藏">
                                        <FolderAdd style="margin-left: 5px;" />
                                    </el-icon>
                                    <!-- 下载 -->
                                    <el-icon class="icon" size="22px"
                                        @click="downLoad((it?.song_name + '-' + it?.songer), it?.audio)" title="下载">
                                        <Bottom style="margin-left: 5px;" />
                                    </el-icon>
                                </div>
                            </td>
                            <td>
                                <!-- 歌手 -->
                                <el-link class="songer" type="danger"
                                    @click="$router.push('/find/songs/' + it?.music_id + '')">
                                    <span>{{ it?.songer ? it.songer : '歌手名称' }}</span>
                                </el-link>
                            </td>
                        </tr>
                    </table>
                    <el-empty v-else description="暂无歌曲" />
                </el-row>
            </el-col>
        </el-row>
        <collectNav @close="close" :isCollectSongList="isCollectSongList" :songid="songid" :listid="toplistid"
            :table="table" />
    </div>
</template>
<script>
export default {
    name: 'TopList'
}
</script>
<script setup>
import { ref, reactive, onMounted, getCurrentInstance, watch, toRefs } from 'vue'
import { getData as _getdtl, setData as _setdtl, downLoad } from '@/assets/js'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import collectNav from '@/components/component/collectNav.vue'
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
// 页面加载完毕
onMounted(() => {
    // 获取音乐排行榜列表
    getTop_list();
    // 获取排行榜信息
    getTop_info();
})

// 监听路由变化
watch(() => route.path, (val) => {
    // 获取排行榜信息
    getTop_info();
    // 获取高亮
    getLight();
})

// 排行榜列表数据
const toplists = reactive({
    arr: []
})
// 排行榜的信息
const topList_info = reactive({
    info: {},
    list: [],
    total: 0
})
// 获取排行榜列表
const getTop_list = () => {
    proxy.$axios.post('/get_table.php',
        Qs.stringify({
            table: 'music_toplist'
        })
    ).then((res) => {
        if (res.data.code == 1) {
            // 获取排行榜列表数据
            toplists.arr = res.data.data;
        }
    }).catch((err) => {
        console.log(err);
    })
}

// 默认高亮
let defltPath = ref('/' + route.path.split('/')[1] + '/' + route.path.split('/')[2] + '/' + route.params.id);
// 获取高亮
const getLight = () => {
    defltPath.value = '/' + route.path.split('/')[1] + '/' + route.path.split('/')[2] + '/' + route.params.id;
}

// 获取排行榜信息
const getTop_info = () => {
    proxy.$axios.post('/getMusic_toplist.php',
        Qs.stringify({
            type: route.params.id
        })
    ).then((res) => {
        if (res.data.code == 1) {
            // 获取排行榜音乐数据
            topList_info.list = res.data.data;
            // 获取排行榜歌曲总数量
            topList_info.total = res.data.total;
            // 获取排行榜标题信息
            for (var i = 0; i < toplists.arr.length; i++) {
                if (route.params.id == toplists.arr[i].id) {
                    topList_info.info.banner_img = toplists.arr[i].banner_img;
                    topList_info.info.type_name = toplists.arr[i].type_name;
                    topList_info.info.update_time = toplists.arr[i].update_time;
                    topList_info.info.toplist_id = toplists.arr[i].id;
                    break;
                }
            }
            if (musicId.value) {
                music_id.value = musicId.value;
            }
        }
    }).catch((err) => {
        console.log(err)
    })
}

// 音乐id
const songid = ref();
// 表
const table = ref();
// 排行榜id
const toplistid = ref();
// 是否打开收藏歌单抽屉
let isCollectSongList = ref(false);
// 打开收藏夹
const add_collect = (n, code) => {
    // console.log(n, code)
    if (!!_getdtl('token'))
        isCollectSongList.value = true;
    else {
        ElMessage.warning('请先登录~');
        // 跳转登录页面
        setTimeout(() => {
            router.push('/login');
        }, 2000);
        return;
    }
    if (code == 1) {
        // 拿到音乐id传递给collectNav子组件
        songid.value = n;
    } else {
        // 拿到排行榜id传递给collectNav子组件
        toplistid.value = n;
        table.value = 'view_music_toplist';
    }
}

// 歌曲id
const music_id = ref();
// 监听musicId变化
watch(() => musicId.value, (val) => {
    // console.log(val)
    music_id.value = val;
})
// 播放音乐
const play_add = (id, list_id, table, type) => {
    if (type == 'play') {
        music_id.value = id;
    }
    emit('getMusic', { id, list_id, table, type });
}

// 获取收藏子组件回调
const close = (n) => {
    isCollectSongList.value = n;
    songid.value = null;
    toplistid.value = null;
    table.value = null;
}
</script>
<style scoped>
.top_content {
    width: 80%;
    min-height: max-content;
    background-color: white;
    margin: 0 auto;
    box-shadow: 0, 0, 3px, rgba(0, 0, 0, .8);
}

.top_content>.el-row,
.top_content .left_list .el-row,
.top_content .left_list .el-menu,
.right_list {
    width: 100%;
    height: 100%;
}

.left_list .el-menu,
.right_list {
    padding: 30px 0;
}

.left_list .el-menu-item {
    height: 60px;
    padding: 0;
}

.left_list .el-menu .el-col {
    height: 100%;
}

.left_list .el-menu .el-col>div {
    height: 100%;
    width: 100%;
}

.left_list .el-menu .top_image {
    display: flex;
    justify-content: center;
    align-items: center;
}

.left_list .el-menu .top_title {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
}

.top_title span {
    height: 30px;
    display: flex;
    align-items: center;
}

.top_title span:nth-child(2) {
    font-size: 10px;
    font-weight: 100;
}


.songlist_info>div {
    margin-bottom: 20px;
}

.image .el-image {
    width: 180px;
    height: 180px;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.555);
}

.image {
    padding-left: 40px;
}

.info .songlist_info .songlist_name {
    display: flex;
    align-items: center;
    font-size: 20px;
}

.songlist_info .update_time {
    font-size: 13px;
    color: rgba(0, 0, 0, .5);
    display: flex;
    align-items: center;
}

.songlist_info .update_time span {
    margin-left: 3px;
}

.songlist_info .update_time small {
    color: rgba(0, 0, 0, .1);
}

.songlist_list {
    border-bottom: 2px solid #C20C0C;
    margin-top: 50px;
    padding: 5px 30px;
}

.songlist_list small {
    font-size: 15px;
}

.songlist_list .title {
    margin-right: 10px;
}

table {
    width: 100%;
}

table tr {
    width: 100%;
}

table tr td,
table tr th {
    padding: 5px 10px;
    text-align: left;
    font-size: 13px;
    height: 25px;
    line-height: 25px;
}

table tr th {
    color: rgba(0, 0, 0, .4);
}

table tr td {
    height: 60px;
    line-height: 60px;
}

table td .el-link {
    font-size: 13px;
}

table td .song_name,
table td .songer {
    display: inline;
}

table .icon {
    color: rgba(0, 0, 0, .5);
}

table .icon:hover {
    color: #C20C0C;
}

table tr td:nth-child(1) {
    width: 10%;
}

table tr td:nth-child(2) {
    width: 45%;
}

table tr td:nth-child(3) {
    width: 20%;
}

table tr td:nth-child(4) {
    width: 25%;
}

table tr:nth-child(2n) {
    background-color: #ECF5FF;
}

.controls {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.controls span {
    font-size: 10px;
}

.control_s {
    display: none;
    align-items: center;
}

table tr:hover .control_s {
    display: flex;
}

table tr:hover .time {
    display: none;
}

table tr:hover {
    background-color: #ECF5FF;
}

table .index,
table .time {
    color: rgba(0, 0, 0, .2);
}

.content_s .icon {
    margin-right: 2px;
}
</style>