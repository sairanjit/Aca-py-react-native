import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import HomeScreen from './src/screens/HomeScreen';
import AgentScreen from './src/screens/AgentScreen';
import ConnectionScreen from './src/screens/ConnectionScreen';

const navigator = createStackNavigator(
  {
    Agent: {
      screen: AgentScreen,
      navigationOptions: {
        headerShown: false
      }
    },
    Home: {
      screen: HomeScreen,
      navigationOptions: {
        headerShown: false
      }
    },
    Connection: {
      screen: ConnectionScreen,
      navigationOptions: {
        headerShown: false
      }
    }
  },
  {
    initialRouteName: 'Agent'
  }
);

const App = createAppContainer(navigator);

export default App;
