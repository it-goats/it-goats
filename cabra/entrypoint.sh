#!/bin/sh
set -e

npm install esbuild@0.14.29

exec "$@"