import { Fragment } from "react";

// components
import Chart from "react-apexcharts";
import CompCardContainer from "./CompCardContainer";

const CompCardDonutChart = ({
	title,
	icon,
	cardColor,
	dataSeries,
	dataLabels,
	dataColor,
	directionColor,
}) => {
	const options = {
		chart: {
			type: "donut",
			fontFamily: null,
		},
		labels: dataLabels,
		colors: dataColor,
		dataLabels: {
			enabled: false,
		},
		fill: {
			type: "gradient",
			gradient: {
				opacityFrom: 0.9,
				opacityTo: 1,
			},
		},
		stroke: {
			show: true,
			colors: "white",
			width: 1,
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
		legend: {
			position: "bottom",
			fontSize: "12px",
		},
		plotOptions: {
			pie: {
				startAngle: 270,
				endAngle: -90,
				customScale: 1,
				donut: {
					size: "65%",
					labels: {
						show: true,
						name: {
							show: false,
						},
						value: {
							show: true,
							offsetY: 10,
							fontSize: "32px",
							color: "#111827",
							fontWeight: 700,
						},
						total: {
							show: true,
							totalAlways: true,
							color: "#111827",
						},
					},
				},
			},
		},
	};

	return (
		<Fragment>
			<CompCardContainer
				cardColor={cardColor}
				icon={icon}
				title={title}
				directionColor={directionColor}
			>
				<div className="flex justify-center py-4">
					<Chart options={options} series={dataSeries} type="donut" />
				</div>
			</CompCardContainer>
		</Fragment>
	);
};

export default CompCardDonutChart;
