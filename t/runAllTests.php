<?php

include_once '../php/breakdown.php';

$tests = json_decode(join("\n", file("tests.json")), true);

$converter = Breakdown::getConverter();

$failed = 0;
foreach( $tests as $test ) {
  echo "Testing $test[label] from PHP\n";
  $result = $converter->makeHtml( $test['input'] );
  if( $test['expected'] != $result ) {
    echo "FAILED\n";
    echo "expected:\n-->$test[expected]<--\n" . 
         "got:\n-->$result<--\n";
    $failed++;
  }
}

if( $failed > 0 ) {
  echo $failed + " out of " + count($tests) + " failed.\n";
} else {
  echo "OK\n";
}
