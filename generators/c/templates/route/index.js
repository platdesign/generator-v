/**
 * Route definition
 *
 * @name 			<%- name %>
 * @project 	<%- project %>
 * @author 		<%- author %>
 * @since			<%- now %>
 */

'use strict';


let ctx = require.context('./routes', true, /^\.\/[^\/.]*\/index\.js$/);
let children = ctx.keys().map(m => ctx(m).default)


export default {

	path: '<%- name %>',

	name: '<%- name %>',

	// component: require('./view'),

	// components: {
	// 	default: require('./main'),
	// 	submenu: require('./submenu')
	// },



	props: true,

	children

}

