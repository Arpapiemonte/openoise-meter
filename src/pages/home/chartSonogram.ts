import * as d3 from 'd3';
import * as d3Legend from 'd3-svg-legend';

export class chartSonogram {

    width:number;
    height:number;
    margin_top = 10;
    margin_bottom = 20;
    margin_right = 10;
    margin_left = 25;
    xAxisLength:number;
    yAxisLength:number;
    barWidth:number;
    barHeight:number;

    svgContainer:any;
    line:any;
    x:any;
    y:any;
    g:any;
    color:any;

    thirdOctaveLabels:Array<string> = ["16", "20", "25", "31.5", "40", "50", "63", "80", "100", "125", "160", "200", "250", "315", "400", "500",
    "630", "800", "1000", "1250", "1600", "2000", "2500", "3150", "4000", "5000", "6300", "8000", "10000", "12500", "16000", "20000"];


    constructor(dbBandTimeSonogram,translation){

        // var thirdOctave:Array<number> = [16, 20, 25, 31.5, 40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500,
        //     630, 800, 1000, 1250, 1600, 2000, 2500, 3150, 4000, 5000, 6300, 8000, 10000, 12500, 16000, 20000];

        var this_copy = this;

        var numberSec:Array<number> = [];

        for (let i = 0; i < 31; i++){
            numberSec[i] = i - 30;
        }

        this.width = parseFloat(d3.select('#chartSonogram').style('width'));
        this.height = Math.round(0.77 * this.width);

        d3.select("#svgSonogram").remove();

        this.svgContainer = d3.select("#chartSonogram")
            .append("svg")
            .attr("id", "svgSonogram")
            .attr("width", this_copy.width)
            .attr("height", this_copy.height)
            ;

        // axis y label fanthom
        var yAxisLabel_temp = this.svgContainer.append("text")
            .attr("class","temp")
            .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
            .attr("transform", "translate("+ 0 +","+ 0 +")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
            .text(translation.AXIS_FREQUENCY_OCTAVES);

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

        this.xAxisLength = this.width - 1.6*xTicksLabel_padding - this.margin_left;
        this.yAxisLength = this.height - this.margin_top - this.margin_bottom;

        this.x = d3.scaleBand().rangeRound([0, this_copy.xAxisLength]).padding(0);
        this.y = d3.scaleBand().rangeRound([this_copy.yAxisLength, 0]).padding(0);

        this.x.domain(dbBandTimeSonogram.map(function(d) { return d.time; }));
        this.y.domain(this.thirdOctaveLabels);
        // console.log(dbBandTimeSonogram.map(function(d) { return d.time; }))

        this.barWidth = this.x.bandwidth()
        this.barHeight = this.y.bandwidth()

        // label y axis
        this.svgContainer.append("text")
            // .attr("class","text")
            .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
            .attr("transform", "translate("+ yAxisLabel_padding/2 +","+ (this_copy.margin_top + this_copy.yAxisLength/2) +")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
            .text(translation.AXIS_FREQUENCY_OCTAVES)
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



        this.g = this.svgContainer.append("g")
            .attr("transform", "translate(" + this_copy.margin_left + "," + this_copy.margin_top + ")")

        // // Verical gridlines
        // g.append("g")
        // .attr("class", "grid vertical")
        // .attr("transform", "translate(" + 0 + "," + this_copy.yAxisLength + ")")
        // .call(d3.axisBottom(this_copy.x)
        //     .tickValues(["16", "31.5", "63", "125", "250","500", "1000", "2000", "4000", "8000", "16000"])
        //     .tickSize(-this_copy.yAxisLength)
        //     // .tickSizeOuter(-this_copy.yAxisLength)
        //     .tickFormat(function(d){return ""})
        // );

        // // Horizontal grid
        // g.append("g")
        // .attr("class", "grid horizontal")
        // .call(d3.axisLeft(this_copy.y)
        //     .ticks(10)
        //     .tickSize(-this_copy.xAxisLength)
        //     .tickFormat(function(d){return ""})
        //     );

        // // grid color
        // d3.selectAll(".grid")
        //     .selectAll("line").style("stroke", "#dbdbdb")
        // d3.selectAll(".grid") // this is for the outer tick...
        //     .selectAll("path").style("stroke", "#dbdbdb")

        // x axis all ticks
        this.g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(" + 0 + "," + this_copy.yAxisLength + ")")
            .call(d3.axisBottom(this_copy.x)
                .tickValues(numberSec)
                .tickSize(4)
                .tickSizeOuter(0)
                .tickFormat(function(d){return ""})
        );
        this.g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(" + 0 + "," + this_copy.yAxisLength + ")")
            .call(d3.axisBottom(this_copy.x)
                .tickValues([-30, -25, -20, -15, -10, -5, 0])
                .tickSize(6)
                .tickFormat(function(d:any) {return d + "s"})
                    // var output;
                    // if (d<0){ output= d + "s"}
                    // else {output = "adesso"};
                    // return  output})
                .tickSizeOuter(0)
            );


        this.g.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(this_copy.y)
                .tickSize(2)
                .tickSizeOuter(0)
                .tickFormat(function(d){return ""})

            );

        this.g.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(this_copy.y)
                .tickValues(["16", "31.5", "63", "125", "250","500", "1000", "2000", "4000", "8000", "16000"])
                .tickSize(4)
                .tickSizeOuter(0)
                .tickPadding(1)
                .tickFormat(function(d){if (d=="1000"){return "1K"}
                                        else if (d=="2000"){return "2K"}
                                        else if (d=="4000"){return "4K"}
                                        else if (d=="8000"){return "8K"}
                                        else if (d=="16000"){return "16K"}
                                        else return d})
        )

        // panthom legend
        var elem = document.getElementById('char')
        var backgroundColor = window.getComputedStyle(elem,null).getPropertyValue("background-color");

        this.color = d3.scaleLinear()
                        .domain([10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110])
                        .range(["#000000", //  nero
                                "#99ff66", //  verde chiaro
                                "#00cc00", //  verde scuro
                                "#ffff1a", //  giallo
                                "#ffcc00", //  arancio
                                "#ff9900", //  arancio scuro
                                "#ff1a1a", //  rosso chiaro
                                "#990000", //  rosso scuro
                                "#ff33cc", //  purple
                                "#3333cc", //  blu
                                backgroundColor
                                // "#ccffff", //  azzurro chiaro
                                // "#ffffff", //  bianco
                                ]);

        this.svgContainer.append("g")
          .attr("class", "legendLinear")
          .attr("transform", "translate(20,20)")
          .attr("font-size", "xx-small")

        var legendLinear = d3Legend.legendColor()
          .shapeWidth(this.barWidth)
          .shapeHeight(this.barHeight)
          .shapePadding(3)
          .cells([10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110])
          .labels(["10", "20", "30", "40", "50", "60", "70", "80", "90", "100","dB"])
          // .ascending(true)
          .labelFormat(d3.format(".0f"))
          .labelOffset(3)
          .orient('vertical')
          .labelAlign('middle')
          .scale(this_copy.color);

        this.svgContainer.select(".legendLinear")
          .call(legendLinear);

        var tPadding = 0.7*this.barWidth;
        var legendWidth:number = this.svgContainer.select(".legendLinear").node().getBBox().width;
        // var legendHeight:number = this.svgContainer.select(".legendLinear").node().getBBox().height;

        // this.svgContainer.append("rect")
        //       .attr("class","legend")
        //       .attr("width",  legendWidth + tPadding)
        //       .attr("height", legendHeight + tPadding)
        //       .attr("transform", function() {
        //           return "translate(" + (this_copy.xAxisLength + this_copy.margin_left - legendWidth - 2*tPadding) + "," + (this_copy.margin_top + this_copy.y("16000")) + ")";
        //           })
        //       // .style("fill", "white")
        //       // .style("stroke", "#dbdbdb")
        //       .style("stroke-width", "1");

        // part to remove and re-create legend
        this.svgContainer.selectAll(".legendLinear").remove();
        // end phantom legend
        // legend
        this.svgContainer.append("g")
          .attr("class", "legendLinear")
          .attr("transform", "translate(20,20)")
          .attr("font-size", "xx-small")

        // this.svgContainer.select(".legendLinear")
        //   .attr("transform", function() {
        //       return "translate(" + (this_copy.xAxisLength + this_copy.margin_left - legendWidth - tPadding) + "," + (this_copy.margin_top + this_copy.y("16000") + tPadding) + ")";
        //       })

        this.svgContainer.select(".legendLinear")
          .attr("transform", function() {
              return "translate(" + (this_copy.width - legendWidth) + "," + (this_copy.margin_top + this_copy.y("16000") + tPadding) + ")";
              })

        this.svgContainer.select(".legendLinear")
          .call(legendLinear);

    }

    public update(dbBandTimeSonogram){

        d3.select("#svgSonogram").selectAll("#bars").remove();

        var this_copy = this;

        for (let i = 0; i < dbBandTimeSonogram.length; i++){
            for (let j = 0; j < this_copy.thirdOctaveLabels.length; j++){
                this_copy.g.data(dbBandTimeSonogram)
                    .append("rect")
                        .attr("id", "bars")
                        .attr("fill", this_copy.color(dbBandTimeSonogram[i].data[j].level))
                        .attr("x", this_copy.x(dbBandTimeSonogram[i].time))
                        .attr("y", this_copy.y(this_copy.thirdOctaveLabels[j]))
                        .attr("width", this_copy.barWidth )
                        .attr("height", this_copy.barHeight);
                // console.log(this_copy.color(dbBandTimeSonogram[i].data[j].level))
                // console.log(dbBandTimeSonogram[i].data[j].level)
            }
        }

    }

}
