var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis="healthcare";

// function used for updating x-scale var upon click on axis label
function xScale(econData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(econData, d => d[chosenXAxis]) * 0.8,
      d3.max(econData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;

}

function yScale(econData, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(econData, d => d[chosenYAxis]) * 0.8,
        d3.max(econData, d => d[chosenYAxis]) * 1.2
      ])
      .range([height, 0]);
  
    return yLinearScale;
  
  }

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}


function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
  
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
  
    return yAxis;
  }
  
// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d=>newYScale(d[chosenYAxis]))

  return circlesGroup;

}

function renderText(circlesGroup, newXScale, newYScale, chosenXAxis, chosenYAxis){
  circlesGroup.append("text")
  .attr("x", d=>newXScale(d[chosenXAxis]))
  .attr("y", d=>newYScale(d[chosenYAxis]))
  .attr("class", "stateText")
  .attr("fill", "black")
  .text(d => d.abbr)
  .style("text-align", "center")
  .style("font-size", "10px")
  .style("font-weight", "bold"); 
}





// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

  if (chosenXAxis === "poverty") {
    var labelX = "Poverty:";
  }
  else {
    var labelX = "Age:";
  }


  if (chosenYAxis === "healthcare") {
    var labelY = "Healthcare:";
  }
  else {
    var labelY = "Obesity:";
  }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>${labelX} ${d[chosenXAxis]}<br>${labelY} ${d[chosenYAxis]}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}




// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv", function(err, econData) {
  if (err) throw err;

  // parse data
  econData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.age= +data.age;
    data.healthcare = +data.healthcare;
    data.obesity=+data.obesity;
  });

  // xLinearScale function above csv import
  var xLinearScale = xScale(econData, chosenXAxis);
  var yLinearScale = yScale(econData, chosenYAxis);

  // Create y scale function
//   var yLinearScale = d3.scaleLinear()
//     .domain([0, d3.max(econData, d => d[chosenYAxis]])
//     .range([height, 0]);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

    var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    // .attr("transform", `translate(0, ${height})`)
    .call(leftAxis);

  // append y axis
//   chartGroup.append("g")
//     .call(leftAxis);


  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(econData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 20)
    .attr("fill", "pink")
    .attr("opacity", ".5");

  // Create group for  2 x- axis labels
  var xlabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var povertyLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("data-axis","x")
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("Poverty (%)");

  var ageLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("data-axis","x")
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age");

    var ylabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${margin.left}, ${height/2})`);

  var healthcareLabel = ylabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", 40)
    .attr("y", -170)
    .attr("data-axis","y")
    .attr("dy", "1em")
    .attr("value", "healthcare") // value to grab for event listener
    .classed("active", true)
    .text("Healthcare");

  var obesityLabel = ylabelsGroup.append("text")
  .attr("transform", "rotate(-90)")
  .attr("x", 40)
  .attr("y", -150)
  .attr("data-axis","y")
  .attr("dy", "1em")
    .attr("value", "obesity") // value to grab for event listener
    .classed("inactive", true)
    .text("Obesity");

//   // append y axis
//   chartGroup.append("text")
//     .attr("transform", "rotate(-90)")
//     .attr("y", 0 - margin.left)
//     .attr("x", 0 - (height / 2))
//     .attr("dy", "1em")
//     .classed("axis-text", true)
//     .text("Healthcare");

  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

  // x axis labels event listener
  xlabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      var axis = d3.select(this).attr("data-axis");
      if (value !== chosenXAxis && axis=="x") {
        console.log(value)
        console.log(axis)
        // replaces chosenXAxis with value
        chosenXAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(econData, chosenXAxis);

        
        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);
        yAxis = renderYAxes(yLinearScale, yAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
        circlesGroup = renderText(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === "age") {
          ageLabel
            .classed("active", true)
            .classed("inactive", false);
         povertyLabel 
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          povertyLabel
            .classed("active", true)
            .classed("inactive", false);
            }

     } });
        


  
    

      ylabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      var axis = d3.select(this).attr("data-axis");
      if (value !== chosenYAxis && axis =="y") {

        console.log(value)
        console.log(axis)
        // replaces chosenXAxis with value
        chosenYAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        yLinearScale = yScale(econData, chosenYAxis);

        
        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);
        yAxis = renderYAxes(yLinearScale, yAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        // changes classes to change bold text

        if (chosenYAxis === "healthcare") {
          healthcareLabel
            .classed("active", true)
            .classed("inactive", false);
         obesityLabel 
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
          obesityLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }});


  });