/**
 * breakdown.js
 * an ultra-light Markdown(-like) implementation
 *
 * See http://github.com/christophevg/breakdown for updates and license info
 */

var Breakdown = {
  converter : function converter() {

    // top-level exposed method to turn breakdown input into HTML
    this.makeHtml = function makeHtml(input) {
      initIncludes();
      input = prepareBlocks(input);
      input = escapeHtml(input);
      input = translateLines(input);
      input = translateInlines(input);
      input = addBlocks(input);
      input = cleanUp(input);
      return input;
    };

    // 2 or more newlines indicate an intended paragraph break
    function prepareBlocks(input) {
      return "\n\n\n" +
             input.replace( /\n{2,}/g,"\n\n\n" ) +
             "\n\n\n";
    };

    // raw HTML is not allowed, all tags are escaped
    function escapeHtml(input) {
      return input.replace( /</g, "&lt;" )
                  .replace( />/g, "&gt;" );
    };

    // headers, list items and horizontal rules are matched on a line basis
    function translateLines(input) {
      return input.replace( /^(#+)[ \t]*(.*)$/gm, generateHeader )
                  .replace( /^\*[ \t]*(.*)$/gm,   "<li>$1</li>" )
                  .replace( /^---+$/gm,           "\n\n\n<hr>\n\n\n" )
                  ;
    };

    // bold, italic, images and links can appear anywhere in-line the text
    function translateInlines(input) {
      return input.replace( /\*\*([^\*]+)\*\*/g,             "<b>$1</b>" )
                  .replace( /\*([^\*]+)\*/g,                 "<i>$1</i>" )
                  .replace( /\[\[([^\|\]]+)\|([^\]]+)\]\]/g, "<img src=\"$1\" alt=\"$2\">" )
                  .replace( /\[\[([^\]]+)\]\]/g,             "<img src=\"$1\">" )
                  .replace( /\[include:([^\]]+)\]/g,         insertInclude )
                  .replace( /\[([^\|\]]+)\|([^\]]+)\]/g,     "<a href=\"$1\">$2</a>" )
                  .replace( /\[([^\]]+)\]/g,                 "<a href=\"$1\">$1</a>" )
                  .replace( /([^>"]+)(http:\/\/[a-zA-Z.]+)/g,"$1<a href=\"$2\">$2</a>" )
                  ;
    };

    // detect blocks (based on 3 or more newlines)
    function addBlocks(input) {
      var Blocks = input.split(/\n{3,}/);
      var output = "";
      for(var p=0; p<Blocks.length; p++ ) {
        output += "\n\n\n" + generateBlock(Blocks[p]) + "\n\n\n";
      }
      return output;
    };

    // reduce the number of newlines
    function cleanUp(body) {
      return body.replace( /\n{2,}/g, "\n\n" );
    };

    // helper function to generate a header tag based on the number of hashes
    function generateHeader(full, hashes, label) {
      var num = hashes.length;
      return "\n\n\n<h" + num + ">" + label + "</h" + num + ">\n\n\n";
    };

    // helper function to generate blocks of HTML
    // blocks starting with a header or horizontal line are left untouched,
    // blocks starting with a list item are wrapped in an unnumbered list,
    // all other blocks are paragraphs and wrapped in paragraph tags
    function generateBlock(body) {
      if( body.match( /^[ \t]*$/ ) ||
          body.match( /^(<h[1-6]+|<hr>|<div)/ ) )
      {
        return body;
      } else if( body.match( /^<li>/ ) ) {
        return "<ul>\n" + body + "\n</ul>";
      } else {
        return "<p>" + body + "</p>";
      }
    };

    // AJAX support to fetch included content
    var includeFunctions = [];

    function initIncludes() {
      includeFunctions = [];
    }

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

    // method to generate HTML and JS to include content, using include method
    var includeIndex = 0;

    function insertInclude(m, location) {
      includeIndex++;
      includeFunctions.push( function(url, index) { return function() {
        include( url, "_include_" + index );
      } }( location, includeIndex ) );
      return '<div style="display:inline" id="_include_' + includeIndex + '">' +
             '</div>' + "\n";
    }

    function include(url, element) {
      fetch( url, function( response ) {
        if( ! response ) {
          response = '<div class="bd-error">failed to include '+url+'</div>';
        }
        document.getElementById( element ).innerHTML = response;
      } );
    }

    // external method to execute the dynamic part of the generated HTML
    this.activateHtml = function activateHtml() {
      for( var index=0; index<includeFunctions.length; index++ ) {
        includeFunctions[index]();
      }
    }
  }
}
