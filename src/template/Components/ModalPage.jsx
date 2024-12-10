import { Button, Container, Modal } from "@/components";
import { ThemeContext } from "@/context/ThemeContext";
import { useContext, useState } from "react";

const ModalPage = () => {
	const { themeColor } = useContext(ThemeContext);
	const [basicModal, setBasicModal] = useState(false);
	const [persistentModal, setPersistentModal] = useState(false);
	const [sizeModal, setSizeModal] = useState(false);
	const [btnCloseModal, setBtnCloseModal] = useState(false);

	return (
		<>
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<Container>
					<div className="text-lg font-normal mb-4">Basic</div>
					<div className="text-sm mb-3">
						Basic modal with close button and backdrop click to close. Use{" "}
						<span style={{ color: themeColor }}>show</span> and{" "}
						<span style={{ color: themeColor }}>setShow</span> props to control
						the modal.
					</div>

					<div className="flex flex-wrap gap-2">
						<Button onClick={() => setBasicModal(true)} color="primary">
							Basic
						</Button>
					</div>
				</Container>

				<Container>
					<div className="text-lg font-normal mb-4">Persistent</div>
					<div className="text-sm mb-3">
						The <span style={{ color: themeColor }}>persistent</span> prop is
						used to make the modal cant be closed by backdrop click.
					</div>

					<div className="flex flex-wrap gap-2">
						<Button onClick={() => setPersistentModal(true)} color="primary">
							Persistent
						</Button>
					</div>
				</Container>

				<Container>
					<div className="text-lg font-normal mb-4">Width & Height</div>
					<div className="text-sm mb-3">
						The <span style={{ color: themeColor }}>width</span> and{" "}
						<span style={{ color: themeColor }}>height</span> props are used to
						set the modal size. If not set, the modal will be auto sized based
						on the content.
					</div>

					<div className="flex flex-wrap gap-2">
						<Button
							onClick={() => setSizeModal(true)}
							color="primary"
							className="whitespace-nowrap"
						>
							Open Modal
						</Button>
					</div>
				</Container>

				<Container>
					<div className="text-lg font-normal mb-4">Button Close</div>
					<div className="text-sm mb-3">
						The <span style={{ color: themeColor }}>btnClose</span> prop is used
						to show the close button. Default is true.
					</div>

					<div className="flex flex-wrap gap-2">
						<Button
							onClick={() => setBtnCloseModal(true)}
							color="primary"
							className="whitespace-nowrap"
						>
							Button Close False
						</Button>
					</div>
				</Container>
			</div>

			{/* Basic */}
			<Modal show={basicModal} setShow={setBasicModal} width="sm">
				<div className="text-lg font-normal p-5">
					<div className="mb-3">Basic Modal</div>
					<div className="text-sm mb-3">
						Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aspernatur
						quae officia doloribus in alias laudantium odio delectus nostrum
						iure! Ipsa eos harum tenetur distinctio! Eligendi ab dignissimos
						laboriosam ipsa velit.
					</div>
					<div className="text-sm flex justify-end">
						<Button onClick={() => setBasicModal(false)} color="primary">
							Close
						</Button>
					</div>
				</div>
			</Modal>

			{/* Persistent */}
			<Modal
				show={persistentModal}
				setShow={setPersistentModal}
				width="sm"
				persistent
			>
				<div className="text-lg font-normal p-5">
					<div className="mb-3">Persistent Modal</div>
					<div className="text-sm mb-3">
						Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aspernatur
						quae officia doloribus in alias laudantium odio delectus nostrum
						iure! Ipsa eos harum tenetur distinctio! Eligendi ab dignissimos
						laboriosam ipsa velit.
					</div>
					<div className="text-sm flex justify-end gap-2">
						<Button
							onClick={() => setPersistentModal(false)}
							variant="tonal"
							color="base"
						>
							Cancel
						</Button>
						<Button
							onClick={() => setPersistentModal(false)}
							variant="flat"
							color="primary"
						>
							Accept
						</Button>
					</div>
				</div>
			</Modal>

			{/* Size */}
			<Modal show={sizeModal} setShow={setSizeModal} width="lg" height="auto">
				<div className="text-lg font-normal p-5">
					<div className="mb-3">Width & Height</div>
					<div className="text-sm mb-3">
						Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aspernatur
						quae officia doloribus in alias laudantium odio delectus nostrum
						iure! Ipsa eos harum tenetur distinctio! Eligendi ab dignissimos
						laboriosam ipsa velit.
					</div>
					<div className="text-sm flex justify-end gap-2">
						<Button
							onClick={() => setSizeModal(false)}
							variant="tonal"
							color="base"
						>
							Cancel
						</Button>
						<Button
							onClick={() => setSizeModal(false)}
							variant="flat"
							color="primary"
						>
							Accept
						</Button>
					</div>
				</div>
			</Modal>

			{/* Button Close */}
			<Modal
				show={btnCloseModal}
				setShow={setBtnCloseModal}
				width="sm"
				btnClose={false}
			>
				<div className="text-lg font-normal p-5">
					<div className="mb-3">Button Close</div>
					<div className="text-sm mb-3">
						Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aspernatur
						quae officia doloribus in alias laudantium odio delectus nostrum
						iure! Ipsa eos harum tenetur distinctio! Eligendi ab dignissimos
						laboriosam ipsa velit.
					</div>
					<div className="text-sm flex justify-end gap-2">
						<Button
							onClick={() => setBtnCloseModal(false)}
							variant="tonal"
							color="base"
						>
							Cancel
						</Button>
						<Button
							onClick={() => setBtnCloseModal(false)}
							variant="flat"
							color="primary"
						>
							Accept
						</Button>
					</div>
				</div>
			</Modal>
		</>
	);
};

export default ModalPage;
