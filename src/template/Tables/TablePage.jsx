import { Container, Tables } from "@/components";
import { ThemeContext } from "@/context/ThemeContext";
import { useContext, useState } from "react";


const TablePage = () => {
	const { themeColor } = useContext(ThemeContext);
	console.log(themeColor)

	const [data] = useState([
		{
			id: 1,
			name: "John Doe",
			email: "johndoegmail.com",
		},
		{
			id: 2,
			name: "Jane Doe",
			email: "janedoegmail.com",
		},
		{
			id: 3,
			name: "John Smith",
			email: "johnsmithgmail.com",
		},
		{
			id: 4,
			name: "John Wick",
			email: "johnwickgmail.com",
		},
		{
			id: 5,
			name: "John Krasinski",
			email: "johnkrasinskigmail.com",
		},
		{
			id: 6,
			name: "John Cena",
			email: "johncenagmail.com",
		},
		{
			id: 7,
			name: "John Legend",
			email: "johnlegendgmail.com",
		},
		{
			id: 8,
			name: "John Mayer",
			email: "johnmayergmail.com",
		},
		{
			id: 9,
			name: "John Travolta",
			email: "johntravoltagmail.com",
		},
		{
			id: 10,
			name: "John Mulaney",
			email: "johnmulaneygmail.com",
		},
		{
			id: 11,
			name: "John Oliver",
			email: "johnolivergmail.com",
		},
		{
			id: 12,
			name: "John Lennon",
			email: "johnlennongmail.com",
		},
	]);

	return (
		<div className="grid grid-cols-1 gap-4">
			{/* Basic */}
			<Container>
				<div className="text-lg mb-4">Basic</div>
				<div className="text-sm mb-3">
					Tables component is a wrapper for HTML table element. It has 3 props:
					size, density, tablefix, and height.
				</div>

				<Tables>
					<Tables.Head>
						<Tables.Row>
							<Tables.Header>ID</Tables.Header>
							<Tables.Header>Name</Tables.Header>
							<Tables.Header>Email</Tables.Header>
						</Tables.Row>
					</Tables.Head>
					<Tables.Body>
						{data.slice(0, 5).map((item, idx) => (
							<Tables.Row
								expandable={<div className="p-2">{item.name}</div>}
								key={idx}
							>
								<Tables.Data>{item.id}</Tables.Data>
								<Tables.Data>{item.name}</Tables.Data>
								<Tables.Data>{item.email}</Tables.Data>
							</Tables.Row>
						))}
					</Tables.Body>
				</Tables>
			</Container>

			{/* Size */}
			<Container>
				<div className="text-lg mb-4">Size</div>
				<div className="text-sm mb-3">
					The <span style={{ color: themeColor }}>size</span> prop is used to
					set the size of the table. It has 4 options: sm, md, lg, and xl.
				</div>

				<Tables size="sm">
					<Tables.Head>
						<Tables.Row>
							<Tables.Header>ID</Tables.Header>
							<Tables.Header>Name</Tables.Header>
							<Tables.Header>Email</Tables.Header>
						</Tables.Row>
					</Tables.Head>
					<Tables.Body>
						{data.slice(0, 5).map((item, idx) => (
							<Tables.Row key={idx}>
								<Tables.Data>{item.id}</Tables.Data>
								<Tables.Data>{item.name}</Tables.Data>
								<Tables.Data>{item.email}</Tables.Data>
							</Tables.Row>
						))}
					</Tables.Body>
				</Tables>
			</Container>

			{/* Density */}
			<Container>
				<div className="text-lg mb-2">Density</div>
				<div className="text-sm mb-3">
					The <span style={{ color: themeColor }}>density</span> prop is used to
					set the density of the table. It has 3 options: tight, normal, and
					loose.
				</div>

				<Tables density="tight">
					<Tables.Head>
						<Tables.Row>
							<Tables.Header>ID</Tables.Header>
							<Tables.Header>Name</Tables.Header>
							<Tables.Header>Email</Tables.Header>
						</Tables.Row>
					</Tables.Head>
					<Tables.Body>
						{data.slice(0, 3).map((item, idx) => (
							<Tables.Row key={idx}>
								<Tables.Data>{item.id}</Tables.Data>
								<Tables.Data>{item.name}</Tables.Data>
								<Tables.Data>{item.email}</Tables.Data>
							</Tables.Row>
						))}
					</Tables.Body>
				</Tables>

				<br />

				<Tables density="normal">
					<Tables.Head>
						<Tables.Row>
							<Tables.Header>ID</Tables.Header>
							<Tables.Header>Name</Tables.Header>
							<Tables.Header>Email</Tables.Header>
						</Tables.Row>
					</Tables.Head>
					<Tables.Body>
						{data.slice(0, 3).map((item, idx) => (
							<Tables.Row key={idx}>
								<Tables.Data>{item.id}</Tables.Data>
								<Tables.Data>{item.name}</Tables.Data>
								<Tables.Data>{item.email}</Tables.Data>
							</Tables.Row>
						))}
					</Tables.Body>
				</Tables>

				<br />

				<Tables density="loose">
					<Tables.Head>
						<Tables.Row>
							<Tables.Header>ID</Tables.Header>
							<Tables.Header>Name</Tables.Header>
							<Tables.Header>Email</Tables.Header>
						</Tables.Row>
					</Tables.Head>
					<Tables.Body>
						{data.slice(0, 3).map((item, idx) => (
							<Tables.Row key={idx}>
								<Tables.Data>{item.id}</Tables.Data>
								<Tables.Data>{item.name}</Tables.Data>
								<Tables.Data>{item.email}</Tables.Data>
							</Tables.Row>
						))}
					</Tables.Body>
				</Tables>
			</Container>

			{/* Table Fix */}
			<Container>
				<div className="text-lg mb-4">Table Fix</div>
				<div className="text-sm mb-3">
					The <span style={{ color: themeColor }}>tablefix</span> prop is used
					to set the table layout to fixed.
				</div>

				<Tables tablefix>
					<Tables.Head>
						<Tables.Row>
							<Tables.Header>ID</Tables.Header>
							<Tables.Header>Name</Tables.Header>
							<Tables.Header>Email</Tables.Header>
						</Tables.Row>
					</Tables.Head>
					<Tables.Body>
						{data.slice(0, 5).map((item, idx) => (
							<Tables.Row key={idx}>
								<Tables.Data>{item.id}</Tables.Data>
								<Tables.Data>{item.name}</Tables.Data>
								<Tables.Data>{item.email}</Tables.Data>
							</Tables.Row>
						))}
					</Tables.Body>
				</Tables>
			</Container>

			{/* Height & Sticky */}
			<Container>
				<div className="text-lg mb-4">Height & Sticky</div>
				<div className="text-sm mb-3">
					The <span style={{ color: themeColor }}>height</span> prop is used to
					set the height of the table. The{" "}
					<span style={{ color: themeColor }}>sticky</span> prop is used to set
					the table header to sticky. It used in Tables.Head component.
				</div>

				<Tables height={300}>
					<Tables.Head sticky>
						<Tables.Row>
							<Tables.Header>ID</Tables.Header>
							<Tables.Header>Name</Tables.Header>
							<Tables.Header>Email</Tables.Header>
						</Tables.Row>
					</Tables.Head>
					<Tables.Body>
						{data.map((item, idx) => (
							<Tables.Row key={idx}>
								<Tables.Data>{item.id}</Tables.Data>
								<Tables.Data>{item.name}</Tables.Data>
								<Tables.Data>{item.email}</Tables.Data>
							</Tables.Row>
						))}
					</Tables.Body>
				</Tables>
			</Container>

			{/* Center */}
			<Container>
				<div className="text-lg mb-4">Center</div>
				<div className="text-sm mb-3">
					The <span style={{ color: themeColor }}>center</span> prop is used to
					set the content of the table to center. It used in Tables.Header and
					Tables.Data component.
				</div>

				<Tables>
					<Tables.Head>
						<Tables.Row>
							<Tables.Header>ID</Tables.Header>
							<Tables.Header center>Name</Tables.Header>
							<Tables.Header center>Email</Tables.Header>
						</Tables.Row>
					</Tables.Head>
					<Tables.Body>
						{data.slice(0, 3).map((item, idx) => (
							<Tables.Row key={idx}>
								<Tables.Data>{item.id}</Tables.Data>
								<Tables.Data center>{item.name}</Tables.Data>
								<Tables.Data center>{item.email}</Tables.Data>
							</Tables.Row>
						))}
					</Tables.Body>
				</Tables>
			</Container>
		</div>
	);
};

export default TablePage;
