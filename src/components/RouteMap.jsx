import { useEffect, useState } from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

/* FIX LEAFLET DEFAULT ICON */

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({

  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"

});

/* ACCIDENT ICON */

const accidentIcon = new L.Icon({

  iconUrl:
    "https://cdn-icons-png.flaticon.com/512/564/564619.png",

  iconSize: [35, 35]

});

/* ROUTING COMPONENT */

function Routing({

  source,
  destination,
  setDistance,
  setTime,
  setSmartSuggestion

}) {

  const map = useMap();

  useEffect(() => {

    if (
      !source ||
      !destination
    ) return;

    /* CREATE ROUTE */

    const routingControl =
      L.Routing.control({

        waypoints: [

          L.latLng(
            source.lat,
            source.lng
          ),

          L.latLng(
            destination.lat,
            destination.lng
          )

        ],

        routeWhileDragging: false,

        showAlternatives: true,

        fitSelectedRoutes: true,

        draggableWaypoints: false,

        addWaypoints: false,

        lineOptions: {

          styles: [

            {

              color: "red",

              weight: 6

            }

          ]

        },

        altLineOptions: {

          styles: [

            {

              color: "blue",

              weight: 5

            }

          ]

        },

        createMarker: function (
          i,
          waypoint
        ) {

          return L.marker(
            waypoint.latLng
          );

        }

      }).addTo(map);

    /* ROUTE FOUND */

    routingControl.on(

      "routesfound",

      function (e) {

        const routes =
          e.routes;

        const summary =
          routes[0].summary;

        const distanceKm = (
          summary.totalDistance / 1000
        ).toFixed(2);

        const timeMin = (
          summary.totalTime / 60
        ).toFixed(0);

        setDistance(distanceKm);

        setTime(timeMin);

        /* SMART SUGGESTION */

        if (
          Number(distanceKm) > 20
        ) {

          setSmartSuggestion(

            "🚦 Alternative route recommended due to heavy traffic."

          );

        }

        else if (
          Number(distanceKm) > 10
        ) {

          setSmartSuggestion(

            "🟡 Moderate traffic ahead. Drive carefully."

          );

        }

        else {

          setSmartSuggestion(

            "✅ Route looks clear with low traffic."

          );

        }

      }

    );

    /* ROUTING ERROR */

    routingControl.on(

      "routingerror",

      function (e) {

        console.log(e);

        alert(
          "Unable to find route"
        );

      }

    );

    /* CLEANUP */

    return () => {

      try {

        map.removeControl(
          routingControl
        );

      }

      catch (error) {

        console.log(error);

      }

    };

  }, [

    source,
    destination,
    map,
    setDistance,
    setTime,
    setSmartSuggestion

  ]);

  return null;
}

/* MAIN MAP COMPONENT */

function RouteMap({

  source,
  destination,
  setDistance,
  setTime,
  setSmartSuggestion

}) {

  const [
    currentPosition,
    setCurrentPosition
  ] = useState(null);

  const [
    accidentAreas,
    setAccidentAreas
  ] = useState([]);

  /* CURRENT LOCATION */

  useEffect(() => {

    navigator.geolocation
      .getCurrentPosition(

        (position) => {

          setCurrentPosition([

            position.coords.latitude,

            position.coords.longitude

          ]);

        },

        (error) => {

          console.log(error);

        }

      );

  }, []);

  /* ACCIDENT ZONES */

  useEffect(() => {

    if (
      !source ||
      !destination
    ) return;

    const areas = [

      {

        lat:
          source.lat +
          (
            destination.lat -
            source.lat
          ) * 0.25,

        lng:
          source.lng +
          (
            destination.lng -
            source.lng
          ) * 0.25,

        name:
          "Accident Zone 1"

      },

      {

        lat:
          source.lat +
          (
            destination.lat -
            source.lat
          ) * 0.50,

        lng:
          source.lng +
          (
            destination.lng -
            source.lng
          ) * 0.50,

        name:
          "Accident Zone 2"

      },

      {

        lat:
          source.lat +
          (
            destination.lat -
            source.lat
          ) * 0.75,

        lng:
          source.lng +
          (
            destination.lng -
            source.lng
          ) * 0.75,

        name:
          "Accident Zone 3"

      }

    ];

    setAccidentAreas(
      areas
    );

  }, [

    source,
    destination

  ]);

  return (

    <div
      style={{
        width: "100%",
        height: "500px"
      }}
    >

      <MapContainer

        center={
          currentPosition || [
            20.5937,
            78.9629
          ]
        }

        zoom={5}

        scrollWheelZoom={true}

        style={{

          width: "100%",

          height: "100%"

        }}

      >

        {/* MAP TILE */}

        <TileLayer

          attribution="&copy; OpenStreetMap contributors"

          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

        />

        {/* SOURCE */}

        {source && (

          <Marker

            position={[
              source.lat,
              source.lng
            ]}

          >

            <Popup>
              📍 Source
            </Popup>

          </Marker>

        )}

        {/* DESTINATION */}

        {destination && (

          <Marker

            position={[
              destination.lat,
              destination.lng
            ]}

          >

            <Popup>
              🏁 Destination
            </Popup>

          </Marker>

        )}

        {/* CURRENT LOCATION */}

        {currentPosition && (

          <Marker
            position={currentPosition}
          >

            <Popup>
              📌 Current Location
            </Popup>

          </Marker>

        )}

        {/* ACCIDENT AREAS */}

        {accidentAreas.map(

          (area, index) => (

            <Marker

              key={index}

              position={[
                area.lat,
                area.lng
              ]}

              icon={accidentIcon}

            >

              <Popup>

                ⚠️ Accident Prone Area

                <br />

                📍 {area.name}

              </Popup>

            </Marker>

          )

        )}

        {/* ROUTE */}

        {source &&
          destination && (

            <Routing

              source={source}

              destination={destination}

              setDistance={setDistance}

              setTime={setTime}

              setSmartSuggestion={
                setSmartSuggestion
              }

            />

          )}

      </MapContainer>

    </div>

  );

}

export default RouteMap;