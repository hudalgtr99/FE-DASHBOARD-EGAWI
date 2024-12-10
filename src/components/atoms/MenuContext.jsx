/* eslint-disable no-mixed-spaces-and-tabs */
import {
	FloatingFocusManager,
	FloatingOverlay,
	autoUpdate,
	flip,
	offset,
	shift,
	useDismiss,
	useFloating,
	useInteractions,
} from "@floating-ui/react";
import { useState } from "react";
import { List } from "@/components";

const MenuContext = ({ rightClick, menu, disabled, title, children }) => {
	const [isOpen, setIsOpen] = useState(false);
	const { refs, floatingStyles, context } = useFloating({
		open: isOpen,
		onOpenChange: setIsOpen,
		middleware: [
			offset({ mainAxis: 5, alignmentAxis: 4 }),
			flip({
				fallbackPlacements: ["left-start"],
			}),
			shift({ padding: 10 }),
		],
		placement: "right-start",
		strategy: "fixed",
		whileElementsMounted: autoUpdate,
	});
	const dismiss = useDismiss(context);
	const { getReferenceProps, getFloatingProps } = useInteractions([dismiss]);

	const handleClick = (e) => {
		e.preventDefault();
		setIsOpen(true);
		refs.setPositionReference({
			getBoundingClientRect() {
				return {
					width: 0,
					height: 0,
					x: e.clientX,
					y: e.clientY,
					top: e.clientY,
					right: e.clientX,
					bottom: e.clientY,
					left: e.clientX,
				};
			},
		});
	};

	return (
		<>
			<span
				ref={refs.setReference}
				{...getReferenceProps()}
				onClick={(e) => {
					if (disabled) return;
					if (rightClick) return;
					handleClick(e);
				}}
				onContextMenu={(e) => {
					if (disabled) return;
					if (!rightClick) return;
					handleClick(e);
				}}
			>
				{children}
			</span>

			{isOpen && menu && (
				<FloatingOverlay className="z-50" lockScroll>
					<FloatingFocusManager context={context} initialFocus={refs.floating}>
						<div
							ref={refs.setFloating}
							style={floatingStyles}
							{...getFloatingProps()}
							className="min-w-[160px] relative z-50 bg-white dark:bg-base-600 text-base-300 dark:text-base-200 shadow-lg rounded-md py-1.5 outline-none border dark:border-base-500"
						>
							{title && <div className="px-4 py-1.5 text-xs">{title}</div>}
							{menu?.map((item, index) => {
								if (item.divider) {
									return (
										<div key={index} className="py-1.5">
											<hr />
										</div>
									);
								} else {
									return (
										<div key={index} className="px-1.5">
											<List
												color={item?.color}
												onClick={
													item.onClick
														? () => {
																item.onClick();
																setIsOpen(false);
														  }
														: () => setIsOpen(false)
												}
												size="sm"
												prefix={item?.icon}
											>
												{item?.label}
											</List>
										</div>
									);
								}
							})}
						</div>
					</FloatingFocusManager>
				</FloatingOverlay>
			)}
		</>
	);
};

export default MenuContext;
