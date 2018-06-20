import * as d3 from 'd3';

export class chartFFT {

    width:number;
    height:number;
    margin_top = 10;
    margin_bottom = 20;
    margin_right = 10;
    margin_left = 25;
    xAxisLength:number;
    yAxisLength:number;

    svgContainer:any;
    line: any;

    labelsValue:Array<string> = ["20", "50", "100", "200", "500","1000", "2000", "5000", "10000", "20000"];
    labels:Array<string> = ["20", "50", "100", "200", "500","1K", "2K", "5K", "10K", "20K"];
    verticalGridValues:Array<string> = ["10","20","30","40","50","60","70","80","90","100",
                                        "100","200","300","400","500","600","700","800","900","1000",
                                        "1000","2000","3000","4000","5000","6000","7000","8000","9000","10000","20000"];

    yMax: number;
    yMin: number;

    constructor(dbFftChart,dbAFftChart,translation,range){

        this.yMin = range.lower
        this.yMax = range.upper

        var this_copy = this;
        // console.log(d3.select('#chartFFT'))
        this.width = parseFloat(d3.select('#chartFFT').style('width'));
        this.height = Math.round(0.77 * this.width);

        d3.select("#svgFFT").remove();

        this.svgContainer = d3.select("#chartFFT")
            .append("svg")
            .attr("id", "svgFFT")
            .attr("width", this.width)
            .attr("height", this.height);
            // .style("border", "1px solid");

        // axis y label fanthom
        var yAxisLabel_temp = this.svgContainer.append("text")
            .attr("class","temp")
            .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
            .attr("transform", "translate("+ 0 +","+ 0 +")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
            .text(translation.AXIS_DB_DBA);

        var yAxisLabel_padding = yAxisLabel_temp.node().getBBox().height;

        this.svgContainer.selectAll("text.temp").remove();
        // end axis y label fanthom

        // axis x label fanthom
        var xAxisLabel_temp = this.svgContainer.append("text")
            .attr("class","temp")
            // .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
            .attr("transform", "translate("+ 0 +","+ 0 +")")  // text is drawn off the screen top left, move down and out and rotate
            .text(translation.AXIS_FREQUENCY_FFT);

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

        var xScale = d3.scaleLog()
            .domain([10, 22050])
            .range([0, this.xAxisLength]);

        var yScale = d3.scaleLinear()
            .domain([this.yMax, this.yMin])
            .range([0, this.yAxisLength]);


        // label y axis
        this.svgContainer.append("text")
            // .attr("class","text")
            .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
            .attr("transform", "translate("+ yAxisLabel_padding/2 +","+ (this_copy.margin_top + this_copy.yAxisLength/2) +")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
            .text(translation.AXIS_DB_DBA)
            .attr("font-size", "x-small");
        // end label y axis

        // label x axis
        this.svgContainer.append("text")
            // .attr("class","text")
            .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
            .attr("transform", "translate("+ (this_copy.margin_left + this_copy.xAxisLength/2) +","+ (this_copy.height - xAxisLabel_padding/8) +")")  // text is drawn off the screen top left, move down and out and rotate
            .text(translation.AXIS_FREQUENCY_FFT)
            .attr("font-size", "x-small");
        // end label x axis

        // Verical gridlines
        var Vgridlines = d3.axisTop(xScale)
            .tickValues(this_copy.verticalGridValues)
            .tickSize(this.yAxisLength)
            .tickFormat(function(d:any) {return ""});
        //
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

        // this.svgContainer.selectAll(".grid")
        //         .selectAll("line").style("stroke", "#dbdbdb")
        // this.svgContainer.selectAll(".grid")
        //         .selectAll("path").style("stroke", "#dbdbdb")

        // x axis
        this.svgContainer.append("g")
            .classed("x-axis", true)
            .attr("transform", function() {
                return "translate(" + this_copy.margin_left + "," + (this_copy.height - this_copy.margin_bottom) + ")";
                })
            .call(d3.axisBottom(xScale)
                    .ticks(10)
                    .tickSize(3)
                    .tickFormat(function(d:any) { return ""})
            );

        this.svgContainer.append("g")
            .classed("x-axis", true)
            .attr("transform", function() {
                return "translate(" + this_copy.margin_left + "," + (this_copy.height - this_copy.margin_bottom) + ")";
                })
            .call(d3.axisBottom(xScale)
                    .tickValues(this_copy.labelsValue)
                    .tickSize(6)
                    .tickFormat(function(d:any) { var index = this_copy.labelsValue.indexOf(d);
                                                  if (index >= 0) {
                                                    return this_copy.labels[index]
                                                  }
                                                })
            );

        // y axis
        this.svgContainer.append("g")
            .classed("y-axis", true)
            .attr("transform", function() {
                return "translate(" + this_copy.margin_left + "," + this_copy.margin_top + ")";
                })
            .call(d3.axisLeft(yScale));

        // lines
        this.line = d3.line()
            .x(function(d:any) { return xScale(d.x); })
            .y(function(d:any) { return yScale(d.y); })
            .curve(d3.curveLinear);

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
              .text("Leq(1s)")

        var tHeight = t1.node().getBBox().height;
        var tPadding = tHeight * 0.66;

        var t1Width = t1.node().getBBox().width + tPadding;
        var t2Width = t2.node().getBBox().width + tPadding;
        var tWidth = t1Width + t2Width

        this.svgContainer.selectAll("text.temp").remove();

        this.svgContainer.append("rect")
              .attr("class","legend")
              .attr("x", this_copy.xAxisLength - tWidth - tPadding)
              .attr("y", yScale(this_copy.yMax))
              .attr("width",  tWidth + tPadding)
              .attr("height", tHeight + tPadding - yScale(this_copy.yMax))
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
              .text("Leq(1s)")
              .attr("font-size", "small")
              .style("fill", "#01A9DB")

    }

    public update(dbFftChart,dbAFftChart,range){

        this.yMin = range.lower
        this.yMax = range.upper

        console.log(dbFftChart)

        for (let i = 0; i < dbFftChart.length; i++)  {
            if (dbFftChart[i].y < this.yMin) {
              dbFftChart[i].y = this.yMin
            }
            if (dbFftChart[i].y > this.yMax) {
              dbFftChart[i].y = this.yMax
            }
            if (dbAFftChart[i].y < this.yMin) {
              dbAFftChart[i].y = this.yMin
            }
            if (dbAFftChart[i].y > this.yMax) {
              dbAFftChart[i].y = this.yMax
            }
        }

        d3.select("#dbFftChart").remove();
        d3.select("#dbAFftChart").remove();

        var this_copy = this;

        this.svgContainer.append("path")
            .attr("id", "dbFftChart")
            .attr("d", this.line(dbFftChart))
            .attr("fill", "none")
            .attr("stroke", "#01A9DB")
            .attr("transform", function() {
            return "translate(" + this_copy.margin_left + "," + this_copy.margin_top + ")";
            });

        this.svgContainer.append("path")
            .attr("id", "dbAFftChart")
            .attr("d", this.line(dbAFftChart))
            .attr("fill", "none")
            .attr("stroke", "#f61d1d")
            .attr("transform", function() {
            return "translate(" + this_copy.margin_left + "," + this_copy.margin_top + ")";
            });

    }

}
