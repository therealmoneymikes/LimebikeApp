export default {
  subtleGrayscale: [
    {
      featureType: "administrative",
      elementType: "all",
      stylers: [
        {
          saturation: "-100",
        },
      ],
    },
    {
      featureType: "administrative.province",
      elementType: "all",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "landscape",
      elementType: "all",
      stylers: [
        {
          saturation: -100,
        },
        {
          lightness: 65,
        },
        {
          visibility: "on",
        },
      ],
    },
    {
      featureType: "poi",
      elementType: "all",
      stylers: [
        {
          saturation: -100,
        },
        {
          lightness: "50",
        },
        {
          visibility: "simplified",
        },
      ],
    },
    {
      featureType: "road",
      elementType: "all",
      stylers: [
        {
          saturation: "-100",
        },
      ],
    },
    {
      featureType: "road.highway",
      elementType: "all",
      stylers: [
        {
          visibility: "simplified",
        },
      ],
    },
    {
      featureType: "road.arterial",
      elementType: "all",
      stylers: [
        {
          lightness: "30",
        },
      ],
    },
    {
      featureType: "road.local",
      elementType: "all",
      stylers: [
        {
          lightness: "40",
        },
      ],
    },
    {
      featureType: "transit",
      elementType: "all",
      stylers: [
        {
          saturation: -100,
        },
        {
          visibility: "simplified",
        },
      ],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [
        {
          hue: "#ffff00",
        },
        {
          lightness: -25,
        },
        {
          saturation: -97,
        },
      ],
    },
    {
      featureType: "water",
      elementType: "labels",
      stylers: [
        {
          lightness: -25,
        },
        {
          saturation: -100,
        },
      ],
    },
  ],
  marsAnalog: [
    {
      featureType: "all",
      elementType: "labels",
      stylers: [
        {
          visibility: "on",
        },
      ],
    },
    {
      featureType: "administrative",
      elementType: "geometry",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "landscape",
      elementType: "geometry",
      stylers: [
        {
          color: "#e0c9a6",
        },
      ],
    },
    {
      featureType: "poi",
      elementType: "geometry",
      stylers: [
        {
          color: "#e0c9a6",
        },
      ],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [
        {
          color: "#d3b38c",
        },
      ],
    },
    {
      featureType: "transit",
      elementType: "geometry",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [
        {
          color: "#883b20",
        },
      ],
    },
  ],
  deepBlue: [
    {
      featureType: "all",
      elementType: "geometry",
      stylers: [
        {
          color: "#202c3e",
        },
      ],
    },
    {
      featureType: "all",
      elementType: "labels.text.fill",
      stylers: [
        {
          gamma: 0.01,
        },
        {
          lightness: 20,
        },
        {
          weight: "1.39",
        },
        {
          color: "#ffffff",
        },
      ],
    },
    {
      featureType: "all",
      elementType: "labels.text.stroke",
      stylers: [
        {
          weight: "0.96",
        },
        {
          saturation: "9",
        },
        {
          visibility: "on",
        },
        {
          color: "#000000",
        },
      ],
    },
    {
      featureType: "all",
      elementType: "labels.icon",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "administrative.country",
      elementType: "labels.icon",
      stylers: [
        {
          visibility: "on",
        },
        {
          color: "#b91212",
        },
      ],
    },
    {
      featureType: "landscape",
      elementType: "geometry",
      stylers: [
        {
          lightness: 30,
        },
        {
          saturation: "9",
        },
        {
          color: "#2a3859",
        },
      ],
    },
    {
      featureType: "landscape.natural.landcover",
      elementType: "all",
      stylers: [
        {
          saturation: "0",
        },
        {
          lightness: "7",
        },
      ],
    },
    {
      featureType: "poi",
      elementType: "geometry",
      stylers: [
        {
          saturation: 20,
        },
      ],
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [
        {
          lightness: 20,
        },
        {
          saturation: -20,
        },
      ],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [
        {
          lightness: 10,
        },
        {
          saturation: -30,
        },
      ],
    },
    {
      featureType: "road",
      elementType: "geometry.fill",
      stylers: [
        {
          color: "#193a55",
        },
      ],
    },
    {
      featureType: "road",
      elementType: "geometry.stroke",
      stylers: [
        {
          saturation: 25,
        },
        {
          lightness: 25,
        },
        {
          weight: "1",
        },
      ],
    },
    {
      featureType: "water",
      elementType: "all",
      stylers: [
        {
          lightness: "-44",
        },
        {
          color: "#0f172a",
        },
      ],
    },
  ],
};
