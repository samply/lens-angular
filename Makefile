##
# Samply Lens
#
# @file
# @version 0.1

# chose between: core/components/auth
LIBRARY_MODULE?=core
# This will start a continuously running build of one library module
dev: package.json
	npm run watch @samply/lens-${LIBRARY_MODULE}
# This will deploy the module to your local registry so you can use it in other projects
deploy: dist/samply/lens-${LIBRARY_MODULE}
	cd dist/samply/lens-${LIBRARY_MODULE}
	npm link
	cd ../../../
# end
