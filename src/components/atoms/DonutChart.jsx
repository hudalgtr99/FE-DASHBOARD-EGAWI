import { Fragment } from 'react';
import Chart from "react-apexcharts";
import CardContainer from './CardContainer'; // Adjust the import path as needed

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
			},
		},
	};

	return (
		<Fragment>
			<CardContainer
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
					/>
				</div>
			</CardContainer>
		</Fragment>
	);
};

export default DonutChart;
