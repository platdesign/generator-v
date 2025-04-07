/**
 * Route definition
 *
 * @name 			<%- name %>
 * @project 	<%- project %>
 * @author 		<%- author %>
 * @since			<%- now %>
 */

'use strict';

import ViewComponent from './view/index.vue'

export const route = {
	path: '<%- name %>',
	component: ViewComponent,
	props: true,
	children: []
}
