// 导入组件
import Vue from 'vue';
import Router from 'vue-router';
// 登录
import login from '@/views/login';
// 首页
import index from '@/views/index';
/**
 * 基础菜单
 */
import User from '@/views/user/user';
import Postion from '@/views/postion/Postion';
import Company from '@/views/company/Company';
import Verify from '@/views/verify/Verify';




// 启用路由
Vue.use(Router);

// 导出路由 
export default new Router({
    routes:
     [
         {
            path: '/',
            name: '',
            component: login,
            hidden: true,
            meta: {
                requireAuth: false
            }
        }, 
        {
            path: '/login',
            name: '登录',
            component: login,
            hidden: true,
            meta: {
                requireAuth: false
            }
         },
          {
            path: '/index',
            name: '首页',
            component: index,
            iconCls: 'el-icon-tickets',
            children: 
            [   
                {
                    path: '/user/user',
                    name: '用户管理',
                    component: User,
                    meta: {
                        requireAuth: true
                    }
                },
                {
                    path: '/postion/Postion',
                    name: '职位管理',
                    component: Postion,
                    meta: {
                        requireAuth: true
                    }
                },
                {
                    path: '/company/Company',
                    name: '公司管理',
                    component: Company,
                    meta: {
                        requireAuth: true
                    }
                },
                {
                    path: '/verify/Verify',
                    name: '认证管理',
                    component: Verify,
                    meta: {
                        requireAuth: true
                    }
                }
            ]
    }]
})