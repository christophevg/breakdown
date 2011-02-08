var Breakdown = {
  converter : function converter() {

    this.escape = function escape(input) {
      return input.replace( /</g, "&lt;" )
                  .replace( />/g, "&gt;" );
    };

    this.translateInlines = function translateInlines(input) {
      return input.replace( /\*\*([^\*]+)\*\*/g,            "<b>$1</b>" )
                  .replace( /\*([^\*]+)\*/g,                "<i>$1</i>" )
                  .replace( /!\[([^\]]+)\]\(([^)]+)\)/g,    "<img src=\"$2\" alt=\"$1\">" )
                  .replace( /\[([^\]]+)\]\(([^)]+)\)/g,     "<a href=\"$2\">$1</a>" )
                  .replace( /([^"])(http:\/\/[a-zA-Z.]+)/g, "$1<a href=\"$2\">$2</a>" )
                  ;
    };

    this.translateLines = function translateLines(input) {
      return input.replace( /^# ?([^#].*)$/gm,  "<h1>$1</h1>" )
                  .replace( /^## ?([^#].*)$/gm, "<h2>$1</h2>" )
                  .replace( /^\* ?(.*)$/gm,     "<li>$1</li>" )
                  .replace( /^---$/gm,          "<hr>" )
                  ;
    };

    this.addParagraphs = function addParagraphs(input) {
      return input.replace( /\n\n([^<])/g,  "\n\n<p>$1" )
                  .replace( /^([^<])/g,     "<p>$1" )
                  .replace( /<p>(.*)\n\n/,  "<p>$1</p>\n\n" )
                  ;
    };

    this.makeHtml = function makeHtml(input) {
      input = this.escape(input);
      input = this.translateLines(input);
      return  this.translateInlines(input);
    };
  }
}
