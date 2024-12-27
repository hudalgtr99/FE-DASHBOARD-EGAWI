import React, { useState, useRef, useEffect, useContext } from "react";
import { GoogleMap, Marker, Autocomplete } from "@react-google-maps/api";
import { TextField } from "@/components";

// Context for managing Google Maps API state
const GoogleMapsContext = React.createContext(false);

const GoogleMapsProvider = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window.google !== "undefined" && window.google.maps) {
      setIsLoaded(true);
    }
  }, []);

  return (
    <GoogleMapsContext.Provider value={isLoaded}>
      {children}
    </GoogleMapsContext.Provider>
  );
};

const mapContainerStyle = {
  width: "100%",
  height: "500px",
};

const MapComponent = ({ data, setFieldValue }) => {
  const [markerPosition, setMarkerPosition] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const autocompleteRef = useRef(null);
  const longlat = {
    lat: Number(data?.latitude),
    lng: Number(data?.longitude),
  };
  // console.log("longlat", longlat);
  const mapRef = useRef(null); 

  useEffect(() => {
    if (longlat.lat && longlat.lng) {
      setUserLocation(longlat);
      setMarkerPosition(longlat);
      setFieldValue("latitude", longlat.lat);
      setFieldValue("longitude", longlat.lng);
      handleMapClick({
        latLng: { lat: () => longlat.lat, lng: () => longlat.lng },
      });
      // console.log("ada longlat", longlat.lng, "Latitude:", longlat.lat);
      return; // Tidak perlu melanjutkan ke geolocation
    }

    // Mendapatkan lokasi pengguna menggunakan Geolocation API
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setUserLocation({ lat, lng });
          setMarkerPosition({ lat, lng });
          // console.log("User Location Longitude:", lng, "Latitude:", lat); // Log posisi pengguna
          setFieldValue("latitude", lat);
          setFieldValue("longitude", lng);
          if (mapRef.current) {
            mapRef.current.panTo({ lat, lng }); // Pindahkan peta ke lokasi pengguna
          }

          // Simulasi klik otomatis pada lokasi pengguna
          handleMapClick({ latLng: { lat: () => lat, lng: () => lng } });
        },
        (error) => {
          console.error("Error getting user location:", error);
          // Menggunakan lokasi longlat jika lokasi pengguna diblokir
          setUserLocation(longlat);
          setMarkerPosition(longlat);

          setFieldValue("latitude", longlat.lat);
          setFieldValue("longitude", longlat.lng);
          // Simulasi klik otomatis pada lokasi longlat
          handleMapClick({
            latLng: { lat: () => longlat.lat, lng: () => longlat.lng },
          });
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      // Menggunakan lokasi longlat jika Geolocation tidak didukung
      setUserLocation(longlat);
      setMarkerPosition(longlat);
      // console.log(
      //   "Geolocation not supported. Using longlat. Longitude:",
      //   longlat.lng,
      //   "Latitude:",
      //   longlat.lat
      // ); // Log fallback longlat
      // Simulasi klik otomatis pada lokasi longlat
      handleMapClick({
        latLng: { lat: () => longlat.lat, lng: () => longlat.lng },
      });
    }
  }, []);

  // Menangani perubahan input pada pencarian
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Menangani klik pada peta untuk memindahkan marker
  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setMarkerPosition({ lat, lng });

    // Gunakan Geocoder untuk mendapatkan alamat berdasarkan koordinat
    const geocoder = new window.google.maps.Geocoder();
    setFieldValue("latitude", lat);
    setFieldValue("longitude", lng);
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results[0]) {
        const address = results[0].formatted_address;
        setSearchQuery(address);
      } else {
        console.error("Geocoder failed due to:", status);
      }
    });
  };

  const handlePlaceSelect = () => {
    const place = autocompleteRef.current.getPlace();
    if (place.geometry) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      setMarkerPosition({ lat, lng });

      if (mapRef.current) {
        mapRef.current.panTo({ lat, lng }); // Pindahkan peta ke lokasi yang dipilih
      }
      const address = place.formatted_address || place.name;
      setSearchQuery(address); // Perbarui kolom pencarian dengan nama atau alamat

      setFieldValue("latitude", lat);
      setFieldValue("longitude", lng);
    }
  };

  return (
    <div>
      <Autocomplete
        onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
        onPlaceChanged={handlePlaceSelect}
      >
        <TextField
          type="text"
          label="Cari lokasi"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </Autocomplete>
      <br />
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={userLocation || { lat: -5.4108, lng: 105.2687 }} // Pusatkan peta ke lokasi pengguna atau Bandar Lampung default
        zoom={12}
        onLoad={(map) => (mapRef.current = map)} // Set map reference
        onClick={handleMapClick} // Menangani klik pada peta
      >
        {markerPosition && (
          <Marker
            position={markerPosition}
            icon={{
              url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png", // Ikon geolokasi (red dot)
              scaledSize: new window.google.maps.Size(30, 30), // Ukuran ikon
            }}
          />
        )}
      </GoogleMap>
    </div>
  );
};

const GoogleMapInput = ({ data }) => {
  const isLoaded = useContext(GoogleMapsContext);

  return (
    <GoogleMapsProvider>
      <TextField
        required
        label="Radius"
        name="radius"
        type="number"
        value={data?.values?.radius || ""} // Akses nilai dari `data`
        onChange={(e) => data.setFieldValue("radius", Number(e.target.value))} // Gunakan `setFieldValue` untuk mengupdate
        error={data?.errors?.radius || ""} // Opsional, jika `data.errors` tersedia
      />
      <MapComponent data={data.values} setFieldValue={data.setFieldValue} />
    </GoogleMapsProvider>
  );
};

export default GoogleMapInput;
