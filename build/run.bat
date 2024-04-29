echo "Start for build"

cd ./build
rm -rf build.zip
CALL npm install --omit=dev
zip -r build.zip ../ -x @build-ignore.lst
CALL npm install -D

exit