import React, { useState } from 'react';
import { StyleSheet, View, Modal, Button, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';

export default function MapScreen() {
  const [marker, setMarker] = useState([]); // Usamos un arreglo para almacenar múltiples pines
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const navigation = useNavigation();

  const handleMapPress = (e) => {
    const { coordinate } = e.nativeEvent;
    setSelectedLocation(coordinate); // Guardar la ubicación seleccionada
    setModalVisible(true); // Mostrar el modal con las opciones
  };

  const handleOptionSelect = (option) => {
    console.log(`Opción seleccionada: ${option}`);

    // Guardar el pin seleccionado en el estado
    if (option === 'Importante' || option === 'Peligroso') {
      const newMarker = {
        ...selectedLocation,
        option, // Guardar la opción seleccionada con el pin
      };

      // Actualizar el estado con el nuevo marcador
      setMarker((prevMarkers) => [...prevMarkers, newMarker]);

      // Cerrar el modal y navegar a la pantalla de Perfil
      setModalVisible(false);
      navigation.navigate('Perfil', { markers: [...marker, newMarker] }); // Pasar los pines a la pantalla de Perfil
    } else {
      setModalVisible(false); // Cerrar el modal si se selecciona "Cancelar"
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        onPress={handleMapPress}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {marker.map((m, index) => (
          <Marker
            key={index}
            coordinate={m}
            title={m.option}
            description={`Marcador: ${m.option}`}
          />
        ))}
      </MapView>

      {/* Modal con las opciones */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Opciones para la ubicación seleccionada:</Text>
            <Button title="Marcar como importante" onPress={() => handleOptionSelect('Importante')} />
            <Button title="Marcar como peligroso" onPress={() => handleOptionSelect('Peligroso')} />
            <Button title="Cancelar" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: 250,
    alignItems: 'center',
  },
});
