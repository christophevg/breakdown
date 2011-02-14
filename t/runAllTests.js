load( "../js/breakdown.js" );

eval( "tests = " + readFile("tests.json") );

converter = new Breakdown.converter();

failed = 0;
for( var i=0; i<tests.length; i++ ) {
  print( "Testing " + tests[i].label + " from Javascript" );
  result = converter.makeHtml( tests[i].input );
  if( tests[i].expected != result ) {
    print( "FAILED" );
    print( "expected:\n-->" + tests[i].expected + "<--\n" + 
           "got:\n-->" + result + "<--" );
    failed++;
  }
}

if( failed > 0 ) {
  print( failed + " out of " + tests.length + " failed." );
} else {
  print( "OK" );
}
