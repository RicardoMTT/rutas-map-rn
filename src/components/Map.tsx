import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet} from 'react-native';
import MapView, {Marker, Polyline} from 'react-native-maps';
import {useLocation} from '../hooks/useLocation';
import {LoadingScreen} from '../pages/LoadingScreen';
import {Fab} from './Fab';
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: 400,
    width: 400,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
const markerStyle = {
  width: 10, // Aquí se define el ancho deseado del marcador
  height: 10,
  // Otros estilos opcionales, como backgroundColor, borderRadius, etc.
};
interface Props {
  markers?: Marker[];
}
export const Map = ({markers}: Props) => {
  const {
    hasLocation,
    initialPosition,
    getCurrentLocation,
    followUserLocation,
    userLocation,
    stopFollowUserLocation,
    routeLines,
  } = useLocation();
  const markersTotal: any[] = [
    {
      coordinate: {
        latitude: -12.1507756,
        longitude: -76.9816868,
      },
      title: 'estacion atocongo',
    },
    {
      coordinate: {
        latitude: -12.1279118,
        longitude: -77.0017177,
      },
      title: 'estacion cabitos',
    },
    {
      coordinate: {
        latitude: -12.141649,
        longitude: -76.9900422,
      },
      title: 'estacion jorge chavez',
    },
  ];
  // mantener la referencia
  const mapViewRef = useRef<MapView>();
  const following = useRef<boolean>(true);
  const [allMarkers, setAllMarkers] = useState(markersTotal);
  const [showPolilyne, setShowPolilyne] = useState(markersTotal);

  useEffect(() => {
    followUserLocation();

    return () => {
      //Cancelar seguimiento
      stopFollowUserLocation();
    };
  }, []);

  useEffect(() => {
    const {latitude, longitude} = userLocation;
    if (following.current) {
      return;
    }
    mapViewRef.current?.animateCamera({
      center: {
        latitude,
        longitude,
      },
    });
    return () => {};
  }, [userLocation]);

  const centerPosition = async () => {
    const {latitude, longitude} = await getCurrentLocation();
    following.current = true;
    mapViewRef.current?.animateCamera({
      center: {
        latitude,
        longitude,
      },
    });
  };
  if (!hasLocation) {
    return <LoadingScreen />;
  }

  return (
    <>
      <MapView
        ref={el => (mapViewRef.current = el!)}
        showsUserLocation={true}
        //   provider={PROVIDER_GOOGLE} // remove if not using Google Maps
        style={styles.map}
        onTouchStart={() => (following.current = false)}
        region={{
          latitude: initialPosition!.latitude,
          longitude: initialPosition!.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}>
        {allMarkers?.map((marker, index) => (
          <Marker
            image={require('../assets/custom-marker.png')}
            style={markerStyle}
            coordinate={marker.coordinate}
            key={index}
            title={marker.title}
            description={marker.title}
          />
        ))}
        {showPolilyne && (
          <Polyline
            coordinates={routeLines}
            strokeColor="black"
            strokeWidth={3}
          />
        )}
        {/* <Marker
          image={require('../assets/custom-marker.png')}
          coordinate={{
            latitude: 37.78825,
            longitude: -122.4324,
          }}
          title="Esto es un titulo"
          description="Esto es una descripción"
        /> */}
      </MapView>
      <Fab
        iconName="compass-outline"
        onPress={centerPosition}
        style={{position: 'absolute', bottom: 20, right: 20}}
      />

      <Fab
        iconName="brush-outline"
        onPress={() => setShowPolilyne(value => !value)}
        style={{position: 'absolute', bottom: 80, right: 20}}
      />
    </>
  );
};
