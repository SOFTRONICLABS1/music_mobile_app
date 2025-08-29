/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import DevServerErrorHandler from './src/utils/devServerErrorHandler';

DevServerErrorHandler.init();

AppRegistry.registerComponent(appName, () => App);
