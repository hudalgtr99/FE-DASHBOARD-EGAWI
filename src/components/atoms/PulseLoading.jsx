import PulseLoader from "react-spinners/PulseLoader"; // Import ClipLoader
import { ThemeContext } from "@/context/ThemeContext";
import { useContext } from "react";

export default function PulseLoading({ size = 13, color, loading = true }) {
    const { themeColor } = useContext(ThemeContext); 

    return (
        <PulseLoader size={size} color={color || themeColor} loading={loading} />
    );
}
