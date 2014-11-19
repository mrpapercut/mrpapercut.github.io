"use strict";

var repoTemplate = require('../templates/repoTemplate');

var App = new Class({
	Implements: [Class.Binds],

	initialize: function() {
		this.header = $(document.body).getElement('header');
		this.nav    = this.header.getElement('nav');
		this.main   = $(document.body).getElement('main');
		this.footer = $(document.body).getElement('footer');

		this.onScroll();
		this.attach();

		this.loadRepositories();
	},

	attach: function() {
		this.attachScroller();
		this.attachNavigation();
	},

	attachScroller: function() {
		window.addEvents({
			'scroll': this.bound('onScroll'),
			'resize': this.bound('onScroll')
		});
	},

	onScroll: function(e) {
		var scrollY     = window.getScroll().y,
			sizeY       = window.getSize().y,
			scrollsizeY = window.getScrollSize().y;

		this.header.toggleClass('small', scrollY > 64);
		this.footer.toggleClass('show', parseInt(scrollY + sizeY, 10) > parseInt(scrollsizeY - 150, 10));
	},

	attachNavigation: function() {
		var self = this;

		this.nav.addEvent('click:relay(a)', function(e) {
			var id = this.get('href'),
				section = self.main.getElement(id),
				posY = section ? section.getPosition().y : 0,
				scrollFx = new Fx.Scroll(window);

			e.preventDefault();

			if (id === '#top') {
				scrollFx.toTop();
			} else {
				posY = (posY > 100) ? posY -= 60 : posY -= 90;
				scrollFx.start(0, posY);
			}
		});
	},

	loadRepositories: function() {
		var self = this;

		new Request.JSONP({
			url: 'https://api.github.com/users/mrpapercut/repos',
			method: 'GET',
			data: {
				sort: 'updated'
			},
			onComplete: self.bound('parseRepositories')
		}).send();
	},

	parseRepositories: function(res) {
		var repos = res.data,
			repoData = {},
			self = this;

		/*
		- description : "GamesCollection.nu site",
		- created_at : "2014-10-29T16:06:56Z",
		- html_url : "https://github.com/mrpapercut/gamescollection.nu",
		- language : "JavaScript",
		- name : "gamescollection.nu",
		- owner : {
				avatar_url : "https://avatars.githubusercontent.com/u/947626?v=3",
				url : "https://api.github.com/users/mrpapercut",
		- updated_at : "2014-11-18T18:03:34Z",
		*/

		if (typeof(repos) === 'object') {
			Array.each(repos, function(repo) {
				if (repo.fork === false) {
					// Repos overview
					repoData = {
						id: repo.id,
						description: repo.description,
						createDate: self.parseRepoDate(repo.created_at),
						url: repo.html_url,
						language: repo.language,
						name: repo.name,
						stars: repo.stargazers_count,
						owner: {
							avatar: repo.owner.avatar,
							url: repo.owner.url
						},
						lastModified: self.parseRepoDate(repo.updated_at)
					}

					repoTemplate(repoData).inject(self.main);

					// Menu
					var li = new Element('li'),
						a = new Element('a', {
							href: '#' + repo.id,
							title: repo.name,
							html: repo.name
						});

					li.adopt(a).inject(self.nav.getElement('ul'));
				}
			});
		}
	},

	parseRepoDate: function(data) {
		var d = new Date(data);

		return d.getFullYear() + '-'
		       + ('0' + parseInt(d.getMonth() + 1, 10)).substr(-2) + '-'
			   + ('0' + d.getDate()).substr(-2) + ' '
			   + ('0' + d.getHours()).substr(-2) + ':'
			   + ('0' + d.getMinutes()).substr(-2) + ':'
			   + ('0' + d.getSeconds()).substr(-2);
	}
});



window.addEvent('domready', function() {
	new App();
});