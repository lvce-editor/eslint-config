#!/bin/bash

set -e

cd "$(dirname "$0")"
cd ..

command_exists(){
  command -v "$1" &> /dev/null
}

if ! command_exists "ncu"; then
    echo "npm-check-updates is not installed"
    npm i -g npm-check-updates
else
    echo "ncu is installed"
fi

function updateDependencies {
  echo "updating dependencies in $(pwd)..."
  ncu -u -x @types/node -x @babel/preset-typescript
}

updateDependencies

for PACKAGE_JSON in packages/*/package.json; do
  PACKAGE_DIR=${PACKAGE_JSON%/package.json}
  (
    cd "$PACKAGE_DIR"
    updateDependencies
  )
done

npm install

echo "Great Success!"

sleep 2
