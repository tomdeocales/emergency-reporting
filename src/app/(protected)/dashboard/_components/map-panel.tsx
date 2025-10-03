"use client";

import type { GeoJSONSource, Map as MapInstance } from "maplibre-gl";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";
import type { IncidentRecord } from "@/types/incidents";

const MAP_STYLE = "https://demotiles.maplibre.org/style.json";
const SOURCE_ID = "dashboard-incidents";
const HEAT_LAYER_ID = "dashboard-incidents-heat";
const CIRCLE_LAYER_ID = "dashboard-incidents-points";

export function MapPanel({
  incidents,
  className,
}: {
  incidents: IncidentRecord[];
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapInstance | null>(null);

  const geojson = buildGeoJson(incidents);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) {
      return;
    }

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: MAP_STYLE,
      center: [-74.0059, 40.7128],
      zoom: 11,
      attributionControl: false,
    });

    map.addControl(
      new maplibregl.NavigationControl({ showCompass: false }),
      "top-right",
    );

    map.once("load", () => {
      const initialData = buildGeoJson(incidents);
      addSourcesAndLayers(map, initialData);
      fitToData(map, incidents);
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [incidents]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (map.isStyleLoaded()) {
      updateSource(map, geojson);
      fitToData(map, incidents);
    } else {
      const onLoad = () => {
        addSourcesAndLayers(map, geojson);
        fitToData(map, incidents);
        map.off("load", onLoad);
      };
      map.on("load", onLoad);
    }
  }, [geojson, incidents]);

  return (
    <div
      ref={containerRef}
      className={cn("h-[360px] w-full overflow-hidden rounded-xl", className)}
    />
  );
}

function buildGeoJson(incidents: IncidentRecord[]) {
  const features = incidents.filter(hasValidCoordinates).map((incident) => ({
    type: "Feature" as const,
    geometry: {
      type: "Point" as const,
      coordinates: [incident.longitude as number, incident.latitude as number],
    },
    properties: {
      id: incident.id,
      priority: incident.priority,
    },
  }));

  return {
    type: "FeatureCollection" as const,
    features,
  };
}

function addSourcesAndLayers(
  map: MapInstance,
  geojson: ReturnType<typeof buildGeoJson>,
) {
  if (map.getSource(SOURCE_ID)) {
    updateSource(map, geojson);
    return;
  }

  map.addSource(SOURCE_ID, {
    type: "geojson",
    data: geojson,
  });

  map.addLayer({
    id: HEAT_LAYER_ID,
    type: "heatmap",
    source: SOURCE_ID,
    paint: {
      "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 10, 12, 15, 40],
      "heatmap-intensity": [
        "interpolate",
        ["linear"],
        ["zoom"],
        10,
        0.6,
        15,
        1.4,
      ],
      "heatmap-opacity": 0.7,
      "heatmap-weight": [
        "interpolate",
        ["linear"],
        ["get", "priority"],
        1,
        1.2,
        3,
        0.6,
      ],
    },
  });

  map.addLayer({
    id: CIRCLE_LAYER_ID,
    type: "circle",
    source: SOURCE_ID,
    paint: {
      "circle-radius": ["interpolate", ["linear"], ["zoom"], 10, 2, 14, 6],
      "circle-color": [
        "step",
        ["get", "priority"],
        "#0ea5e9",
        2,
        "#f97316",
        3,
        "#ef4444",
      ],
      "circle-opacity": 0.8,
      "circle-stroke-width": 1,
      "circle-stroke-color": "#ffffff",
    },
  });
}

function updateSource(
  map: MapInstance,
  geojson: ReturnType<typeof buildGeoJson>,
) {
  const source = map.getSource(SOURCE_ID) as GeoJSONSource | undefined;
  if (source) {
    source.setData(geojson);
  } else {
    addSourcesAndLayers(map, geojson);
  }
}

function fitToData(map: MapInstance, incidents: IncidentRecord[]) {
  const valid = incidents.filter(hasValidCoordinates);

  if (!valid.length) {
    return;
  }

  const [first, ...rest] = valid;
  const bounds = new maplibregl.LngLatBounds(
    [first.longitude as number, first.latitude as number],
    [first.longitude as number, first.latitude as number],
  );

  for (const incident of rest) {
    bounds.extend([incident.longitude as number, incident.latitude as number]);
  }

  map.fitBounds(bounds, {
    padding: 48,
    maxZoom: 14,
    duration: 800,
  });
}

function hasValidCoordinates(incident: IncidentRecord) {
  const { latitude, longitude } = incident;
  if (typeof latitude !== "number" || typeof longitude !== "number") {
    return false;
  }

  return (
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
}
