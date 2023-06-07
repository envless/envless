#!/usr/bin/env sh

if [[ -z "$1" ]]
  then
    echo "No argument supplied"
    yarn dev --filter=platform
  elif [[ $1 = "init" ]]; then
    yarn db:generate;
    yarn db:migrate;
    yarn db:seed;
    yarn dev --filter=platform;
  elif [[ $1 = "platform" ]]; then
    yarn dev --filter=platform;
  elif [[ $1 -eq "www" ]]; then
    yarn dev --filter=www;
  elif [[ $1 -eq "docs" ]]; then
    yarn dev --filter=docs;
  else 
    echo "Nothing."
fi
