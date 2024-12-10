import { ThemeContext } from "@/context/ThemeContext";
import PropTypes from "prop-types";
import { useContext } from "react";
import { BeatLoader } from "react-spinners";

/**
 *
 * @param {{
 * size: number;
 * loading: boolean;
 * color: "primary" | "base" | "success" | "warning" | "danger" | "info";
 * }}
 *
 */

const Loading = ({ size = 20,
	loading = false,
	color = "primary", }) => {
	const { themeColor } = useContext(ThemeContext);

	const loadColor =
		{
			primary: themeColor,
			base: "#BABCBD",
			success: "#4ED17E",
			warning: "#EEC239",
			danger: "#F26969",
			info: "#629BF8",
		}[color] || color;

	return (
		<div className="flex justify-center items-center">
			<BeatLoader color={loadColor} loading={loading} size={size} />
		</div>
	);
};

Loading.propTypes = {
	size: PropTypes.number,
	loading: PropTypes.bool,
	color: PropTypes.string,
};

export default Loading;
