

/*var t1=190;
var t2=140;
var t3=90;
var t4=230;
var t5=270;
var t6=180;
*/var tF1=RegExp.escape("Tote Forklift|stack1");
var tF2=RegExp.escape("Tote Forklift|stack2");
var tF3=RegExp.escape("Tote Forklift|stack3");
var tF4=RegExp.escape("Tote Forklift|stack4");
var tF5=RegExp.escape("Tote Forklift|stack5");
var tF6=RegExp.escape("Tote Forklift|stack5");


keyStore[tF1]=190;
keyStore[tF2]=150;
keyStore[tF3]=90;
keyStore[tF4]=230;
keyStore[tF5]=270;
keyStore[tF6]=180;


var t1=keyStore[tF1];
var t2=keyStore[tF2];
var t3=keyStore[tF3];
var t4=keyStore[tF4];
var t5=keyStore[tF5];
var t6=keyStore[tF6];//*/

var jsonRectangles=[
                      {"x_axis": 140, "y_axis": t1, "height": 10, "width":20, "color" : "purple"},
                      {"x_axis": 140, "y_axis": t2, "height": 10, "width":20, "color" : "purple"},
                      {"x_axis": 140, "y_axis": t3, "height": 10, "width":20, "color" : "purple"},
                      {"x_axis": 140, "y_axis": t4, "height": 10, "width":20, "color" : "purple"},
                      {"x_axis": 140, "y_axis": t5, "height": 10, "width":20, "color" : "purple"},
                      {"x_axis": 50, "y_axis": t6, "height": 15, "width":25, "color" : "orange"},
                      {"x_axis": 70, "y_axis": 70, "height": 133, "width":80, "color": ""}];

var max_x = 0;
var max_y = 0;
//This code makes the SVG responsive to
//size of the overall SVG element on display
for (var i = 0; i < jsonRectangles.length; i++) {
    var temp_x, temp_y;
    var temp_x = jsonRectangles[i].x_axis + jsonRectangles[i].width;
    var temp_y = jsonRectangles[i].y_axis + jsonRectangles[i].height;
    
    if ( temp_x >= max_x ) { max_x = temp_x + 20; }
    if ( temp_y >= max_y ) { max_y = temp_y + 20; }
}

var svgContainer = d3.select("#RobotDiagram").append("svg")
.attr("width", max_x)
.attr("height", max_y);

var rectangles = svgContainer.selectAll("rect")
.data(jsonRectangles)
.enter()
.append("rect");

var rectangleAttributes = rectangles
.attr("class", "box")
.attr("x", function (d) { return d.x_axis; })
.attr("y", function (d) { return d.y_axis; })
.attr("height", function (d) { return d.height; })
.attr("width", function (d) { return d.width; })
.style("fill", function(d) { return d.color; });
//Note each rectangle get class=box attribute for CSS styling


/*for(var k=0;k<6;k++)
{
if(jsonRectangles[k].y_axis>190||jsonRectangles[k].y_axis<90)
{
    var moveRect = rectangles
    .attr("class", "part")
    .style("visibility", function(d) { return d.visibitity; });
    //jsonRectangles[k].setVisible=false;
    
}
}
/*else if(prompt("what is the message"=="yes"))
{
    part=active;
    for(var j=0;j<50;j++){
        for(var k=0;k<3;k++){
            jsonRectangles[k].y_axis=jsonRectangles[k].y_axis+1}}
}*/


