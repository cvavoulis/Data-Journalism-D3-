// Define size of svg
var svgWidth = 960;
var svgHeight = 500;

// set the margin area parameters
var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

//define the size of the chart
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

//append an SVG tag to the div tag with ID scatter

var svg=d3.select("#scatter")
        .append("svg")
        .attr("height", svgHeight)
        .attr("width", svgWidth)

// append g tag to group the charts 
var chartGroup = svg.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);

// poverty="poverty"
// obesity="obesity"

// function xScale(econData, poverty) {
//   // create scales
//   var xLinearScale = d3.scaleLinear()
//     .domain([d3.min(econData, d => d[poverty]) * 0.8,
//       d3.max(econData, d => d[poverty]) * 1.2
//     ])
//     .range([0, width]);

//   return xLinearScale;
// }

// function yScale(econData, obesity) {
//   // create scales
//   var yLinearScale = d3.scaleLinear()
//     .domain([d3.min(econData, d => d[obesity]) * 0.8,
//       d3.max(econData, d => d[obesity]) * 1.2
//     ])
//     .range([0, width]);

//   return yLinearScale;
// }

// function renderXAxes(newXScale, xAxis) {
//   var bottomAxis = d3.axisBottom(newXScale);

//   xAxis.transition()
//     .duration(1000)
//     .call(bottomAxis);

//   return xAxis;
// }

// function renderYAxes(newYScale, yAxis) {
//   var bottomAxis = d3.axisBottom(newYScale);

//   yAxis.transition()
//     .duration(1000)
//     .call(bottomAxis);

//   return yAxis;
// }

// fetch the data and define variables as integers
d3.csv("assets/data/data.csv", (err, econData)=>{
    if (err) throw err;

    console.log(econData);
    econData.forEach(data => {
        data.poverty=+data.poverty;
        data.povertyMoe=+data.povertyMoe;
        data.age=+data.age;
        data.ageMoe=+data.ageMoe;
        data.income=+data.income;
        data.incomeMoe=+data.incomeMoe;
        data.healthcare=+data.healthcare;
        data.healthcareLow=+data.healthcareLow;
        data.healthcareHigh=+data.healthcareHigh;
        data.obesity=+data.obesity;
        data.obesityLow=+data.obesityHigh;
        data.obesityHigh=+data.obesityHigh;
        data.smokes=+data.smokes;
        data.smokesLow=+data.smokesLow;
        data.smokesHigh=+data.smokesHigh;
    });

// create scale functions
    var xLinearScale = d3.scaleLinear()
    .domain([d3.min(econData, d => d.poverty)*0.8,d3.max(econData, d => d.poverty)*1.2])
    .range([0, width]);


  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(econData, d => d.healthcare)*0.8,d3.max(econData, d => d.healthcare)*1.2])
    .range([height, 0]);

    // var xLinearScale=xScale(econData, poverty)
    // var yLinearScale=yScale(econData, obesity)

  // Create axis functions

  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

// add axes to chart 
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chartGroup.append("g")
    .call(leftAxis);

// create circles for scatter plot
var circlesGroup = chartGroup.selectAll("circle")
.data(econData)
.enter()

var circles=circlesGroup.append("circle")
.attr("cx", d => xLinearScale(d.poverty)+6)
.attr("cy", d => yLinearScale(d.healthcare)-5)
.attr("r", "15")
.attr("fill", "blue")
.attr("opacity", .75)
.classed("stateCircle", true);


// label the axes
chartGroup.append("text")
.attr("transform", "rotate(-90)")
.attr("y", 0 - margin.left + 40)
.attr("x", 0 - (height / 2))
.attr("dy", "1em")
.attr("class", "axisText")
.text("Lacks Healthcare (%)");

chartGroup.append("text")
.attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
.attr("class", "axisText")
.text("In Poverty (%)");

var text=circlesGroup.append("text")
.attr("x", d=>xLinearScale(d.poverty))
.attr("y", d=>yLinearScale(d.healthcare))
// .attr("class", "stateText")
.attr("fill", "white")
.text(d => d.abbr)
.style("text-align", "center")
.style("font-size", "10px")
.style("font-weight", "bold")

// Initialize Tooltip
    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .html(function(d) {
        return (`State: ${d.abbr}<br>Poverty: ${(d.poverty)}%<br>Healthcare: ${d.healthcare}%
      `);
    });

//  Create the tooltip in circles and text.
    chartGroup.call(toolTip);

// Create "mouseover" event listener to display tooltip
    circles.on("mouseover", function(d) {
      toolTip.show(d, this);
    })
// Create "mouseout" event listener to hide tooltip
    .on("mouseout", function(d) {
      toolTip.hide(d, this);
    });

// Create mouseover/mouseout for text also
    text.on("mouseover", function(d) {
      toolTip.show(d, this);
    })
// Create "mouseout" event listener to hide tooltip
    .on("mouseout", function(d) {
      toolTip.hide(d, this);
    });

});





