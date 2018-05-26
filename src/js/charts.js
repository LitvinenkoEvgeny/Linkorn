import * as d3 from "d3";

class ChannelPerformance {
    constructor(video, social) {
        this.video = video;
        this.social = social;
        this.data = [this.video, this.social,];
        this.svg = d3.select(".channel-perf__svg");
        this.svg.attr("width", "100%");
        this.svg.attr("height", "400px");
        this.xScale = d3.scaleLinear().domain([0, 4000,]).range([0, 100,]);
        this.xAxis = d3.axisBottom().scale(this.xScale).tickFormat(d3.format("s"));
        this.svg.append("g").call(this.xAxis);

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
            .attr("width", d => `${this.xScale(d)}%`)
            .append("text")
            .attr("x", d => `${this.xScale(d) + 1}%`)
            .text(d => d);
    }


}

export default ChannelPerformance;