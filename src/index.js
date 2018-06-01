import "./index.pug";
import "./css/index.sass";
import {random} from 'lodash';

import $ from "jquery";
window.jQuery = $;

import customSelect from "custom-select";

import flatpickr from "flatpickr";

import dt from "datatables.net";
$.fn.dataTable = dt;

import {BlockChart, ChannelSplit} from "./js/charts";


customSelect("select");
const dateInput = document.querySelectorAll(".date-input");

flatpickr(dateInput, {
    mode: "range",
    dateFormat: "d/M/Y",
    locale: {
        rangeSeparator: " - ",
    },
});


$(document).ready(function () {
    $(".checkbox__input").on("click", function () {
        const $this = $(this);

        $this.parent(".checkbox").toggleClass("checkbox--checked");
    });

    $("table").dataTable({
        "paging": false,
        "info": false,
        "searching": false,
        "autoWidth": false,
        "columnDefs": [
            {"targets": [1, 2, 3, 4, 5, 6, 7, 8, 9,], orderable: false,},
        ],
    });

    const data = [
        {
            title: "Video",
            value: 3500,
        },
        {
            title: "Social",
            value: 2200,
        },
    ];

    // const channelPerformance = new BlockChart({width: 750, height: 250, data: data, selector: ".channel-perf__svg",});
    const channelSplit = new ChannelSplit({
        width: 300, height: 250,
        innerRadius: 70,
        outerRadius: 90,
        data: 79, selector: ".channel-split__svg",
    });

    // setInterval(() => {
    //     channelPerformance.updateData([
    //         {
    //             title: "Video",
    //             value: random(0, 4000),
    //         },
    //         {
    //             title: "Social",
    //             value: random(0, 4000),
    //         },
    //     ]);
    //
    // }, 2000);
});

