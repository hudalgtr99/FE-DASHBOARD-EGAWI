import PropTypes from "prop-types";
import { Fragment } from "react";
import Chart from "react-apexcharts";
import { Card } from "@/components";

const CardDonuts = ({
  title,
  icon,
  dataSeries,
  dataLabels,
  dataColor,
}) => {
  const chartConfig = {
    series: dataSeries,
    options: {
      chart: {
        height: 300,
        type: "donut",
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
        text: "No Data Available",
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
        position: "bottom",
        labels: {
          colors: ["dark:text-white", "dark:text-white", "dark:text-white"],
        },
      },
    },
  };

  return (
    <Fragment>
      <Card
        onClick={() => ""}
        color={"primary"}
        rounded={"md"}
        variant="border"
      >
        <div className="flex gap-1 items-center">
          <span className="text-xl">{icon}</span>
          <p className="text-slate-800 dark:text-gray-400">{title}</p>
        </div>
        <div className="flex justify-center py-4">
          <Chart
            options={chartConfig.options}
            series={chartConfig.series}
            type="donut"
            height={200}
            className="text-slate-800 dark:text-gray-400"
          />
        </div>
      </Card>
    </Fragment>
  );
};

CardDonuts.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.element.isRequired,
  dataSeries: PropTypes.arrayOf(PropTypes.number).isRequired,
  dataLabels: PropTypes.arrayOf(PropTypes.string).isRequired,
  dataColor: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default CardDonuts;
