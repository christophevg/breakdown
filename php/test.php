<?php

include_once dirname(__FILE__) . '/breakdown.php';

$input = <<<EOT
Introduction paragraph
# Heading 1
## Heading 2
Some text containing **bold** and *italic* parts, as well as 
[http://christophe.vg|a link to my website] 
and another one [http://christophe.vg]
and even another one http://christophe.vg

And a second paragraph.

---

## Bullets
* bullet 1
* bullet 2

And some more text in a second paragraph.

and this might be me ;-)

[[http://christophevg.github.com/christophe.vg/images/avatar.png|Christophe VG]]

even twice ...

[[http://christophevg.github.com/christophe.vg/images/avatar.png]]

and even with a link ...

[http://christophe.vg|[[http://christophevg.github.com/christophe.vg/images/avatar.png]]]
EOT;

$converter = Breakdown::getConverter();
$output    = $converter->makeHtml($input);

echo $output;
