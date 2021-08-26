import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import FormScreen from './src/screens/FromScreen';
import LoginScreen from './src/screens/LoginScreen';

const navigator = createStackNavigator(
  {
    Log: LoginScreen,
    Form: FormScreen,
  },
  {
    initialRouteName: 'Log',
    defaultNavigationOptions: {
      title: 'Empresa de Trasmicion Electrica Dominicana',
    },
  }
);

export default createAppContainer(navigator);
