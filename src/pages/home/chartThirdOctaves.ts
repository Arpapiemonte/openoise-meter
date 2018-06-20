import * as d3 from 'd3';

export class chartThirdOctaves {

    width:number;
    height:number;
    margin_top = 10;
    margin_bottom = 20;
    margin_right = 10;
    margin_left = 25;
    xAxisLength:number;
    yAxisLength:number;
    barWidth:number;

    svgContainer:any;
    line: any;
    x: any;
    y: any;


    yMax: number;
    yMin: number;

    constructor(dbBand,translation,range){

        this.yMin = range.lower
        this.yMax = range.upper

        var this_copy = this;

        this.width = parseFloat(d3.select('#chartThirdOctaves').style('width'));
        this.height = Math.round(0.77 * this.width);

        d3.select("#svgThirdOctaves").remove();

        this.svgContainer = d3.select("#chartThirdOctaves")
            .append("svg")
            .attr("id", "svgThirdOctaves")
            .attr("width", this_copy.width)
            .attr("height", this_copy.height)
            ;

        // axis y label fanthom
        var yAxisLabel_temp = this.svgContainer.append("text")
            .attr("class","temp")
            .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
            .attr("transform", "translate("+ 0 +","+ 0 +")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
            .text(translation.AXIS_DB);

        var yAxisLabel_padding = yAxisLabel_temp.node().getBBox().height;

        this.svgContainer.selectAll("text.temp").remove();
        // end axis y label fanthom

        // axis x label fanthom
        var xAxisLabel_temp = this.svgContainer.append("text")
            .attr("class","temp")
            // .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
            .attr("transform", "translate("+ 0 +","+ 0 +")")  // text is drawn off the screen top left, move down and out and rotate
            .text(translation.AXIS_FREQUENCY_OCTAVES);

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
        // end x ticks fanthom

        this.margin_left = yAxisLabel_padding*1.2 + yTicksLabel_padding
        this.margin_bottom = xAxisLabel_padding + xTicksLabel_padding

        this.xAxisLength = this.width - this.margin_right - this.margin_left;
        this.yAxisLength = this.height - this.margin_top - this.margin_bottom;

        // label y axis
        this.svgContainer.append("text")
            // .attr("class","text")
            .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
            .attr("transform", "translate("+ yAxisLabel_padding/2 +","+ (this_copy.margin_top + this_copy.yAxisLength/2) +")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
            .text(translation.AXIS_DB)
            .attr("font-size", "x-small");
        // end label y axis

        // label x axis
        this.svgContainer.append("text")
            // .attr("class","text")
            .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
            .attr("transform", "translate("+ (this_copy.margin_left + this_copy.xAxisLength/2) +","+ (this_copy.height - xAxisLabel_padding/8) +")")  // text is drawn off the screen top left, move down and out and rotate
            .text(translation.AXIS_FREQUENCY_OCTAVES)
            .attr("font-size", "x-small");
        // end label x axis

        this.x = d3.scaleBand().rangeRound([0, this_copy.xAxisLength]).padding(0.1);
        this.y = d3.scaleLinear().rangeRound([this_copy.yAxisLength, 0]);

        this.x.domain(dbBand.map(function(d) { return d.band; }));
        this.y.domain([this.yMin,this.yMax]);

        this.barWidth = this.x.bandwidth()

        var g = this.svgContainer.append("g")
            .attr("transform", "translate(" + this_copy.margin_left + "," + this_copy.margin_top + ")")

        // Verical gridlines
        g.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(" + 0 + "," + this_copy.yAxisLength + ")")
        .call(d3.axisBottom(this_copy.x)
            .tickValues(["16", "31.5", "63", "125", "250","500", "1000", "2000", "4000", "8000", "16000"])
            .tickSize(-this_copy.yAxisLength)
            .tickFormat(function(d){return ""})
        );

        // Horizontal grid
        g.append("g")
        .attr("class", "grid")
        .call(d3.axisLeft(this_copy.y)
            .ticks(10)
            .tickSize(-this_copy.xAxisLength)
            .tickFormat(function(d){return ""})
            );

        // grid color
        // d3.select('#chartThirdOctaves').selectAll(".grid")
        //     .selectAll("line").style("stroke", "#dbdbdb")
        // d3.select('#chartThirdOctaves').selectAll(".grid") // this is for the outer tick...
        //     .selectAll("path").style("stroke", "#dbdbdb")

        // x axis all ticks
        g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(" + 0 + "," + this_copy.yAxisLength + ")")
            .call(d3.axisBottom(this_copy.x)
                .tickSize(4)
                .tickSizeOuter(0)
                .tickFormat(function(d){return ""})

            );
        // x axis ticks with label
        g.append("g")
            .attr("class", "axis axis--x--with--labels")
            .attr("transform", "translate(" + 0 + "," + this_copy.yAxisLength + ")")
            .call(d3.axisBottom(this_copy.x)
                .tickValues(["16", "31.5", "63", "125", "250","500", "1000", "2000", "4000", "8000", "16000"])
                .tickSize(6)
                .tickSizeOuter(0)
                .tickFormat(function(d){if (d=="1000"){return "1K"}
                                        else if (d=="2000"){return "2K"}
                                        else if (d=="4000"){return "4K"}
                                        else if (d=="8000"){return "8K"}
                                        else if (d=="16000"){return "16K"}
                                        else return d})
            );

        g.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(this_copy.y).ticks(10))


        // legend
        var t1 = this.svgContainer.append("text")
              .attr("class","temp")
              .attr("x", 20)
              .attr("y", 20)
              .attr("font-size", "small")
              .text("Lmin")
        var t2 = this.svgContainer.append("text")
              .attr("class","temp")
              .attr("x", 20)
              .attr("y", 20)
              .attr("font-size", "small")
              .text("Leq(1s)")
        var t3 = this.svgContainer.append("text")
              .attr("class","temp")
              .attr("x", 20)
              .attr("y", 20)
              .attr("font-size", "small")
              .text("Leq(t)")
        var t4 = this.svgContainer.append("text")
              .attr("class","temp")
              .attr("x", 20)
              .attr("y", 20)
              .attr("font-size", "small")
              .text("Lmax")

        var tHeight = t1.node().getBBox().height;
        var tPadding = tHeight * 0.66;

        var t1Width = t1.node().getBBox().width + tPadding;
        var t2Width = t2.node().getBBox().width + tPadding;
        var t3Width = t3.node().getBBox().width + tPadding;
        var t4Width = t4.node().getBBox().width + tPadding;
        var tWidth = t1Width + t2Width + t3Width + t4Width

        this.svgContainer.selectAll("text.temp").remove();

        this.svgContainer.append("rect")
              .attr("class","legend")
              .attr("x", this_copy.xAxisLength - tWidth - tPadding)
              .attr("y", this_copy.y(this_copy.yMax))
              .attr("width", tWidth + tPadding)
              .attr("height", tHeight + tPadding - this_copy.y(this_copy.yMax))
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
              .attr("font-size", "small")
              .text("Lmin")
              .style("fill", "#46a867")

        this.svgContainer.append("text")
              .attr("x", this_copy.xAxisLength - t2Width - t3Width - t4Width)
              .attr("y", tHeight)
              .attr("transform", function() {
                  return "translate(" + this_copy.margin_left + "," + this_copy.margin_top + ")";
                  })
              .attr("font-size", "small")
              .text("Leq(1s)")
              .style("fill", "#f61d1d")

        this.svgContainer.append("text")
              .attr("x", this_copy.xAxisLength - t3Width - t4Width)
              .attr("y", tHeight)
              .attr("transform", function() {
                  return "translate(" + this_copy.margin_left + "," + this_copy.margin_top + ")";
                  })
              .attr("font-size", "small")
              .text("Leq(t)")
              .style("fill", "#b366ff")

        this.svgContainer.append("text")
              .attr("x", this_copy.xAxisLength - t4Width)
              .attr("y", tHeight)
              .attr("transform", function() {
                  return "translate(" + this_copy.margin_left + "," + this_copy.margin_top + ")";
                  })
              .attr("font-size", "small")
              .text("Lmax")
              .style("fill", "#0000ff")




    }

    public update(dbBand,range){

        this.yMin = range.lower
        this.yMax = range.upper

        // console.log(dbBand)

        for (let i = 0; i < dbBand.length; i++)  {
            if (dbBand[i].level < this.yMin) {
              dbBand[i].level = this.yMin
            }
            if (dbBand[i].level > this.yMax) {
              dbBand[i].level = this.yMax
            }
            if (dbBand[i].min < this.yMin) {
              dbBand[i].min = this.yMin
            }
            if (dbBand[i].min > this.yMax) {
              dbBand[i].min = this.yMax
            }
            if (dbBand[i].max < this.yMin) {
              dbBand[i].max = this.yMin
            }
            if (dbBand[i].max > this.yMax) {
              dbBand[i].max = this.yMax
            }
            if (dbBand[i].running < this.yMin) {
              dbBand[i].running = this.yMin
            }
            if (dbBand[i].running > this.yMax) {
              dbBand[i].running = this.yMax
            }
        }

        d3.select("#svgThirdOctaves").selectAll("#bars").remove();

        var this_copy = this;

        d3.select("#svgThirdOctaves").selectAll(".max")
        .data(dbBand)
        .enter().append("rect")
        .attr("id", "bars")
        .attr("class", "max")
          .attr("x", function(d) { return this_copy.x(d.band) })
          .attr("y", function(d) { return this_copy.y(d.max) })
          .attr("width", this_copy.barWidth)
          .attr("height", function(d) {return this_copy.yAxisLength * (d.max - this_copy.yMin)/(this_copy.yMax - this_copy.yMin)})
          .attr("transform", "translate(" + this_copy.margin_left + "," + (this_copy.margin_top) + ")")
          .attr("fill","#0000ff");

        d3.select("#svgThirdOctaves").selectAll(".running")
        .data(dbBand)
        .enter().append("rect")
        .attr("id", "bars")
        .attr("class", "running")
          .attr("x", function(d) { return this_copy.x(d.band) })
          .attr("y", function(d) { return this_copy.y(d.running) })
          .attr("width", this_copy.barWidth)
          .attr("height", function(d) {return this_copy.yAxisLength * (d.running - this_copy.yMin)/(this_copy.yMax - this_copy.yMin) })
          .attr("transform", "translate(" + this_copy.margin_left + "," + (this_copy.margin_top) + ")")
          .attr("fill","#b366ff");

        d3.select("#svgThirdOctaves").selectAll(".level")
        .data(dbBand)
        .enter().append("rect")
        .attr("id", "bars")
        .attr("class", "level")
          .attr("x", function(d) { return this_copy.x(d.band) })
          .attr("y", function(d) { return this_copy.y(d.level) })
          .attr("width", this_copy.barWidth)
          .attr("height", function(d) {return this_copy.yAxisLength * (d.level - this_copy.yMin)/(this_copy.yMax - this_copy.yMin) })
          .attr("transform", "translate(" + this_copy.margin_left + "," + (this_copy.margin_top) + ")")
          .attr("fill","#f61d1d");

        d3.select("#svgThirdOctaves").selectAll(".min")
        .data(dbBand)
        .enter().append("rect")
        .attr("id", "bars")
        .attr("class", "min")
            .attr("x", function(d) { return this_copy.x(d.band) })
            .attr("y", function(d) { return this_copy.y(d.min) })
            .attr("width", this_copy.barWidth)
            .attr("height", function(d) {return this_copy.yAxisLength * (d.min - this_copy.yMin)/(this_copy.yMax - this_copy.yMin) })
            .attr("transform", "translate(" + this_copy.margin_left + "," + (this_copy.margin_top) + ")")
            .attr("fill","#46a867");

    }

}
