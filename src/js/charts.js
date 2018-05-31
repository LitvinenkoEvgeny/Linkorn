import * as d3 from "d3";

class Chart {
    constructor() {
        this.fontFamily = "LibreFranklinLight";
        this.width = 450;
        this.height = 400;

        this.svg = null;
    }

    static valueToKNotation(val) {
        // vaToKNotation(500) => 500
        // vaToKNotation(1500) => 1.5K
        if (val >= 1000) {
            return `${val / 1000}K`;
        } else {
            return val;
        }
    }

    setCanvasSizes() {
        this.svg.attr("width", this.width);
        this.svg.attr("height", this.height);
    }

    setCanvasFont(fontFamily = this.fontFamily) {
    //     this.svg.selectAll("text").style("font-family", fontFamily);
    }
}

class ChannelPerformance extends Chart {
    constructor(video, social) {
        super(...arguments);

        this.video = video;
        this.social = social;
        this.data = [this.video, this.social,];
        this.svg = d3.select(".channel-perf__svg");


        this.xScale = d3.scaleLinear().domain([0, 4000,]).range([0, 400,]);
        this.xAxis = d3.axisBottom().scale(this.xScale).tickFormat(Chart.valueToKNotation);
        this.svg.append("g").attr("id", "xAxisGroup").attr("transform", "translate(0, 150)").call(this.xAxis);

        this.yScale = d3.scaleOrdinal().domain(["video", "social"]).range([0, 150,]);
        this.yAxis = d3.axisRight().scale(this.yScale);
        this.svg.append("g").attr("id", "yAxisGroup").call(this.yAxis);


        this.setCanvasSizes();
        this.setCanvasFont();
        this.render();
    }

    render() {
        const that = this;

        this.svg.selectAll("g.dataGroup")
            .data(this.data)
            .enter()
            .append("g")
            .attr("class", "dataGroup")
            .attr("transform", (d, i) => `translate(0, ${i * 75})`)
            .append("rect")
            .attr("height", 65)
            .attr("fill", "#00B7F1")
            .attr("fill-opacity", "0.49")
            .attr("width", d => this.xScale(d));

        this.svg.selectAll("g.dataGroup").each(function (d) {
            const group = d3.select(this);

            group.append("text").text(d);
        });

        this.svg.selectAll("g.dataGroup text").each(function (d) {
            const text = d3.select(this);
            const textWidth = this.clientWidth;
            text
                .attr("transform", d => {
                    // ensure that text inside svg canvas
                    // else put text inside block
                    let textX = that.xScale(d) + 20;

                    if (textX + textWidth + 20 >= that.width) {
                        textX = textX - 80;
                    }
                    return `translate(${textX}, 34)`;
                });

        });
    }


}

export default ChannelPerformance;