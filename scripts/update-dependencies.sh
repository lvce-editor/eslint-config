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
  OUTPUT=$(ncu -u -x @types/node -x lerna -x @babel/preset-typescript)
  SUB='All dependencies match the latest package versions'
  if [[ "$OUTPUT" == *"$SUB"* ]]; then
    echo "$OUTPUT"
  else
    rm -rf node_modules package-lock.json dist
    npm install
  fi
}

updateDependencies

for PACKAGE_JSON in packages/*/package.json; do
  PACKAGE_DIR=${PACKAGE_JSON%/package.json}
  (
    cd "$PACKAGE_DIR"
    updateDependencies
  )
done


echo "Great Success!"

sleep 2
