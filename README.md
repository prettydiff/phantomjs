phantomjs-prebuilt
==================

1. (clone this repository)
2. `cd phantomjs`
3. `npm install`
4. `vim bin/phantomjs`    (modify the path to the config.json file)
5. add the phantomjs/bin to your path
   * vim ~/.bash_profile
   * for it is `export PATH=~/apache-maven-3.3.9/bin:~/phantomjs-prebuilt/bin:$PATH`
   * good now phantomjs is a global command in the terminal

## Run it:
   phantomjs ~/phantomjs/tests/homepage.js
