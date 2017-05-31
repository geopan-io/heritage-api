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
    express: 'grunt-express-server'
  });

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig({
    // Project settings
    pkg: grunt.file.readJSON('package.json'),
    env: {
      options: {
        PORT: grunt.option('port') || 9000,
      },
      dev: {
        NODE_ENV: 'development'
      },
      prod: {
        NODE_ENV: 'production'
      }
    },
    express: {
      options: {
        port: process.env.PORT || 9000
      },
      dev: {
        options: {
          script: './server/app.js',
          debug: true
        }
      },
      prod: {
        options: {
          script: './server/app.js'
        }
      }
    },
    watch: {
      mochaTest: {
        files: ['./server/**/*.{spec,integration}.js'],
        tasks: ['env:test', 'mochaTest']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        files: [
          './server/{app,components}/**/!(*.spec|*.mock).js',
        ],
        options: {
          livereload: true
        }
      },
      express: {
        files: ['./server/**/*.{js,json}'],
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
        src: ['./server/**/!(*.spec|*.integration).js']
      },
      serverTest: {
        options: {
          jshintrc: '.jshintrc'
        },
        src: ['./server/**/*.{spec,integration}.js']
      }
    }

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

};
