import { Button, Container } from "@/components";
import { ThemeContext } from "@/context/ThemeContext";
import { useContext } from "react";

const ButtonPage = () => {
	const { themeColor } = useContext(ThemeContext);
	return (
		<div className="grid grid-cols-1 gap-4">
			{/* Color */}
			<Container>
				<div className="text-lg font-normal mb-4">Color</div>
				<div className="text-sm mb-3">
					The <span style={{ color: themeColor }}>color</span> prop is used to
					change the background color of the button.
				</div>

				<div className="flex flex-wrap gap-2">
					<Button color="primary">Primary</Button>
					<Button color="base">Base</Button>
					<Button color="success">Success</Button>
					<Button color="warning">Warning</Button>
					<Button color="danger">Danger</Button>
					<Button color="info">Info</Button>
				</div>
			</Container>

			{/* Variant */}
			<Container>
				<div className="text-lg font-normal mb-4">Variant</div>
				<div className="text-sm mb-3">
					The <span style={{ color: themeColor }}>variant</span> prop is used to
					change the variant of the button.
				</div>

				<div className="text-sm mb-2 mt-4">Solid</div>
				<div className="flex flex-wrap gap-2">
					<Button variant="solid" color="primary">
						Primary
					</Button>
					<Button variant="solid" color="base">
						Base
					</Button>
					<Button variant="solid" color="success">
						Success
					</Button>
					<Button variant="solid" color="warning">
						Warning
					</Button>
					<Button variant="solid" color="danger">
						Danger
					</Button>
					<Button variant="solid" color="info">
						Info
					</Button>
				</div>

				<div className="text-sm mb-2 mt-4">Outline</div>
				<div className="flex flex-wrap gap-2">
					<Button variant="outline" color="primary">
						Primary
					</Button>
					<Button variant="outline" color="base">
						Base
					</Button>
					<Button variant="outline" color="success">
						Success
					</Button>
					<Button variant="outline" color="warning">
						Warning
					</Button>
					<Button variant="outline" color="danger">
						Danger
					</Button>
					<Button variant="outline" color="info">
						Info
					</Button>
				</div>

				<div className="text-sm mb-2 mt-4">Text</div>
				<div className="flex flex-wrap gap-2">
					<Button variant="text" color="primary">
						Primary
					</Button>
					<Button variant="text" color="base">
						Base
					</Button>
					<Button variant="text" color="success">
						Success
					</Button>
					<Button variant="text" color="warning">
						Warning
					</Button>
					<Button variant="text" color="danger">
						Danger
					</Button>
					<Button variant="text" color="info">
						Info
					</Button>
				</div>

				<div className="text-sm mb-2 mt-4">Tonal</div>
				<div className="flex flex-wrap gap-2">
					<Button variant="tonal" color="primary">
						Primary
					</Button>
					<Button variant="tonal" color="base">
						Base
					</Button>
					<Button variant="tonal" color="success">
						Success
					</Button>
					<Button variant="tonal" color="warning">
						Warning
					</Button>
					<Button variant="tonal" color="danger">
						Danger
					</Button>
					<Button variant="tonal" color="info">
						Info
					</Button>
				</div>
			</Container>

			{/* Size */}
			<Container>
				<div className="text-lg font-normal mb-4">Size</div>
				<div className="text-sm mb-3">
					The <span style={{ color: themeColor }}>size</span> prop is used to
					set the size of the button.
				</div>

				<div className="flex flex-wrap items-end gap-2">
					<Button size="xl" color="primary">
						XL
					</Button>
					<Button size="lg" color="base">
						LG
					</Button>
					<Button size="md" color="success">
						MD
					</Button>
					<Button size="sm" color="warning">
						SM
					</Button>
					<Button size="xs" color="danger">
						XS
					</Button>
					<Button size="40" color="danger">
						<span className="text-xs">40</span>
					</Button>
					<Button size="50" color="danger">
						<span className="text-xs">50</span>
					</Button>
				</div>
			</Container>

			{/* Rounded */}
			<Container>
				<div className="text-lg font-normal mb-4">Rounded</div>
				<div className="text-sm mb-3">
					The <span style={{ color: themeColor }}>rounded</span> prop is used to
					set the rounded of the button.
				</div>

				<div className="flex flex-wrap gap-2">
					<Button rounded="none" color="primary">
						None
					</Button>
					<Button rounded="sm" color="base">
						SM
					</Button>
					<Button rounded="md" color="success">
						MD
					</Button>
					<Button rounded="lg" color="warning">
						LG
					</Button>
					<Button rounded="xl" color="danger">
						XL
					</Button>
					<Button rounded="full" color="info">
						Full
					</Button>
				</div>
			</Container>
		</div>
	);
};

export default ButtonPage;
