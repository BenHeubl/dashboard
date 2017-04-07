import d3 from   "d3";
// iserts d3 into workspace


console.log(d3.range(1, 15))


// names
var allNames = ["a", "b", "c"];

//Parses date for correct time format
  var parseDate = d3.time.format("%d/%m/%y").parse;


  //Loads the data
  d3.csv("index_china.csv", ready);

  function ready(err, data) {

    if (err) throw "error loading data";

    //FORMAT data
    data.forEach(function(d) {
      d.count = +d.count;
      d.year = parseDate(d.year)
      d.start = parseDate(d.start);
    });

    //Organizes the data
    var maxY = d3.max(data, function(d) { return d.count; });
    var maxY = 100;

    var maxX = d3.max(data, function(d) { return d.year; });
    var minX = d3.min(data, function(d) { return d.year; });

    //Map the property names to the data
    allNames = d3.set(data.map(function(d) { return d.name; })).values();


    //Make a chart for each property
    var charts = allNames.map(makeChart);

    //Syncs all charts together
    function syncFocus (x0) {
      charts.forEach(function(chart) {
        chart.updateFocus(x0);
      });
    }

    //RESPONSIVENESS
    d3.select(window).on("resize", function () {
      charts.forEach(function(chart) {
        chart.resize();
      })
    });

    var datadivs = d3.range(1, 6)


    function makeChart(name, chartIndex) {

      console.log(chartIndex)


      //Append individual chart div
      var chartContainer = d3.select(".gia-chart")
      // .data(d3.range(1, 5))
      // .enter()
      .append("div")
        .attr("class", "g-chart-container")
        .attr("id", function(){
          return "container_id_" + chartIndex;
          // console.log(d)
        });

      //Margin conventions
      var margin = {top: 20, right: 20, bottom: 30, left: 32};

      var widther = d3.select(".g-chart-container").node().clientWidth;

      var width = (widther) - margin.left - margin.right,
        height = 250 - margin.top - margin.bottom;

      //Creates the xScale
      var xScale = d3.time.scale()
        .range([0, width]);

      //Creates the yScale
      var yScale = d3.scale.linear()
        .range([height, 0]);

      //line function convention (feeds an array)
      var line = d3.svg.line()
        .x(function(d) { return xScale(d.year); })
        .y(function(d) { return yScale(d.count); });

      //area function
      var area = d3.svg.area()
        .x(function(d) {return xScale(d.year); })
        .y0(height)
        .y1(function(d) {return yScale(d.count); });

      //Defines the xScale max
      xScale.domain(d3.extent(data, function(d) { return d.year; }));

      //Defines the yScale max
      yScale.domain([30, maxY]);

      //Defines the y axis styles
      var yAxis = d3.svg.axis()
        .scale(yScale)
        .tickSize(-width)
        .tickPadding(10)
        .ticks(10)
        .orient("left");

      //Defines the y axis styles
      var xAxis = d3.svg.axis()
        .scale(xScale)
        .tickPadding(8)
        .orient("bottom")
        .tickValues([minX, maxX])
        .tickFormat(d3.time.format("%Y"));

      //Finds the data associated with each name
      var myCurrentName = name;

      var myNameData = data.filter(function(d) {
        return d.name === myCurrentName;
      });

      //Sets value for ending dot on line
      var maxXdot = d3.max(myNameData, function(d) { return d.year; });

      var maxXdot = d3.max(myNameData, function(d) { return d.start; });

      //Appends the property name to the individual chart container
      var chartName = chartContainer.append("h5")
        .attr("class", "g-name");

      //Appends the name chart to the individual chart container
      var chart = chartContainer.append("div")
        .attr("class", "g-chart");

      //Assigns the property name
      chartName.text(myCurrentName);

      //Appends the svg to the chart-container div
      var svg = chart.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      //Appends the y axis
      var yAxisGroup = svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .selectAll("g")
        .classed("g-baseline", function(d) {return d == 0});

      //Appends the x axis
      var xAxisGroup = svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

      //Binds the data to the area
      var drawarea = svg.append("path")
        .datum(myNameData)
        .attr("class", "area")
        .attr("d", area);

      //Binds the data to the line
      var drawline = svg.append("path")
        .datum(myNameData)
        .attr("class", "line")
        .attr("d", line)
        .selectAll("line");

      //Adds vertical line
      var startline = svg.append("line")
        .datum(myNameData[0])
        .attr("x1", function(d) {return xScale(d.start); })
        .attr("y1", 5)
        .attr("x2", function(d) { return xScale(d.start); })
        .attr("y2", 200)
        .attr("class", "startline");

      var starttext = svg.append("text")
        .datum(myNameData[0])
        .attr("transform", function(d) { return "translate(" + (xScale(d.start)+15) + "," + yScale(510) + ")"; } )
        .attr("text-anchor", "end")
        .text(function(d) { return d.start.getFullYear();})
        .attr("class", "g-label-text");

      //LINKED INTERACTIVES
      //Divides date for tooltip placement
      var bisectDate = d3.bisector(function(d) { return d.year; }).left;

      //Tooltips
      var focus = svg.append("g")
        .attr("class", "focus")
        .style("display", "none");

      //Adds circle to focus point on line
      focus.append("circle")
        .attr("r", 4);

      //Adds text to focus point on line
      focus.append("text")
        .attr("x", -10)
        .attr("y", -10)
        .attr("dy", ".35em");

      //Creates larger area for tooltip
      var overlay = svg.append("rect")
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height)
        .on("mouseover", function() {
          d3.selectAll('.focus')
            .style("display", null); })
        .on("mouseout", function() {
          d3.selectAll('.focus')
          .style("display", "none"); })
        .on("mousemove", mousemove);

      //Tooltip mouseovers
      function mousemove() {
        var x0 = xScale.invert(d3.mouse(this)[0]);
        syncFocus(x0);
      }

      return {
        updateFocus: function (x0) {
          var i = bisectDate(myNameData, x0, 1),
              d0 = myNameData[i - 1],
              d1 = myNameData[i],
              d = x0 - d0.year > d1.year - x0 ? d1 : d0;
          focus.attr("transform", "translate(" + xScale(d.year) + "," + yScale(d.count) + ")");
          focus.select("text").text(d3.round(d.count, 1));
        },

        resize: function () {
          //new margin
          var newMargin = {top: 20, right: 20, bottom: 30, left: 32};

          var newWidther = d3.select(".g-chart-container").node().clientWidth;

          var newWidth = (newWidther) - newMargin.left - newMargin.right;

          //Change the width of the svg
          d3.selectAll("svg")
            .attr("width", newWidth + newMargin.left + newMargin.right);

          //Change the xScale
          xScale
            .range([0, newWidth]);

          //Update the line
          line = d3.svg.line()
            .x(function(d) { return xScale(d.year); })
            .y(function(d) { return yScale(d.count); });

          d3.selectAll('.line')
            .attr("d", line);

          //Update the area
          area = d3.svg.area()
            .x(function(d) {return xScale(d.year); })
            .y0(height)
            .y1(function(d) {return yScale(d.count); });

          d3.selectAll('.area')
            .attr("d", area);

          //Updates label
          d3.selectAll('.g-label-element0')
            .attr("transform", function(d) { return "translate(" + xScale(d.year) + "," + yScale(d.count) + ")"; } );

          //Updates xAxis
          d3.selectAll(".x.axis")
            .call(xAxis);

          xAxis
            .scale(xScale);

          //Updates yAxis
          d3.selectAll(".y.axis")
            .call(yAxis);

          yAxis
            .tickSize(-newWidth);

          //Updates overlay
          d3.selectAll(".overlay")
            .attr("width", newWidth);

          //Updates vertical line
          d3.selectAll(".startline")
            .attr("x1", function(d) {return xScale(d.start); })
            .attr("x2", function(d) { return xScale(d.start); })

          d3.selectAll(".g-label-text")
            .attr("transform", function(d) { return "translate(" + (xScale(d.start)+15) + "," + yScale(510) + ")"; } )
        }
      };
    }
  }














  // Chart 2



  //Loads the data
  d3.csv("index_asean.csv", ready);

  function ready(err, data) {

    if (err) throw "error loading data";

    //FORMAT data
    data.forEach(function(d) {
      d.count = +d.count;
      d.year = parseDate(d.year)
      d.start = parseDate(d.start);
    });

    //Organizes the data
    var maxY = d3.max(data, function(d) { return d.count; });
    var maxY = 100;

    var maxX = d3.max(data, function(d) { return d.year; });
    var minX = d3.min(data, function(d) { return d.year; });

    //Map the property names to the data
    allNames = d3.set(data.map(function(d) { return d.name; })).values();


    //Make a chart for each property
    var charts = allNames.map(makeChart);

    //Syncs all charts together
    function syncFocus (x0) {
      charts.forEach(function(chart) {
        chart.updateFocus(x0);
      });
    }

    //RESPONSIVENESS
    d3.select(window).on("resize", function () {
      charts.forEach(function(chart) {
        chart.resize();
      })
    });

    var datadivs = d3.range(1, 6)


    function makeChart(name, chartIndex) {

      console.log(chartIndex)


      //Append individual chart div
      var chartContainer2 = d3.select(".gia-chart2")
      // .data(d3.range(1, 5))
      // .enter()
      .append("div")
        .attr("class", "g-chart-container")
        .attr("id", function(){
          return "container_id_" + chartIndex;
          // console.log(d)
        });

      //Margin conventions
      var margin = {top: 20, right: 20, bottom: 30, left: 32};

      var widther = d3.select(".g-chart-container").node().clientWidth;

      var width = (widther) - margin.left - margin.right,
        height = 250 - margin.top - margin.bottom;

      //Creates the xScale
      var xScale = d3.time.scale()
        .range([0, width]);

      //Creates the yScale
      var yScale = d3.scale.linear()
        .range([height, 0]);

      //line function convention (feeds an array)
      var line = d3.svg.line()
        .x(function(d) { return xScale(d.year); })
        .y(function(d) { return yScale(d.count); });

      //area function
      var area = d3.svg.area()
        .x(function(d) {return xScale(d.year); })
        .y0(height)
        .y1(function(d) {return yScale(d.count); });

      //Defines the xScale max
      xScale.domain(d3.extent(data, function(d) { return d.year; }));

      //Defines the yScale max
      yScale.domain([30, maxY]);

      //Defines the y axis styles
      var yAxis = d3.svg.axis()
        .scale(yScale)
        .tickSize(-width)
        .tickPadding(10)
        .ticks(10)
        .orient("left");

      //Defines the y axis styles
      var xAxis = d3.svg.axis()
        .scale(xScale)
        .tickPadding(8)
        .orient("bottom")
        .tickValues([minX, maxX])
        .tickFormat(d3.time.format("%Y"));

      //Finds the data associated with each name
      var myCurrentName = name;

      var myNameData = data.filter(function(d) {
        return d.name === myCurrentName;
      });

      //Sets value for ending dot on line
      var maxXdot = d3.max(myNameData, function(d) { return d.year; });

      var maxXdot = d3.max(myNameData, function(d) { return d.start; });

      //Appends the property name to the individual chart container
      var chartName = chartContainer2.append("h5")
        .attr("class", "g-name");

      //Appends the name chart to the individual chart container
      var chart = chartContainer2.append("div")
        .attr("class", "g-chart");

      //Assigns the property name
      chartName.text(myCurrentName);

      //Appends the svg to the chart-container div
      var svg2 = chart.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      //Appends the y axis
      var yAxisGroup = svg2.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .selectAll("g")
        .classed("g-baseline", function(d) {return d == 0});

      //Appends the x axis
      var xAxisGroup = svg2.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

      //Binds the data to the area
      var drawarea = svg2.append("path")
        .datum(myNameData)
        .attr("class", "area")
        .attr("d", area);

      //Binds the data to the line
      var drawline = svg2.append("path")
        .datum(myNameData)
        .attr("class", "line")
        .attr("d", line)
        .selectAll("line");

      //Adds vertical line
      var startline = svg2.append("line")
        .datum(myNameData[0])
        .attr("x1", function(d) {return xScale(d.start); })
        .attr("y1", 5)
        .attr("x2", function(d) { return xScale(d.start); })
        .attr("y2", 200)
        .attr("class", "startline");

      var starttext = svg2.append("text")
        .datum(myNameData[0])
        .attr("transform", function(d) { return "translate(" + (xScale(d.start)+15) + "," + yScale(510) + ")"; } )
        .attr("text-anchor", "end")
        .text(function(d) { return d.start.getFullYear();})
        .attr("class", "g-label-text");

      //LINKED INTERACTIVES
      //Divides date for tooltip placement
      var bisectDate = d3.bisector(function(d) { return d.year; }).left;

      //Tooltips
      var focus = svg2.append("g")
        .attr("class", "focus")
        .style("display", "none");

      //Adds circle to focus point on line
      focus.append("circle")
        .attr("r", 4);

      //Adds text to focus point on line
      focus.append("text")
        .attr("x", -10)
        .attr("y", -10)
        .attr("dy", ".35em");

      //Creates larger area for tooltip
      var overlay = svg2.append("rect")
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height)
        .on("mouseover", function() {
          d3.selectAll('.focus')
            .style("display", null); })
        .on("mouseout", function() {
          d3.selectAll('.focus')
          .style("display", "none"); })
        .on("mousemove", mousemove);

      //Tooltip mouseovers
      function mousemove() {
        var x0 = xScale.invert(d3.mouse(this)[0]);
        syncFocus(x0);
      }

      return {
        updateFocus: function (x0) {
          var i = bisectDate(myNameData, x0, 1),
              d0 = myNameData[i - 1],
              d1 = myNameData[i],
              d = x0 - d0.year > d1.year - x0 ? d1 : d0;
          focus.attr("transform", "translate(" + xScale(d.year) + "," + yScale(d.count) + ")");
          focus.select("text").text(d3.round(d.count, 1));
        },

        resize: function () {
          //new margin
          var newMargin = {top: 20, right: 20, bottom: 30, left: 32};

          var newWidther = d3.select(".g-chart-container").node().clientWidth;

          var newWidth = (newWidther) - newMargin.left - newMargin.right;

          //Change the width of the svg2
          d3.selectAll("svg2")
            .attr("width", newWidth + newMargin.left + newMargin.right);

          //Change the xScale
          xScale
            .range([0, newWidth]);

          //Update the line
          line = d3.svg.line()
            .x(function(d) { return xScale(d.year); })
            .y(function(d) { return yScale(d.count); });

          d3.selectAll('.line')
            .attr("d", line);

          //Update the area
          area = d3.svg.area()
            .x(function(d) {return xScale(d.year); })
            .y0(height)
            .y1(function(d) {return yScale(d.count); });

          d3.selectAll('.area')
            .attr("d", area);

          //Updates label
          d3.selectAll('.g-label-element0')
            .attr("transform", function(d) { return "translate(" + xScale(d.year) + "," + yScale(d.count) + ")"; } );

          //Updates xAxis
          d3.selectAll(".x.axis")
            .call(xAxis);

          xAxis
            .scale(xScale);

          //Updates yAxis
          d3.selectAll(".y.axis")
            .call(yAxis);

          yAxis
            .tickSize(-newWidth);

          //Updates overlay
          d3.selectAll(".overlay")
            .attr("width", newWidth);

          //Updates vertical line
          d3.selectAll(".startline")
            .attr("x1", function(d) {return xScale(d.start); })
            .attr("x2", function(d) { return xScale(d.start); })

          d3.selectAll(".g-label-text")
            .attr("transform", function(d) { return "translate(" + (xScale(d.start)+15) + "," + yScale(510) + ")"; } )
        }
      };
    }
  }
