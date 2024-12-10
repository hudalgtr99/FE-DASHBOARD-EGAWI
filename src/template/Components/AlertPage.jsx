import { Alert, Button, Container } from "@/components";
import { ThemeContext } from "@/context/ThemeContext";
import { useContext, useState } from "react";
import { TbCheck, TbExclamationMark, TbSmartHome, TbX } from "react-icons/tb";

const AlertPage = () => {
	const { themeColor } = useContext(ThemeContext);
	const [show, setShow] = useState(true);

	return (
		<div className="flex flex-col gap-4">
			{/* Color */}
			<Container>
				<div className="text-lg font-normal mb-4">Color</div>
				<div className="text-sm mb-3">
					The <span style={{ color: themeColor }}>color</span> prop is used to
					set the background color of the alert.
				</div>

				<div className="flex flex-wrap gap-3">
					<Alert color="primary">
						Good morning! You have successfully logged in.
					</Alert>
					<Alert color="base">
						Good morning! You have successfully logged in.
					</Alert>
					<Alert color="success">
						Good morning! You have successfully logged in.
					</Alert>
					<Alert color="warning">
						Good morning! You have successfully logged in.
					</Alert>
					<Alert color="danger">
						Good morning! You have successfully logged in.
					</Alert>
					<Alert color="info">
						Good morning! You have successfully logged in.
					</Alert>
				</div>
			</Container>

			{/* Icon */}
			<Container>
				<div className="text-lg font-normal mb-4">Icon</div>
				<div className="text-sm mb-3">
					The <span style={{ color: themeColor }}>icon</span> prop is used to
					set the icon of the alert.
				</div>

				<div className="flex flex-wrap gap-3">
					<Alert icon={<TbSmartHome />} color="primary">
						Good morning! You have successfully logged in.
					</Alert>
					<Alert icon={<TbCheck />} color="success">
						Good morning! You have successfully logged in.
					</Alert>
					<Alert icon={<TbExclamationMark />} color="warning">
						Good morning! You have successfully logged in.
					</Alert>
					<Alert icon={<TbX />} color="danger">
						Good morning! You have successfully logged in.
					</Alert>
				</div>
			</Container>

			{/* Closable */}
			<Container>
				<div className="text-lg font-normal mb-4">Closable</div>
				<div className="text-sm mb-3">
					The <span style={{ color: themeColor }}>closable</span> prop is used
					to set the alert closable.
				</div>

				<div className="flex flex-wrap gap-3">
					{show ? (
						<Alert
							show={show}
							setShow={setShow}
							closable
							icon={<TbSmartHome />}
							color="primary"
						>
							Good morning! You have successfully logged in.
						</Alert>
					) : (
						<Button color="primary" onClick={() => setShow(true)}>
							Reset
						</Button>
					)}
				</div>
			</Container>

			{/* Variant */}
			<Container>
				<div className="text-lg font-normal mb-4">Variant</div>
				<div className="text-sm mb-3">
					The <span style={{ color: themeColor }}>variant</span> prop is used to
					set the icon of the alert.
				</div>

				<div className="text-sm mb-2 mt-4">Solid</div>
				<div className="flex flex-wrap gap-2">
					<Alert variant={"solid"} color="primary">
						Good morning! You have successfully logged in.
					</Alert>
					<Alert variant={"solid"} color="base">
						Good morning! You have successfully logged in.
					</Alert>
				</div>

				<div className="text-sm mb-2 mt-4">Tonal</div>
				<div className="flex flex-wrap gap-2">
					<Alert variant={"tonal"} color="success">
						Good morning! You have successfully logged in.
					</Alert>
					<Alert variant={"tonal"} color="warning">
						Good morning! You have successfully logged in.
					</Alert>
				</div>

				<div className="text-sm mb-2 mt-4">Outline</div>
				<div className="flex flex-wrap gap-2">
					<Alert variant={"outline"} color="danger">
						Good morning! You have successfully logged in.
					</Alert>
					<Alert variant={"outline"} color="info">
						Good morning! You have successfully logged in.
					</Alert>
				</div>
			</Container>

			{/* Density */}
			<Container>
				<div className="text-lg font-normal mb-4">Density</div>
				<div className="text-sm mb-3">
					The <span style={{ color: themeColor }}>density</span> prop is used to
					set the padding of the alert.
				</div>

				<div className="flex flex-wrap gap-2">
					<Alert density="tight" color="primary">
						Good morning! You have successfully logged in.
					</Alert>
					<Alert density="normal" color="success">
						Good morning! You have successfully logged in.
					</Alert>
					<Alert density="loose" color="warning">
						Good morning! You have successfully logged in.
					</Alert>
				</div>
			</Container>
		</div>
	);
};

export default AlertPage;
