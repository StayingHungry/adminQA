import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import Table from './views/nav1/Table.vue'
import Form from './views/nav1/Form.vue'
import user from './views/nav1/user.vue'
import ListDataCon from './views/nav1/ListDataCon.vue'
import InsertOneDocument from './views/nav2/InsertOneDocument.vue'
import NewTable from './views/nav2/NewTable.vue'
import Page6 from './views/nav3/Page6.vue'
import DataMake from './views/nav2/DataMake.vue'
import IndexNav from './views/index_nav/IndexNav.vue'
import echarts from './views/charts/echarts.vue'

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    // { path: '/main', component: Main },

    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'fa fa-institution',
        leaf: true,//只有一个节点
        children: [
            { path: '/indexNav', component: IndexNav, name: '导航' }
        ]
    },

    {
        path: '/',
        component: Home,
        name: '自动化',
        iconCls: 'fa fa-automobile',//图标样式class
        children: [
            { path: '/main', component: Main, name: '主页', hidden: true },
            { path: '/table', component: Table, name: 'Table' },
            { path: '/form', component: Form, name: 'Form' },
            { path: '/user', component: user, name: '列表' },
            { path: '/listDataCon', component: ListDataCon, name: '构造列表'}
        ]
    },
    {
        path: '/',
        component: Home,
        name: '数据构造',
        iconCls: 'fa fa-id-card-o',
        children: [
            { path: '/insertOne', component: InsertOneDocument, name: '单条数据' },
            { path: '/dataMake', component: DataMake, name: '循环创建'},
            { path: '/newCol', component: NewTable, name: '新表创建' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'fa fa-address-card',
        leaf: true,//只有一个节点
        children: [
            { path: '/page6', component: Page6, name: '标注平台' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '数据统计',
        iconCls: 'fa fa-bar-chart',
        children: [
            { path: '/echarts', component: echarts, name: '云效数据' }
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;