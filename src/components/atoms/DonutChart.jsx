import { Fragment } from 'react';
import Chart from "react-apexcharts";
import Container from './Container'; // Adjust the import path as needed

const DonutChart = ({
	title,
	icon,
	cardColor,
	dataSeries,
	dataLabels,
	dataColor,
	directionColor,
}) => {
	const chartConfig = {
		series: dataSeries,
		options: {
			chart: {
				height: 300,
				type: 'donut',
				zoom: {
					enabled: false,
				},
				toolbar: {
					show: false,
				},
			},
			stroke: {
				show: false,
			},
			noData: {
				text: "No Data",
				align: "center",
				verticalAlign: "middle",
				offsetX: 0,
				offsetY: -30,
				style: {
					fontSize: "20px",
					color: "dark:text-white",
				},
			},
			labels: dataLabels,
			colors: dataColor,
			responsive: [
				{
					breakpoint: 480,
					options: {
						chart: {
							width: 200,
						},
					},
				},
			],
			legend: {
				position: 'bottom',
				labels: {
					colors: ["dark:text-white", "dark:text-white", "dark:text-white"],
				},
			},
		},
	};

	return (
		<Fragment>
			<Container
				cardColor={cardColor}
				icon={icon}
				title={title}
				directionColor={directionColor}
			>
				<div className="flex justify-center py-4">
					<Chart
						options={chartConfig.options}
						series={chartConfig.series}
						type="donut"
						height={300}
						className="text-black dark:text-white" // Ensure the chart text color adapts to dark mode
					/>
				</div>
			</Container>
		</Fragment>
	);
};

export default DonutChart;
