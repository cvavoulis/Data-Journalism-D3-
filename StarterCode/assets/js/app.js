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


choiceX="poverty"

function xScale(econData, choiceX) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(econData, d => d[choiceX]) * 0.8,
      d3.max(econData, d => d[choiceX]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;
}

// function yScale(econData, choiceY) {
//   // create scales
//   var yLinearScale = d3.scaleLinear()
//     .domain([d3.min(econData, d => d[choiceY]) * 0.8,
//       d3.max(econData, d => d[choiceY]) * 1.2
//     ])
//     .range([0, width]);

//   return yLinearScale;
// }

function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

function updateToolTip(choiceX, circlesGroup) {

  if (choiceX === "poverty") {
    var label = "Poverty:";
  }
  else {
    var label = "Age:";
  }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>${label} ${d[chosenXAxis]}`);
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
  //   var xLinearScale = d3.scaleLinear()
  //   .domain([d3.min(econData, d => d.choiceX)*0.8,d3.max(econData, d => d.choiceX)*1.2])
  //   .range([0, width]);



  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(econData, d => d.healthcare)*0.8,d3.max(econData, d => d.healthcare)*1.2])
    .range([height, 0]);


    var xLinearScale=xScale(econData, choiceX)
    // var yLinearScale=yScale(econData, "healthcare")

  // Create axis functions

  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

// add axes to chart 
  var xAxis= chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chartGroup.append("g")
    .call(leftAxis);

// create circles for scatter plot
var circlesGroup = chartGroup.selectAll("circle")
.data(econData)
.enter()

var circles=circlesGroup.append("circle")
.attr("cx", d => xLinearScale(d.choiceX)+6)
.attr("cy", d => yLinearScale(d.choiceY)-5)
.attr("r", "15")
.attr("fill", "blue")
.attr("opacity", .75)
.classed("stateCircle", true);

var labelsGroup = chartGroup.append("g")
.attr("transform", `translate(${width / 2}, ${height + 20})`);
// label the axes
chartGroup.append("text")
.attr("transform", "rotate(-90)")
.attr("y", 0 - margin.left + 40)
.attr("x", 0 - (height / 2))
.attr("dy", "1em")
.attr("class", "axisText")
.text("Lacks Healthcare (%)");
// ABOVE NOT SURE - MAKE TWO AND SPACE THEM OUT?

var textPoverty=labelsGroup.append("text")
.attr("x", 0)
.attr("y", 20)
.attr("value", "poverty") // value to grab for event listener
.classed("active", true)
.text("Poverty");

var textAge=labelsGroup.append("text")
.attr("x", 0)
.attr("y", 20)
.attr("value", "age") // value to grab for event listener
.classed("active", true)
.text("Age");
// SAME 

circles.append("text")
.attr("x", d=>xLinearScale(d[choiceX]))
.attr("y", d=>yLinearScale(d.healthcare))
.attr("class", "stateText")
.attr("fill", "white")
.text(d => d.abbr)
.style("text-align", "center")
.style("font-size", "10px")
.style("font-weight", "bold"); 

var circles = updateToolTip(choiceX, circles);

// // Initialize Tooltip
//     var toolTip = d3.tip()
//       .attr("class", "d3-tip")
//       .html(function(d) {
//         return (`State: ${d.abbr}<br>Poverty: ${(d.choiceX)}%<br>Healthcare: ${d.choiceY}%
//       `);
//     });

// //  Create the tooltip in circles and text.
//     text.call(toolTip);

// // Create mouseover/mouseout for text also
//     text.on("mouseover", function(d) {
//       toolTip.show(d, this);
//     })
// // Create "mouseout" event listener to hide tooltip
//     .on("mouseout", function(d) {
//       toolTip.hide(d, this);
//     });

labelsGroup.selectAll("text")
.on("click", function() {
  // get value of selection
  var value = d3.select(this).attr("value");
  if (value !== choiceX) {

    // replaces chosenXAxis with value
    chosenXAxis = value;

    // console.log(chosenXAxis)

    // functions here found above csv import
    // updates x scale for new data
    xLinearScale = xScale(econData, choiceX);

    
    // updates x axis with transition
    xAxis = renderAxes(xLinearScale, xAxis);

    // updates circles with new x values
    circles = renderCircles(circles, xLinearScale, choiceX);

    // updates tooltips with new info
    circles = updateToolTip(choiceX, circles);

    // changes classes to change bold text
    if (choiceX === "poverty") {
      textPoverty
        .classed("active", true)
        .classed("inactive", false);
      textAge
        .classed("active", false)
        .classed("inactive", true);
    }
    else {
      textPoverty
        .classed("active", false)
        .classed("inactive", true);
      textAge
        .classed("active", true)
        .classed("inactive", false);
    }
  }
});


});




