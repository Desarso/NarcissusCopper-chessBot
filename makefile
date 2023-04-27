#move docs to root and delete client

#run
run:
#get build from typescript
	mkdir -p client/docs
	git checkout typescript client/docs
#delete assets and index.html
	rm -rf assets
	rm -rf index.html
#copy docs to root
	cp -r client/docs/* .
