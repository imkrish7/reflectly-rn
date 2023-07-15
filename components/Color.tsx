import { LinearGradient } from "expo-linear-gradient"
import { FC } from "react"
import { Dimensions, StyleSheet, View } from "react-native"
import { TapGestureHandler, TapGestureHandlerGestureEvent } from "react-native-gesture-handler";
import Animated, { Extrapolate, interpolate, runOnJS, useAnimatedGestureHandler, useAnimatedStyle } from "react-native-reanimated";

const { width } = Dimensions.get('window');
const COLOR_WIDTH = width / 3;
const RADIUS= 45;

interface IProps{
    color: {
        id: number,
        start: string,
        end: string
    },
    index: number,
    translateX: Animated.SharedValue<number>,
    onPress: (position: {x: number, y: number})=> void;
}

type TContext = {

}


export const Color: FC<IProps> = ({ color, index, onPress,translateX })=>{
    const inputRange = [
        -COLOR_WIDTH * (index+1),
        -COLOR_WIDTH * index,
        -COLOR_WIDTH * (index-1),
    ];

    const rStyle = useAnimatedStyle(()=>{
        const angle = interpolate(
            translateX.value ,  
            inputRange,
            [0, Math.PI/2, Math.PI], 
            Extrapolate.CLAMP
            );
        const translateY = 100 * Math.cos(angle); //interpolate(translateX.value,  inputRange, [100, 0, -100], Extrapolate.CLAMP)  
        const scale = 0.8 + 0.2 * Math.sin(angle);
        return {
            transform: [{translateX: translateX.value}, { translateY }, {scale}]
        }
    })

    const gestureHandler = useAnimatedGestureHandler<TapGestureHandlerGestureEvent, TContext>({
        onActive: (event, ctx)=>{
            runOnJS(onPress)({x: event.absoluteX, y: event.absoluteY});
            // onPress()
        }
    })
    return  <Animated.View style={[styles.container, rStyle]}>
                <TapGestureHandler onGestureEvent={gestureHandler}>
                    <Animated.View>
                        <LinearGradient style={styles.gradient} colors={[color.start, color.end]}/>
                    </Animated.View>
                </TapGestureHandler>
        </Animated.View>
}

const styles = StyleSheet.create({
    container: {
       width: COLOR_WIDTH,
       alignItems: 'center'
    },
    gradient: {
        borderRadius: RADIUS,
        width: RADIUS * 2,
        height: RADIUS * 2,
        borderWidth: 6,
        borderColor: 'white'
    }
})