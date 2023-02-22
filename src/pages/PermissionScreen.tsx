import React, {useContext} from 'react';
import {StyleSheet} from 'react-native';
import {Text, View} from 'react-native';
import {BlackButton} from '../components/BlackButton';
import {permissionContext} from '../context/PermissionContext';

export const PermissionScreen = () => {
  const {permissions, askLocationPermission} = useContext(permissionContext);

  return (
    <View style={styles.container}>
      <Text>PermissionScreen</Text>
      {/* <Button title="Permiso" onPress={askLocationPermission} /> */}
      <BlackButton title="Permiso" onPress={askLocationPermission} />
      <Text>{JSON.stringify(permissions, null, 5)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
