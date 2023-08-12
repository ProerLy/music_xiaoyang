<template>
    <div class="content">
        <el-skeleton animated :loading="loading" style="width:100%;">
            <template #template>
                <el-row class="content_s" style="background-color: white; padding: 0 20px; height:100%;" :gutter="20">
                    <el-col style="padding: 30px 0;" :span="6" :offset="0">
                        <br>
                        <div v-for="i in 10" :key="i">
                            <el-skeleton-item variant="h3" style="width: 100%" /><br><br>
                        </div>
                        <br>
                        <br>
                    </el-col>
                    <el-col style="padding: 30px 20px;" :span="18" :offset="0">
                        <el-row :gutter="20">
                            <el-col :span="8" :offset="0">
                                <el-skeleton-item variant="image" style="width: 180px; height: 180px;" />
                            </el-col>
                            <el-col :span="16" :offset="0">
                                <el-skeleton-item variant="h3" style="width: 20%" /><br><br>
                                <el-skeleton-item variant="h3" style="width: 40%" /><br><br>
                                <el-skeleton-item variant="button" />
                            </el-col>
                        </el-row>
                        <br>
                        <br>
                        <br>
                        <br>
                        <br>
                        <div v-for="i in 6" :key="i">
                            <el-skeleton-item variant="h3" style="width: 100%" /><br><br>
                        </div>
                    </el-col>
                </el-row>
            </template>
            <template #default>
                <el-empty v-if="!_getdtl('token')" :image-size="500"
                    image="https://img.zcool.cn/community/0156e65d0f3560a801205e4bcd4d39.png@1280w_1l_2o_100sh.png">
                    <el-button type="success" size="mini" @click="$router.push('/login')">前往登录</el-button>
                </el-empty>
                <el-empty v-else-if="songlist.total <= 0" :image-size="300" description="暂无歌曲"></el-empty>
                <el-row v-else class="content_s" :gutter="20">
                    <el-col class="left" :span="6" :offset="0">
                        <el-menu @open="showItem" @close="hideItem" @select="select" :default-openeds="open_item" router
                            :default-active="$route.path" active-text-color="#FFD04B" class="el-menu-vertical-demo">
                            <el-sub-menu index="1">
                                <template #title>
                                    <el-icon>
                                        <location />
                                    </el-icon>
                                    <span>收藏的歌单（{{ songlist.total }}）</span>
                                </template>
                                <el-menu-item-group>
                                    <el-menu-item @click="isCollectCreat = !isCollectCreat"
                                        style="background-color: #ECF5FF;">
                                        <el-icon>
                                            <Plus />
                                        </el-icon>
                                        <span>新建歌单</span>
                                    </el-menu-item>
                                    <el-menu-item :index="'/mymusic/' + (it?.id)" v-for="(it, index) in songlist.info"
                                        :key="index">
                                        <el-row>
                                            <el-col class="songlist_avatar" :span="10" :offset="0">
                                                <el-image :src="it?.banner_img" fit="fill"></el-image>
                                            </el-col>
                                            <el-col class="songlist_info" :span="12" :offset="0">
                                                <span class="songlist_name">{{ it?.type_name ? it?.type_name :
                                                    '歌单名称'
                                                }}</span>
                                                <span class="songlist_num">{{ it?.num ? it?.num : 0
                                                }}首</span>
                                            </el-col>
                                            <el-col :span="2">
                                                <div class="del_icon">
                                                    <el-icon size="16px" @click.stop="del_collect(it?.id)" title="删除">
                                                        <Delete />
                                                    </el-icon>
                                                </div>
                                            </el-col>
                                        </el-row>
                                    </el-menu-item>
                                </el-menu-item-group>
                            </el-sub-menu>
                        </el-menu>
                    </el-col>
                    <el-col class="right" :span="18" :offset="0">
                        <el-row>
                            <!-- 音乐图片 -->
                            <el-col class="image" :lg="{ span: 8 }" :md="{ span: 24 }" :offset="0">
                                <el-image :src="songs?.banner_img" fit="fill"></el-image>
                            </el-col>
                            <!-- 音乐信息 -->
                            <el-col class="info" :lg="{ span: 12 }" :md="{ span: 24 }" :offset="0">
                                <div class="songlist_info">
                                    <div class="songlist_name">
                                        <i class="u-icon"></i>
                                        {{ songs?.type_name }}
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
                                        <el-button type="primary" size="mini"
                                            @click="play_add(null, songs.songList_id, 'collect', 'add')"
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
                                            @click="play_add(it?.music_id, null, 'collect', 'play')" class="icon"
                                            title="播放">
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
                                        <el-icon class="icon" size="22px"
                                            @click="play_add(it?.music_id, null, 'collect', 'add')" title="加入播放列表">
                                            <Plus style="margin-left: 5px;" />
                                        </el-icon>
                                        <!-- 删除 -->
                                        <el-icon class="icon" size="16px" @click="del(it?.music_id)" title="删除">
                                            <Delete />
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
                                    <!-- 收藏时间 -->
                                    <span>{{ it?.collect_time ? it.collect_time : '时间' }}</span>
                                </td>
                            </tr>
                        </table>
                        <div v-else>
                            <el-empty description="暂无歌曲" />
                        </div>
                    </el-col>
                </el-row>
                <!-- 收藏歌单创建列表 -->
                <el-dialog draggable width="30%" :modal="false" v-model="isCollectCreat" title="创建新的收藏歌单">
                    <el-input v-model="collectName" placeholder="请输入歌单名称" clearable>
                        <template #prepend>
                            <span>歌单名称</span>
                        </template>
                    </el-input>
                    <br><br>
                    <p><small>可通过“收藏”将音乐添加到新歌单中</small></p>
                    <template #footer>
                        <span class="dialog-footer">
                            <el-button @click="isCollectCreat = false">取消</el-button>
                            <el-button type="primary" @click="creat_collect()">
                                新建
                            </el-button>
                        </span>
                    </template>
                </el-dialog>
            </template>
        </el-skeleton>
    </div>
    <!-- 删除提示弹窗 -->
    <el-dialog v-model="delDtl.del_dialog" title="提示" width="30%">
        <span>此操作不可逆，是否删除？</span>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="delDtl.del_dialog = false">取消</el-button>
                <el-button type="primary" @click="del_ok">
                    确定
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script>
export default {
    name: 'MyMusic'
}
</script>
<script setup>
import { ref, reactive, onMounted, watch, getCurrentInstance, toRefs } from 'vue'
import { getData as _getdtl, setData as _setdtl, downLoad } from '@/func/index'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import Qs from 'qs'
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
// 加载
let loading = ref(true);

// 收藏夹左侧数据
let songlist = reactive({
    total: 0,
    info: []
});
// 收藏夹右侧音乐列表数据
const songs = reactive({
    type_name: '',
    songList_id: '',
    create_time: '',
    banner_img: '',
    songlist: [],
    total: 0
});

// 获取歌单数据
const getList = () => {
    if (!_getdtl('token')) {
        ElMessage.warning('请先登录~');
        // 跳转登录页面
        setTimeout(() => {
            router.replace('/login');
        }, 2000);
        return false;
    }
    loading.value = true;
    setTimeout(() => {
        // 获取收藏的音乐列表
        proxy.$axios.post('/get_collect_list.php',
            Qs.stringify({
                token: _getdtl('token')
            })
        )
            .then((res) => {
                songlist.total = 0;
                // console.log(res)
                if (res.data.code == 1) {
                    if (res.data.total > 0) {
                        songlist.info = res.data.data
                        // 总数量
                        songlist.total = res.data.total;
                        if (route.params.id == 'null' || delDtl.collect_id == route.params.id) {
                            router.replace('/mymusic/' + res.data.data[0].id);
                        }
                        // 获取音乐
                        getSongs(route.params.id);
                    }
                    loading.value = false;
                }
            }).catch((err) => {
                console.log(err);
            })
    }, 1500);

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
                songlist.info.forEach(val => {
                    if (val.id == key) {
                        songs.type_name = val.type_name;
                        songs.create_time = val.create_time;
                        songs.banner_img = val.banner_img;
                        songs.songList_id = val.id;
                    }
                });
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
// 播放音乐
const play_add = (id, list_id, table, type) => {
    if (type == 'play') {
        music_id.value = id;
    }
    emit('getMusic', { id, list_id, table, type });
}

// 是否打开收藏歌单创建列表
let isCollectCreat = ref(false);
// 创建收藏歌单的名称
let collectName = ref('');

// 创建收藏歌单
function creat_collect() {
    if (!collectName.value) {
        // 提示
        ElMessage.warning('请输入歌单名称~');
        return false;
    }
    // 创建音乐收藏列表请求
    proxy.$axios.post('/add_collect_list.php',
        Qs.stringify({
            key: collectName.value,
            token: _getdtl('token')
        })
    ).then((res) => {
        if (res.data.code == 0) {
            // 提示
            ElMessage.warning(res.data.msg);
            return;
        }
        // 提示
        ElMessage.success(res.data.msg);
        // 关闭创建框
        isCollectCreat.value = false;
        // 重新加载
        getList();
    }).catch((err) => {
        console.log(err);
    })
}

// 删除数据
const delDtl = reactive({
    del_dialog: false,
    collect_id: null,
    music_id: null
});

// 删除收藏歌单
const del_collect = (n) => {
    delDtl.del_dialog = true;
    delDtl.collect_id = n;
    delDtl.music_id = null;
}

// 删除歌单里面的歌曲
const del = (n) => {
    // console.log(n)
    delDtl.del_dialog = true;
    delDtl.music_id = n;
    delDtl.collect_id = null;
}

// 确定删除
const del_ok = () => {
    // 传递的数据
    let data = Qs.stringify({
        list_id: songs.songList_id,
        music_id: delDtl.music_id
    })
    if (!!delDtl.collect_id) {
        data = Qs.stringify({
            list_id: delDtl.collect_id
        })
    }
    proxy.$axios.post('/delet_collect.php', data)
        .then((res) => {
            // console.log(res)
            if (res.data.code == 0) {
                ElMessage.warning(res.data.msg);
                return;
            }
            ElMessage.success(res.data.msg);
            delDtl.del_dialog = false;
            // 重新加载数据
            // 获取歌单数据
            getList();
        }).catch((err) => {
            console.log(err);
        })
}

// 监听路由变化
watch(() => route.path, (val) => {
    // 获取歌单数据
    getSongs(route.params.id);
})

// 页面渲染完毕
onMounted(() => {
    // 获取歌单数据
    getList();
})
</script>
<style scope>
.content {
    width: 80%;
    margin: 0 auto;
    height: auto;
}

.content_s {
    background-color: #ffffff;
    box-shadow: 0 0 3px rgba(0, 0, 0, .8);
    padding: 20px 0;
}

.left .el-menu-item {
    height: 80px !important;
    margin: 5px 0;
}

.left .el-menu-item>.el-link {
    display: block;
    width: 100%;
    height: 100%;
}

:deep(.el-link__inner) {
    display: inline;
}

.left .el-row {
    width: 100%;
    height: 100%;
}

.left .songlist_avatar,
.left .songlist_info {
    height: 100%;
}

.left .songlist_info {
    display: flex !important;
    flex-direction: column;
    justify-content: space-around;
}

.left .songlist_avatar {
    display: flex !important;
    justify-content: center;
    align-items: center;
}

.left .songlist_avatar .el-image {
    width: 60px;
    height: 60px;
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

.content_s table {
    width: 100%;
}

.content_s table tr {
    width: 100%;
}

.content_s table tr:nth-child(1) th {
    background-color: #ffffff;
    border-bottom: 1px solid rgba(0, 0, 0, .1);
}

.content_s table tr td,
.content_s table tr th {
    padding: 5px 10px;
    text-align: left;
    font-size: 13px;
    height: 25px;
    line-height: 25px;
}

.content_s table tr th:nth-child(2),
.content_s table tr th:nth-child(3),
.content_s table tr th:nth-child(4) {
    border-left: 1px solid rgba(0, 0, 0, .1);
}

.content_s table tr th {
    color: rgba(0, 0, 0, .4);
}


.content_s table td .el-link {
    font-size: 13px;
}

.content_s table .icon {
    color: rgba(0, 0, 0, .5);
    margin: 0 3px;
}

.content_s table .icon:hover {
    color: #C20C0C;
}

.content_s table tr td:nth-child(1) {
    width: 10%;
}

.content_s table tr td:nth-child(2) {
    width: 35%;
}

.content_s table tr td:nth-child(3) {
    width: 15%;
}

.content_s table tr td:nth-child(4) {
    width: 20%;
}

.content_s table tr td:nth-child(5) {
    width: 20%;
}

.content_s table tr:nth-child(2n) {
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


.content_s table .index,
.content_s table .time {
    color: rgba(0, 0, 0, .2);
}


.control_s {
    display: none;
    align-items: center;
}

.content_s table tr:hover .control_s {
    display: flex;
}

.content_s table tr:hover .time {
    display: none;
}

.content_s table tr:hover {
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
