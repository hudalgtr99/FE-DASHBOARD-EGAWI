import { Avatar, Container } from "@/components";
import { ThemeContext } from "@/context/ThemeContext";
import { useContext } from "react";
import {
	TbCalendar,
	TbCheck,
	TbCloudExclamation,
	TbExclamationMark,
	TbInfoCircle,
	TbSmartHome,
} from "react-icons/tb";

const AvatarPage = () => {
	const { themeColor } = useContext(ThemeContext);
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
			{/* Color */}
			<Container>
				<div className="text-lg font-normal mb-4">Color</div>
				<div className="text-sm mb-3">
					The <span style={{ color: themeColor }}>color</span> prop is used to
					set the color of the avatar.
				</div>

				<div className="flex flex-wrap gap-2">
					<Avatar color="primary">PR</Avatar>
					<Avatar color="base">BA</Avatar>
					<Avatar color="success">SU</Avatar>
					<Avatar color="warning">WA</Avatar>
					<Avatar color="danger">DA</Avatar>
					<Avatar color="info">IN</Avatar>
				</div>
			</Container>

			{/* Variant */}
			<Container>
				<div className="text-lg font-normal mb-4">Variant</div>
				<div className="text-sm mb-3">
					The <span style={{ color: themeColor }}>variant</span> prop is used to
					set the variant of the avatar. Variant can be solid or tonal.
				</div>

				<div className="flex flex-wrap gap-2">
					<Avatar variant="tonal" color="primary">
						PR
					</Avatar>
					<Avatar variant="tonal" color="base">
						BA
					</Avatar>
					<Avatar variant="tonal" color="success">
						SU
					</Avatar>
					<Avatar variant="tonal" color="warning">
						WA
					</Avatar>
					<Avatar variant="tonal" color="danger">
						DA
					</Avatar>
					<Avatar variant="tonal" color="info">
						IN
					</Avatar>
				</div>
			</Container>

			{/* Rounded */}
			<Container>
				<div className="text-lg font-normal mb-4">Rounded</div>
				<div className="text-sm mb-3">
					The <span style={{ color: themeColor }}>rounded</span> prop is used to
					set the rounded of the avatar.
				</div>

				<div className="flex flex-wrap gap-2">
					<Avatar rounded="none" color="primary">
						NO
					</Avatar>
					<Avatar rounded="sm" color="base">
						SM
					</Avatar>
					<Avatar rounded="md" color="success">
						MD
					</Avatar>
					<Avatar rounded="lg" color="warning">
						LG
					</Avatar>
					<Avatar rounded="xl" color="danger">
						XL
					</Avatar>
					<Avatar rounded="2xl" color="danger">
						2X
					</Avatar>
					<Avatar rounded="full" color="info">
						FU
					</Avatar>
				</div>
			</Container>

			{/* Size */}
			<Container>
				<div className="text-lg font-normal mb-4">Size</div>
				<div className="text-sm mb-3">
					The <span style={{ color: themeColor }}>size</span> prop is used to
					set the size of the avatar.
				</div>

				<div className="flex items-center flex-wrap gap-2">
					<Avatar size="xs" color="primary">
						XS
					</Avatar>
					<Avatar size="sm" color="base">
						SM
					</Avatar>
					<Avatar size="md" color="success">
						MD
					</Avatar>
					<Avatar size="lg" color="warning">
						LG
					</Avatar>
					<Avatar size="xl" color="danger">
						XL
					</Avatar>
					<Avatar size="70" color="info">
						70
					</Avatar>
				</div>
			</Container>

			{/* Icon */}
			<Container>
				<div className="text-lg font-normal mb-4">Icon</div>
				<div className="text-sm mb-3">
					You can use icon as avatar. Just put the icon inside the avatar.
				</div>

				<div className="flex items-center flex-wrap gap-2">
					<Avatar color="primary">
						<TbSmartHome className="text-lg" />
					</Avatar>
					<Avatar color="base">
						<TbCalendar className="text-lg" />
					</Avatar>
					<Avatar color="success">
						<TbCheck className="text-lg" />
					</Avatar>
					<Avatar color="warning">
						<TbExclamationMark className="text-lg" />
					</Avatar>
					<Avatar color="danger">
						<TbCloudExclamation className="text-lg" />
					</Avatar>
					<Avatar color="info">
						<TbInfoCircle className="text-lg" />
					</Avatar>
				</div>
			</Container>

			{/* Image */}
			<Container>
				<div className="text-lg font-normal mb-4">Image</div>
				<div className="text-sm mb-3">
					You can use image as avatar. Just put the image inside the avatar.
				</div>

				<div className="flex items-center flex-wrap gap-2">
					<Avatar>
						<img src="https://i.pravatar.cc/100" alt="avatar" />
					</Avatar>
					<Avatar>
						<img src="https://i.pravatar.cc/200" alt="avatar" />
					</Avatar>
					<Avatar>
						<img src="https://i.pravatar.cc/300" alt="avatar" />
					</Avatar>
					<Avatar>
						<img src="https://i.pravatar.cc/400" alt="avatar" />
					</Avatar>
					<Avatar>
						<img src="https://i.pravatar.cc/500" alt="avatar" />
					</Avatar>
				</div>
			</Container>
		</div>
	);
};

export default AvatarPage;
