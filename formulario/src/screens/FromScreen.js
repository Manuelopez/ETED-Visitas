import React, { useMemo } from 'react';
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import SelectDropdown from 'react-native-select-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SelectMultiple from 'react-native-select-multiple';

import * as ImagePicker from 'expo-image-picker';

const reasonForVisit = [
  'Instalacion',
  'Reparacion',
  'Mantenimiento',
  'Remocion',
  'Cambio',
  'Inspeccion',
  'Visita de Cortesia',
  'Levantamiento',
  'Otros',
];

const FormScreen = () => {
  const [date, setDate] = React.useState(new Date());
  const [showDate, setShowDate] = React.useState(false);
  const [selectedNode, setSelectedNode] = React.useState('');
  const [nodeRecords, setNodeRecords] = React.useState([]);
  const [selectedResonForVisit, setSelectedReasonsForVisit] = React.useState(
    []
  );
  const [motive, setMotive] = React.useState('');
  const [activityPreformed, setActivityPreformed] = React.useState('');
  const [observations, setObservations] = React.useState('');
  const [staffPresent, setStaffPresent] = React.useState('');
  const [showTimeIn, setShowTimeIn] = React.useState(false);
  const [timeIn, setTimeIn] = React.useState(new Date());
  const [showTimeOut, setShowTimeOut] = React.useState(false);
  const [timeOut, setTimeOut] = React.useState(new Date());
  const [imagesData, setImagesData] = React.useState([]);
  const [nodeOriginalRecord, setNodeOriginalRecord] = React.useState([]);

  const getNodes = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      const response = await fetch('http://137.184.75.4:5000/api/node', {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${token}`,
        },
      });
      const nodesData = await response.json();
      setNodeOriginalRecord(nodesData);
      const formatedNodes = nodesData.map((node) => node.name);
      setNodeRecords(formatedNodes);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    getNodes();
  }, []);

  const onDateChange = (event, selectedDate) => {
    setShowDate(false);
    const currentDate = selectedDate || date;
    setDate(currentDate);
  };

  const onTimeInChange = (event, selectedTime) => {
    setShowTimeIn(false);
    const currentTime = selectedTime || timeIn;
    setTimeIn(currentTime);
  };

  const onTimeOutChange = (event, selectedTime) => {
    setShowTimeOut(false);
    const currentTime = selectedTime || timeOut;
    setTimeOut(currentTime);
  };

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        quality: 1,
        base64: true,
      });
      const imagesDataCopy = [...imagesData];
      imagesDataCopy.push(result.base64);
      setImagesData(imagesDataCopy);
    } catch (error) {
      console.log(error);
    }
  };
  const addFormClicked = async () => {
    try {
      const pickedNode = nodeOriginalRecord.find(
        (node) => node.name === selectedNode
      );

      const token = await AsyncStorage.getItem('token');
      const formatedActivity = selectedResonForVisit.map(
        (reason) => reason.value
      );

      const response = await fetch('http://137.184.75.4:5000/api/visitform', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          date: date,
          nodeId: pickedNode.id,
          activity: formatedActivity,
          reasonForVisit: motive,
          activityDone: activityPreformed,
          observations: observations,
          staffPresent: staffPresent,
          timeIn: timeIn.toLocaleTimeString(),
          timeOut: timeOut.toLocaleTimeString(),
          images: imagesData,
        }),
      });
      const jsonData = await response.json();
      console.log(jsonData);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScrollView>
      <View style={styles.root}>
        {showDate && (
          <DateTimePicker value={date} onChange={onDateChange} mode="date" />
        )}
        <Text style={styles.textTitle}>Fecha *</Text>
        <TouchableOpacity
          onPress={() => {
            setShowDate(true);
          }}
        >
          <Text style={styles.textDatePickerStyle}>{date.toDateString()}</Text>
        </TouchableOpacity>

        <Text style={styles.textTitle}>Nodo *</Text>
        <SelectDropdown
          style={styles.selectNode}
          data={nodeRecords}
          onSelect={(selectedItem) => {
            setSelectedNode(selectedItem);
          }}
        />

        <Text style={styles.textTitle}>Actividad *</Text>
        <SelectMultiple
          items={reasonForVisit}
          selectedItems={selectedResonForVisit}
          onSelectionsChange={(reason) => setSelectedReasonsForVisit(reason)}
        />

        <Text style={styles.textTitle}>Motivo de visita *</Text>
        <TextInput
          style={styles.input}
          onChangeText={setMotive}
          value={motive}
        />

        <Text style={styles.textTitle}>Actividad Realizada *</Text>
        <TextInput
          style={styles.input}
          onChangeText={setActivityPreformed}
          value={activityPreformed}
        />

        <Text style={styles.textTitle}>Observaciones *</Text>
        <TextInput
          style={styles.input}
          onChangeText={setObservations}
          value={observations}
        />

        <Text style={styles.textTitle}>Personal Acompañado *</Text>
        <TextInput
          style={styles.input}
          onChangeText={setStaffPresent}
          value={staffPresent}
        />

        {showTimeIn && (
          <DateTimePicker
            value={timeIn}
            onChange={onTimeInChange}
            mode="time"
          />
        )}
        <Text style={styles.textTitle}>Hora In *</Text>
        <TouchableOpacity
          onPress={() => {
            setShowTimeIn(true);
          }}
        >
          <Text style={styles.textDatePickerStyle}>
            {timeIn.toLocaleTimeString()}
          </Text>
        </TouchableOpacity>

        {showTimeOut && (
          <DateTimePicker
            value={timeOut}
            onChange={onTimeOutChange}
            mode="time"
          />
        )}
        <Text style={styles.textTitle}>Hora Out *</Text>
        <TouchableOpacity
          onPress={() => {
            setShowTimeOut(true);
          }}
        >
          <Text style={styles.textDatePickerStyle}>
            {timeOut.toLocaleTimeString()}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>Pick an image from camera roll</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={addFormClicked}>
          <Text style={styles.buttonText}>Agregar Visita</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    margin: 30,
    display: 'flex',
    flexDirection: 'column',
  },
  textTitle: {
    fontSize: 20,
    marginBottom: 10,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },

  button: {
    marginTop: 10,
    backgroundColor: '#4CAF50',
    color: 'white',
    textAlign: 'center',
    padding: 15,
  },

  textDatePickerStyle: {
    fontSize: 18,
    borderWidth: 1,
    padding: 10,
  },
  input: {
    height: 40,

    borderWidth: 1,
    padding: 10,
  },
});

export default FormScreen;
