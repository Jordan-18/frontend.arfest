import * as Dashboard from '@/views/Contents/Dashboard/Route.js'
import * as Event from '@/views/Contents/Event/Route.js'
import * as Point from '@/views/Contents/Point/Route.js'
import * as Menu from '@/views/Contents/Menu/Route.js'
import * as Access from '@/views/Contents/Access/Route.js'
import * as JenisBusur from '@/views/Contents/JenisBusur/Route.js'
import * as Publisher from '@/views/Contents/Publisher/Route.js'
import * as User from '@/views/Contents/User/Route.js'

export const route = 
[
    ...Dashboard.route,
    ...Menu.route,
    ...Access.route,
    ...JenisBusur.route,
    ...Publisher.route,
    ...User.route,
    ...Point.route,
    ...Event.route,
]