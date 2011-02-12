/**
 * breakdown.js
 * an ultra-light Markdown(-like) implementation
 *
 * http://github.com/christophevg/breakdown
 */

var Breakdown = {
  converter : function converter() {

    // 2 or more newlines indicate an intended paragraph break
    this.prepareBlocks = function prepareBlocks(input) {
      return "\n\n\n" +
             input.replace( /\n{2,}/g,"\n\n\n" ) +
             "\n\n\n";
    };

    // raw HTML is not allowed, all tags are escaped
    this.escapeHtml = function escapeHtml(input) {
      return input.replace( /</g, "&lt;" )
                  .replace( />/g, "&gt;" );
    };

    // headers, list items and horizontal rules are matched on a line basis
    this.translateLines = function translateLines(input) {
      var self = this;
      return input.replace( /^(#+)[ \t]*(.*)$/gm, self.generateHeader )
                  .replace( /^\*[ \t]*(.*)$/gm,   "<li>$1</li>" )
                  .replace( /^---+$/gm,           "\n\n\n<hr>\n\n\n" )
                  ;
    };

    // bold, italic, images and links can appear anywhere in-line the text
    this.translateInlines = function translateInlines(input) {
      return input.replace( /\*\*([^\*]+)\*\*/g,            "<b>$1</b>" )
                  .replace( /\*([^\*]+)\*/g,                "<i>$1</i>" )
                  .replace( /!\[([^\]]+)\]\(([^)]+)\)/g,    "<img src=\"$2\" alt=\"$1\">" )
                  .replace( /\[([^\]]+)\]\(([^)]+)\)/g,     "<a href=\"$2\">$1</a>" )
                  .replace( /([^"])(http:\/\/[a-zA-Z.]+)/g, "$1<a href=\"$2\">$2</a>" )
                  ;
    };

    // helper function to generate a header tag based on the number of hashes
    this.generateHeader = function generateHeader(full, hashes, label) {
      var num = hashes.length;
      return "\n\n\n<h" + num + ">" + label + "</h" + num + ">\n\n\n";
    };

    // detect blocks (based on 3 or more newlines)
    this.addBlocks = function addBlocks(input) {
      var Blocks = input.split(/\n{3,}/);
      var output = "";
      for(var p=0; p<Blocks.length; p++ ) {
        output += "\n\n\n" + this.generateBlock(Blocks[p]) + "\n\n\n";
      }
      return output;
    };

    // blocks starting with a header or horizontal line are left untouched,
    // blocks starting with a list item are wrapped in an unnumbered list,
    // all other blocks are paragraphs and wrapped in paragraph tags
    this.generateBlock = function generateBlock(body) {
      if( body.match( /^[ \t]*$/ ) ||
          body.match( /^(<h[1-6]+|<hr>)/ ) )
      {
        return body;
      } else if( body.match( /^<li>/ ) ) {
        return "<ul>\n" + body + "\n</ul>";
      } else {
        return "<p>" + body + "</p>";
      }
    };

    // reduce the number of newlines
    this.cleanUp = function cleanUp(body) {
      return body.replace( /\n{2,}/g, "\n\n" );
    };

    // top-level exposed method to turn breakdown input into HTML
    this.makeHtml = function makeHtml(input) {
      input = this.prepareBlocks(input);
      input = this.escapeHtml(input);
      input = this.translateLines(input);
      input = this.translateInlines(input);
      input = this.addBlocks(input);
      input = this.cleanUp(input);
      return input;
    };
  }
}
