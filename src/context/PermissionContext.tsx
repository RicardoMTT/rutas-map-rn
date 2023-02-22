import React, {createContext, useEffect, useState} from 'react';
import {AppState, Platform} from 'react-native';
import {
  PERMISSIONS,
  PermissionStatus,
  request,
  check,
  openSettings,
} from 'react-native-permissions';

export interface PermissionState {
  locationStatus: PermissionStatus;
}

type PermissionsContextProps = {
  permissions: PermissionState;
  askLocationPermission: () => void;
  checkLocationPermission: () => void;
};

export const permissionInitState: PermissionState = {
  locationStatus: 'unavailable',
};

export const permissionContext = createContext({} as PermissionsContextProps); //TODO :: QUE EXPORTA

export const PermissionsProvider = ({children}: any) => {
  const [permissions, setPermissions] = useState(permissionInitState);

  useEffect(() => {
    checkLocationPermission();

    AppState.addEventListener('change', state => {
      if (state !== 'active') return;
      checkLocationPermission();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const askLocationPermission = async () => {
    let permissionStatus: PermissionStatus;
    if (Platform.OS === 'ios') {
      permissionStatus = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    } else {
      permissionStatus = await request(
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      );
    }

    if (permissionStatus === 'blocked') {
      openSettings();
    }

    setPermissions({
      ...permissions,
      locationStatus: permissionStatus,
    });
  };

  //Cuando la persona regresa a la app
  const checkLocationPermission = async () => {
    let permissionStatus: PermissionStatus;
    if (Platform.OS === 'ios') {
      permissionStatus = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    } else {
      permissionStatus = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    }
    setPermissions({
      ...permissions,
      locationStatus: permissionStatus,
    });
  };
  return (
    <permissionContext.Provider
      value={{
        permissions,
        askLocationPermission,
        checkLocationPermission,
      }}>
      {children}
    </permissionContext.Provider>
  );
};
