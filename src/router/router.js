import page1 from '../component/page1.vue'
import page2 from '../component/page2.vue'
import child1 from '../component/child1.vue'
import child2 from '../component/child2.vue'
import VueRouter from 'vue-router'

const routes=[
    {path:'/page1',component:page1,children:[
        {path:'child1',component:child1},
        {path:'child2',component:child2}
    ]},
    {path:'/page2',component:page2}
]

const router=new VueRouter({routes})

export default router