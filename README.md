phantomjs-prebuilt
==================

1. (clone this repository)
2. `cd phantomjs`
3. `npm install`
4. `vim bin/phantomjs`    (modify the path to the config.json file)
5. open tests/banks.js and replace `/Users/echeney/` with your appropriate absolute paths to the two dependent files
6. add the phantomjs/bin to your path
   * vim ~/.bash_profile
   * for it is `export PATH=~/apache-maven-3.3.9/bin:~/phantomjs-prebuilt/bin:$PATH`
   * good now phantomjs is a global command in the terminal

## Run it:
   phantomjs ~/phantomjs/tests/homepage.js

## Advantages:

* Speed.  All operations are on the command line.  No waiting to open a browser.
* No build... it just runs immediately upon issuing the command.
* More stable... since there are no build artifacts to fail any breaking errors are *your* defects or changes to the site breaking your test.
* Better error messages
* The error messages are visually distinct from test failures
* A stopwatch is provided with each test result, so as scream about slow page loads
* Interact with the DOM directly using standard DOM methods. You can also return DOM objects from the page for evaluation.

## Dependencies:

* Node.js (just for installation, run time is completely independent)

## Lessons Learned:

* **You must provide error messaging**. Be very precise and explicit about throwing errors.  Phantom provides a great, short, and yet complete stacktrace, but the stacktrace is not logged by default.  You must specify this and issue an application kill (phantom.exit(1)).  Otherwise Phantom will silently hang awaiting further instructions.
* **Injected code is very limited** Execution of injected test logic is limited to modifying, interacting, and returning DOM nodes.  All other logic must occur in the test runner outside the page.  This code must be a string representing a function to be evaluated.  This is the only way to supply variables and closures into the injectable logic.

Example of injectable logic:

    page.evaluateJavaScript("function () {return document.getElementById(\"flight-errors\");}");
