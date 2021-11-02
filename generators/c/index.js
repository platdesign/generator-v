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

		if (!this.pkg) {
			throw new Error('No package.json found');
		}
	}

	async prompting() {


		let defaultAuthor = input => {
			let pkga = input || this.pkg.author;

			if (typeof pkga === 'string') {
				return pkga;
			} else if (Array.isArray(pkga) && pkga.length >= 1) {
				return defaultAuthor(pkga[0]);
			} else if (pkga.name && pkga.email) {
				return `${pkga.name} <${pkga.email}>`;
			} else if (pkga.name) {
				return `${pkga.name}`;
			}
			return false;
		};



		this.props = await this.prompt([{
				type: 'list',
				name: 'type',
				message: 'Component type:',
				choices: ['component', 'route'],
				store: false
			},
			{
				type: 'input',
				name: 'name',
				message: 'Component name:',
				validate: input => Boolean(input)
			},
			{
				type: 'input',
				name: 'author',
				message: 'Author:',
				default: defaultAuthor(),
				validate: input => Boolean(input)
			}
		]);
	}

	async writing() {
		let now = moment().format('MMMM Do YYYY, h:mm:ss a');
		let author = this.pkg.author;

		// Create component directory
		mkdirp.sync(this.destinationPath(this.props.name));

		const tmplScope = {
			name: this.props.name,
			pkg: this.pkg,
			now: moment().format('MMMM Do YYYY, h:mm:ss a'),
			author: this.props.author,
			project: this.pkg.name
		};

		switch (this.props.type) {
			case 'component':

				// Index.vue
				this.fs.copyTpl(
					this.templatePath('component/index.vue'),
					this.destinationPath(`${this.props.name}/index.vue`),
					tmplScope
				);

				// Component.js
				this.fs.copyTpl(
					this.templatePath('component/component.js'),
					this.destinationPath(`${this.props.name}/component.js`),
					tmplScope
				);

				// Template.pug
				this.fs.copyTpl(
					this.templatePath('component/template.pug'),
					this.destinationPath(`${this.props.name}/template.pug`),
					tmplScope
				);

				// Style.scss
				this.fs.copyTpl(
					this.templatePath('component/style.scss'),
					this.destinationPath(`${this.props.name}/style.scss`),
					tmplScope
				);

				break;



			case 'route':

				// Index.js
				this.fs.copyTpl(
					this.templatePath('route/index.js'),
					this.destinationPath(`${this.props.name}/index.js`),
					tmplScope
				);

				// Mkdirp.sync(this.destinationPath(`${this.props.name}/routes`));

				break;
		}

		// This.fs.copy(
		// 	this.templatePath('dummyfile.txt'),
		// 	this.destinationPath('dummyfile.txt')
		// );
	}

	install() {

	}
};
