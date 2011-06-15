<?php

/**
* breakdown.php
* an ultra-light Markdown(-like) implementation
*
* See http://ithub.com/christophevg/breakdown for updates and license info
*/

class Breakdown {
  static function getConverter() {
    return new Breakdown();
  }

  // top-level exposed method to turn breakdown input into HTML
  public function makeHtml($input) {
    $this->initIncludes();
    $input = $this->prepareBlocks($input);
    $input = $this->escapeHtml($input);
    $input = $this->translateLines($input);
    $input = $this->translateInlines($input);
    $input = $this->addBlocks($input);
    $input = $this->cleanUp($input);
    $input = $this->activateIncludes($input);
    return $input;
  }

  // 2 or more newlines indicate an intended paragraph break
  private function prepareBlocks($input) {
    return "\n\n\n" . preg_replace( '/\n{2,}/', "\n\n\n", $input ) . "\n\n\n";
  }

  // raw HTML is not allowed, all tags are escaped
  private function escapeHtml($input) {
    $patterns     = array( '/</', '/>/' );
    $replacements = array( '&lt;', '&gt;' );
    return preg_replace( $patterns, $replacements, $input );
  }

  // headers, list items and horizontal rules are matched on a line basis
  private function translateLines($input) {
    $input = preg_replace_callback( '/^(#+)[ \t]*(.*)$/m', 
      create_function( '$matches',
                       '$num = strlen($matches[1]);' .
                       'return "\n\n\n<h$num>$matches[2]</h$num>\n\n\n";' 
                      ), 
      $input );
    $patterns     = array( '/^\*[ \t]*(.*)$/m', '/^---+$/m' );
    $replacements = array( '<li>\1</li>',        "\n\n\n<hr>\n\n\n" );
    return preg_replace( $patterns, $replacements, $input );
  }

  private $insertIncludeActivation = false;
  private $includeIndex = 0;

  private function initIncludes() {
    $this->insertIncludeActivation = false;
  }

  private function activateIncludes($input) {
    if( ! $this->insertIncludeActivation ) { return $input; }
    $input .= <<<EOT
<script>
  // create a XMLHTTP object
  function getXMLHTTP() {
    var xmlhttp;
    if( window.XMLHttpRequest ) {
      // code for IE7+, Firefox, Chrome, Opera, Safari
      xmlhttp = new XMLHttpRequest();
    } else if( window.ActiveXObject ) {
      // code for IE6, IE5
      xmlhttp = new ActiveXObject( "Microsoft.XMLHTTP" );
    } else {
      alert( "Your browser does not support XMLHTTP!" );
    }
    return xmlhttp;
  }

  // url to fetch content from a URL and pass it to a processing callback
  function fetch(url, callback) {
    var xmlhttp = getXMLHTTP();
    xmlhttp.open( "GET", url, true );
    xmlhttp.onreadystatechange = function() {
      if( xmlhttp.readyState  == 4 ) {
        if( xmlhttp.status == 200 ) {
          callback( xmlhttp.responseText );
        } else {
          callback();
        }
      }
    };
    xmlhttp.send(null);
  }

  for( var index=0; index<includeFunctions.length; index++ ) {
    includeFunctions[index]();
  }
</script>
EOT;
    return "<script>var includeFunctions = [];</script>\n\n$input";
  }

  private function insertInclude($matches) {
    $this->insertIncludeActivation = true;
    $this->includeIndex++;
    $id = "_include_{$this->includeIndex}";
    $url = $matches[1];

    return <<<EOT
<span id="$id"></span>
<script>
  includeFunctions.push( function() {
    fetch( '$url', function(responseText) {
      if( ! responseText ) {
        responseText = '<span class="bd-error">failed to include $url</span>';
      }
      document.getElementById('$id').innerHTML = responseText;
    } );
  } );
</script>
EOT;
  }

  // bold, italic, images and links can appear anywhere in-line the text
  private function translateInlines($input) {
    // include support
    $input = preg_replace_callback( '/\[include:([^\]]+)\]/',
                                    array( $this, 'insertInclude' ),
                                    $input );
    // other inlines
    $patterns     = array( '/\*\*([^\*]+)\*\*/',
                           '/\*([^\*]+)\*/',
                           '/\[\[([^\|\]]+)\|([^\]]+)\]\]/',
                           '/\[\[([^\]]+)\]\]/',
                           '/\[([^\|\]]+)\|([^\]]+)\]/',
                           '/\[([^\]]+)\]/',
                           '/([^">])(http:\/\/[a-zA-Z.]+)/' );
    $replacements = array( '<b>\1</b>',
                           '<i>\1</i>',
                           '<img src="\1" alt="\2">',
                           '<img src="\1">',
                           '<a href="\1">\2</a>',
                           '<a href="\1">\1</a>',
                           '\1<a href="\2">\2</a>' );
    return preg_replace( $patterns, $replacements, $input );
  }
  
  // detect blocks (based on 3 or more newlines)
  private function addBlocks($input) {
    $blocks = preg_split( '/\n{3,}/', $input );
    $output = "";
    foreach( $blocks as $block ) {
      $output .= "\n\n\n" . $this->generateBlock($block) . "\n\n\n";
    }
    return $output;
  }

  // reduce the number of newlines
  private function cleanUp($body) {
    return preg_replace( '/\n{2,}/', "\n\n", $body );
  }

  // helper function to generate blocks of HTML
  // blocks starting with a header or horizontal line are left untouched,
  // blocks starting with a list item are wrapped in an unnumbered list,
  // all other blocks are paragraphs and wrapped in paragraph tags
  function generateBlock($body) {
    if( preg_match( '/^[ \t]*$/', $body ) ||
        preg_match( '/^(<h[1-6]+|<hr>|<span|<script)/', $body ) )
    {
      return $body;
    } else if( preg_match( '/^<li>/', $body ) ) {
      return "<ul>\n$body\n</ul>";
    } else {
      return "<p>$body</p>";
    }
  }
}
