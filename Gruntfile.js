module.exports = function (grunt) {
	"use strict";
	grunt.initConfig({
		exec: {
			webpack: 'webpack --watch &'
		},
		"http-server": {
			dev: {
				root: "./",
				port: 8000,
				host: "0.0.0.0",
				showDir: true,
				autoIndex: true,
				runInBackground: true
			}
		},
		watch: {
			reload: {
				files: ["dist/**"],
				options: {
					livereload: true
				}
			},
			css: {
				files: ["style.css"],
				options: {
					livereload: true
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-http-server');
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks('grunt-exec');

	grunt.registerTask("webpackWatch", ["exec:webpack"]);
	grunt.registerTask("default", ["http-server", "webpackWatch", "watch"]);
};