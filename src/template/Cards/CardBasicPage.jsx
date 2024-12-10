import { Card } from "@/components";
import moment from "moment";
import { useState } from "react";

const CardBasicPage = () => {
	const [cardBasic] = useState([
		{
			title: "Solid",
			description:
				"Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eligendi asperiores corrupti.",
			variant: "solid",
			date: moment().format("ll"),
		},
		{
			title: "Tonal",
			description:
				"Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eligendi asperiores corrupti.",
			variant: "tonal",
			date: moment().format("ll"),
		},
		{
			title: "Border",
			description:
				"Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eligendi asperiores corrupti.",
			variant: "border",
			date: moment().format("ll"),
		},
		{
			title: "Gradient",
			description:
				"Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eligendi asperiores corrupti.",
			variant: "gradient",
			date: moment().format("ll"),
		},
	]);

	return (
		<div className="flex flex-col gap-4">
			<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
				{cardBasic.map((item, itemIdx) => (
					<Card key={itemIdx} variant={item.variant}>
						<div>
							<div className="text-sm font-bold mb-1">{item.title}</div>
							<div className="text-xs mb-4">{item.description}</div>
							<div className="text-[10px] flex justify-end items-end">
								{item.date}
							</div>
						</div>
					</Card>
				))}
			</div>
		</div>
	);
};

export default CardBasicPage;
