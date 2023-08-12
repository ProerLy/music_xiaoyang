<template>
    <div class="box">
        <userTitle :user_id="nowUser?.user_id"></userTitle>
        <div id="histroySongList">
            <h3 class="songListTitle">最近听过的歌曲 <small>累计听歌{{ histroy.total }}首</small></h3>
            <div class="songList" v-if="!histroy.total">
                <el-empty description="暂无歌曲" />
            </div>
            <div class="songList" v-else>
                <table cellspacing="0">
                    <tr v-for="(it, index) in histroy.info" :key="index">
                        <td>
                            <!-- 歌名 -->
                            <div class="controls">
                                <span>{{ index + 1 }}</span>
                                <el-icon :style="music_id == it?.music_id ? 'color: red; font-size: 16px;' : 'font-size: 16px;'"
                                    @click="play_add(it.music_id, null, null, 'play')" class="icon" title="播放">
                                    <VideoPlay />
                                </el-icon>
                            </div>
                        </td>
                        <td>
                            <el-link type="danger" @click="$router.push('/find/songs/' + it?.music_id + '')">
                                <span class="song_name">{{ it?.song_name ? it.song_name : '歌曲名称' }}</span>
                            </el-link>
                        </td>
                        <td>
                            <span class="time">{{ it?.time ? it.time : '0:00' }}</span>
                            <div class="control_s">
                                <!-- 加入播放列表 -->
                                <el-icon class="icon" size="22" @click="play_add(it?.music_id, null, null, 'add')"
                                    title="加入播放列表">
                                    <Plus style="margin-left: 5px;" />
                                </el-icon>
                                <!-- 加入收藏 -->
                                <el-icon class="icon" size="22" @click="add_collect(it?.music_id)" title="收藏">
                                    <FolderAdd style="margin-left: 5px;" />
                                </el-icon>
                                <!-- 下载 -->
                                <el-icon class="icon" size="16px"
                                    @click="downLoad((it?.song_name + '-' + it?.songer), it?.audio)" title="下载">
                                    <Bottom />
                                </el-icon>
                            </div>
                        </td>
                        <td>
                            <!-- 歌手 -->
                            <el-link type="danger" @click="$router.push('/find/songs/' + it?.music_id + '')">
                                <span>{{ it?.songer ? it.songer : '歌手名称' }}</span>
                            </el-link>
                        </td>
                        <td>
                            <!-- 时间 -->
                            <span>{{ it?.create_time ? it.create_time : '时间' }}</span>
                        </td>
                    </tr>
                </table>
                <p class="show_hide">
                    <a href="javascript:;">
                        <span @click="isShow = !isShow" v-if="!isShow" title="查看更多">查看更多<el-icon>
                                <CaretBottom />
                            </el-icon></span>
                        <span v-else @click="isShow = !isShow" title="收起">收起<el-icon>
                                <CaretTop />
                            </el-icon></span>
                    </a>
                </p>
            </div>
        </div>
        <div id="collectSongList">
            <h3 class="songListTitle">他（她）的收藏歌单({{ collectSongList.total }})</h3>
            <div class="songList" v-if="!collectSongList.total">
                <el-empty description="暂无歌单" />
            </div>
            <div v-else class="songList">
                <el-row :gutter="20">
                    <el-col :xl="{ span: 6 }" :lg="{ span: 6 }" :md="{ span: 6 }" :sm="{ span: 12 }" :xs="{ span: 12 }"
                        style="margin: 10px 0;" :span="6" :offset="0" v-for="(it, index) in collectSongList.info"
                        :key="index">
                        <div style="width: 140px; height: 140px; position: relative;">
                            <el-link :title="it?.type_name" :underline="false"
                                @click="$router.push('/musiclist/' + it?.id)"><el-image
                                    style="width: 140px; height: 140px; " :src="it?.banner_img" fit="fit" /></el-link>
                            <p class="listControl">
                                <span title="歌曲数量">
                                    <el-icon>
                                        <List />
                                    </el-icon>
                                    &nbsp;{{ it?.num }}
                                </span>
                                <span>
                                    <el-icon title="播放" class="icon" @click="play_add(null, it?.id, 'collect', 'play')">
                                        <VideoPlay />
                                    </el-icon>
                                </span>
                            </p>
                        </div>
                        <el-link @click="$router.push('/musiclist/' + it?.id)" :title="it?.type_name" type="danger"
                            class="listName">{{ it?.type_name
                            }}</el-link>
                    </el-col>
                </el-row>
            </div>
        </div>
        <!-- 收藏夹 -->
        <collectNav @close="close" :isCollectSongList="isCollectSongList" :songid="songid" />
    </div>
</template>
<script>
export default {
    name: 'otherPage'
}
</script>
<script setup>
import { ref, reactive, onMounted, getCurrentInstance, watch, toRefs } from 'vue'
import { ElMessage } from 'element-plus'
import Qs from 'qs'
// 引入方法
import { getData as _getdtl, setData as _setdtl, downLoad } from '@/func/index'
import { useRouter, useRoute } from 'vue-router'
import collectNav from '@/components/collectNav'
import userTitle from '@/components/userTitle'
const emit = defineEmits(['getPath', 'getMusic']);
const router = useRouter();
const route = useRoute();
const { proxy } = getCurrentInstance();
const props = defineProps({
    musicId: {
        type: String
    }
})
const { musicId } = toRefs(props);
// 页面渲染完毕时传递父级值
onMounted(() => {
    // 获取高亮
    getpath();
    // 获取用户数据
    getData();
    // 获取历史音乐数据
    getHistroy(6);
    // 获取收藏歌单列表
    getCollect_list();
})
// 传递值的方法
const getpath = () => {
    emit('getPath', '')
}

// 默认个人数据
const nowUser = ref();
// 获取用户数据
const getData = () => {
    const params = Qs.stringify({
        id: route.params.id
    })
    proxy.$axios.post('/getUser_info.php', params)
        .then((res) => {
            if (res.data.code == 1) {
                nowUser.value = res.data.data[0];
            }
        }).catch((err) => {
            console.log(err);
        })
}

// 是否收起历史播放
let isShow = ref(false);
// 监听isShow
watch(() => isShow.value, (val) => {
    // 重新加载数据
    getHistroy(6);
})

// 历史音乐数据
const histroy = reactive({
    total: 0,
    info: []
})
// 获取历史音乐
const getHistroy = (page_size) => {
    let data = Qs.stringify({
        id: route.params.id
    })
    if (!isShow.value) {
        data = Qs.stringify({
            id: route.params.id,
            page_size
        })
    }
    proxy.$axios.post('/get_histroy_song.php', data).then((res) => {
        if (res.data.code == 1) {
            histroy.info = res.data.data;
            histroy.total = res.data.total;
            // 获取默认音乐id
            if (musicId.value) {
                music_id.value = musicId.value;
            }
        }
    }).catch((err) => {
        console.log(err);
    })
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

// 是否打开收藏歌单抽屉
let isCollectSongList = ref(false);
// 音乐id
const songid = ref();
// 获取歌曲索引
function add_collect(index) {
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
    songid.value = index;
}

// 收藏歌单的值
const collectSongList = reactive({
    total: 0,
    info: []
})
// 获取收藏歌单列表
const getCollect_list = () => {
    proxy.$axios.post('/get_collect_list.php',
        Qs.stringify({
            user_id: route.params.id
        })
    ).then((res) => {
        // console.log(res)
        if (res.data.code == 1) {
            collectSongList.info = res.data.data;
            collectSongList.total = res.data.data.length;
        }
    }).catch((err) => {
        console.log(err);
    })
}

// 获取收藏子组件回调
const close = (n) => {
    isCollectSongList.value = n;
    songid.value = null;
}
</script>
<style scoped>
.box {
    width: 60%;
    min-height: max-content;
    margin: 0 auto;
    box-shadow: 0 0 3px rgba(0, 0, 0, .8);
    padding: 40px;
    background-color: rgba(255, 255, 255, .1);
}

.userName {
    font-family: '微软雅黑';
    display: flex;
    justify-content: space-between;
}

:deep(.el-breadcrumb__item .el-breadcrumb__inner) {
    font-weight: bold !important;
    font-size: 15px;
    color: rgba(0, 0, 0, .8) !important;
    cursor: pointer !important;
}

:deep(.el-breadcrumb__item .el-breadcrumb__inner):hover {
    color: #529EFF !important;
}

#uerinfo p {
    padding: 5px 0;
    font-size: 10px;
}

.songListTitle {
    border-bottom: 2px solid #EEEEEE;
    padding: 5px 0;
    margin-top: 30px;
}


.box table {
    width: 100%;
}

.box table tr {
    width: 100%;
}

.box table tr td,
.box table tr th {
    padding: 6px 10px;
    text-align: left;

}

.box table .icon {
    color: rgba(0, 0, 0, .5);
}

.box table .icon:hover {
    color: #C20C0C;
}

.box table tr td:nth-child(1) {
    width: 10%;
}

.box table tr td:nth-child(2) {
    width: 35%;
}

.box table tr td:nth-child(3) {
    width: 15%;
}

.box table tr td:nth-child(4) {
    width: 20%;
}

.box table tr td:nth-child(5) {
    width: 20%;
}

.box table tr {
    background-color: #ffffff31;
}

.box table tr:nth-child(2n) {
    background-color: #00fff27e;
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

.box table tr:hover .control_s {
    display: flex;
}

.content_s table tr:hover .time {
    display: none;
}

.box table tr:hover {
    background-color: #00e1ff;
}

.control_s .icon:nth-child(2) {
    margin: 0 8px;
}

small {
    font-size: 10px;
}

.contorl {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.info {
    display: flex;
    align-items: center;
}

.info span {
    margin-right: 5px;
}

.obj {
    display: flex;
    align-items: center;
}

.listControl {
    position: absolute;
    bottom: 10px;
    left: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 10px;
    width: 85%;
}

.listControl span {
    display: flex;
    align-items: center;
    color: #7b7b7c;
}

.icon:hover {
    color: #B90B0B;
}

ul {
    list-style-type: none;
}

ul li {
    padding: 20px;
    border-bottom: 1px solid #EEEEEE;
    font-size: 15px;
}

ul li:first-child {
    display: flex;
    align-items: center;
    background-color: #F2F2F2;
}

ul li:hover {
    background-color: #F2F2F2;
}

.show_hide {
    margin-top: 10px;
    text-align: right;
}

.show_hide span {
    color: rgba(0, 0, 0, .3);
    font-size: 13px;
}

ul li .el-image {
    margin-right: 10px;
}

ul li:last-of-type {
    border: none;
}

.listInfo {
    height: 75px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.listInfo p:last-child {
    color: #4c4c4d;
}
</style>