/*
  "grunt clean" removes the images directory
  "grunt responsive_images" re-processes images without removing the old ones
*/

module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
      options: {
        separator: ';',
      },

      basic_and_extras: {
        files: {
          'js/production_main.js': ['js/dbhelper.js', 'js/main.js', 'js/init_service_worker.js'],
          'js/production_restaurant.js': ['js/dbhelper.js', 'js/restaurant_info.js', 'js/init_service_worker.js'],
        },
      },
    },

    babel: {
      options: {
        sourceMap: true,
        presets: ['env']
      },
      dist: {
        files: {
          'dist/production_main.js': 'js/production_main.js',
          'dist/production_restaurant.js': 'js/production_restaurant.js',
        }
      }
      // dist: {
      //   files: [{
      //     expand: true,
      //     src: ['js/production_main.js'],
      //     dest: 'dist/'
      //   }]
      // }
    },

    uglify: {
      options: {
        mangle: false
      },
      my_target: {
        files: {
          'dist/production_main.min.js': ['dist/production_main.js'],
          'dist/production_restaurant.min.js': ['dist/production_restaurant.js']
        }
      }
    },

    responsive_images: {
      dev: {
        options: {
          engine: 'im',
          sizes: [{
            name: 'small',
            width: 325,
            quality: 70
          },{
            name: 'medium',
            width: 500,
            quality: 70
          },{
            width: 800,
            quality: 70,
            rename: false
          }]
        },

        /*
        You don't need to change this part if you don't change
        the directory structure.
        */
        files: [{
          expand: true,
          src: ['*.{gif,jpg,png}'],
          cwd: 'img_src/',
          dest: 'img/'
        }]
      }
    },

    /* Clear out the images directory if it exists */
    clean: {
      dev: {
        src: ['img'],
      },
    },

    /* Generate the images directory if it is missing */
    mkdir: {
      dev: {
        options: {
          create: ['img']
        },
      },
    },

    sass: {
      dist: {
        options: {
          style: 'compressed'
        },
        files: {
          'css/styles.css': 'css/styles.scss'
        }
      }
    },

    watch: {
      options: {
        livereload: true,
      },

      scripts: {
        files: ['js/*.js'],
        tasks: ['concat', 'babel', 'uglify'],
        options: {
          spawn: false,
        }
      },

      css: {
        files: ['css/*.scss'],
        tasks: ['sass'],
        options: {
          spawn: false,
        }
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-responsive-images');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-mkdir');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('default', ['concat', 'babel', 'uglify', 'clean', 'mkdir', 'responsive_images', 'sass', 'watch']);

};