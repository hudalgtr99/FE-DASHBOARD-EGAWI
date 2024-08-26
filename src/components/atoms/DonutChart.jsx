import { Fragment } from 'react';
import ReactApexChart from 'react-apexcharts';
import CardContainer from './CardContainer'; // Adjust the import path as needed

const DonutChart = ({ colors, icon, title, directionColor }) => {
	const chartConfig = {
		series: [44, 55, 13],
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
			labels: ['Team A', 'Team B', 'Team C'],
			colors: ['#4361ee', '#805dca', '#e2a03f'],
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
				colors={colors}
				icon={icon}
				title={title}
				directionColor={directionColor}
			>
				<div className="flex justify-center py-4">
					<ReactApexChart
						options={chartConfig.options}
						series={chartConfig.series}
						type="donut"
						height={460}
					/>
				</div>
			</CardContainer>
		</Fragment>
	);
};

export default DonutChart;
