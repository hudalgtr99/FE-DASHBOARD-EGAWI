import { DOTS, usePagination } from "@/hooks/usePagination";
import { TbChevronLeft, TbChevronRight, TbDots } from "react-icons/tb";
import { Button } from "..";
import { useContext } from "react";
import { ThemeContext } from "@/context/ThemeContext";
import PropTypes from "prop-types";
import { useWindowSize } from "@/hooks/useWindowSize";

const Pagination = ({
  onPageChange,
  totalCount,
  siblingCount = 1,
  currentPage,
  pageSize,
  activeColor = "primary",
  rounded = "md",
  variant = "flat",
  size = "md",
}) => {
  const { themeColor, colorMode } = useContext(ThemeContext);
  const { width } = useWindowSize();
  const siblings = width < 640 ? 0 : siblingCount;

  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount: siblings,
    pageSize,
  }) || [];

  const onNext = () => {
    if (currentPage < paginationRange.length) {
      onPageChange(currentPage + 1);
    }
  };

  const onPrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  // Color
  const colorPagination =
    {
      primary: themeColor,
      base: "#BABCBD",
      success: "#4ED17E",
      warning: "#EEC239",
      danger: "#F26969",
      info: "#629BF8",
    }[activeColor] || activeColor;

  // Size
  const sizePagination =
    {
      xs: 25,
      sm: 30,
      md: 35,
      lg: 40,
      xl: 45,
    }[size] || size;

  let lastPage = paginationRange.length ? paginationRange[paginationRange.length - 1] : 1;

  return (
    <div className="flex gap-2">
      {totalCount > 0 && (
        <>
          {/* Left */}
          <Button
            size={sizePagination}
            className="text-xs"
            color={colorMode === "light" ? "#BABCBD95" : "#4D535595"}
            textcolor={colorMode === "light" ? "#171C1E" : "white"}
            variant={variant}
            rounded={rounded}
            onClick={onPrevious}
            disabled={currentPage === 1}
          >
            <TbChevronLeft />
          </Button>

          {paginationRange.map((pageNumber, index) => {
            if (pageNumber === DOTS) {
              return (
                <Button
                  key={index}
                  size={sizePagination}
                  className="text-xs"
                  color={colorMode === "light" ? "#BABCBD95" : "#4D535595"}
                  textcolor={colorMode === "light" ? "#171C1E" : "white"}
                  variant={variant}
                  rounded={rounded}
                  disabled
                >
                  <TbDots />
                </Button>
              );
            }

            return (
              <Button
                key={index}
                size={sizePagination}
                className="text-xs"
                color={
                  pageNumber === currentPage
                    ? colorPagination
                    : colorMode === "light"
                      ? "#BABCBD95"
                      : "#4D535595"
                }
                textcolor={
                  pageNumber === currentPage
                    ? "white"
                    : colorMode === "light"
                      ? "#171C1E"
                      : "white"
                }
                variant={variant}
                rounded={rounded}
                onClick={() => onPageChange(pageNumber)}
              >
                {pageNumber}
              </Button>
            );
          })}

          {/* Right */}
          <Button
            size={sizePagination}
            className="text-xs"
            color={colorMode === "light" ? "#BABCBD95" : "#4D535595"}
            textcolor={colorMode === "light" ? "#171C1E" : "white"}
            variant={variant}
            rounded={rounded}
            disabled={currentPage === lastPage}
            onClick={onNext}
          >
            <TbChevronRight />
          </Button>
        </>
      )}
    </div>
  );
};

Pagination.propTypes = {
  onPageChange: PropTypes.func.isRequired,
  totalCount: PropTypes.number.isRequired,
  siblingCount: PropTypes.number,
  currentPage: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  activeColor: PropTypes.oneOfType([
    PropTypes.oneOf([
      "primary",
      "base",
      "success",
      "warning",
      "danger",
      "info",
    ]),
    PropTypes.string,
  ]),
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
  variant: PropTypes.oneOf(["solid", "flat"]),
  size: PropTypes.oneOfType([
    PropTypes.oneOf(["xs", "sm", "md", "lg", "xl"]),
    PropTypes.number,
  ]),
};

export default Pagination;
