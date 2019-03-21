// See https://github.com/sindresorhus/grunt-shell
module.exports = function( grunt ) {
	return {
		makepot: {
			potFile: "languages/yoast-seo.pot",
			textdomain: "js-text-analysis",
			command: function() {
				var files;

				files = [ "src/**/*.js" ];
				files = grunt.file.expand( files );

				return "xgettext" +
					" --default-domain=<%= shell.makepot.textdomain %>" +
					" -o <%= shell.makepot.potFile %>" +
					" --package-version=<%= pkg.version %> --package-name=<%= pkg.name %>" +
					" --force-po" +
					" --from-code=UTF-8" +
					" --add-comments=\"translators: \"" +
					" --add-comments=\"Translators: \"" +
					" " + files.join( " " );
			},
		},
		"get-current-branch": {
			command: function() {
				const commands = [];

				if ( grunt.file.exists( "premium-configuration" ) ) {
					commands.push( "cd premium-configuration" );
					commands.push( "git branch | grep \\* | cut -d ' ' -f2" );
					commands.push( "cd .." );
				} else {
					commands.push( "git branch | grep \\* | cut -d ' ' -f2" );
				}

				return commands.join( "&&" );
			},
			options: {
				// eslint-disable-next-line handle-callback-err
				callback: function( err, stdout, stderr, cb ) {
					grunt.config.set( "currentBranch", stdout );

					cb();
				},
			},
		},
		"clone-premium-configuration": {
			command: function() {
				const commands = [];

				if ( ! grunt.file.exists( "premium-configuration" ) ) {
					let gitUrl = "git@github.com:Yoast/YoastSEO.js-premium-configuration.git";

					if ( process.env.CI ) {
						gitUrl = "https://github.com/Yoast/YoastSEO.js-premium-configuration.git";
					}

					commands.push( `git clone ${ gitUrl } premium-configuration` );
				}

				commands.push( "cd premium-configuration" );
				commands.push( "git fetch" );
				commands.push( "echo Done" );

				return commands.join( "&&" );
			},
		},
		// This command tries to get the same branch for the premium configuration as for YoastSEO.js.
		// This way changes to the configuration can be tested in conjunction with testing YoastSEO.js.
		"checkout-premium-configuration": {
			command: function() {
				const commands = [];
				let branch = grunt.config.get( "currentBranch" );

				if ( process.env.CI ) {
					if ( process.env.TRAVIS_PULL_REQUEST_BRANCH === "" ) {
						branch = process.env.TRAVIS_BRANCH;
					} else {
						branch = process.env.TRAVIS_PULL_REQUEST_BRANCH;
					}
				}

				// Whitespace within the commands results into unexpected tokens.
				branch = branch.trim();

				commands.push( "cd premium-configuration" );
				commands.push( "git checkout develop" );
				commands.push( `git checkout ${ branch }` );

				return commands.join( "&&" );
			},
			options: {
				failOnError: false,
			},
		},
		"pull-premium-configuration": {
			command: function() {
				const commands = [];

				commands.push( "cd premium-configuration" );
				commands.push( "git pull" );

				return commands.join( "&&" );
			},
		},
	};
};
