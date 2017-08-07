'use strict';


const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const mkdirp = require('mkdirp');
const path = require('path');
const moment = require('moment');
const pkgFinder = require('find-package-json');


module.exports = class extends Generator {

	constructor() {
		super(...arguments);

		this.pkg = pkgFinder(this.destinationPath()).next().value;
	}

	async prompting() {

		let defaultAuthor = (input) => {

			let pkga = input || this.pkg.author;

			if(typeof pkga === 'string') {
				return pkga;
			} else if(Array.isArray(pkga) && pkga.length >= 1) {
				return defaultAuthor(pkga[0]);
			} else if(pkga.name && pkga.email) {
				return `${pkga.name} <${pkga.email}>`;
			} else if(pkga.name) {
				return `${pkga.name}`;
			} else {
				return false;
			}

		};




		this.props = await this.prompt([
			{
				type: 'list',
				name: 'type',
				message: 'Component type:',
				choices: ['component', 'view'],
				store: false
			},
			{
				type: 'input',
				name: 'name',
				message: 'Component name:',
				validate: input => !!input
			},
			{
				type: 'input',
				name: 'author',
				message: 'Author:',
				default: defaultAuthor(),
				validate: input => !!input
			},
		]);

	}

	async writing() {

		let now = moment().format('MMMM Do YYYY, h:mm:ss a');
		let author = this.pkg.author;

		// create component directory
		mkdirp.sync(this.destinationPath(this.props.name));


		const tmplScope = {
			name: this.props.name,
			pkg: this.pkg,
			now: moment().format('MMMM Do YYYY, h:mm:ss a'),
			author: this.props.author,
			project: this.pkg.name
		};


		switch(this.props.type) {
			case 'component':

				// index.vue
				this.fs.copyTpl(
					this.templatePath('component/index.vue'),
					this.destinationPath(`${this.props.name}/index.vue`),
					tmplScope
				);

				// component.js
				this.fs.copyTpl(
					this.templatePath('component/component.js'),
					this.destinationPath(`${this.props.name}/component.js`),
					tmplScope
				);

				// template.pug
				this.fs.copyTpl(
					this.templatePath('component/template.pug'),
					this.destinationPath(`${this.props.name}/template.pug`),
					tmplScope
				);

				// style.scss
				this.fs.copyTpl(
					this.templatePath('component/style.scss'),
					this.destinationPath(`${this.props.name}/style.scss`),
					tmplScope
				);

			break;

			case 'view':

				// index.vue
				this.fs.copyTpl(
					this.templatePath('view/index.vue'),
					this.destinationPath(`${this.props.name}/index.vue`),
					tmplScope
				);

				// component.js
				this.fs.copyTpl(
					this.templatePath('view/component.js'),
					this.destinationPath(`${this.props.name}/component.js`),
					tmplScope
				);

				// template.pug
				this.fs.copyTpl(
					this.templatePath('view/template.pug'),
					this.destinationPath(`${this.props.name}/template.pug`),
					tmplScope
				);

				// style.scss
				this.fs.copyTpl(
					this.templatePath('view/style.scss'),
					this.destinationPath(`${this.props.name}/style.scss`),
					tmplScope
				);

				// create folder for subviews
				mkdirp.sync(this.destinationPath(`${this.props.name}/views`));

			break;
		}

		// this.fs.copy(
		// 	this.templatePath('dummyfile.txt'),
		// 	this.destinationPath('dummyfile.txt')
		// );
	}

	install() {

	}
};
