#!/bin/bash
set -e
set -x

DIR="love-letter-server"
pushd $DIR >/dev/null

git pull
npm run build
pm2 restart ecosystem.json

popd >/dev/null
