#!/bin/bash

npm install
mkdir -p ./{cache,public/{assets,pages},temp}
node app/engine/PageGen
forever start --spinSleepTime 10000 Server