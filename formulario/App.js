import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import FormScreen from './src/screens/FromScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';

const navigator = createStackNavigator(
  {
    Log: LoginScreen,
    Form: FormScreen,
    Register: RegisterScreen,
  },
  {
    initialRouteName: 'Log',
    defaultNavigationOptions: {
      title: 'EMPRESA DE TRANSMISIÓN ELÉCTRICA DOMINICANA',
    },
  }
);

export default createAppContainer(navigator);
