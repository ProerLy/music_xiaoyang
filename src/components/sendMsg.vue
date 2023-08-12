<template>
    <!-- 加入收藏的抽屉 -->
    <el-dialog @close="close" draggable width="40%" :modal="false" v-model="isSend" title="发送私信">
        <!-- 私信对象 -->
        <el-input v-model="send_msg.input" placeholder="请输入好友名称" @focus="focus" @blur="blur" clearable
            @input="change(send_msg.input)">
            <template #prepend v-if="is_concern.length > 0">
                <el-tag closable type="info" v-for="(it, i) in is_concern" :key="i" @close="handleClose(i)">{{
                    it?.nick_name }}</el-tag>
            </template>
        </el-input>
        <br>
        <br>
        <!-- 内容 -->
        <el-input type="textarea" rows="3" maxlength="300" show-word-limit v-model="send_msg.content" placeholder="说点什么吧~"
            clearable></el-input>
        <!-- 私信列表 -->
        <ul id="list">
            <li v-for="(it, i) in concern_copy" :key="i" @click="check(i)">
                <el-image :src="it?.avatar" fit="fill"></el-image>
                <div class="nick_name">{{ it?.nick_name }}</div>
            </li>
        </ul>
        <!-- 表情包 -->
        <div class="commit_input_happy">
            <el-icon size="20" color="rgba(0, 0, 0, .6)" @click="dialogVisible.dialogVisible_1 = true">
                <Watermelon />
            </el-icon>
            <el-dialog v-model="dialogVisible.dialogVisible_1" :modal="false" width="20%" draggable>
                <div class="happy_content">
                    <span @click="demos(it)" v-for="it in demo" :key="it">{{ it }}</span>
                </div>
            </el-dialog>
        </div>
        <template #footer>
            <el-button type="primary" size="default" @click="send(is_concern, send_msg.content)">发送</el-button>
        </template>
    </el-dialog>
</template>
<script>
export default {
    name: 'sendMsg'
}
</script>
<script setup>
import { ref, reactive, toRefs, getCurrentInstance, onMounted, watch } from 'vue'
import { getData as _getdtl, setData as _setdtl } from '@/func/index'
import { ElMessage } from 'element-plus'
import Qs from 'qs'
const { proxy } = getCurrentInstance();
// 页面加载完毕
onMounted(() => {
    getMsg_friends();
    getDemo();
})
// props
const props = defineProps({
    isSend: {
        type: Boolean,
        default: false
    },
    is_ary: {
        type: Array
    }
})
const { isSend, is_ary } = toRefs(props);
// emit方法
const emit = defineEmits(['close']);

// 所有关注的好友信息
const concern = ref([]);
// 可编辑好友
const concern_copy = ref([]);
// 获取好友
const getMsg_friends = () => {
    proxy.$axios.post('/get_concern.php',
        Qs.stringify({
            token: _getdtl('token')
        })
    ).then((res) => {
        if (res.data.code == 1) {
            // console.log(res)
            concern.value = res.data.data;
            concern_copy.value = res.data.data;
        }
    }).catch((err) => {
        console.log(err)
    })
}

// 监听is_ary
watch(() => is_ary.value, (arry) => {
    if (arry.length > 0) {
        is_concern.value = arry;
        concern_copy.value = [];
        for (var i = 0; i < concern.value.length; i++) {
            let flag = false;
            for (var j = 0; j < is_concern.value.length; j++) {
                if (concern.value[i].friend_id == is_concern.value[j].friend_id) {
                    flag = true;
                    break;
                }
            }
            if (!flag) {
                concern_copy.value.push(concern.value[i]);
            }
        }
    }
})

// 获取焦点
const focus = () => {
    // 显示
    document.getElementById('list').style.display = 'block';
}
// 失去焦点
const blur = () => {
    // 隐藏
    setTimeout(() => {
        document.getElementById('list').style.display = 'none';
    }, 200);
}

// 选择的好友
const is_concern = ref([]);
// 选择好友
const check = (index) => {
    // 添加已选好友
    is_concern.value.push(concern_copy.value[index]);
    // 备份好友删除
    concern_copy.value.splice(index, 1);
}

// 取消勾选
const handleClose = (index) => {
    // 备份好友添加
    concern_copy.value.push(is_concern.value[index]);
    // 删除所选
    is_concern.value.splice(index, 1);
}

// 输入框的内容
const send_msg = reactive({
    input: null,
    content: ''
})

// 搜索好友
const change = (key) => {
    // 筛选
    let ary = [];
    for (var i = 0; i < concern_copy.value.length; i++) {
        if (concern_copy.value[i].nick_name.indexOf(key) > -1) {
            ary.push(concern_copy.value[i]);
        }
    }
    concern_copy.value = ary;
    if (!key) {
        concern_copy.value = [];
        for (var i = 0; i < concern.value.length; i++) {
            let flag = false;
            for (var j = 0; j < is_concern.value.length; j++) {
                if (concern.value[i].friend_id == is_concern.value[j].friend_id) {
                    flag = true;
                    break;
                }
            }
            if (!flag) {
                concern_copy.value.push(concern.value[i]);
            }
        }
    }
}

// 表情开关
const dialogVisible = reactive({
    dialogVisible_1: false,
    dialogVisible_2: false
})
// 表情数据
const demo = ref();
// 获取表情的方法
const getDemo = () => {
    proxy.$axios('/demo.json')
        .then((inres) => {
            demo.value = inres.data.demo;
        }).catch((err) => {
            console.log(err)
        })
}

// 点击表情添加
const demos = (key) => {
    send_msg.content += key;
}

// 发送信息
const send = (ary, key) => {
    if (ary.length == 0) {
        ElMessage.warning('请选择私信对象~');
        return;
    } else if (!key) {
        ElMessage.warning('请输入私信内容~');
        return;
    }

    proxy.$axios.post('/insert_msg.php',
        Qs.stringify({
            token: _getdtl('token'),
            friend_id: is_concern.value,
            content: send_msg.content
        })
    ).then((res) => {
        // console.log(res)
        if (res.data.code == 0) {
            ElMessage.warning(res.data.msg);
            return;
        }
        ElMessage.success(res.data.msg);
        send_msg.content = '';
        send_msg.input = null;
        is_concern.value = [];
        // 传值给父组件
        emit('close', { isSend: false, isOk: true });
    }).catch((err) => {
        console.log(err)
    })
}

// 弹窗关闭触发事件
const close = () => {
    // 传值给父组件
    emit('close', false);
}

// 监听isSend
watch(() => isSend.value, (key) => {
    if (!key) {
        send_msg.content = '';
        send_msg.input = null;
        is_concern.value = [];
    }else{
        getMsg_friends();
    }
})
</script>
<style lang="less" scoped>
.el-dialog {
    #list {
        width: 90%;
        list-style-type: none;
        position: absolute;
        left: 21px;
        top: 116px;
        background-color: white;
        box-shadow: 0 0 3px rgba(0, 0, 0, .3);
        display: none;

        li {
            display: flex;
            align-items: center;
            border-bottom: 1px solid rgba(0, 0, 0, .3);
            cursor: pointer;

            .el-image {
                margin: 5px;
                width: 30px;
            }
        }

        li:hover {
            background-color: rgba(0, 0, 0, .05);
        }
    }

    .happy_content {
        height: 200px;
        overflow: auto;
    }

    .happy_content span {
        display: inline-block;
        width: 25px;
        height: 25px;
        text-align: center;
        line-height: 25px;
    }

    .happy_content span:hover {
        background-color: rgba(0, 0, 0, .2);
        cursor: pointer;
    }
}
</style>