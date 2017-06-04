'use strict';

module.exports = function(grunt) {
  var localConfig;
  try {
    localConfig = require('./server/config/local.env');
  } catch (e) {
    localConfig = {};
  }

  // Load grunt tasks automatically, when needed
  require('jit-grunt')(grunt, {
    express: 'grunt-express-server',
    copy: 'grunt-contrib-copy'
  });

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig({
    // Project settings
    pkg: grunt.file.readJSON('package.json'),

    path: {
      // configurable paths
      server: 'server',
      dist: 'dist'
    },

    env: {
      options: {
        PORT: grunt.option('port') || 9000,
      },
      dev: {
        NODE_ENV: 'development'
      },
      prod: {
        NODE_ENV: 'production'
      },
      all: localConfig
    },
    express: {
      options: {
        port: process.env.PORT || 9000
      },
      dev: {
        options: {
          script: '<%= path.server %>',
          debug: true
        }
      },
      prod: {
        options: {
          script: '<%= path.dist %>/<%= path.server %>'
        }
      }
    },
    watch: {
      mochaTest: {
        files: ['<%= path.server %>/**/*.{spec,integration}.js'],
        tasks: ['env:test', 'mochaTest']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        files: [
          '<%= path.server %>/{app,components}/**/!(*.spec|*.mock).js',
        ],
        options: {
          livereload: true
        }
      },
      express: {
        files: ['<%= path.server %>/**/*.{js,json}'],
        tasks: ['express:dev', 'wait'],
        options: {
          livereload: true,
          spawn: false //Without this option specified express won't be reloaded
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: 'jshintrc',
        reporter: require('jshint-stylish')
      },
      server: {
        options: {
          jshintrc: 'jshintrc'
        },
        src: ['<%= path.server %>/**/!(*.spec|*.integration).js']
      },
      serverTest: {
        options: {
          jshintrc: '.jshintrc'
        },
        src: ['<%= path.server %>/**/*.{spec,integration}.js']
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= path.dist %>'
          ]
        }]
      },
      server: '.tmp'
    },

    copy: {
      dist: {
        expand: true,
        src: '<%= path.server %>/**/*',
        dest: '<%= path.dist %>',
      },
    },

  });

  // Used for delaying livereload until after server has restarted
  grunt.registerTask('wait', function() {
    grunt.log.ok('Waiting for server reload...');

    var done = this.async();

    setTimeout(function() {
      grunt.log.writeln('Done waiting!');
      done();
    }, 1500);
  });

  grunt.registerTask('express-keepalive', 'Keep grunt running', function() {
    this.async();
  });

  grunt.registerTask('serve', function(target) {

    if (target === 'debug') {
      return grunt.task.run([
        'env:all',
      ]);
    }

    grunt.task.run([
      'env:all',
      'env:dev',
      'express:dev',
      'wait',
      'watch'
    ]);
  });

  grunt.registerTask('server', function() {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve']);
  });

  grunt.registerTask('build', function() {

    grunt.task.run([
      'env:all',
      'env:prod',
      'copy:dist'
    ]);

  });

};
