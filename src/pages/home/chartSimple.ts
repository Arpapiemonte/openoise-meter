import * as d3 from 'd3';

export class chartSimple {

    width:number;
    height:number;
    margin = 25;
    xAxisLength:number;
    yAxisLength:number;
    barWidth:number;

    svgContainer:any;
    line: any;
    x: any;
    y: any;

    constructor(LAeq, Min, Max){

        var this_copy = this;
        var width_div = parseFloat(d3.select('#chartSimple').style('width'));
        this.width = 0.6 * width_div
        this.height = 1 * width_div;
        this.xAxisLength = this.width - 2*this.margin;
        this.yAxisLength = this.height - 2*this.margin;

        d3.select("#svgSimple").remove();

        this.svgContainer = d3.select("#chartSimple")
            .append("svg")
            .attr("id", "svgSimple")
            .attr("width", this_copy.width)
            .attr("height", this_copy.height)
            ;

        this.x = d3.scaleBand().rangeRound([0, this_copy.xAxisLength]).padding(0.1);
        this.y = d3.scaleLinear().rangeRound([this_copy.yAxisLength, 0]);

        this.x.domain([1]);
        this.y.domain([0,100]);

        this.barWidth = this.x.bandwidth()

        var g = this.svgContainer.append("g")
            .attr("transform", "translate(" + this_copy.margin + "," + (this_copy.margin) + ")")

        // Verical gridlines
        // g.append("g")
        // .attr("class", "grid vertical")
        // .attr("transform", "translate(" + 0 + "," + this_copy.yAxisLength + ")")
        // .call(d3.axisBottom(this_copy.x)
        //     .tickValues(["16", "31.5", "63", "125", "250","500", "1000", "2000", "4000", "8000", "16000"])
        //     .tickSize(-this_copy.yAxisLength)
        //     .tickFormat(function(d){return ""})
        // );

        // Horizontal grid
        g.append("g")
        .attr("class", "grid")
        // .attr("transform", "translate(" + this_copy.margin + "," + (this_copy.margin) + ")")
        .call(d3.axisLeft(this_copy.y)
            .ticks(10)
            .tickSize(- 0.8 * this_copy.xAxisLength)
            .tickFormat(function(d){return ""})
            );

        // grid color
        // d3.selectAll(".grid")
        //     .selectAll("line").style("stroke", "#dbdbdb")
        // d3.selectAll(".grid") // this is for the outer tick...
        //     .selectAll("path").style("stroke", "#dbdbdb")

        // // x axis all ticks
        // g.append("g")
        //     .attr("class", "axis axis--x")
        //     .attr("transform", "translate(" + 0 + "," + this_copy.yAxisLength + ")")
        //     .call(d3.axisBottom(this_copy.x)
        //         .tickSize(4)
        //         .tickSizeOuter(0)
        //         .tickFormat(function(d){return ""})
        //
        //     );
        // // x axis ticks with label
        // g.append("g")
        //     .attr("class", "axis axis--x--with--labels")
        //     .attr("transform", "translate(" + 0 + "," + this_copy.yAxisLength + ")")
        //     .call(d3.axisBottom(this_copy.x)
        //         .tickValues(["16", "31.5", "63", "125", "250","500", "1000", "2000", "4000", "8000", "16000"])
        //         .tickSize(6)
        //         .tickSizeOuter(0)
        //         .tickFormat(function(d){if (d=="1000"){return "1K"}
        //                                 else if (d=="2000"){return "2K"}
        //                                 else if (d=="4000"){return "4K"}
        //                                 else if (d=="8000"){return "8K"}
        //                                 else if (d=="16000"){return "16K"}
        //                                 else return d})
        //     );

        g.append("g")
            .attr("class", "axis axis--y")
            // .attr("transform", "translate(" + this_copy.margin + "," + (this_copy.margin) + ")")
            .call(d3.axisLeft(this_copy.y).ticks(10))

    }

    public update(LAeq, Min, Max){

        d3.select("#svgSimple").selectAll("#bars").remove();

        var this_copy = this;

        d3.select("#svgSimple")
        .append("rect")
        .attr("id", "bars")
        .attr("class", "max")
          .attr("x", this_copy.x(1) )
          .attr("y", this_copy.y(Max) )
          .attr("width", 0.8 * this_copy.barWidth)
          .attr("height", this_copy.yAxisLength * Max/100)
          .attr("transform", "translate(" + this_copy.margin + "," + (this_copy.margin) + ")")
          .attr("fill","#0000ff");

        d3.select("#svgSimple")
        .append("rect")
        .attr("id", "bars")
        .attr("class", "LAeq")
          .attr("x", this_copy.x(1) )
          .attr("y", this_copy.y(LAeq) )
          .attr("width", 0.8 * this_copy.barWidth)
          .attr("height", this_copy.yAxisLength * LAeq/100)
          .attr("transform", "translate(" + this_copy.margin + "," + (this_copy.margin) + ")")
          .attr("fill","#f61d1d");

        d3.select("#svgSimple")
        .append("rect")
        .attr("id", "bars")
        .attr("class", "Min")
          .attr("x", this_copy.x(1) )
          .attr("y", this_copy.y(Min) )
          .attr("width", 0.8 * this_copy.barWidth)
          .attr("height", this_copy.yAxisLength * Min/100)
          .attr("transform", "translate(" + this_copy.margin + "," + (this_copy.margin) + ")")
          .attr("fill","#46a867");


      this.svgContainer.selectAll("text.labels").remove();

      this.svgContainer.append("text")
            .attr("class","labels")
            .attr("x",  (this.barWidth))
            .attr("y",  this_copy.y(Max))
            .attr("transform", function() {
                return "translate(" + this_copy.margin + "," + this_copy.margin + ")";
                })
            .text(("Max " + Max))
            .attr("font-size", "small")
            .style("fill", "#0000ff")

        this.svgContainer.append("text")
              .attr("class","labels")
              .attr("x",  (this.barWidth))
              .attr("y",  this_copy.y(Min))
              .attr("transform", function() {
                  return "translate(" + this_copy.margin + "," + this_copy.margin + ")";
                  })
              .text(("Min " + Min))
              .attr("font-size", "small")
              .style("fill", "#46a867")

    }

}
