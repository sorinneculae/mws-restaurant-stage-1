/*
  "grunt clean" removes the images directory
  "grunt responsive_images" re-processes images without removing the old ones
*/

module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // concat: {
    //     dist: {
    //       src: [
    //           'js/*.js'
    //       ],
    //       dest: 'js/production.js',
    //     }
    // },

    // uglify: {
    //   dev: {
    //       src: 'js/production.js',
    //       dest: 'js/production.min.js'
    //   }
    // },

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
          style: 'expanded'
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

      // scripts: {
      //   files: ['js/*.js'],
      //   tasks: ['concat', 'uglify'],
      //   options: {
      //     spawn: false,
      //   }
      // },

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
  grunt.registerTask('default', [/*'concat', 'uglify',*/ 'clean', 'mkdir', 'responsive_images', 'watch',]);

};