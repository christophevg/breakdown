<?php

switch( $_GET['c'] ) {
  case 1:
    print <<<EOT
<h1>Some included HTML</h1>

<p>This content has been dynamically included.</p>
EOT;
    break;
  case 2:
    print <<<EOT
<h1>Some More included HTML</h1>

<p>This content has also been dynamically included.</p>
EOT;
    break;
}
