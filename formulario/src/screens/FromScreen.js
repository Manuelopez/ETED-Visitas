import React from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import SelectDropdown from 'react-native-select-dropdown';
// import MultiSelect from 'react-native-multiple-select';

const resonsForVisit = [
  { id: 1, name: 'Instalacion' },
  { id: 2, name: 'Reparacion' },
  { id: 3, name: 'Mantenimiento' },
  { id: 4, name: 'Remocion' },
  { id: 5, name: 'Cambio' },
  { id: 6, name: 'Inspeccion' },
  { id: 7, name: 'Visita de Cortesia' },
  { id: 8, name: 'Levantamiento' },
  { id: 9, name: 'Otros' },
];

const FormScreen = () => {
  const [date, setDate] = React.useState(new Date());
  const [showDate, setShowDate] = React.useState(false);
  const [selectedNode, setSelectedNode] = React.useState('');
  const [selectedPhase, setSelectedPhase] = React.useState('');
  const [slectedReasonsForVisit, setSelectedReasonsForVisit] = React.useState(
    []
  );
  const onDateChange = (event, selectedDate) => {
    setShowDate(false);
    const currentDate = selectedDate || date;
    setDate(currentDate);
  };
  return (
    <View>
      {showDate && (
        <DateTimePicker value={date} onChange={onDateChange} mode="date" />
      )}
      <Text>Selecionar Dia</Text>
      <TouchableOpacity
        onPress={() => {
          setShowDate(true);
        }}
      >
        <Text style={styles.textDatePickerStyle}>{date.toDateString()}</Text>
      </TouchableOpacity>
      <SelectDropdown
        data={['Los Minas', 'San Pedro II']}
        onSelect={(selectedItem) => {
          setSelectedNode(selectedItem);
        }}
      />
      <SelectDropdown
        data={['Fase I', 'Fase II', 'Fase III']}
        onSelect={(selectedItem) => {
          setSelectedPhase(selectedItem);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  textDatePickerStyle: {
    fontSize: 18,
  },
});

export default FormScreen;
