import { Avatar, Badge, Button, Container } from "@/components";
import { ThemeContext } from "@/context/ThemeContext";
import { useContext } from "react";
import { TbExclamationCircle } from "react-icons/tb";

const BadgePage = () => {
	const { themeColor } = useContext(ThemeContext);
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
			{/* Placement */}
			<Container>
				<div className="text-lg font-normal mb-4">Placement</div>
				<div className="text-sm mb-3">
					The <span style={{ color: themeColor }}>placement</span> prop is used
					to change the placement of the badge.
				</div>

				<div className="flex flex-wrap gap-2 gap-x-6">
					<Badge placement="left-start" color="primary">
						<Avatar>
							<img src="https://i.pravatar.cc/100" alt="avatar" />
						</Avatar>
					</Badge>
					<Badge placement="left" color="primary">
						<Avatar>
							<img src="https://i.pravatar.cc/100" alt="avatar" />
						</Avatar>
					</Badge>
					<Badge placement="left-end" color="primary">
						<Avatar>
							<img src="https://i.pravatar.cc/100" alt="avatar" />
						</Avatar>
					</Badge>
					<Badge placement="top-start" color="primary">
						<Avatar>
							<img src="https://i.pravatar.cc/100" alt="avatar" />
						</Avatar>
					</Badge>
					<Badge placement="top" color="primary">
						<Avatar>
							<img src="https://i.pravatar.cc/100" alt="avatar" />
						</Avatar>
					</Badge>
					<Badge placement="top-end" color="primary">
						<Avatar>
							<img src="https://i.pravatar.cc/100" alt="avatar" />
						</Avatar>
					</Badge>
					<Badge placement="right-start" color="primary">
						<Avatar>
							<img src="https://i.pravatar.cc/100" alt="avatar" />
						</Avatar>
					</Badge>
					<Badge placement="right" color="primary">
						<Avatar>
							<img src="https://i.pravatar.cc/100" alt="avatar" />
						</Avatar>
					</Badge>
					<Badge placement="right-end" color="primary">
						<Avatar>
							<img src="https://i.pravatar.cc/100" alt="avatar" />
						</Avatar>
					</Badge>
					<Badge placement="bottom-start" color="primary">
						<Avatar>
							<img src="https://i.pravatar.cc/100" alt="avatar" />
						</Avatar>
					</Badge>
					<Badge placement="bottom" color="primary">
						<Avatar>
							<img src="https://i.pravatar.cc/100" alt="avatar" />
						</Avatar>
					</Badge>
					<Badge placement="bottom-end" color="primary">
						<Avatar>
							<img src="https://i.pravatar.cc/100" alt="avatar" />
						</Avatar>
					</Badge>
				</div>
			</Container>

			{/* Color */}
			<Container>
				<div className="text-lg font-normal mb-4">Color</div>
				<div className="text-sm mb-3">
					The <span style={{ color: themeColor }}>color</span> prop is used to
					change the color of the badge.
				</div>

				<div className="flex flex-wrap gap-2">
					<Badge color="primary">
						<Avatar>
							<img src="https://i.pravatar.cc/100" alt="avatar" />
						</Avatar>
					</Badge>
					<Badge color="base">
						<Avatar>
							<img src="https://i.pravatar.cc/100" alt="avatar" />
						</Avatar>
					</Badge>
					<Badge color="success">
						<Avatar>
							<img src="https://i.pravatar.cc/100" alt="avatar" />
						</Avatar>
					</Badge>
					<Badge color="warning">
						<Avatar>
							<img src="https://i.pravatar.cc/100" alt="avatar" />
						</Avatar>
					</Badge>
					<Badge color="danger">
						<Avatar>
							<img src="https://i.pravatar.cc/100" alt="avatar" />
						</Avatar>
					</Badge>
					<Badge color="info">
						<Avatar>
							<img src="https://i.pravatar.cc/100" alt="avatar" />
						</Avatar>
					</Badge>
				</div>
			</Container>

			{/* Size */}
			<Container>
				<div className="text-lg font-normal mb-4">Size</div>
				<div className="text-sm mb-3">
					The <span style={{ color: themeColor }}>size</span> prop is used to
					change the size of the badge.
				</div>

				<div className="flex flex-wrap gap-2">
					<Badge size="xs" color="primary">
						<Avatar>
							<img src="https://i.pravatar.cc/100" alt="avatar" />
						</Avatar>
					</Badge>
					<Badge size="sm" color="primary">
						<Avatar>
							<img src="https://i.pravatar.cc/100" alt="avatar" />
						</Avatar>
					</Badge>
					<Badge size="md" color="primary">
						<Avatar>
							<img src="https://i.pravatar.cc/100" alt="avatar" />
						</Avatar>
					</Badge>
					<Badge size="lg" color="primary">
						<Avatar>
							<img src="https://i.pravatar.cc/100" alt="avatar" />
						</Avatar>
					</Badge>
					<Badge size="xl" color="primary">
						<Avatar>
							<img src="https://i.pravatar.cc/100" alt="avatar" />
						</Avatar>
					</Badge>
				</div>
			</Container>

			{/* Rounded */}
			<Container>
				<div className="text-lg font-normal mb-4">Rounded</div>
				<div className="text-sm mb-3">
					The <span style={{ color: themeColor }}>rounded</span> prop is used to
					change the rounded of the badge.
				</div>

				<div className="flex flex-wrap gap-2">
					<Badge rounded="none" color="primary">
						<Avatar>
							<img src="https://i.pravatar.cc/100" alt="avatar" />
						</Avatar>
					</Badge>
					<Badge rounded="sm" color="primary">
						<Avatar>
							<img src="https://i.pravatar.cc/100" alt="avatar" />
						</Avatar>
					</Badge>
					<Badge rounded="md" color="primary">
						<Avatar>
							<img src="https://i.pravatar.cc/100" alt="avatar" />
						</Avatar>
					</Badge>
					<Badge rounded="lg" color="primary">
						<Avatar>
							<img src="https://i.pravatar.cc/100" alt="avatar" />
						</Avatar>
					</Badge>
				</div>
			</Container>

			{/* Value */}
			<Container>
				<div className="text-lg font-normal mb-4">Value</div>
				<div className="text-sm mb-3">
					The <span style={{ color: themeColor }}>value</span> prop is used to
					set the value of the badge.
				</div>

				<div className="flex flex-wrap gap-4">
					<Badge value="99" color="primary">
						<Avatar>
							<img src="https://i.pravatar.cc/100" alt="avatar" />
						</Avatar>
					</Badge>
					<Badge value="Name" placement="bottom" color="primary">
						<Avatar>
							<img src="https://i.pravatar.cc/100" alt="avatar" />
						</Avatar>
					</Badge>
					<Badge
						value={<TbExclamationCircle className="text-xs" />}
						size="xl"
						placement="bottom-end"
						color="danger"
					>
						<Avatar>
							<img src="https://i.pravatar.cc/100" alt="avatar" />
						</Avatar>
					</Badge>
					<Badge size="xl" value="2" color="success">
						<Button color="primary">Notifikasi</Button>
					</Badge>
				</div>
			</Container>

			{/* Spacing & Skidding */}
			<Container>
				<div className="text-lg font-normal mb-4">Spacing & Skidding</div>
				<div className="text-sm mb-3">
					The <span style={{ color: themeColor }}>spacing</span> prop is used to
					set the spacing of the badge. Default value is -12px.
					<br />
					The <span style={{ color: themeColor }}>skidding</span> prop is used
					to set the skidding of the badge. Default value is 0px.
				</div>

				<div className="flex flex-wrap gap-2">
					<Badge color="success">
						<Button color="primary">Default</Button>
					</Badge>
					<Badge spacing={-10} skidding={-4} color="warning">
						<Button color="primary">-10px & -4px</Button>
					</Badge>
				</div>
			</Container>
		</div>
	);
};

export default BadgePage;
