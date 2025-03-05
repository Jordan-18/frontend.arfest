import {onAccess} from '@/utils/Access';
import {isAuth} from '@/utils/isAuth';
import Table from './Table.vue'
import Form from './Form.vue'

export const route = 
[
    { 
        path: '/events', 
        component: Table,
        beforeEnter: [
            onAccess,
            isAuth
        ],
        meta: {
            title: 'Event',
            breadcrumb: 'Event',
        }
    },
    { 
        path: '/events/:id', 
        component: Form,
        beforeEnter: [
            isAuth
        ],
        meta: {
            title: 'Event detail',
            breadcrumb: 'detail',
        }
    },
]