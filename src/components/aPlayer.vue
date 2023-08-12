<template>
    <div id="aplayer" @mouseover="enter" @mouseleave="leave"></div>
</template>
<script>
export default {
    name: 'aPlayer'
}
</script>
<script setup>
import 'aplayer/dist/APlayer.min.css';
import APlayer from 'aplayer';
import { ref, onMounted, toRefs, watch, getCurrentInstance } from 'vue'
import Qs from 'qs'
import { ElMessage } from 'element-plus';
import { setData as _setdtl, getData as _getdtl } from '@/func/index'
const props = defineProps({
    audio: {
        type: String || Array
    }
})
const { proxy } = getCurrentInstance();
const emit = defineEmits(['toMusic_id']);
// 播放
onMounted(() => {
    addMyAudio();
})

const { audio } = toRefs(props);

// 当前播放的音乐
const play_audio = ref()
// 播放并创建
let ap;
const addMyAudio = () => {
    ap = new APlayer({
        container: document.getElementById("aplayer"),
        audio: _getdtl('play_list') ? _getdtl('play_list') : [],
        fixed: true,                //是否附着页面底部，否为false
        autoplay: false,             //是否自动播放，否为false,移动端不能生效
        volume: 0.6,                //初始音量（0~1）
        lrcType: 3,                 //歌词模式（1、HTML模式 2、js模式 3、lrc文件模式）
        mutex: true,                //互斥模式：阻止多个播放器同时播放，当前播放器播放时暂停其他播放器
        order: 'list',            //音频循环顺序（'list'：顺序, 'random'：随机）
        preload: 'none',            //预加载（'none'：不预加载, 'metadata'：元数据, 'auto'：自动）
        listFolded: false,          //列表默认折叠，开启为true
        theme: '#C72222',          //主题颜色
    })

    // 当前选中的音乐id
    let music_id;
    // 获取默认播放索引
    if (!!_getdtl('play_id')) {
        music_id = _getdtl('play_id');
        for (var i = 0; i < ap.list.audios.length; i++) {
            if (_getdtl('play_id') == ap.list.audios[i].song_id) {
                ap.list.switch(i);
                break;
            }
        }
    }

    // 选中时返回音乐id
    ap.on('listswitch', function (n) {
        // 获取到选中的音乐id
        music_id = ap.list.audios[n.index].song_id;
    })

    // 定时器
    let time;
    // 音乐播放
    ap.on('play', function () {
        // 储存音乐id
        _setdtl('play_id', music_id);
        // 传递个父元素
        emit('toMusic_id', music_id);
        // 清除定时器
        clearTimeout(time);
        // 五秒后加入播放记录,并且听取量加一
        time = setTimeout(() => {
            set_histroy(music_id);
            // 音乐听取了加一
            hear_func(music_id);
            // 清除定时器
            clearTimeout(time);
        }, 10000);
    })

    // 音乐暂停
    ap.on('pause', function () {
        // 传递个父元素
        emit('toMusic_id', null);
        // 清除定时器
        clearTimeout(time);
    })
}

// 监听audio变化
watch(() => audio.value, (val) => {
    // console.log(val)
    if (val.type == 'play') {
        if (val.list_id != null) {
            if (val.table == 'recomment') {
                // 获取歌曲列表
                getMusic_list_id(val.list_id, 'getMusic_recomment_kh');
            } else if (val.table == 'toplist') {
                // 获取歌曲列表
                getMusic_list_id(val.list_id, 'getMusic_toplist');
            } else if (val.table == 'collect') {
                // 获取歌曲列表
                getMusic_list_id(val.list_id, 'get_collect_song');
            }
        } else {
            // 获取音乐
            get_music(val.id, (index) => {
                ap.list.switch(index);
                ap.play();
            });
        }
    } else {
        if (val.list_id != null) {
            // console.log(val.table)
            if (val.table == 'recomment') {
                // 获取歌曲列表
                getMusic_list_id(val.list_id, 'getMusic_recomment_kh');
            } else if (val.table == 'toplist') {
                // 获取歌曲列表
                getMusic_list_id(val.list_id, 'getMusic_toplist');
            } else if (val.table == 'collect') {
                // 获取歌曲列表
                getMusic_list_id(val.list_id, 'get_collect_song');
            }
        } else {
            // 获取音乐
            get_music(val.id, (index, n) => {
                // console.log(n)
                n ? ElMessage.success('添加成功~') : ElMessage.warning('已存在~');
            });
        }
    }
})

// 查询音乐
const get_music = (music_id, callback) => {
    proxy.$axios.post('/getMusic_song.php',
        Qs.stringify({
            music_id
        })
    ).then((res) => {
        if (res.data.code == 1) {
            play_audio.value = res.data.data[0];
            // 判断是否存在该音乐
            let isIn = false;
            // 索引
            let index = null;
            for (let i = 0; i < ap.list.audios.length; i++) {
                if (play_audio.value.id == ap.list.audios[i].song_id) {
                    isIn = true;
                    index = i;
                    break;
                }

            }
            if (!isIn) {
                ap.list.add({
                    song_id: play_audio.value.id,
                    url: play_audio.value.audio,
                    name: play_audio.value.song_name,
                    artist: play_audio.value.songer,
                    lrc: play_audio.value.lrc,
                    cover: play_audio.value.baner_img
                })
                // 保存至本地
                _setdtl('play_list', ap.list.audios);
            }
            // 是否存在
            if (index != null) {
                callback && callback(index);
            } else {
                callback && callback(ap.list.audios.length - 1, 1);
            }
        }
    }).catch((err) => {
        console.log(err);
    })
}

// 查询表中的音乐
const getMusic_list_id = (type, api) => {
    let data = Qs.stringify({
        type
    });
    if (audio.value.table == 'collect') {
        data = Qs.stringify({
            id: type
        });
    }
    proxy.$axios.post('/' + api + '.php', data)
        .then((res) => {
            // console.log(res)
            if (res.data.code == 1) {
                if(res.data.total==0){
                    ElMessage.warning('暂无歌曲~');
                    return;
                }
                // 模式不同对应不同的方法
                if (audio.value.type == 'play') {
                    func_play(res.data.data);
                } else {
                    func_add(res.data.data);
                }
            }
        }).catch((err) => {
            console.log(err);
        })
}

// 获取播放列表后的操作
const func_play = (data) => {
    ap.list.clear();
    data.forEach(val => {
        ap.list.add({
            song_id: val.music_id,
            url: val.audio,
            name: val.song_name,
            artist: val.songer,
            lrc: val.lrc,
            cover: val.baner_img
        })
    });
    // 保存至本地
    _setdtl('play_list', ap.list.audios);
    // 获取音乐
    get_music(ap.list.audios[0].song_id, () => {
        ap.list.switch(0);
        ap.play();
    });
}

// 获取添加列表后的操作
const func_add = (data) => {
    var isto = true;
    for (var i = 0; i < data.length; i++) {
        let isIn = false;
        for (var j = 0; j < ap.list.audios.length; j++) {
            if (data[i].music_id == ap.list.audios[j].song_id) {
                isIn = true;
                break;
            }
        }
        if (!isIn) {
            isto = false;
            ap.list.add({
                song_id: data[i].music_id,
                url: data[i].audio,
                name: data[i].song_name,
                artist: data[i].songer,
                lrc: data[i].lrc,
                cover: data[i].baner_img
            })
        }
    }
    // console.log(isto)
    if (!isto) {
        // 保存至本地
        _setdtl('play_list', ap.list.audios);
        ElMessage.success('添加成功~');
    } else {
        ElMessage.warning('已存在~')
    }
}

// 添加历史记录
const set_histroy = (music_id) => {
    proxy.$axios.post('/add_histroy.php',
        Qs.stringify({
            token: _getdtl('token'),
            music_id
        })
    ).then((res) => {
        // if(res.data.code == 1){
        //     console.log(res)
        // }
    }).catch((err) => {
        console.log(err);
    })
}

// 音乐听取数量加一
const hear_func = (music_id) => {
    proxy.$axios.post('/update_music_hear.php',
        Qs.stringify({
            music_id
        })
    ).then((res) => {
        // if(res.data.code == 1){
        //     console.log(res)
        // }
    }).catch((err) => {
        console.log(err);
    })
}

</script>
<style  lang='less' scope>
.aplayer-body {
    width: 100% !important;

    .aplayer-lrc{
        height: 60px;
    }
}
</style>
