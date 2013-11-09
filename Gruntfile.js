module.exports = function(grunt) {
    
    // Project configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        compress: {
            main: {
                options: {
                    archive: './bin/CodeMirror_Release.zip',
                    mode: 'zip'
                },
                cwd: 'src',
                expand: true,
                src: ['**/*'],
                dest: '.'
            }
        }
    });
    
    // Load the compress plugin
    grunt.loadNpmTasks('grunt-contrib-compress');
    
    // Default
    grunt.registerTask('default', ['compress']);
};