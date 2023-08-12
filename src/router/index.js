import { createRouter, createWebHashHistory } from 'vue-router'
// 引入ElMessage 
import { ElMessage  } from 'element-plus'
// 引入get方法
import { getData as _getdtl } from '@/func/index'

import LoginPage from '@/LoginPage'
import RegitPage from '@/RegitPage'
import HomePage from '@/HomePage'
import FindPage from '@/home/FindPage'
import MyMusic from '@/home/MyMusic'
import TuiJian from '@/home/find/TuiJian'
import TopList from '@/home/find/TopList'
import SongS from '@/home/find/SongS'
import AllSongS from '@/home/find/AllSongS'
import RecomMend from '@/home/find/RecomMend'
import MinePage from '@/home/MinePage'
import MineSet from '@/home/MineSet'
import DefltSet from '@/home/mineSet/DefltSet'
import CheckSongs from '@/home/CheckSongs'
import IdSet from '@/home/mineSet/IdSet'
import otherPage from '@/home/otherPage'
import musicList from '@/home/musicList'
import msgPage from '@/home/msgPage'
import msgList from '@/home/msg/msgList'
import msgInfo from '@/home/msg/msgInfo'
import sysMsg from '@/home/msg/sysMsg'
import followsPage from '@/home/followsPage'
import fensPage from '@/home/fensPage'
// import 
const routes = [
    {
        path: "/login",
        name: "LoginPage",
        component: LoginPage,
        meta: {
            title: '登录',
            transition: 'scale-slide'
        }
    }, {
        path: "/regit",
        name: "RegitPage",
        component: RegitPage,
        meta: {
            title: '注册',
            transition: 'scale-slide'
        }
    },
    {
        path: "/home",
        name: "HomePage",
        component: HomePage,
        redirect: '/find',
        meta: {
            title: '七语熙音乐馆'
        },
        children: [
            {
                path: "/find",
                name: "FindPage",
                component: FindPage,
                redirect: '/find/tuijian',
                children: [
                    {
                        path: "tuijian",
                        name: "TuiJian",
                        component: TuiJian
                    },
                    {
                        path: "toplist/:id",
                        name: "TopList",
                        component: TopList
                    },
                    {
                        path: "songs/:id",
                        name: "SongS",
                        component: SongS
                    },
                    {
                        path: "allsongs/:type/:limit",
                        name: "AllSongS",
                        component: AllSongS
                    },
                    {
                        path: "recommend",
                        name: "RecomMend",
                        component: RecomMend
                    }
                ]
            },
            {
                path: "/mymusic/:id",
                name: "MyMusic",
                component: MyMusic
            },
            {
                path: "/mine",
                name: "MinePage",
                component: MinePage
            },
            {
                path: "/other/:id",
                name: "otherPage",
                component: otherPage
            },
            {
                path: "/mineset",
                name: "MineSet",
                component: MineSet,
                redirect: '/mineset/defltset',
                children: [
                    {
                        path: "defltset",
                        name: "DefltSet",
                        component: DefltSet,
                    },
                    {
                        path: "idset",
                        name: "IdSet",
                        component: IdSet,
                    }
                ]
            },
            {
                path: "/check/:key",
                name: "CheckSongs",
                component: CheckSongs
            },
            {
                path: "/musiclist/:id",
                name: "musicList",
                component: musicList
            },
            {
                path: "/msg",
                name: "msgPage",
                component: msgPage,
                redirect: '/msglist',
                children: [
                    {
                        path: "/msglist",
                        name: "msgList",
                        component: msgList
                    }, {
                        path: "/msginfo/:user_id/:friend_id",
                        name: "msgInfo",
                        component: msgInfo
                    },
                    {
                        path: "/sysmsg",
                        name: "sysMsg",
                        component: sysMsg
                    }
                ]
            },
            {
                path: "/follows/:id",
                name: "followsPage",
                component: followsPage
            },
            {
                path: "/fens/:id",
                name: "fensPage",
                component: fensPage
            }
        ]
    },
    {
        path: "/",
        redirect: '/home'
    },
    // 404
    {
        path: "/:pathMatch(.*)",
        name: "errorPage",
        component: () => import('./../errorPage')
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

router.beforeEach((to, from, next) => {
    // 可通过的页面
    if (to.path.indexOf('/mine') > -1 || to.path.indexOf('/mymusic') > -1 || to.path.indexOf('/msglist') > -1 || to.path.indexOf('/mineset') > -1) {
        // 获取本地储存的token
        const token = _getdtl('token');
        if (!token) {
            // 提示
            ElMessage.error('请先登录~');
            setTimeout(() => {
                next('/login');
            }, 1000);
        } else {
            next();
        }
    } else {
        next()
    }

})

export default router