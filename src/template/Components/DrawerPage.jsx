import { Button, Container, Drawer } from "@/components";
import { ThemeContext } from "@/context/ThemeContext";
import { useContext, useState } from "react";

const DrawerPage = () => {
	const { themeColor } = useContext(ThemeContext);

	const [drawer, setDrawer] = useState(false);
	const [drawerFullWidth, setDrawerFullWidth] = useState(false);
	const [drawerWidth, setDrawerWidth] = useState(false);

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
			{/* Title & Description */}
			<Container>
				<div className="text-lg font-normal mb-4">Title & Description</div>
				<div className="text-sm mb-3">
					The <span style={{ color: themeColor }}>title</span> prop is used to
					set the title of the drawer. The{" "}
					<span style={{ color: themeColor }}>description</span> prop is used to
					set the description of the drawer.
				</div>

				<Button onClick={() => setDrawer(true)} color="primary">
					Open Drawer
				</Button>
				<Drawer
					dismiss
					title="DRAWER TITLE"
					description="Drawer Description"
					open={drawer}
					setOpen={setDrawer}
				>
					Helo
				</Drawer>
			</Container>

			{/* Width */}
			<Container>
				<div className="text-lg font-normal mb-4">Width</div>
				<div className="text-sm mb-3">
					The <span style={{ color: themeColor }}>width</span> prop is used to
					set the width of the drawer. The default width is 380px.
				</div>

				<div className="flex flex-wrap gap-4">
					<Button onClick={() => setDrawerFullWidth(true)} color="primary">
						Open FullWidth Drawer
					</Button>
					<Button onClick={() => setDrawerWidth(true)} color="primary">
						Open 50% Drawer
					</Button>
				</div>
				<Drawer
					dismiss
					title="DRAWER"
					width="100%"
					open={drawerFullWidth}
					setOpen={setDrawerFullWidth}
				>
					Full Width Drawer
				</Drawer>

				<Drawer
					dismiss
					title="DRAWER"
					width="50%"
					open={drawerWidth}
					setOpen={setDrawerWidth}
				>
					50% Drawer
				</Drawer>
			</Container>
		</div>
	);
};

export default DrawerPage;
