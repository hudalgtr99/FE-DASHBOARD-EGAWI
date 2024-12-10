import { Chip, Container } from "@/components";
import { ThemeContext } from "@/context/ThemeContext";
import { useContext } from "react";

const ChipPage = () => {
	const { themeColor } = useContext(ThemeContext);
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
			{/* Color */}
			<div className="col-span-full">
				<Container>
					<div className="text-lg font-normal mb-4">Color</div>
					<div className="text-sm mb-3">
						The <span style={{ color: themeColor }}>color</span> prop is used to
						change the background color of the chip.
					</div>

					<div className="flex flex-wrap items-end gap-4">
						<Chip color="primary">Primary</Chip>
						<Chip color="base">Base</Chip>
						<Chip color="success">Success</Chip>
						<Chip color="warning">Warning</Chip>
						<Chip color="danger">Danger</Chip>
						<Chip color="info">Info</Chip>
					</div>
				</Container>
			</div>

			{/* Variant */}
			<div className="row-span-2">
				<Container fill>
					<div className="text-lg font-normal mb-4">Variant</div>
					<div className="text-sm mb-3">
						The <span style={{ color: themeColor }}>variant</span> prop is used
						to change the variant of the chip.
					</div>

					<div className="text-sm mb-2 mt-4">Solid</div>
					<div className="flex flex-wrap items-end gap-4">
						<Chip variant="solid" color="primary">
							Primary
						</Chip>
						<Chip variant="solid" color="base">
							Base
						</Chip>
						<Chip variant="solid" color="success">
							Success
						</Chip>
						<Chip variant="solid" color="warning">
							Warning
						</Chip>
						<Chip variant="solid" color="danger">
							Danger
						</Chip>
						<Chip variant="solid" color="info">
							Info
						</Chip>
					</div>

					<div className="text-sm mb-2 mt-4">Outline</div>
					<div className="flex flex-wrap items-end gap-4">
						<Chip variant="outline" color="primary">
							Primary
						</Chip>
						<Chip variant="outline" color="base">
							Base
						</Chip>
						<Chip variant="outline" color="success">
							Success
						</Chip>
						<Chip variant="outline" color="warning">
							Warning
						</Chip>
						<Chip variant="outline" color="danger">
							Danger
						</Chip>
						<Chip variant="outline" color="info">
							Info
						</Chip>
					</div>

					<div className="text-sm mb-2 mt-4">Tonal</div>
					<div className="flex flex-wrap items-end gap-4">
						<Chip variant="tonal" color="primary">
							Primary
						</Chip>
						<Chip variant="tonal" color="base">
							Base
						</Chip>
						<Chip variant="tonal" color="success">
							Success
						</Chip>
						<Chip variant="tonal" color="warning">
							Warning
						</Chip>
						<Chip variant="tonal" color="danger">
							Danger
						</Chip>
						<Chip variant="tonal" color="info">
							Info
						</Chip>
					</div>
				</Container>
			</div>

			{/* Size */}
			<Container>
				<div className="text-lg font-normal mb-4">Size</div>
				<div className="text-sm mb-3">
					The <span style={{ color: themeColor }}>size</span> prop is used to
					set the size of the chip.
				</div>

				<div className="flex flex-wrap items-end gap-2">
					<Chip size="xl" color="primary">
						x-large
					</Chip>
					<Chip size="lg" color="base">
						large
					</Chip>
					<Chip size="md" color="success">
						medium
					</Chip>
					<Chip size="sm" color="warning">
						small
					</Chip>
					<Chip size="xs" color="danger">
						x-small
					</Chip>
				</div>
			</Container>

			{/* Rounded */}
			<Container>
				<div className="text-lg font-normal mb-4">Rounded</div>
				<div className="text-sm mb-3">
					The <span style={{ color: themeColor }}>rounded</span> prop is used to
					set the rounded of the chip.
				</div>

				<div className="flex flex-wrap gap-2">
					<Chip rounded="none" color="primary">
						None
					</Chip>
					<Chip rounded="sm" color="base">
						SM
					</Chip>
					<Chip rounded="md" color="success">
						MD
					</Chip>
					<Chip rounded="lg" color="warning">
						LG
					</Chip>
					<Chip rounded="xl" color="danger">
						XL
					</Chip>
					<Chip rounded="full" color="info">
						Full
					</Chip>
				</div>
			</Container>
		</div>
	);
};

export default ChipPage;
