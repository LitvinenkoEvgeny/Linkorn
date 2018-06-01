import * as d3 from "d3";

class Chart {
    constructor({width, height, selector, data = [],}) {
        this.width = width;
        this.height = height;
        this.data = data.slice();
        this.selector = selector;

        this.svg = d3.select(this.selector);
        this.basicTransition = d3.transition().duration(750).ease(d3.easeBackInOut);
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

    static numberWithCommas(x) {
        // numberWithCommas(1200) => 1,200
        return x.toLocaleString("en-US");
    }

    setCanvasSizes() {
        this.svg.attr("width", this.width);
        this.svg.attr("height", this.height);
    }
}

class RadialChart extends Chart {
    constructor(svgSelector, width = 200, height = 200, data = []) {
        super(...arguments);
        this.fullRadius = Math.min(this.width, this.height) / 2;
        this.arc = d3.arc()
            .innerRadius(this.fullRadius - 10)
            .outerRadius(this.fullRadius - 70);

    }
}

class ChannelPerformance extends Chart {
    constructor() {
        super(...arguments);

        this.xScale = d3.scaleLinear().domain([0, 4000,]).range([0, 555,]);
        this.xAxis = d3.axisBottom().scale(this.xScale).tickFormat(Chart.valueToKNotation).tickSize(-220);
        this.svg.append("g").attr("id", "xAxisGroup").attr("transform", "translate(80, 220)").call(this.xAxis);


        this.yScale = d3.scaleOrdinal().domain(["video", "social",]).range([0, 220,]);
        this.yAxis = d3.axisRight().scale(this.yScale).tickValues(() => "").tickSize(0);
        this.svg.append("g").attr("id", "yAxisGroup").attr("transform", "translate(80, 0)").call(this.yAxis);


        this.setCanvasSizes();
        this.render();
    }

    updateData(data) {
        const self = this;

        this.data = data.slice();

        this.svg.selectAll("g.dataGroup").data(this.data).select("rect")
            .transition(this.basicTransition)
            .attr("width", d => this.xScale(d.value));

        this.svg.selectAll("g.dataGroup").data(this.data).select("text.channel-performance")
            .text(d => Chart.numberWithCommas(d.value));

        this.svg.selectAll("g.dataGroup text.channel-performance").each(function (d) {
            const text = d3.select(this);
            const textWidth = this.clientWidth;
            text
                .transition(self.basicTransition)
                .attr("transform", d => {
                    // ensure self text inside svg canvas
                    // else put text inside block
                    let textX = self.xScale(d.value) + 20;

                    if (textX + textWidth + 20 >= self.width) {
                        textX = textX - 120;
                    }
                    return `translate(${textX}, 45)`;
                });
        });
    }

    render() {
        const self = this;

        this.svg.select("#xAxisGroup").append("line")
            .attr("class", "xAxisBase")
            .attr("stroke", "#000")
            .attr("x1", "90%");

        this.svg.selectAll("g.dataGroup")
            .data(this.data)
            .enter()
            .append("g")
            .attr("class", "dataGroup")
            .attr("transform", (d, i) => `translate(80, ${i * 100})`)
            .append("rect")
            .attr("height", 65)
            .attr("fill", "#00B7F1")
            .attr("fill-opacity", "0.49")
            .transition(this.basicTransition)
            .attr("width", d => this.xScale(d.value));

        this.svg.selectAll("g.dataGroup").each(function (d) {
            const group = d3.select(this);

            group.append("text").attr("class", "channel-performance").text(Chart.numberWithCommas(d.value));
            group.append("text").attr("class", "channel-performance__label").text(d.title);
        });

        this.svg.selectAll("g.dataGroup text.channel-performance").each(function (d) {
            const text = d3.select(this);
            const textWidth = this.clientWidth;
            text
                .transition(self.basicTransition)
                .attr("transform", d => {
                    // ensure self text inside svg canvas
                    // else put text inside block
                    let textX = self.xScale(d.value) + 20;

                    if (textX + textWidth + 20 >= self.width) {
                        textX = textX - 120;
                    }
                    return `translate(${textX}, 45)`;
                });
        });

        this.svg.selectAll("g.dataGroup text.channel-performance__label").each(function (d) {
            const text = d3.select(this);
            text.attr("transform", "translate(-75, 40)");
        });
    }


}

class ChannelSplit extends Chart {
    constructor(percents) {
        super(...arguments);
        this.data = percents;
    }

}

export default ChannelPerformance;