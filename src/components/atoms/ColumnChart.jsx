import { Fragment } from 'react';
import ReactApexChart from 'react-apexcharts';
import CardContainer from './CardContainer'; // Adjust the import path as needed

const ColumnChart = ({ colors, icon, title, directionColor, isDark, isRtl }) => {
    const chartConfig = {
        series: [
            {
                name: 'Net Profit',
                data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
            },
            {
                name: 'Revenue',
                data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
            },
        ],
        options: {
            chart: {
                height: 300,
                type: 'bar',
                zoom: {
                    enabled: false,
                },
                toolbar: {
                    show: false,
                },
            },
            colors: ['#805dca', '#e7515a'],
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                width: 2,
                colors: ['transparent'],
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '55%',
                    endingShape: 'rounded',
                },
            },
            grid: {
                borderColor: isDark ? '#191e3a' : '#e0e6ed',
                xaxis: {
                    lines: {
                        show: false,
                    },
                },
            },
            xaxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
                axisBorder: {
                    color: isDark ? '#191e3a' : '#e0e6ed',
                },
            },
            yaxis: {
                opposite: isRtl ? true : false,
                labels: {
                    offsetX: isRtl ? -10 : 0,
                },
            },
            tooltip: {
                theme: isDark ? 'dark' : 'light',
                y: {
                    formatter: function (val) {
                        return val;
                    },
                },
            },
        },
    };

    return (
        <Fragment>
            <CardContainer
                colors={colors}
                icon={icon}
                title={title}
                directionColor={directionColor}
            >
                <div className="flex justify-center py-4">
                    <ReactApexChart
                        options={chartConfig.options}
                        series={chartConfig.series}
                        type="bar"
                        height={460}
                    />
                </div>
            </CardContainer>
        </Fragment>
    );
};

export default ColumnChart;
