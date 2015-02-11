

var t1=keyStore.Tote Forklift|stack1;
var t2=keyStore.Tote Forklift|stack2;
var t3=keyStore.Tote Forklift|stack3;
var t4=keyStore.Tote Forklift|stack4;
var t5=keyStore.Tote Forklift|stack5;

var jsonRectangles
                      { "x_axis": 140, "y_axis": t1, "height": 10, "width":20, "color" : "purple" },
                      {"x_axis": 140, "y_axis": t2, "height": 10, "width":20, "color" : "purple"},
                      {"x_axis": 140, "y_axis": t3, "height": 10, "width":20, "color" : "purple"},
                      { "x_axis": 140, "y_axis": t4, "height": 10, "width":20, "color" : "purple" },
                      {"x_axis": 140, "y_axis": t5, "height": 10, "width":20, "color" : "purple"},
                     
                      //{ "x_axis": 40, "y_axis": 220, "height": 20, "width":40, "color" : "red" },
                      // {"x_axis": 140, "y_axis": 220, "height": 20, "width":40, "color" : "green"},
                      { "x_axis": 70, "y_axis": 70, "height": 133, "width":80, "color" : "" }
                      //{ "x_axis": 40, "y_axis": 220, "height": 20, "width":40, "color" : "red" }
                      //{"x_axis": 140, "y_axis": 220, "height": 20, "width":40, "color" : "green"}];
                      
                      ];
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
//Note each rectangle get class=box attribute for CSS styling
var rectangleAttributes = rectangles
.attr("class", "box")
.attr("x", function (d) { return d.x_axis; })
.attr("y", function (d) { return d.y_axis; })
.attr("height", function (d) { return d.height; })
.attr("width", function (d) { return d.width; })
.style("fill", function(d) { return d.color; });
var moveRect = rectangles
.attr("class", "part")
.attr("y", function (k) { return k.y_axis; })
for(var k=0;k<5;k++)
{
if(jsonRectangles[k].y_axis==89)
{
    
    jsonRectangles[k].setVisible=false;
    
}
/*else if(prompt("what is the message"=="yes"))
{
    part=active;
    for(var j=0;j<50;j++){
        for(var k=0;k<3;k++){
            jsonRectangles[k].y_axis=jsonRectangles[k].y_axis+1}}
}*/


