import * as d3 from 'd3';

export class chartLAeqRunning {

    width:number;
    height:number;
    margin_top = 10;
    margin_bottom = 30;
    margin_right = 10;
    margin_left = 35;
    xAxisLength:number;
    yAxisLength:number;

    svgContainer:any;
    line: any;

    yMax: number;
    yMin: number;

    constructor(dbATimeChart,dbARunningChart,translation,range){

        this.yMin = range.lower
        this.yMax = range.upper

        var this_copy = this;
        // console.log(d3.select('#chartLAeqRunning'))
        this.width = parseFloat(d3.select('#chartLAeqRunning').style('width'));
        this.height = Math.round(0.77 * this.width);

        d3.select("#svgLAeqRunning").remove();

        this.svgContainer = d3.select("#chartLAeqRunning")
            .append("svg")
            .attr("id", "svgLAeqRunning")
            .attr("width", this.width)
            .attr("height", this.height);
            // .style("border", "1px solid");

        // axis y label fanthom
        var yAxisLabel_temp = this.svgContainer.append("text")
            .attr("class","temp")
            .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
            .attr("transform", "translate("+ 0 +","+ 0 +")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
            .text(translation.AXIS_DBA);

        var yAxisLabel_padding = yAxisLabel_temp.node().getBBox().height;

        this.svgContainer.selectAll("text.temp").remove();
        // end axis y label fanthom

        // axis x label fanthom
        var xAxisLabel_temp = this.svgContainer.append("text")
            .attr("class","temp")
            // .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
            .attr("transform", "translate("+ 0 +","+ 0 +")")  // text is drawn off the screen top left, move down and out and rotate
            .text(translation.AXIS_TIME);

        var xAxisLabel_padding = xAxisLabel_temp.node().getBBox().height;

        this.svgContainer.selectAll("text.temp").remove()
        // end axis x label fanthom

        // y ticks fanthom
        var yTicksLabel_temp = this.svgContainer.append("text")
            .attr("class","temp")
            // .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
            .attr("transform", "translate("+ 0 +","+ 0 +")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
            .text("10000");

        var yTicksLabel_padding = yTicksLabel_temp.node().getBBox().height;

        this.svgContainer.selectAll("text.temp").remove();
        // end y tiks fanthom

        // x ticks fanthom
        var xTicksLabel_temp = this.svgContainer.append("text")
            .attr("class","temp")
            // .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
            .attr("transform", "translate("+ 0 +","+ 0 +")")  // text is drawn off the screen top left, move down and out and rotate
            .text("10000");

        var xTicksLabel_padding = xTicksLabel_temp.node().getBBox().height;

        this.svgContainer.selectAll("text.temp").remove();
        // end x tiks fanthom

        this.margin_left = yAxisLabel_padding*1.2 + yTicksLabel_padding
        this.margin_bottom = xAxisLabel_padding + xTicksLabel_padding


        this.xAxisLength = this.width - this.margin_right - this.margin_left;
        this.yAxisLength = this.height - this.margin_top - this.margin_bottom;

        var xScale = d3.scaleLinear()
            .domain([-30, 0])
            .range([0, this.xAxisLength]);

        var yScale = d3.scaleLinear()
            .domain([this.yMax, this.yMin])
            .range([0, this.yAxisLength]);

        // label y axis
        this.svgContainer.append("text")
            // .attr("class","text")
            .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
            .attr("transform", "translate("+ yAxisLabel_padding/2 +","+ (this_copy.margin_top + this_copy.yAxisLength/2) +")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
            .text(translation.AXIS_DBA)
            .attr("font-size", "x-small");
        // end label y axis

        // label x axis
        this.svgContainer.append("text")
            // .attr("class","text")
            .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
            .attr("transform", "translate("+ (this_copy.margin_left + this_copy.xAxisLength/2) +","+ (this_copy.height - xAxisLabel_padding/8) +")")  // text is drawn off the screen top left, move down and out and rotate
            .text(translation.AXIS_TIME)
            .attr("font-size", "x-small");
        // end label x axis

        // Verical gridlines
        var Vgridlines = d3.axisTop(xScale)
            .ticks(5)
            .tickSize(this.yAxisLength)
            .tickFormat(function(d:any) {return ""});

        this.svgContainer.append("g")
            .attr("class", "grid")
            .attr("transform", function() {
                return "translate(" + this_copy.margin_left + "," + (this_copy.height - this_copy.margin_bottom) + ")";
                })
            .call(Vgridlines);

        // Horizontal gridlines
        var Hgridlines = d3.axisLeft(yScale)
            .ticks(10)
            .tickSize(-this.xAxisLength)
            .tickFormat(function(d:any) {return ""});

        this.svgContainer.append("g")
            .attr("class", "grid")
            .attr("transform", function() {
                return "translate(" + this_copy.margin_left + "," + this_copy.margin_top + ")";
                })
            .call(Hgridlines);

        // d3.select('#chartLAeqRunning').selectAll(".grid")
        //         .selectAll("line").style("stroke", "#dbdbdb")

        // x axis
        this.svgContainer.append("g")
            .classed("x-axis", true)
            .attr("transform", function() {
                return "translate(" + this_copy.margin_left + "," + (this_copy.height - this_copy.margin_bottom) + ")";
                })
            .call(d3.axisBottom(xScale)
                    .ticks(30)
                    .tickSize(4)
                    .tickFormat(function(d:any) { return ""})
        );

        this.svgContainer.append("g")
            .classed("x-axis", true)
            .attr("transform", function() {
                return "translate(" + this_copy.margin_left + "," + (this_copy.height - this_copy.margin_bottom) + ")";
                })
            .call(d3.axisBottom(xScale)
                    .ticks(5)
                    // .tickFormat(function(d:any) {return d + "s"})
                        // var output;
                        // if (d<0){ output= d + "s"}
                        // else {output = "adesso"};
                        // return  output})
            );

        // y axis
        this.svgContainer.append("g")
            .classed("y-axis", true)
            .attr("transform", function() {
                return "translate(" + this_copy.margin_left + "," + this_copy.margin_top + ")";
                })
            .call(d3.axisLeft(yScale)
                    // .tickFormat(function(d:any) {
                    //       if (d==100){ return "dBA"}
                    //       else {return d}})
                        );


        // lines
        this.line = d3.line()
            .x(function(d:any) { return xScale(d.x); })
            .y(function(d:any) { return yScale(d.y); })
            .curve(d3.curveStepBefore);

        // legend
        var t1 = this.svgContainer.append("text")
              .attr("class","temp")
              .attr("x", 20)
              .attr("y", 20)
              .attr("font-size", "small")
              .text("LAeq(1s)")
        var t2 = this.svgContainer.append("text")
              .attr("class","temp")
              .attr("x", 20)
              .attr("y", 20)
              .attr("font-size", "small")
              .text("LAeq(t)")

        var tHeight = t1.node().getBBox().height;
        var tPadding = tHeight * 0.66;

        var t1Width = t1.node().getBBox().width + tPadding;
        var t2Width = t2.node().getBBox().width + tPadding;
        var tWidth = t1Width + t2Width

        this.svgContainer.selectAll("text.temp").remove();

        this.svgContainer.append("rect")
              .attr("class","legend")
              .attr("x", this_copy.xAxisLength - tWidth - tPadding)
              .attr("y", yScale(this.yMax))
              .attr("width",  tWidth + tPadding)
              .attr("height", tHeight + tPadding - yScale(this.yMax))
              .attr("transform", function() {
                  return "translate(" + this_copy.margin_left + "," + this_copy.margin_top + ")";
                  })
              // .style("fill", "white")
              // .style("stroke", "#dbdbdb")
              .style("stroke-width", "1");

        this.svgContainer.append("text")
              .attr("x", this_copy.xAxisLength - tWidth)
              .attr("y", tHeight)
              .attr("transform", function() {
                  return "translate(" + this_copy.margin_left + "," + this_copy.margin_top + ")";
                  })
              .text("LAeq(1s)")
              .attr("font-size", "small")
              .style("fill", "#f61d1d")

        this.svgContainer.append("text")
              .attr("x", this_copy.xAxisLength - t2Width)
              .attr("y", tHeight)
              .attr("transform", function() {
                  return "translate(" + this_copy.margin_left + "," + this_copy.margin_top + ")";
                  })
              .text("LAeq(t)")
              .attr("font-size", "small")
              .style("fill", "#b366ff")



    }

    public update(dbATimeChart,dbARunningChart,range){

        this.yMin = range.lower
        this.yMax = range.upper

        for (let i = 0; i < dbATimeChart.length; i++)  {
            if (dbARunningChart[i].y < this.yMin) {
              dbARunningChart[i].y = this.yMin
            }
            if (dbARunningChart[i].y > this.yMax) {
              dbARunningChart[i].y = this.yMax
            }
            if (dbATimeChart[i].y < this.yMin) {
              dbATimeChart[i].y = this.yMin
            }
            if (dbATimeChart[i].y > this.yMax) {
              dbATimeChart[i].y = this.yMax
            }
        }

        d3.select("#dbATimeChart").remove();
        d3.select("#dbARunningChart").remove();

        var this_copy = this;

        this.svgContainer.append("path")
            .attr("id", "dbATimeChart")
            .attr("d", this.line(dbATimeChart))
            .attr("fill", "none")
            .attr("stroke", "#f61d1d")
            .attr("transform", function() {
            return "translate(" + this_copy.margin_left + "," + this_copy.margin_top + ")";
            });

        this.svgContainer.append("path")
            .attr("id", "dbARunningChart")
            .attr("d", this.line(dbARunningChart))
            .attr("fill", "none")
            .attr("stroke", "#b366ff")
            .attr("transform", function() {
            return "translate(" + this_copy.margin_left + "," + this_copy.margin_top + ")";
            });

    }

}
