import * as d3 from "d3";
import {flattenDeep,} from "lodash";

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

    /**
     * translate number to localeString
     * numberWithCommas(1200) => 1,200
     *
     * @param x {number}
     * @returns {string}
     */
    static numberWithCommas(x) {
        return x.toLocaleString("en-US");
    }

    setCanvasSizes() {
        this.svg.attr("width", this.width);
        this.svg.attr("height", this.height);
    }
}

class RadialChart extends Chart {
    constructor({selector, width, height, innerRadius, outerRadius, data, className,}) {
        super({selector, width, height,});
        this.data = data;
        this.className = className;
        this.innerRadius = innerRadius;
        this.outerRadius = outerRadius;
        this.fullCircle = Math.PI * 2;

        this.svg.attr("class", `radial-chart ${className}`);

        this.arc = d3.arc()
            .innerRadius(this.innerRadius)
            .outerRadius(this.outerRadius)
            .startAngle(0);

        this.setCanvasSizes();
        this.render();
    }

    static percentsToMedians(percent) {
        return (Math.PI * 2) * percent / 100;
    }

    arcTween(newAngle) {
        // Returns a tween for a transition’s "d" attribute, transitioning any selected
        // arcs from their current angle to the specified new angle.
        // http://bl.ocks.org/mbostock/5100636
        const self = this;
        return function (d) {
            const interpolate = d3.interpolate(d.endAngle, newAngle);
            return function (t) {
                d.endAngle = interpolate(t);
                return self.arc(d);
            };
        };
    }

    updateData(data) {
        this.data = data;

        this.foregroundArc.transition()
            .duration(750)
            .attrTween("d", this.arcTween(RadialChart.percentsToMedians(this.data)));

        this.text.transition(this.basicTransition).text(`${this.data}%`);
    }

    render() {
        const groupClass = `${this.className}__group`;
        const valueTextClass = `${this.className}__text-value`;
        const valueDescriptionClass = `${this.className}__text-description`;

        this.group = this.svg.append("g").attr("class", `radial-chart__group ${groupClass}`)
            .attr("transform", `translate(${this.width / 2}, ${this.height / 2})`);

        this.text = this.group.append("text").attr("class", `radial-chart__value ${valueTextClass}`)
            .attr("text-anchor", "middle")
            .text(`${this.data}%`);

        this.group.append("text")
            .attr("class", () => `radial-chart__description ${valueDescriptionClass}`)
            .attr("text-anchor", "middle")
            .text("Conversions");

        this.backgroundArc = this.group.append("path")
            .datum({endAngle: this.fullCircle,})
            .style("fill", "#a5dd85")
            .attr("d", this.arc);

        this.foregroundArc = this.group.append("path")
            .datum({endAngle: RadialChart.percentsToMedians(this.data),})
            .style("fill", "#85dcf8")
            .attr("d", this.arc);
    }

}

class BlockChart extends Chart {
    constructor({className, blockHeight, blockMargin,}) {
        super(...arguments);

        this.className = className;
        this.blockHeight = blockHeight;
        this.blockMargin = blockMargin;

        // sum of all blocks height and space between
        this.chartSize = (this.data.length * this.blockHeight) + (this.data.length * this.blockMargin);

        this.svg.attr("class", `block-chart ${this.className}`);

        this.xScale = d3.scaleLinear().domain([0, 4000,]).range([0, 555,]);
        this.xAxis = d3.axisBottom().scale(this.xScale).tickFormat(Chart.valueToKNotation).tickSize(-this.chartSize);
        this.svg.append("g").attr("id", "xAxisGroup")
            .attr("class", `block-chart__xAxisGroup ${this.className}__xAxisGroup`)
            .attr("transform", `translate(80, ${this.chartSize})`).call(this.xAxis);


        this.yScale = d3.scaleOrdinal().domain(["video", "social",]).range([0, this.chartSize,]);
        this.yAxis = d3.axisRight().scale(this.yScale).tickValues(() => "").tickSize(0);
        this.svg.append("g").attr("id", "yAxisGroup")
            .attr("class", `block-chart__yAxisGroup ${this.className}__yAxisGroup`)
            .attr("transform", "translate(80, 0)").call(this.yAxis);


        this.setCanvasSizes();
        this.render();
    }

    updateData(data) {
        const self = this;

        this.data = data.slice();

        this.svg.selectAll("g.dataGroup").data(this.data).select("rect")
            .transition(this.basicTransition)
            .attr("width", d => this.xScale(d.value));

        this.svg.selectAll("g.dataGroup").data(this.data).select("text.block-chart__value")
            .text(d => Chart.numberWithCommas(d.value));

        this.svg.selectAll("g.dataGroup text.block-chart__value").each(function () {
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
                    return `translate(${textX}, ${self.blockHeight / 2 + 10})`;
                });
        });
    }

    render() {
        const self = this;

        this.svg.select("#xAxisGroup").append("line")
            .attr("class", `xAxisBase block-chart__xAxisBase ${this.className}__xAxisBase`)
            .attr("stroke", "#000")
            .attr("x1", "90%");

        this.svg.selectAll("g.dataGroup")
            .data(this.data)
            .enter()
            .append("g")
            .attr("class", `dataGroup block-chart__dataGroup ${this.className}__dataGroup`)
            .attr("transform", (d, i) => `translate(80, ${i * (this.blockHeight + this.blockMargin)})`)
            .append("rect")
            .attr("height", this.blockHeight)
            .attr("fill", "#00B7F1")
            .attr("fill-opacity", "0.49")
            .transition(this.basicTransition)
            .attr("width", d => this.xScale(d.value));

        this.svg.selectAll("g.dataGroup").each(function (d) {
            const group = d3.select(this);

            group.append("text")
                .attr("class", `block-chart__value ${this.className}__value`)
                .text(Chart.numberWithCommas(d.value));
            group.append("text")
                .attr("class", `block-chart__label ${this.className}__label`)
                .text(d.title);
        });

        this.svg.selectAll("g.dataGroup text.block-chart__value").each(function () {
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
                    return `translate(${textX}, ${self.blockHeight / 2 + 10})`;
                });
        });

        this.svg.selectAll("g.dataGroup text.block-chart__label").each(function () {
            const text = d3.select(this);
            text.attr("transform", `translate(-75, ${self.blockHeight / 2 + 8})`);
        });
    }


}

class WeekChart extends Chart {
    constructor({className, blockWidth, blockMargin,}) {
        super(...arguments);
        this.className = className;
        this.blockWidth = blockWidth;
        this.blockMargin = blockMargin;


        this.svg.node().classList.add(this.className);
        this.chartGroup = this.svg.append("g").attr("class", `${this.className}__main-group`);

        this.prepareData();

        this.sellsScale = d3.scaleLinear().domain([0, 1500,]).range([this.height - 60, 0,]);
        this.viewsScale = d3.scaleLinear().domain([0, 300,]).range([this.height - 60, 0,]);
        this.datesScale = d3.scaleTime().domain(this.datesMinMax)
            .range([35, 1351,]);

        this.sellsAxis = d3.axisLeft(this.sellsScale)
            .tickFormat(val => Chart.valueToKNotation(val))
            .ticks(4);
        this.viewsAxis = d3.axisRight(this.viewsScale).ticks(4);

        // reassing this value in updateData method
        this.datesAxis = d3.axisBottom(this.datesScale).ticks(7).tickFormat(WeekChart.formatDate);


        this.chartGroup.append("g").attr("class", `${this.className}__sells-axis`)
            .call(this.sellsAxis);
        this.chartGroup.append("g").attr("class", `${this.className}__views-axis`)
            .attr("transform", `translate(${this.width - 30}, 0)`)
            .call(this.viewsAxis);
        this.chartGroup.append("g").attr("class", `${this.className}__dates-axis`)
            .attr("transform", `translate(-20, ${this.height - 40})`)
            .call(this.datesAxis);

        this.line = d3.line()
            .x(d => d[0])
            .y(d => d[1]).curve(d3.curveBasis);

        this.thousandLine = this.chartGroup.append("line")
            .attr("class", `${this.className}__thousand-line`)
            .attr("x1", 10)
            .attr("x2", this.width - 25)
            .attr("y1", this.sellsScale(1000))
            .attr("y2", this.sellsScale(1000))

        this.fiveHundredLine = this.chartGroup.append("line")
            .attr("class", `${this.className}__five-hundred-line`)
            .attr("x1", 10)
            .attr("x2", this.width - 25)
            .attr("y1", this.sellsScale(500))
            .attr("y2", this.sellsScale(500))

        this.setCanvasSizes();
        this.preparePoints();
        this.render();
    }

    prepareData() {
        this.viewsArr = flattenDeep(this.data.map(d => d.views));
        this.sellsArr = flattenDeep(this.data.map(d => d.sells));
        this.datesArr = flattenDeep(this.data.map(d => WeekChart.stringToDate(d.date)));

        this.viewsMinMax = d3.extent(flattenDeep(this.data.map(d => d.views)));
        this.sellsMinMax = d3.extent(flattenDeep(this.data.map(d => d.sells)));
        this.datesMinMax = d3.extent(this.data, d => WeekChart.stringToDate(d.date));

        // увеличить максимальную дату на один день
        this.datesMinMax[1] = WeekChart.increaseDateByOneDay(this.datesMinMax[1]);

    }

    /**
     * Create points object from date for x axis
     * and sells for y axis
     */
    preparePoints() {
        // TODO: refactr
        this.datesX = [];
        this.salesY = [];
        this.points = {};

        this.data.forEach(item => {
            const point = this.datesScale(WeekChart.stringToDate(item.date));

            this.datesX.push(
                point + (this.blockMargin ), 
                point + (this.blockWidth * 2 + this.blockMargin / 2) ,
                point + (this.blockWidth * 3 + 30) );

            item.sells.forEach(sell => {
                this.salesY.push(this.sellsScale(sell));
            });
        });

        this.points.x = this.datesX.slice();
        this.points.y = this.salesY.slice();

        this.points = d3.zip(this.points.x, this.points.y);

    }

    updateData(data) {
        this.data = data.slice();
        this.prepareData();

        // re-render Dates Axis
        this.datesScale = d3.scaleTime().domain(this.datesMinMax)
            .range([25, 1351,]);
        this.datesAxis = d3.axisBottom(this.datesScale).ticks(7).tickFormat(WeekChart.formatDate);
        this.svg.select(`g.${this.className}__dates-axis`).call(this.datesAxis);


        this.chartGroup.selectAll(`g.${this.className}__days-group`)
            .data(this.data)
            .selectAll("rect")
            .data(d => d.views)
            .attr("y", d => this.height - 30 - this.viewsScale(d))
            .style("transform", (d, i) => `translate(${i * (this.blockMargin + this.blockWidth)}px, 0)`)
            .transition(this.basicTransition)
            .attr("height", d => this.viewsScale(d));

        this.preparePoints();

        this.path = this.chartGroup.selectAll(`path.${this.className}__sells-line`)
            .transition(this.basicTransition).duration(1500)
            .attr("d", this.line(this.points)).attr("stroke-width", 2);
    }

    /**
     * return new date from string with format: "yyyy, mm, dd"
     * example: "2018, 05, 09"
     *
     * @param date {string}
     * @returns {Date}
     */
    static stringToDate(date) {
        const [year, month, day,] = date.split(",");
        return new Date(year, month, day);
    }

    static formatDate(date) {
        // need moment.js here
        let dateString = date.toLocaleDateString("en-US", {
                day: "2-digit",
                month: "short",
                year: '2-digit',
            });

        dateString = dateString.replace(",", "");
        const [month, day, year] = dateString.split(" ");

        return `${day} ${month} ${year}`;
    }

    /**
     * Increase given date by one day
     *
     * @param date {Date}
     * @returns {Date}
     */
    static increaseDateByOneDay(date) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    }

    render() {
        this.weeksGroup = this.chartGroup
            .append("g")
            .attr("class", `${this.className}__weeks-group`)

        this.daysGroups = this.weeksGroup.selectAll(`g.${this.className}__days-group`)
            .data(this.data)
            .enter()
            .append("g")
            .attr("class", `${this.className}__days-group`)
            .style("transform", d => `translate(${this.datesScale(WeekChart.stringToDate(d.date))}px, -10px)`)
            .attr("width", this.blockWidth * 3 + this.blockMargin * 3);

        this.viewsRects = this.daysGroups.selectAll(`rect.${this.className}__views-block`)
            .data(d => d.views)
            .enter()
            .append("rect")
            .attr("class", `${this.className}__views-rect`)
            .attr("width", this.blockWidth)
            .attr("y", d => this.height - 30 - this.viewsScale(d))
            .style("transform", (d, i) => `translate(${i * (this.blockMargin + this.blockWidth)}px, 0)`)
            .transition(this.basicTransition)
            .attr("height", d => this.viewsScale(d));


        // this.sellsCircles = this.daysGroups.selectAll(`circle.${this.className}__sells-circle`)
        //     .data(d => d.sells)
        //     .enter()
        //     .append("circle")
        //     .attr("class", `${this.className}__sells-circle`)
        //     .attr("r", "5px")
        //     .style("transform", "translateX(25px)")
        //     .attr("cx", (d, i) => i * (this.blockMargin + this.blockWidth))
        //     .attr("cy", d => this.sellsScale(d));

        this.path = this.chartGroup.append("path").transition(this.basicTransition)
            .attr("class", `${this.className}__sells-line`)
            .attr("d", this.line(this.points)).attr("fill", "none").attr("stroke", "#44B900")
            .attr("stroke-width", 2);


    }
}


class ChannelPerformance extends BlockChart {
    constructor() {
        super(...arguments);
    }
}

class ChannelSplit extends RadialChart {
    constructor() {
        super(...arguments);
    }
}

class Stats extends BlockChart {
    constructor() {
        super(...arguments);
    }
}

class NewVsReturning extends RadialChart {
    constructor() {
        super(...arguments);
    }
}

export {ChannelPerformance, ChannelSplit, NewVsReturning, Stats, WeekChart,} ;