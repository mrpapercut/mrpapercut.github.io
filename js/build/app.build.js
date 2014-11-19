(function () {
    var modules = {}, cache = {};
    if (typeof define == 'undefined') {
        window.define = function (id, factory) {
            modules[id] = factory;
        };
        window.require = function (id) {
            var module = cache[id];
            if (!module) {
                module = cache[id] = {};
                var exports = module.exports = {};
                modules[id].call(exports, require, exports, module);
            }
            return module.exports;
        };
    }
}());
define('js/app', function (require, exports, module) {
    'use strict';
    var repoTemplate = require('templates/repoTemplate');
    var App = new Class({
            Implements: [Class.Binds],
            initialize: function () {
                this.header = $(document.body).getElement('header');
                this.nav = this.header.getElement('nav');
                this.main = $(document.body).getElement('main');
                this.footer = $(document.body).getElement('footer');
                this.onScroll();
                this.attach();
                this.loadRepositories();
            },
            attach: function () {
                this.attachScroller();
                this.attachNavigation();
            },
            attachScroller: function () {
                window.addEvents({
                    'scroll': this.bound('onScroll'),
                    'resize': this.bound('onScroll')
                });
            },
            onScroll: function (e) {
                var scrollY = window.getScroll().y, sizeY = window.getSize().y, scrollsizeY = window.getScrollSize().y;
                this.header.toggleClass('small', scrollY > 64);
                this.footer.toggleClass('show', parseInt(scrollY + sizeY, 10) > parseInt(scrollsizeY - 150, 10));
            },
            attachNavigation: function () {
                var self = this;
                this.nav.addEvent('click:relay(a)', function (e) {
                    var id = this.get('href'), section = self.main.getElement(id), posY = section ? section.getPosition().y : 0, scrollFx = new Fx.Scroll(window);
                    e.preventDefault();
                    if (id === '#top') {
                        scrollFx.toTop();
                    } else {
                        posY = posY > 100 ? posY -= 60 : posY -= 90;
                        scrollFx.start(0, posY);
                    }
                });
            },
            loadRepositories: function () {
                var self = this;
                new Request.JSONP({
                    url: 'https://api.github.com/users/mrpapercut/repos',
                    method: 'GET',
                    data: { sort: 'updated' },
                    onComplete: self.bound('parseRepositories')
                }).send();
            },
            parseRepositories: function (res) {
                var repos = res.data, repoData = {}, self = this;
                if (typeof repos === 'object') {
                    Array.each(repos, function (repo) {
                        if (repo.fork === false) {
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
                            };
                            repoTemplate(repoData).inject(self.main);
                            var li = new Element('li'), a = new Element('a', {
                                    href: '#' + repo.id,
                                    title: repo.name,
                                    html: repo.name
                                });
                            li.adopt(a).inject(self.nav.getElement('ul'));
                        }
                    });
                }
            },
            parseRepoDate: function (data) {
                var d = new Date(data);
                return d.getFullYear() + '-' + ('0' + parseInt(d.getMonth() + 1, 10)).substr(-2) + '-' + ('0' + d.getDate()).substr(-2) + ' ' + ('0' + d.getHours()).substr(-2) + ':' + ('0' + d.getMinutes()).substr(-2) + ':' + ('0' + d.getSeconds()).substr(-2);
            }
        });
    window.addEvent('domready', function () {
        new App();
    });
});
define('templates/repoTemplate', function (require, exports, module) {
    'use strict';
    module.exports = function (data) {
        var template = '<section id="{id}">';
        template += '\t<h2><a href="{url}">{name}</a><span class="language">({language})</h2>';
        template += '\t<p class="description">{description}</p>';
        template += '\t<p class="dates">';
        template += '\t\t<span>Created: <strong>{createDate}</strong></span>';
        template += '\t\t<span>Last modified: <strong>{lastModified}</strong></span>';
        template += '\t</p>';
        template += '</section>';
        return Elements.from(template.substitute(data));
    };
});