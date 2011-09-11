<style>
.demo {
  border: 1px solid red;
  display: inline-block;
}
</style>
    
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

Email addresses like somebody@somewhere.com are also automatically detected, 
but can also be enclosed by brackets: [somebody@somewhere.com].

[Links with spaces are cleaned up] ...

And a second paragraph.

Within a paragraph a double space  
at the end of a line  
is rendered as a soft-break  
like in this paragrah.

---

## Bullets
* bullet 1
* bullet 2
** Level 2
** More Level 2
* level 1 again

And some more text in a second paragraph.

## Images

This might be me ;-)

[image:http://christophevg.github.com/christophe.vg/images/avatar.png|Christophe VG]

even aligned ...

[image:http://christophevg.github.com/christophe.vg/images/avatar.png|right]

[image:http://christophevg.github.com/christophe.vg/images/avatar.png|Christophe VG]

and even with a link ...

[http://christophe.vg|[image:http://christophevg.github.com/christophe.vg/images/avatar.png]]

## styling blocks

[style:demo|Blocks of text can be styled with CSS.

There is no limit to what *you* _can_ do ;-)]

## Include support using Ajax

[include:include.php?c=1]
---
[include:include.php?c=2]
EOT;

$converter = Breakdown::getConverter();
$output    = $converter->makeHtml($input);

echo $output;
