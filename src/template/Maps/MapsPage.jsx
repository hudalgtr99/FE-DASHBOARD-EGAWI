import {
	APIProvider,
	InfoWindow,
	Map,
	Marker,
	useApiIsLoaded,
	useMap,
	useMapsLibrary,
} from "@vis.gl/react-google-maps";
import { useEffect, useRef, useState } from "react";

const API_KEY = "AIzaSyCRoEQgZ-A0qteh57AabiHehG7AI44Y7Po";
const MapTypeId = {
	HYBRID: "hybrid",
	ROADMAP: "roadmap",
	SATELLITE: "satellite",
	TERRAIN: "terrain",
};

const MyComponent = () => {
	const map = useMap();
	const drawLib = useMapsLibrary("drawing");
	const apiIsLoaded = useApiIsLoaded();

	useEffect(() => {
		if (!map) return;

	}, [map]);

	useEffect(() => {
		if (!drawLib) return;

	}, [drawLib]);

	useEffect(() => {
		if (!apiIsLoaded) return;
	}, [apiIsLoaded]);

	return <></>;
};

const MapsPage = () => {
	const ref = useRef(null);
	const [zoom, setZoom] = useState(14);
	const [center, setCenter] = useState({
		lat: -5.388833,
		lng: 105.27873,
	});
	const [markerSize, setMarkerSize] = useState(3);
	const [markers, setMarkers] = useState([
		{
			type: "office",
			position: {
				lat: -5.38868,
				lng: 105.278561,
			},
			showInfo: false,
		},
		{
			type: "user",
			position: {
				lat: -5.388526,
				lng: 105.282295,
			},
			showInfo: false,
		},
		{
			type: "user",
			position: {
				lat: -5.387,
				lng: 105.288,
			},
			showInfo: false,
		},
	]);
	const [polygons, setPolygons] = useState([
		{
			type: "polygon",
			position: [
				{ lat: -5.38768, lng: 105.277561 },
				{ lat: -5.387526, lng: 105.272295 },
				{ lat: -5.381, lng: 105.288 },
			],
		},
	]);
	const [lines, setLines] = useState([
		{
			type: "line",
			position: [
				{ lat: -5.38868, lng: 105.278561 },
				{ lat: -5.387, lng: 105.288 },
			],
		},
	]);
	const [circles, setCircles] = useState([
		{
			type: "circle",
			center: { lat: -5.38768, lng: 105.277561 },
			radius: 1000,
		},
	]);
	return (
		<div className="w-full h-[80vh]">
			<APIProvider apiKey={API_KEY}>
				<Map
					zoom={zoom}
					center={center}
					gestureHandling={"greedy"}
					disableDefaultUI={true}
					mapTypeId={MapTypeId.ROADMAP}
				>
					{markers.map((marker, index) => (
						<Marker
							key={index}
							position={marker.position}
							onClick={() => {
								const newMarkers = [...markers];
								newMarkers[index].showInfo = true;
								setMarkers(newMarkers);
							}}
						></Marker>
					))}
				</Map>
				<MyComponent />
			</APIProvider>
		</div>
	);
};

export default MapsPage;
