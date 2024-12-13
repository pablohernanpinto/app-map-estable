import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Modal, Button, Text, TextInput, Alert, DevSettings } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import Checkbox from 'expo-checkbox';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function MapScreen() {
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.324,
    latitudeDelta: 0.005 ,
    longitudeDelta: 0.005,
  });
  const [incidentes, setIncidentes] = useState([]); // Estado para almacenar los incidentes
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null); // Para almacenar las coordenadas
  const [selectedIncident, setSelectedIncident] = useState(null); // Para almacenar el incidente seleccionado
  const [description, setDescription] = useState('');
  const [nombreAccidente, setNombreAccidente] = useState('');
  const [id, setID] = useState(null);
  const navigation = useNavigation();
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchIncidentes = async () => {
      try {
        const response = await axios.get('http://192.168.0.12:3000/incidentes/');

        setIncidentes(response.data);
        
      } catch (err) {
        console.error('Error al cargar incidentes:', err);
        Alert.alert('Error', 'No se pudieron cargar los incidentes');
      } 
    };

    fetchIncidentes();

    (async () => {
      try {
        const userId = await AsyncStorage.getItem('id_usuario');
        setID(userId);

        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permisos denegados', 'No se puede acceder a la ubicación.');
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        setRegion({
          latitude,
          longitude,
          latitudeDelta: 0.0005,
          longitudeDelta: 0.001,
        });
        console.log('aqui')
      } catch (error) {
        console.error('Error al obtener ubicación:', error);
        Alert.alert('Error', 'No se pudo obtener la ubicación.');
      }
    })();
  }, []);
  const forzarRefresco = () => {
    setRefresh(true); // Esto activará el efecto
  };
  const handleMapPress = (e) => {
    const { coordinate } = e.nativeEvent;
    setSelectedLocation(coordinate);
    setModalVisible(true);
  };

  const handleMarkerPress = (incident) => {
    setSelectedIncident(incident); // Guardar el incidente seleccionado
    setModalVisible(true); // Mostrar el modal con los detalles
  };

  const handleFormSubmit = async () => {
    const now = new Date();
    const date = now.toLocaleDateString(); // Fecha en formato local
    const time = String(now.getHours()).padStart(2, '0') + ':' +
                String(now.getMinutes()).padStart(2, '0') + ':' +
                String(now.getSeconds()).padStart(2, '0');

    if (selectedLocation) {
      const formData = {
        id_usuario: id,
        fecha: date,
        hora: time,
        tipo: nombreAccidente,
        descripcion: description,
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
      };
      try {
        await axios.post('http://192.168.0.12:3000/incidentes/', formData, {
          headers: { 'Content-Type': 'application/json' },
        });
        Alert.alert('Incidente Registrado', 'El incidente ha sido registrado correctamente');
      } catch (error) {
        console.error('Error al registrar incidente:', error);
        Alert.alert('Error', 'Hubo un error al registrar el incidente');
      }
    } else {
      Alert.alert('Error', 'Por favor selecciona una ubicación en el mapa.');
    }
  };

  const handleCheckboxSelect = (index) => {
    switch (index) {
      case 0:
        setNombreAccidente('Accidente - Accidente de tránsito');
        break;
      case 1:
        setNombreAccidente('Accidente - Incendio');
        break;
      case 2:
        setNombreAccidente('Delito - Robo/Hurto');
        break;
      case 3:
        setNombreAccidente('Delito - Asalto');
        break;
      default:
        setNombreAccidente('');
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onPress={handleMapPress}
      >
        {incidentes.length > 0 ? (
          incidentes.map((incident) => (
            <Marker
              key={incident.id_incidente}
              coordinate={{
                latitude: parseFloat(incident.latitude),
                longitude: parseFloat(incident.longitude),
              }}
              title={incident.tipo}
              description={incident.descripcion}
              onPress={() => handleMarkerPress(incident)}
            />
          ))
        ) : (
          <Text style={styles.noIncidentsText}>No hay incidentes disponibles.</Text>
        )}
      </MapView>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedIncident ? (
              <>
                <Text style={styles.titleText}>Detalles del incidente</Text>
                <Text>Tipo: {selectedIncident.tipo}</Text>
                <Text>Descripción: {selectedIncident.descripcion}</Text>
              </>
            ) : (
              <>
                <Text style={styles.titleText}>Opciones para la ubicación seleccionada:</Text>

                <View style={styles.containerCheckBox}>
                  <Checkbox
                    value={nombreAccidente === 'Accidente - Accidente de tránsito'}
                    onValueChange={() => handleCheckboxSelect(0)}
                  />
                  <Text style={styles.textCheckbox}>Accidente - Accidente de tránsito</Text>
                </View>

                <View style={styles.containerCheckBox}>
                  <Checkbox
                    value={nombreAccidente === 'Accidente - Incendio'}
                    onValueChange={() => handleCheckboxSelect(1)}
                  />
                  <Text style={styles.textCheckbox}>Accidente - Incendio</Text>
                </View>

                <View style={styles.containerCheckBox}>
                  <Checkbox
                    value={nombreAccidente === 'Delito - Robo/Hurto'}
                    onValueChange={() => handleCheckboxSelect(2)}
                  />
                  <Text style={styles.textCheckbox}>Delito - Robo/Hurto</Text>
                </View>

                <View style={styles.containerCheckBox}>
                  <Checkbox
                    value={nombreAccidente === 'Delito - Asalto'}
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
              </>
            )}
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
  noIncidentsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});
