import React from 'react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import JsZip from 'jszip';
import { saveAs } from 'file-saver';
import { makeStyles } from '@material-ui/core/styles';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import GetAppIcon from '@material-ui/icons/GetApp';
import DeleteIcon from '@material-ui/icons/Delete';

import { isAuth } from '../Middleware/isAuth';

const FormPage = (props) => {
  const [formVisitsData, setFormVisitsData] = React.useState([]);
  const [nodesRecord, setNodesRecord] = React.useState([]);
  const [selectedNode, setSelectedNodes] = React.useState([]);
  const [filterPhase, setFilterPhase] = React.useState([]);
  const [filterFromDate, setFilterFromDate] = React.useState();
  const [filterUntilDate, setFIlterUntilDate] = React.useState();
  const [filterZone, setFilterZone] = React.useState('');
  const [skip, setSkip] = React.useState(0);

  const classes = useStyles();

  const fetchForms = React.useCallback(async () => {
    const filterNodes = selectedNode.map((node) => node.value);
    const filterPhaseData = filterPhase.map((phase) => phase.label);
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(
        'http://137.184.75.4:5000/api/visitform/filter',
        {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            filterNodes,
            filterPhase: filterPhaseData,
            filterFromDate: filterFromDate || undefined,
            filterUntilDate: filterUntilDate || undefined,
            filterZone,
            skip,
            take: 50,
          }),
        }
      );

      const jsonData = await response.json();
      if (jsonData.error || jsonData.errors) {
      } else {
        setFormVisitsData(jsonData);
      }
    } catch (error) {
      console.log(error);
    }
  }, [
    filterUntilDate,
    filterFromDate,
    filterZone,
    filterPhase,
    selectedNode,
    skip,
  ]);

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

  const downloadFormClicked = async () => {
    const filterNodes = selectedNode.map((node) => node.value);
    const filterPhaseData = filterPhase.map((phase) => phase.label);
    const token = localStorage.getItem('token');
    const imagesToDownload = [];

    try {
      const response = await fetch(
        'http://137.184.75.4:5000/api/visitform/filter',
        {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            filterNodes,
            filterPhase: filterPhaseData,
            filterFromDate,
            filterUntilDate,
            filterZone,
            skip: 0,
            take: 0,
          }),
        }
      );

      const formsData = await response.json();

      for (let visit of formsData) {
        for (let img of visit.images) {
          imagesToDownload.push(img.id);
        }
      }

      const csvData = formsData.map((visit) => {
        const imagesId = visit.images.map((img) => img.id);
        return [
          visit.date.substring(0, 10),
          visit.node.name,
          visit.node.phase,
          visit.node.zone,
          visit.activity.join(' - '),
          visit.reasonForVisit,
          visit.activityDone,
          visit.observations,
          imagesId.join(' - '),
          visit.staffPresent.join(' - '),
          visit.timeIn,
          visit.timeOut,
        ];
      });

      let csvJoinedData = [
        `Fechan,Ubicacion Nodo,Fase,Zona,Categoria Actividad,Motivo Visita,Actividades Realizadas,Observaciones,Fotos,Personal Presente,Hora In,Hora Out`,
      ];
      let csvString = '';
      for (let i = 0; i < csvData.length; i++) {
        csvJoinedData.push(csvData[i].join(','));
      }
      csvString = csvJoinedData.join('\n');
      const blobCSV = new Blob([csvString], { type: 'text/csv' });

      const responseImages = await fetch(
        'http://137.184.75.4:5000/api/visitform/images',
        {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ids: imagesToDownload }),
        }
      );
      const base64Images = await responseImages.json();

      const zip = new JsZip();
      zip.file('formulario.csv', blobCSV);
      const imagesFolder = zip.folder('imagenes');
      const mime = 'data:image/jpeg;base64,';

      for (let imgData of base64Images) {
        let url = `${mime}${imgData.data}`;
        let blob = b64toBlob(url);
        imagesFolder.file(`${imgData.id}.jpg`, blob);
      }
      zip.generateAsync({ type: 'blob' }).then((content) => {
        saveAs(content, 'formulario.zip');
      });
    } catch (error) {
      console.log(error);
    }
  };

  const deleteVisitClicked = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://137.184.75.4:5000/api/visitform/${id}`, {
        method: 'DELETE',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${token}`,
        },
      });
      await fetchForms();
    } catch (error) {}
  };

  React.useEffect(() => {
    isAuth();
    fetchNodes();
  }, []);

  React.useEffect(() => {
    fetchForms();
  }, [
    selectedNode,
    filterPhase,
    filterUntilDate,
    filterFromDate,
    filterZone,
    skip,
    fetchForms,
  ]);

  return (
    <div className={classes.root}>
      <div className={classes.filterTitltes}>
        <p>Nodo</p>
        <p>Fase</p>
        <p>Zona</p>
        <p>Desde</p>
        <p>Hasta</p>
      </div>
      <div className={classes.filterItems}>
        <Select
          className={classes.filterSelect}
          value={selectedNode}
          onChange={(node) => setSelectedNodes(node)}
          options={nodesRecord}
          isMulti
        />

        <Select
          value={filterPhase}
          className={classes.filterSelect}
          onChange={(phase) => setFilterPhase(phase)}
          options={[
            { value: 1, label: 'Fase I' },
            { value: 2, label: 'Fase II' },
            { value: 3, label: 'Fase III' },
          ]}
          isMulti
        />
        <input
          value={filterZone}
          className={classes.filterInputs}
          onChange={(e) => setFilterZone(e.target.value)}
        />
        <DatePicker
          className={classes.filterInputs}
          selected={filterFromDate}
          onChange={(date) => {
            setFilterFromDate(date);
          }}
        />
        <DatePicker
          className={classes.filterInputs}
          selected={filterUntilDate}
          onChange={(date) => {
            setFIlterUntilDate(date);
          }}
        />

        <IconButton
          onClick={() => {
            if (skip > 0) setSkip(skip - 50);
          }}
          disabled={skip === 0 ? true : false}
        >
          <ChevronLeftIcon />
        </IconButton>
        <IconButton
          onClick={() => setSkip(skip + 50)}
          disabled={formVisitsData.length === 0 ? true : false}
        >
          <ChevronRightIcon />
        </IconButton>
        <IconButton
          onClick={() => {
            props.history.push('/addForm');
          }}
        >
          <AddIcon />
        </IconButton>
        <IconButton onClick={downloadFormClicked}>
          <GetAppIcon />
        </IconButton>
      </div>
      <table className={classes.formsTabel}>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Ubicacion Nodo</th>
            <th>Fase</th>
            <th>Zona</th>
            <th>Categoria Actividad</th>
            <th>Motivo Visita</th>
            <th>Actividades Realizadas</th>
            <th>Observaciones</th>
            <th>Foto</th>
            <th>Personal Presente</th>
            <th>Hora In</th>
            <th>Hora Out</th>
          </tr>
        </thead>
        <tbody>
          {formVisitsData &&
            formVisitsData.map((visit) => {
              const imagesId = visit.images.map((img) => img.id);
              return (
                <tr key={visit.id}>
                  <td className={classes.tableCells}>
                    {moment(visit.date).format('DD-MM-YY')}
                  </td>
                  <td className={classes.tableCells}>{visit.node.name}</td>
                  <td className={classes.tableCells}>{visit.node.phase}</td>
                  <td className={classes.tableCells}>{visit.node.zone}</td>
                  <td className={classes.tableCells}>
                    {visit.activity.join(' - ')}
                  </td>
                  <td className={classes.tableCells}>{visit.reasonForVisit}</td>
                  <td className={classes.tableCells}>{visit.activityDone}</td>
                  <td className={classes.tableCells}>{visit.observations}</td>
                  <td className={classes.tableCells}>{imagesId.join(' - ')}</td>
                  <td className={classes.tableCells}>
                    {visit.staffPresent.join(' - ')}
                  </td>
                  <td className={classes.tableCells}>{visit.timeIn}</td>
                  <td className={classes.tableCells}>{visit.timeOut}</td>
                  <td>
                    <IconButton onClick={() => deleteVisitClicked(visit.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    marginLeft: 150,
    marginTop: 80,
  },
  filterItems: {
    display: 'flex',
  },
  formsTabel: {
    tableLayout: 'fixed',
    '& th': {
      paddingTop: 12,
      paddingBottom: 12,
      paddingRight: 12,
      paddingLeft: 7,
      textAlign: 'left',
      backgroundColor: '#04AA6D',
      color: 'white',
      border: '1px solid #ddd',
    },
  },
  tableCells: {
    wordWrap: 'break-word',
    border: '1px solid #ddd',
  },
  filterDates: {
    display: 'flex',
    flexDirection: 'column',
  },
  filterSelect: {
    width: 220,
    marginBottom: 0,
    padding: 0,
  },
  filterInputs: {
    height: 32,
    width: 220,
  },
  filterTitltes: {
    display: 'flex',
    '& p': {
      marginRight: 200,
    },
  },
}));

const b64toBlob = (dataURI) => {
  let byteString = atob(dataURI.split(',')[1]);
  let ab = new ArrayBuffer(byteString.length);
  let ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: 'image/jpg' });
};

export default FormPage;
