import React from 'react';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import TimePcker from 'react-time-picker';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';

import { isAuth } from '../Middleware/isAuth';

const activityOptions = [
  { value: 1, label: 'Instalacion' },
  { value: 2, label: 'Reparacion' },
  { value: 3, label: 'Matenimiento' },
  { value: 4, label: 'Remocion' },
  { value: 5, label: 'Cambio' },
  { value: 6, label: 'Inspeccion' },
  { value: 7, label: 'Visita de Cortesia' },
  { value: 8, label: 'Levantamiento' },
  { value: 9, label: 'Combustible' },
  { value: 10, label: 'Supervision' },
  { value: 11, label: 'Recepcion' },
  { value: 12, label: 'Otras' },
];

const AddFormPage = (props) => {
  const [formVisitDate, setFormVisitDate] = React.useState(new Date());
  const [nodesRecord, setNodesRecord] = React.useState([]);
  const [selectedNode, setSelectedNode] = React.useState();
  const [selectedActivity, setSelectedActivity] = React.useState([]);
  const [reasonForVisit, setReasonForVisit] = React.useState('');
  const [activityDone, setActivityDone] = React.useState('');
  const [observation, setObservation] = React.useState('');
  const [staffPresent, setStaffPresent] = React.useState('');
  const [timeIn, setTimeIn] = React.useState('');
  const [timeOut, setTimeOut] = React.useState('');
  const [selectedImages, setSelectedImages] = React.useState(null);

  const classes = useStyles();

  const fetchNodes = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('http://137.184.75.4:5000/api/node', {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${token}`,
      },
    });
    const jsonData = await response.json();

    if (!jsonData.error) {
      const formatedData = jsonData.map((node) => {
        return { value: node.id, label: node.name };
      });
      setNodesRecord(formatedData);
    }
  };

  const submitForm = async () => {
    const token = localStorage.getItem('token');
    const imagesData = [];
    for (let image of selectedImages) {
      let base64string = await getBase64(image);
      base64string = base64string.split(',')[1];
      imagesData.push(base64string);
    }
    console.log(imagesData);
    const formatedSelectedActivities = selectedActivity.map(
      (activity) => activity.label
    );
    try {
      await fetch('http://137.184.75.4:5000/api/visitform', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          date: formVisitDate,
          nodeId: selectedNode.value,
          activity: formatedSelectedActivities,
          reasonForVisit: reasonForVisit,
          activityDone: activityDone,
          observations: observation,
          staffPresent: staffPresent,
          timeIn: timeIn,
          timeOut: timeOut,
          images: imagesData,
        }),
      });

      setFormVisitDate(new Date());
      setSelectedNode(null);
      setSelectedActivity(null);
      setReasonForVisit('');
      setActivityDone('');
      setObservation('');
      setStaffPresent('');
      setTimeIn('');
      setTimeOut('');
      // setSelectedImages(null);
      // const jsonData = await response.json();
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    isAuth();
    fetchNodes();
  }, []);

  return (
    <div className={classes.root}>
      <div className={classes.rootSection}>
        <div className={classes.section1}>
          <label>
            <p>Fecha</p>
            <DatePicker
              selected={formVisitDate}
              onChange={(date) => {
                setFormVisitDate(date);
              }}
              className={classes.addDate}
            />
          </label>
          <label>
            <p>Nodo</p>
            <Select
              value={selectedNode}
              onChange={(node) => {
                setSelectedNode(node);
              }}
              options={nodesRecord}
              className={classes.addSelect}
            />
          </label>
          <label>
            <p>Actividad</p>
            <Select
              value={selectedActivity}
              isMulti
              onChange={(activity) => {
                setSelectedActivity(activity);
              }}
              options={activityOptions}
              className={classes.addSelect}
            />
          </label>
          <label>
            <p>Motivo de visita</p>
            <Input
              style={{ width: 300 }}
              value={reasonForVisit}
              onChange={(e) => setReasonForVisit(e.target.value)}
            />
          </label>
          <label>
            <p>Hora In</p>
            <TimePcker
              className={classes.addTimeIn}
              value={timeIn}
              onChange={setTimeIn}
            />
          </label>
        </div>
        <div className={classes.section2}>
          <label>
            <p>Actividad Realizada</p>
            <Input
              value={activityDone}
              style={{ width: 300 }}
              onChange={(e) => setActivityDone(e.target.value)}
            />
          </label>
          <label>
            <p>Observaciones</p>
            <Input
              value={observation}
              style={{ width: 300 }}
              onChange={(e) => setObservation(e.target.value)}
            />
          </label>
          <label>
            <p>Personal Acompañado</p>
            <Input
              value={staffPresent}
              style={{ width: 300 }}
              onChange={(e) => setStaffPresent(e.target.value)}
            />
          </label>

          <label>
            <p>Fotos</p>
            <Input
              inputProps={{ multiple: true }}
              type="file"
              multiple={true}
              onChange={(e) => setSelectedImages(e.target.files)}
            />
          </label>
          <label>
            <p>Hora Out</p>
            <TimePcker
              className={classes.addTimeIn}
              value={timeOut}
              onChange={setTimeOut}
            />
          </label>
        </div>
      </div>
      <Button
        style={{ width: '100%' }}
        variant="contained"
        onClick={submitForm}
      >
        Agregar formulario
      </Button>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    marginLeft: 150,
    marginTop: 80,
  },
  rootSection: {
    display: 'flex',
  },
  section1: {
    width: 'calc(50% - 150px)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 100,
  },
  section2: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: 'calc(50% - 150px)',
  },
  addSelect: {
    width: 300,
  },
  addDate: {
    width: 300,
  },
  addTimeIn: {
    width: 300,
  },
}));

const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

export default AddFormPage;
