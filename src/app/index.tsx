if (__DEV__) {
  require("../../ReactotronConfig");
}
import { Redirect } from 'expo-router';

export default function IndexRoute() {
  return <Redirect href="/(tabs)/apod" />;
}
