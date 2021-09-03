import React from 'react';
import Select from 'react-select';
import { makeStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
// import {
//   withScriptjs,
//   withGoogleMap,
//   GoogleMap,
//   Marker,
// } from 'react-google-maps';

import { isAuth } from '../Middleware/isAuth';

const NodePage = (props) => {
  const [nodeName, setNodeName] = React.useState('');
  const [nodePhase, setNodePhase] = React.useState('');
  const [nodeZone, setNodeZone] = React.useState('');
  const [nodesRecords, setNodesRecord] = React.useState([]);
  const [selectedNode, setSelectedNode] = React.useState();
  const [nodeLatitude, setNodeLatitude] = React.useState('');
  const [nodeLongitude, setNodeLongitude] = React.useState('');

  const classes = useStyles();

  const deleteNodeClicked = async () => {
    const token = localStorage.getItem('token');

    await fetch(`https://137.184.75.4:5001/api/node/${selectedNode.value}`, {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${token}`,
      },
    });
    fetchNodes();
    setDefaults();
  };

  const updateNodeClicked = async () => {
    const token = localStorage.getItem('token');

    await fetch(`http://137.184.75.4:5000/api/node/${selectedNode.value}`, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: nodeName,
        zone: nodeZone,
        phase: nodePhase,
        latitude: parseFloat(nodeLatitude),
        longitude: parseFloat(nodeLongitude),
      }),
    });

    fetchNodes();
    setDefaults();
  };

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
        return {
          value: node.id,
          label: node.name,
          zone: node.zone,
          phase: node.phase,
          longitude: node.longitude,
          latitude: node.latitude,
        };
      });
      setNodesRecord(formatedData);
    }
  };
  const setDefaults = () => {
    setNodeName('');
    setNodePhase('');
    setNodeZone('');
    setNodeLongitude('');
    setNodeLatitude('');
    setSelectedNode(null);
  };

  const saveNewNodeClicked = async () => {
    const token = localStorage.getItem('token');

    const response = await fetch('http://137.184.75.4:5000/api/node', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: nodeName,
        phase: nodePhase,
        zone: nodeZone,
        latitude: parseFloat(nodeLatitude),
        longitude: parseFloat(nodeLongitude),
      }),
    });
    setDefaults();
    fetchNodes();
    const jsonData = await response.json();
    console.log(jsonData);
  };

  React.useEffect(() => {
    isAuth();
    fetchNodes();
  }, [props.history]);

  return (
    <div className={classes.root}>
      <div>
        <Select
          value={selectedNode}
          options={nodesRecords}
          onChange={(node) => {
            setSelectedNode(node);
            setNodeName(node.label);
            setNodePhase(node.phase);
            setNodeZone(node.zone);
            setNodeLatitude(node.latitude);
            setNodeLongitude(node.longitude);
          }}
          className={classes.selectNode}
        />
      </div>
      <div>
        <label>
          <p>Nombre</p>
          <Input
            value={nodeName}
            onChange={(e) => setNodeName(e.target.value)}
            style={{ width: 300 }}
          />
        </label>
        <br />
        <label>
          <p>Fase</p>
          <Input
            value={nodePhase}
            onChange={(e) => setNodePhase(e.target.value)}
            style={{ width: 300 }}
          />
        </label>
        <br />
        <label>
          <p>Zona</p>
          <Input
            value={nodeZone}
            onChange={(e) => setNodeZone(e.target.value)}
            style={{ width: 300, marginBottom: 20 }}
          />
        </label>
        <label>
          <p>Latitud</p>
          <Input
            value={nodeLatitude}
            onChange={(e) => setNodeLatitude(e.target.value)}
            style={{ width: 300, marginBottom: 20 }}
          />
        </label>
        <label>
          <p>Longitud</p>
          <Input
            value={nodeLongitude}
            onChange={(e) => setNodeLongitude(e.target.value)}
            style={{ width: 300, marginBottom: 20 }}
          />
        </label>
        <br />
        <Button
          onClick={saveNewNodeClicked}
          variant="contained"
          size={'small'}
          style={{ marginRight: 10 }}
        >
          Nuevo Nodo
        </Button>
        <Button
          onClick={() => {
            updateNodeClicked();
          }}
          style={{ marginRight: 10 }}
          variant="contained"
          size={'small'}
        >
          Actualizar
        </Button>
        <Button onClick={deleteNodeClicked} variant="contained" size={'small'}>
          Borrar
        </Button>
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    marginLeft: 150,
    marginTop: 80,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectNode: {
    width: 450,
    marginBottom: 20,
  },
}));

export default NodePage;
