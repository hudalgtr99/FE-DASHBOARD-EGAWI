import { Fragment } from 'react';
import ReactApexChart from 'react-apexcharts';
import Container from './Container'; // Adjust the import path as needed

const RadialBarChart = ({ colors, icon, title, directionColor, isDark }) => {
    const chartConfig = {
        series: [44, 55, 41],
        options: {
            chart: {
                height: 300,
                type: 'radialBar',
                zoom: {
                    enabled: false,
                },
                toolbar: {
                    show: false,
                },
            },
            colors: ['#4361ee', '#805dca', '#e2a03f'],
            grid: {
                borderColor: isDark ? '#191e3a' : '#e0e6ed',
            },
            plotOptions: {
                radialBar: {
                    dataLabels: {
                        name: {
                            fontSize: '22px',
                        },
                        value: {
                            fontSize: '16px',
                        },
                        total: {
                            show: true,
                            label: 'Total',
                            formatter: function (w) {
                                return 249;
                            },
                        },
                    },
                },
            },
            labels: ['Apples', 'Oranges', 'Bananas'],
            fill: {
                opacity: 0.85,
            },
        },
    };

    return (
        <Fragment>
            <Container
                colors={colors}
                icon={icon}
                title={title}
                directionColor={directionColor}
            >
                <div className="flex justify-center py-4">
                    <ReactApexChart
                        options={chartConfig.options}
                        series={chartConfig.series}
                        type="radialBar"
                        height={460}
                    />
                </div>
            </Container>
        </Fragment>
    );
};

export default RadialBarChart;
