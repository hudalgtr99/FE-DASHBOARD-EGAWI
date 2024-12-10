import { ColorPicker, Container } from "@/components";
import { ThemeContext } from "@/context/ThemeContext";
import { useContext, useState } from "react";

const ColorPickerPage = () => {
	const { themeColor } = useContext(ThemeContext);

	const [value, setValue] = useState("");

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-20">
			{/* Color */}
			<Container>
				<div className="text-lg font-normal mb-4">Color Picker</div>
				<div className="text-sm mb-3">
					You can use the{" "}
					<span style={{ color: themeColor }}>color picker</span> to select a
					color.
				</div>

				<div className="grid grid-cols-2 gap-2">
					<ColorPicker
						label="Colorcdcd"
						required
						value={value}
						setValue={setValue}
					/>
				</div>
			</Container>
		</div>
	);
};

export default ColorPickerPage;
