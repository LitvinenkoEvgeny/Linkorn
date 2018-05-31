import * as d3 from "d3";

class Chart {
    constructor(){
        this.fontFamily = "LibreFranklinLight";
        this.width = 450;
        this.height = 400;

        this.svg = null;
    }

    static valueToKNotation(val){
        // vaToKNotation(500) => 500
        // vaToKNotation(1500) => 1.5K
        if(val >= 1000){
            return `${val / 1000}K`;
        } else {
            return val;
        }
    }

    setCanvasSizes(){
        this.svg.attr("width", this.width);
        this.svg.attr("height", this.height);
    }

    setCanvasFont(fontFamily = this.fontFamily){
        this.svg.selectAll("text").style("font-family", fontFamily);
    }
}

class ChannelPerformance extends Chart {
    constructor(video, social) {
        super();
        this.video = video;
        this.social = social;
        this.data = [this.video, this.social,];
        this.svg = d3.select(".channel-perf__svg");


        this.xScale = d3.scaleLinear().domain([0, 4000,]).range([0, 400,]);

        this.xAxis = d3.axisBottom().scale(this.xScale).tickFormat(Chart.valueToKNotation);

        this.svg.append("g").attr("class", "xAxisGroup").call(this.xAxis);


        this.setCanvasSizes();
        this.setCanvasFont();
        this.render();
    }

    render() {
        this.svg.selectAll("rect")
            .data(this.data)
            .enter()
            .append("rect")
            .attr("height", 65)
            .attr("y", (d, i) => 75 * i)
            .attr("fill", "#00B7F1")
            .attr("fill-opacity", "0.49")
            .attr("width", d => this.xScale(d))
            .append("text")
            .attr("x", d => this.xScale(d))
            .text(d => d);
    }


}

export default ChannelPerformance;