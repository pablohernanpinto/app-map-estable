import React, { useState } from 'react';
import { StyleSheet, View, Modal, Button, Text, TextInput } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import Checkbox from 'expo-checkbox';

export default function MapScreen() {
  const [marker, setMarker] = useState([]); // Almacenamiento de múltiples pines
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null); // Para almacenar las coordenadas
  const navigation = useNavigation();
  const [selectedCheckbox, setSelectedCheckbox] = useState(null); // Estado para el checkbox seleccionado
  const [description, setDescription] = useState(''); // Para capturar la descripción

  const handleMapPress = (e) => {
    const { coordinate } = e.nativeEvent;
    setSelectedLocation(coordinate); // Guardar la ubicación seleccionada
    setModalVisible(true); // Mostrar el modal con las opciones
  };

  const handleFormSubmit = () => {
    if (selectedLocation) {
      const formData = {
        selectedOption: selectedCheckbox,
        description: description,
        latitude: selectedLocation.latitude,  // Guardar la latitud
        longitude: selectedLocation.longitude, // Guardar la longitud
      };
      console.log('Datos del formulario:', formData);
      setModalVisible(false); // Cerrar el modal

      // Aquí podrías enviar formData a un servidor o hacer lo que necesites
    } else {
      alert('Por favor selecciona una ubicación en el mapa.');
    }
  };

  const handleCheckboxSelect = (index) => {
    setSelectedCheckbox(selectedCheckbox === index ? null : index); // Selecciona o desmarca el checkbox
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
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.titleText}>Opciones para la ubicación seleccionada:</Text>

            <View style={styles.containerCheckBox}>
              <Checkbox
                value={selectedCheckbox === 0}
                onValueChange={() => handleCheckboxSelect(0)}
              />
              <Text style={styles.textCheckbox}>Accidente - Accidente de tránsito</Text>
            </View>

            <View style={styles.containerCheckBox}>
              <Checkbox
                value={selectedCheckbox === 1}
                onValueChange={() => handleCheckboxSelect(1)}
              />
              <Text style={styles.textCheckbox}>Accidente - Incendio</Text>
            </View>

            <View style={styles.containerCheckBox}>
              <Checkbox
                value={selectedCheckbox === 2}
                onValueChange={() => handleCheckboxSelect(2)}
              />
              <Text style={styles.textCheckbox}>Delito - Robo/Hurto</Text>
            </View>

            <View style={styles.containerCheckBox}>
              <Checkbox
                value={selectedCheckbox === 3}
                onValueChange={() => handleCheckboxSelect(3)}
              />
              <Text style={styles.textCheckbox}>Delito - Asalto</Text>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Descripción"
              value={description}
              onChangeText={setDescription}
            />

            <View style={styles.buttonContainer}>
              <Button title="Ingresar" onPress={handleFormSubmit} />
              <Text></Text>
              <Button title="Cancelar" onPress={() => setModalVisible(false)} />
            </View>
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
    alignItems: 'flex-start',
  },
  input: {
    height: 40,
    width: 300,
    margin: 12,
    borderWidth: 1,
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  containerCheckBox: {
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textCheckbox: {
    marginLeft: 8,
  },
  buttonContainer: {
    flexDirection: 'row',

    width: '100%',
    marginTop: 20,
  },
});
