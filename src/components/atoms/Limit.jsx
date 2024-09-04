import { Select } from "..";
import PropTypes from "prop-types";

/**
 *
 * @param {{
 * limit: number;
 * setLimit: React.Dispatch<React.SetStateAction<number>>;
 * onChange?: (value: number) => void;
 *  }}
 *
 */

const Limit = ({ limit = 10, setLimit, onChange }) => {
	const options = [
		{ value: 10, label: "10" },
		{ value: 25, label: "25" },
		{ value: 50, label: "50" },
		{ value: 100, label: "100" },
	];

	return (
		<div className="w-20">
			<Select
				options={options}
				value={options.find((item) => item.value === limit)}
				onChange={({ value }) => {
					setLimit(value);
					onChange && onChange(value);
				}}
			/>
		</div>
	);
};

Limit.propTypes = {
	limit: PropTypes.number.isRequired,
	setLimit: PropTypes.func.isRequired,
	onChange: PropTypes.func,
};

export default Limit;
