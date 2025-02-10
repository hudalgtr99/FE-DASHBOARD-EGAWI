const Progress = ({ completionPercentage }) => {
	return (
		<div className="w-full bg-gray-200 dark:bg-gray-500 rounded-full h-2.5">
			<div
				className="h-2.5 rounded-full"
				style={{
					width: `${completionPercentage}%`,
					backgroundColor:
						completionPercentage >= 100 ? "#4CAF50" : "#2196F3",
				}}
			></div>
		</div>
	);
};

export default Progress;
