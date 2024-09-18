import {
    autoUpdate,
    flip,
    offset,
    shift,
    useFloating,
} from "@floating-ui/react";
import { Popover as PopoverHeadless, Transition } from "@headlessui/react";
import PropTypes from "prop-types";

/**
 *
 * @param {{
 * button?: React.ReactNode;
 * placement?: "top" | "top-start" | "top-end" | "right" | "right-start" | "right-end" | "bottom" | "bottom-start" | "bottom-end" | "left" | "left-start" | "left-end";
 * spacing?: number;
 * fill?: boolean;
 * rounded?: "none" | "sm" | "rounded" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
 * isFlip?: boolean;
 * isShift?: boolean;
 * position?: "relative" | "fixed" | "absolute" | "sticky";
 * children?: React.ReactNode;
 * full?: boolean;
 * }}
 *
 */

const Popover = ({
    button = null,
    placement = "bottom",
    spacing = 5,
    fill = false,
    rounded = "rounded",
    isFlip = true,
    isShift = true,
    position = "relative",
    children = null,
    full = false,
}) => {
    // Rounded
    const panelRounded =
        {
            none: "rounded-none",
            sm: "rounded-sm",
            rounded: "rounded",
            md: "rounded-md",
            lg: "rounded-lg",
            xl: "rounded-xl",
            "2xl": "rounded-2xl",
            "3xl": "rounded-3xl",
            full: "rounded-full",
        }[rounded] || "rounded";

    const { refs, floatingStyles } = useFloating({
        placement,
        whileElementsMounted: autoUpdate,
        middleware: [
            offset(spacing),
            isFlip ? flip() : null,
            isShift ? shift({ padding: 10 }) : null,
        ],
    });

    return (
        <PopoverHeadless className={`relative ${full ? "w-full" : "w-fit"}`}>
            <PopoverHeadless.Button ref={refs.setReference} as="div">
                {button}
            </PopoverHeadless.Button>

            <Transition
                className={`${position} z-10`}
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
            >
                <PopoverHeadless.Panel
                    ref={refs.setFloating}
                    style={floatingStyles}
                    className={`relative bg-white dark:bg-gray-600  ${fill ? "w-full" : ""
                        } ${panelRounded} shadow-lg overflow-hidden`}
                >
                    {children}
                </PopoverHeadless.Panel>
            </Transition>
        </PopoverHeadless>
    );
};

Popover.propTypes = {
    button: PropTypes.node,
    placement: PropTypes.oneOf([
        "top",
        "top-start",
        "top-end",
        "right",
        "right-start",
        "right-end",
        "bottom",
        "bottom-start",
        "bottom-end",
        "left",
        "left-start",
        "left-end",
    ]),
    spacing: PropTypes.number,
    fill: PropTypes.bool,
    rounded: PropTypes.oneOf([
        "none",
        "sm",
        "rounded",
        "md",
        "lg",
        "xl",
        "2xl",
        "3xl",
        "full",
    ]),
    isFlip: PropTypes.bool,
    isShift: PropTypes.bool,
    position: PropTypes.oneOf(["relative", "fixed", "absolute", "sticky"]),
    children: PropTypes.node,
    full: PropTypes.bool,
};

export default Popover;
