<template>
    <!-- 加入收藏的抽屉 -->
    <el-dialog @close="close" draggable width="40%" :modal="false" v-model="isCollectSongList" title="加入我的收藏歌单">
        <ul class="collect_box">
            <li @click="isCollectCreat = true"><el-icon size="50">
                    <CirclePlus />
                </el-icon>创建新的收藏歌单</li>
            <li v-for="(it, index) in collect_list.arr" :key="index" @click="add_collect_list(it.id)">
                <div style="display: flex;">
                    <div class="avatar">
                        <el-image style="width: 80px; height: 80px;" :src="it.banner_img" fit="fill"></el-image>
                    </div>
                    <div class="listInfo">
                        <p>{{ it?.type_name }}</p>
                        <p>{{ it?.num }}首</p>
                    </div>
                </div>
            </li>
        </ul>
    </el-dialog>
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
                <el-button type="primary" @click="creat_collect_add()">
                    新建
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script>
export default {
    name: 'collectNav'
}
</script>
<script setup>
import { ref, reactive, toRefs, getCurrentInstance, onMounted } from 'vue'
import { getData as _getdtl, setData as _setdtl } from '@/assets/js'
import { ElMessage } from 'element-plus'
import Qs from 'qs'
const { proxy } = getCurrentInstance();
// 页面加载完毕
onMounted(() => {
    // 获取收藏列表
    getCollect_list();
})
// props
const props = defineProps({
    isCollectSongList: {
        type: Boolean,
        default: false
    },
    songid: {
        type: String
    },
    listid: {
        type: String
    },
    table: {
        type: String
    }
})
const { isCollectSongList, songid, listid, table } = toRefs(props);
// emit方法
const emit = defineEmits(['close']);

// 收藏列表数据
const collect_list = reactive({
    arr: []
})
// 获取收藏歌单
const getCollect_list = () => {
    proxy.$axios.post('/get_collect_list.php',
        Qs.stringify({
            token: _getdtl('token')
        })
    ).then((res) => {
        if (res.data.code == 1) {
            // console.log(res)
            collect_list.arr = res.data.data;
        }
    }).catch((err) => {
        console.log(err)
    })
}

// 是否打开收藏歌单创建列表
let isCollectCreat = ref(false);
// 创建收藏歌单的名称
let collectName = ref('');

// 返回选中的收藏歌单的索引,并添加
function add_collect_list(n) {
    // console.log(n, songid.value, toplistid.value)
    // 传递的参数
    let data = Qs.stringify({
        music_id: songid.value,
        collect_list_id: n,
    })
    if (!!listid.value) {
        data = Qs.stringify({
            table: table.value,
            list_id: listid.value,
            collect_list_id: n,
        })
    } else if (!!table.value) {
        data = Qs.stringify({
            table: table.value,
            collect_list_id: n,
        })
    }
    // 添加请求
    proxy.$axios.post('/add_collect_song.php', data)
        .then((res) => {
            // console.log(res)
            if (res.data.code == 0) {
                // 提示
                ElMessage.warning(res.data.msg);
                return;
            }
            // 提示
            ElMessage.success(res.data.msg);
            // 关闭
            emit('close', false);
            // 重新加载收藏歌单
            getCollect_list();
        }).catch((err) => {
            console.log(err);
        })

}

// 创建我的收藏歌单
function creat_collect_add() {
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
        collectName.value = '';
        // 关闭创建框
        isCollectCreat.value = false;
        // 重新加载收藏歌单
        getCollect_list();
    }).catch((err) => {
        console.log(err);
    })
}

// 弹窗关闭触发事件
const close = () => {
    emit('close', false);
}

</script>