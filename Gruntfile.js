module.exports = function(grunt) {

  'use strict';

  grunt.initConfig({
    jshint: {
      files: ['Gruntfile.js', 'app.js', 'bin/www', 'db/*.js', 'utils/*.js', 'app/**/*.js'],
      options: {
        unused: true,
        maxdepth: 2,
        expr: true,
        node: true,
        eqeqeq: true,
        strict: true,
        undef: true
      }
    },
    mochaTest: {
      test: {
        src: ['test/**/*.js']
      }
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['jshint']);
  grunt.registerTask('test', ['mochaTest']);
  grunt.registerTask('build', ['jshint', 'mochaTest']);

};
