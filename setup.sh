#!/bin/bash

echo ''
echo '=======  Setting up languages & tools ========'
echo ''

asdf plugin-add python
asdf plugin-add nodejs
asdf plugin-add poetry https://github.com/asdf-community/asdf-poetry.git

asdf install

## Configure mookme

echo ''
echo '=======  Setting up mookme - select pre-commit and proceed ========'
echo ''

npm install
npx mookme init --only-hook

echo ''
echo '=======  Setting up bode ========'
echo ''

cd bode
poetry config virtualenvs.in-project true
poetry install

echo ''
echo '=======  Setting up cabra ========'
echo ''

cd ../cabra

npm install

cd ..

echo ''
echo '=======  Starting the project ========'
echo ''


if command -v docker-compose &> /dev/null
then
    docker-compose up --build
else
    docker compose up --build
fi


