<template>
    <div class="contents">
        <el-row>
            <!-- 音乐图片 -->
            <el-col style="display: flex; justify-content: center;" class="image" :lg="{ span: 8 }" :md="{ span: 24 }"
                :offset="0">
                <el-image :src="songs?.banner_img" fit="fill"></el-image>
            </el-col>
            <!-- 音乐信息 -->
            <el-col class="info" :lg="{ span: 12 }" :md="{ span: 24 }" :offset="0">
                <div class="songlist_info">
                    <div class="songlist_name">
                        <i class="u-icon"></i>
                        {{ songs.type_name }}
                    </div>
                    <div>
                        <span class="creat_time">创建时间：{{ songs?.create_time }}</span>
                    </div>
                </div>
                <!-- 播放、添加播放列表 -->
                <div class="control">
                    <el-button-group>
                        <el-button type="primary" size="mini"
                            @click="play_add(songs.songlist[0]?.music_id, songs.songList_id, 'collect', 'play')"
                            title="播放"><el-icon>
                                <VideoPlay />
                            </el-icon>播放</el-button>
                        <el-button type="primary" size="mini" @click="play_add(null, songs.songList_id, 'collect', 'add')"
                            title="添加播放列表"><el-icon>
                                <Plus />
                            </el-icon></el-button>
                    </el-button-group>
                </div>
            </el-col>
        </el-row>
        <h3 class="songlist_list">
            <span class="title">歌曲列表</span>
            <small>共{{ songs.total }}首</small>
        </h3>
        <!-- 歌曲列表 -->
        <table cellspacing="0" v-if="songs.total > 0">
            <tr>
                <th></th>
                <th>歌曲名称</th>
                <th>时长</th>
                <th>歌手</th>
                <th>收藏时间</th>
            </tr>
            <tr v-for="(it, index) in songs.songlist" :key="index">
                <td>
                    <div class="controls">
                        <span class="index">{{ index + 1 }}</span>
                        <el-icon :style="music_id == it?.music_id ? 'color: red;' : ''" size="16px"
                            @click="play_add(it?.music_id, null, 'collect', 'play')" class="icon" title="播放">
                            <VideoPlay />
                        </el-icon>
                    </div>
                </td>
                <td>
                    <!-- 歌名 -->
                    <el-link type="danger" @click="$router.push('/find/songs/' + it?.music_id + '')">
                        <span class="song_name">{{ it?.song_name ? it.song_name : '歌曲名称' }}</span>
                    </el-link>
                </td>
                <td>
                    <span class="time">{{ it?.time ? it.time : '0:00' }}</span>
                    <div class="control_s">
                        <!-- 加入播放列表 -->
                        <el-icon class="icon" size="22px" @click="play_add(it?.music_id, null, 'collect', 'add')"
                            title="加入播放列表">
                            <Plus style="margin-left: 5px;" />
                        </el-icon>
                        <!-- 加入收藏 -->
                        <el-icon class="icon" size="22" @click="add_collect(it?.music_id)" title="收藏">
                            <FolderAdd style="margin-left: 5px;" />
                        </el-icon>
                        <!-- 下载 -->
                        <el-icon class="icon" size="16px" @click="downLoad((it?.song_name + '-' + it?.songer), it?.audio)"
                            title="下载">
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
                    <!-- 收藏时间 -->
                    <span>{{ it?.collect_time ? it.collect_time : '时间' }}</span>
                </td>
            </tr>
        </table>
        <div v-else>
            <el-empty description="暂无歌曲" />
        </div>
        <collectNav @close="close" :isCollectSongList="isCollectSongList" :songid="songid" />
    </div>
</template>
<script>
export default {
    name: 'musicList'
}
</script>
<script setup>
import { ref, reactive, onMounted, watch, getCurrentInstance, toRefs } from 'vue'
import { getData as _getdtl, setData as _setdtl, downLoad } from '@/func/index'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import Qs from 'qs'
import collectNav from '@/components/collectNav'
const route = useRoute();
const router = useRouter();
const { proxy } = getCurrentInstance();
const emit = defineEmits(['getMusic']);
const props = defineProps({
    musicId: {
        type: String
    }
})
const { musicId } = toRefs(props);

// 收藏夹右侧音乐列表数据
const songs = reactive({
    type_name: '',
    songList_id: '',
    create_time: '',
    banner_img: '',
    songlist: [],
    total: 0
});

// 获取歌曲列表信息
const getList = (key) => {
    proxy.$axios.post('/get_collect_list.php',
        Qs.stringify({
            id: key
        }))
        .then((res) => {
            // console.log(res)
            if (res.data.code == 1) {
                songs.type_name = res.data.data[0].type_name;
                songs.create_time = res.data.data[0].create_time;
                songs.banner_img = res.data.data[0].banner_img;
                songs.total = res.data.data[0].num;
                songs.songList_id = res.data.data[0].id;
                // 获取音乐
                getSongs(key);
            }
        }).catch((err) => {
            console.log(err);
        })
}

// 获取歌曲
const getSongs = (key) => {
    proxy.$axios.post('/get_collect_song.php',
        Qs.stringify({
            id: key
        }))
        .then((res) => {
            // console.log(res)
            if (res.data.code == 1) {
                songs.songlist = res.data.data;
                // 总数量
                songs.total = res.data.total;
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
// 播放音乐
const play_add = (id, list_id, table, type) => {
    if (songs.total == 0) {
        ElMessage.warning('暂无音乐~');
        return;
    }
    if (type == 'play') {
        music_id.value = id;
    }
    emit('getMusic', { id, list_id, table, type });
}

// 获取收藏子组件回调
const close = (n) => {
    isCollectSongList.value = n;
    songid.value = null;
}

// 页面渲染完毕
onMounted(() => {
    // 获取歌单数据
    getList(route.params.id);
})
</script>
<style scope>
.contents {
    width: 80%;
    margin: 0 auto;
    height: auto;
    background-color: #ffffff;
    box-shadow: 0 0 3px rgba(0, 0, 0, .8);
    padding: 20px 0;
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

.u-icon {
    display: inline-block;
    width: 54px;
    height: 24px;
    background: url(https://s2.music.126.net/style/web2/img/icon.png?75cae89c0400d74200ba366024ebb47a) no-repeat;
    background-position: 0 -243px;
    margin-right: 10px;
}

.info .songlist_info .songlist_name {
    display: flex;
    align-items: center;
    font-size: 20px;
}

.songlist_info .el-link {
    margin: 0 15px;
}

.songlist_info .creat_time {
    font-size: 13px;
    color: rgba(0, 0, 0, .5);
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

.contents table {
    width: 100%;
}

.contents table tr {
    width: 100%;
}

.contents table tr:nth-child(1) th {
    background-color: #ffffff;
    border-bottom: 1px solid rgba(0, 0, 0, .1);
}

.contents table tr td,
.contents table tr th {
    padding: 5px 10px;
    text-align: left;
    font-size: 13px;
    height: 25px;
    line-height: 25px;
}

.contents table tr th:nth-child(2),
.contents table tr th:nth-child(3),
.contents table tr th:nth-child(4) {
    border-left: 1px solid rgba(0, 0, 0, .1);
}

.contents table tr th {
    color: rgba(0, 0, 0, .4);
}


.contents table td .el-link {
    font-size: 13px;
}

.contents table .icon {
    color: rgba(0, 0, 0, .5);
}

.contents table .icon:hover {
    color: #C20C0C;
}

.contents table tr td:nth-child(1) {
    width: 10%;
}

.contents table tr td:nth-child(2) {
    width: 35%;
}

.contents table tr td:nth-child(3) {
    width: 15%;
}

.contents table tr td:nth-child(4) {
    width: 20%;
}

.contents table tr td:nth-child(5) {
    width: 20%;
}

.contents table tr:nth-child(2n) {
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


.contents table .index,
.contents table .time {
    color: rgba(0, 0, 0, .2);
}


.control_s {
    display: none;
    align-items: center;
}

.contents .icon {
    margin-right: 2px;
}

.contents table tr:hover .control_s {
    display: flex;
}

.contents table tr:hover .time {
    display: none;
}

.contents table tr:hover {
    background-color: #ECF5FF;
}

ul.collect_box {
    list-style-type: none;
}

ul.collect_box li {
    padding: 20px;
    border-bottom: 1px solid #EEEEEE;
    font-size: 15px;
}

ul.collect_box li:first-child {
    display: flex;
    align-items: center;
    background-color: #F2F2F2;
}

ul.collect_box li:hover {
    background-color: #F2F2F2;
}

ul.collect_box li .el-image {
    margin-right: 10px;
}

ul.collect_box li:last-of-type {
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

.del_icon {
    display: none;
    color: rgba(0, 0, 0, .5);
}

.el-menu-item:hover .del_icon {
    display: block;
}
</style>
