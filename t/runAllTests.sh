# !/bin/bash

: ${PHP:=`which php`}
: ${JAVA:=`which java`}
: ${RHINO:="js.jar"}

# run Javascript tests
${JAVA} -jar ${RHINO} runAllTests.js
${PHP} -f runAllTests.php
