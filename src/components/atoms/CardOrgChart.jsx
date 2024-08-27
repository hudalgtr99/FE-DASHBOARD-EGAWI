import React, { Fragment } from "react";
import PropTypes from "prop-types";

// components
import { CardContainer } from "@/components";

const propTypes = {
	nodeData: PropTypes.object.isRequired,
};

const CardOrgChart = ({ nodeData }) => {
	return (
		<Fragment>
			<div className="flex justify-center text-xs">
				<div className="w-32 rounded">
					<CardContainer>
						{nodeData.fotoProfil && (
							<div className="flex mb-2 justify-center w-full h-28 overflow-clip">
								<img
									className="w-full rounded object-cover object-center"
									src={nodeData.fotoProfil}
									alt="Profil"
								/>
							</div>
						)}
						<div className="font-bold dark:text-white">
							{nodeData.nama}
						</div>
						{nodeData.jabatan && (
							<span className="dark:text-gray-300">
								{nodeData.jabatan}
							</span>
						)}
					</CardContainer>
				</div>
			</div>
		</Fragment>
	);
};

CardOrgChart.propTypes = propTypes;

export default CardOrgChart;
