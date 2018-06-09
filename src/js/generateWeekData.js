import {random,} from "lodash";

// Returns an array of dates between the two dates
const getDatesBetween = (startDate, endDate) => {
    const dates = [];

    // Strip hours minutes seconds etc.
    let currentDate = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate()
    );

    while (currentDate <= endDate) {
        dates.push(currentDate);

        currentDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate() + 1 // Will increase month if over range
        );
    }

    return dates;
};

// Usage
// const dates = getDatesBetween(new Date(2018, 1, 1), new Date(2018, 1, 9));

const genViewsArr = () => [random(300), random(300), random(300),];
const genSellsArr = () => [random(1500), random(1500), random(1500),];

export default () => {
    const startDay = random(1, 20);
    const endDay = startDay + 6;

    const dates = getDatesBetween(new Date(2018, 1, startDay), new Date(2018, 1, endDay));

    let data = [];

    dates.map(d => {
        data.push({
            date: `${d.getFullYear()}, ${d.getMonth()}, ${d.getDate()}`,
            sells: genSellsArr(),
            views: genViewsArr(),
        });
    });

    return data;
};

