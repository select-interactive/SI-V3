/*global module:false*/
module.exports = function( grunt ) {
    'use strict';

    // Project Configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON( 'package.json' ),

        // Autoprefixer
        autoprefixer: {
            dist: {
                files: {
                    'css/styles.css': 'css/styles.css'
                }
            }
        },

        // Before generating any new files, remove any previously-created files.
        clean: {
            tests: ['.tmp'],
        },

        // Compile compass to CSS
        compass: {
            dev: {
                options: {
                    cssDir: 'css',
                    debugInfo: false,
                    noLineComments: true,
                    outputStyle: 'expanded',
                    require: ['compass-placeholders', 'susy'],
                    sassDir: 'css/sass',
                    sourcemap: true
                }
            }
        },

        // Concat JS files into main.js
        concat: {
            jsUtil: {
                src: ['js/<%= pkg.appDir %>/src/*.js'],
                dest: 'js/<%= pkg.appDir %>/main.js'
            }
        },

        // Connect server for critical CSS
        connect: {
	        server: {
		        options: { 
                    base: '',
                    //keepalive: true,
			        port: 9010,
		        }
	        }
        },

        // Min CSS files
        cssmin: {
            minify: {
                expand: true,
                cwd: 'css/',
                src: ['*.css', '!*.min.css'],
                dest: 'css/',
                ext: '.min.css'
            },

            minCritical: {
                expand: true,
                cwd: '.tmp/',
                src: ['*.css', '!*.min.css'],
                dest: '.tmp/',
                ext: '.min.css'
            }
        },

        // Optimize images
        imagemin: {
            prod: {
                files: [
                    {
                        expand: true,
                        cwd: 'img/',
                        src: ['**/*.jpg', '**/*.png'],
                        dest: 'img'
                    }
                ],
                options: {
                    progressive: true
                }
            }
        },

        // Lint JS
        jshint: {
            all: [
                'Gruntfile.js',
                'js/<%= pkg.appDir %>/*.js',
                'js/<%= pkg.appDir %>/**/*.js',
                '!js/<%= pkg.appDir %>/main.js',
                '!js/<%= pkg.appDir %>/moduleTmpl.js',
                '!js/<%= pkg.appDir %>/build/*.js'
            ],
            options: {
                jshintrc: true
            }
        },

        // Get critical CSS
        penthouse: {
            testTask: {
                outfile: '.tmp/critical.css',
                css: 'css/styles.css',
                url: 'http://localhost:9010/critical.html',
                width: 1300,
                height: 900
            },
        },

        // Sass compilation
        sass: {
        	dist: {
        		files: {
        			'css/styles.css': 'css/sass/styles.scss'
        		}
        	}
        },

        // Min JS
        uglify: {
            prod: {
                files: grunt.file.expandMapping(['js/app/*.js'], 'js/app/build/', {
                    rename: function( destBase, destPath ) {
                        var fName = destPath.replace( '.js', '.min.js' );
                        fName = fName.substring( fName.indexOf( 'app/' ) + 4 );
                        fName = destBase + fName;
                        return fName;
                    }
                })
            }
        },

        // Convert images to .webp
        cwebp: {
            dynamic: {
                options: {
                    q: 80
                },
                files: [{
                    expand: true,
                    cwd: 'img/', 
                    src: ['**/*.{png,jpg}'],
                    dest: 'img/'
                }]
            }
        },

        // watch task
        watch: {
            sass: {
                files: [
                    'css/sass/*.scss', 
                    'css/sass/**/*.scss'
                ],
                tasks: ['sass', 'autoprefixer'],
                options: {
                    livereload: true
                }
            },

            jshint: {
                files: [
                    'Gruntfile.js',
                    'js/<%= pkg.appDir %>/*.js',
                    'js/<%= pkg.appDir %>/src/*.js',
                    '!js/<%= pkg.appDir %>/main.js'
                ],
                tasks: ['jshint', 'concat:jsUtil'],
                options: {
                    livereload: true
                }
            },

            dotnetfiles: {
                files: [
                    '*.aspx',
                    '*.vb',
                    '**/*.aspx',
                    '**/*.vb',
                    '**/**/*.aspx',
                    '**/**/*.vb',
                    'masterpages/*.master',
                    'controls/*.ascx',
                    'controls/**/*.ascx',
                    '*.ashx',
                    '/app_code/webservices/*.vb'
                ],
                options: {
                    livereload: true
                }
            }
        }
    });

    // Load Tasks
    grunt.loadNpmTasks( 'grunt-autoprefixer' );
    grunt.loadNpmTasks( 'grunt-contrib-concat' );
    grunt.loadNpmTasks( 'grunt-contrib-connect' );
    grunt.loadNpmTasks( 'grunt-contrib-cssmin' );
    grunt.loadNpmTasks( 'grunt-contrib-imagemin' );
    grunt.loadNpmTasks( 'grunt-contrib-jshint' );
    grunt.loadNpmTasks( 'grunt-contrib-uglify' );
    grunt.loadNpmTasks( 'grunt-contrib-watch' );
    grunt.loadNpmTasks( 'grunt-sass' );
    grunt.loadNpmTasks( 'grunt-cwebp' );
    grunt.loadNpmTasks( 'grunt-penthouse' );
    
    // Register Tasks
    grunt.registerTask( 'default', ['watch'] );
    grunt.registerTask( 'build', ['sass', 'autoprefixer', 'cssmin:minify', 'uglify', 'imagemin', 'connect', 'penthouse', 'cssmin:minCritical'] );
    grunt.registerTask( 'js', ['uglify'] );
    grunt.registerTask( 'css', ['sass', 'autoprefixer', 'cssmin:minify'] );
    grunt.registerTask( 'img', ['imagemin'] );
    grunt.registerTask( 'imgwebp', ['cwebp'] );
    grunt.registerTask( 'criticalCss', ['connect', 'penthouse', 'cssmin:minCritical'] );
    grunt.registerTask( 'serve', ['connect'] );
};