import "./index.pug";
import "./css/index.sass";

import $ from "jquery";
window.jQuery = $;

import customSelect from "custom-select";

import flatpickr from "flatpickr";

import dt from "datatables.net";
$.fn.dataTable = dt;

import ChannelPerformance from "./js/charts";



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
            {"targets": [1, 2, 3, 4, 5, 6, 7, 8, 9,], orderable: false, },
        ],
    });

    const CP = new ChannelPerformance(3100, 2120);
});

