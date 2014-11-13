"use strict";

var merge = require('mout/object/merge');

module.exports = function(grunt){

	grunt.initConfig({});

	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-wrapup');
	grunt.loadNpmTasks('grunt-wrapup-partition');
	grunt.loadNpmTasks('grunt-sass');

	var wrapupSite = {
		require: [
			'./js/app.js'
		],
		output: './js/build/app.build.js'
	};

	grunt.config('wrapup-amd.watch', merge(wrapupSite, {
		watch: true
	}));

	grunt.config('wrapup-amd.build', merge(wrapupSite, {
		compress: true
	}));

	var sassConfig = {
		files: [{
			src: './css/app.scss',
			dest: './css/app.css'
		}]
	};

	grunt.config('sass.watch-css', merge(sassConfig, {
		options: {sourceComments: 'normal'}
	}));

	grunt.config('sass.build', merge(sassConfig, {
		options: {outputStyle: 'compressed'}
	}));

	grunt.registerTask('build', [
		'wrapup-amd:build',
		'sass:build'
	]);

	grunt.config('watch.sass', {
		options: {atBegin: true},
		files: ['./css/**/*.scss'],
		tasks: ['sass:watch-css']
	});

	grunt.config('concurrent.dev', {
		tasks: ['wrapup-amd:watch', 'watch:sass'],
		options: {logConcurrentOutput: true}
	});

	grunt.registerTask('dev', ['concurrent:dev']);
}