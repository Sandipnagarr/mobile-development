import { useEffect, useRef } from "react";
import { View,  StyleSheet, Animated } from "react-native";

const SplashIntro = ({ onFinish }) => {
  const scale = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.timing(scale, {
      toValue: 1,
      duration: 13500,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      onFinish();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onFinish, scale]);

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.text, { transform: [{ scale }] }]}>
        TickMap
      </Animated.Text>
    </View>
  );
};

/**1. Fixed Site Priority checkbox behavior so unchecking it also removes plotted icons from the map.
 * 7.github issued resolved with prateek sir(problem remote branch not pushed after fix the issue)
2.Fixed dependent layer for the Toilets section so child Site Priority visuals are cleared when the parent layer is unchecked. 
3.merge the code and resolve the merge conflict, and push the code ,also added the open area layer check box
4.Debugged the mobile app login issue by tracing the full frontend and backend authentication flow
5.Fixed the React Native login screen by correcting auth storage handling with AsyncStorage and validating token save flow
6.
*/


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#fff",
    fontSize: 34,
    fontWeight: "700",
  },
});

export default SplashIntro;
