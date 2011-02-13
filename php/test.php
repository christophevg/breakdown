<?php

include_once dirname(__FILE__) . '/breakdown.php';

$input = <<<EOT
Introduction paragraph
# Heading 1
## Heading 2
Some text containing **bold** and *italic* parts, as well as [a link to my
website](http://christophe.vg) and another one : http://christophe.vg

And a second paragraph

---

## Bullets
* bullet 1
* bullet 2

And some more text in a second paragraph.

and this might be me ;-)

![Christophe VG](http://christophevg.github.com/christophe.vg/images/avatar.png)
EOT;

$converter = Breakdown::getConverter();
$output    = $converter->makeHtml($input);

echo $output;
