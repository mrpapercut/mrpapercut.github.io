"use strict";

var App = new Class({
	Implements: [Class.Binds],

	initialize: function() {
		this.header = $(document.body).getElement('header');
		this.nav    = this.header.getElement('nav');
		this.main   = $(document.body).getElement('main');
		this.footer = $(document.body).getElement('footer');

		this.onScroll();
		this.attach();
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
	}
});



window.addEvent('domready', function() {
	new App();
});