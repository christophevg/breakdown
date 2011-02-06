var Breakdown = {
  converter : function converter() {
    this.makeHtml = function makeHtml(input) {

      var html = "";

      var lines = input.split(/\n/);
      for( var i=0; i <lines.length; i++ ) {
        html += lines[i].replace( /^# ?([^#].*)$/, "<h1>$1</h1>" ) 
        .replace( /^## ?([^#].*)$/, "<h2>$1</h2>" )
        .replace( /^\* ?(.*)$/, "<li>$1</li>" ) 
        .replace( /^---$/, "<hr>" )
        + "\n"
        ;
      }

      html = html.replace( /\*\*([^\*]+)\*\*/g, "<b>$1</b>" )
      .replace( /\*([^\*]+)\*/g, "<i>$1</i>" )
      .replace( /!\[([^\]]+)\]\(([^)]+)\)/g, "<img src=\"$2\" alt=\"$1\">" )
      .replace( /\[([^\]]+)\]\(([^)]+)\)/g, "<a href=\"$2\">$1</a>" )
      .replace( /([^"])(http:\/\/[a-zA-Z.]+)/g, "$1<a href=\"$2\">$2</a>" )
      .replace( /\n\n([^<])/g, "\n\n<p>$1" )
      .replace( /^([^<])/g, "<p>$1" )
      .replace( /<p>(.*)\n\n/, "<p>$1</p>\n\n" )
      ;

      return html;
    }
  }
}
