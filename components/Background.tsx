import { FC, useEffect } from "react"
import { View, StyleSheet, Dimensions } from "react-native"
import Animated, { Easing, color, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"


interface IProps {
    colorSelection: {
        position: { x: number, y: number },
        current: { id: number,start: string, end: string },
        previous: {id: number, start: string, end: string}
    }
}

const { width, height } = Dimensions.get('window');



export const Background: FC<IProps> = ({ colorSelection })=>{
    const progress = useSharedValue(0);

    useEffect(()=>{
        progress.value = 0;
        progress.value = withTiming(1, {duration: 650, easing: Easing.inOut(Easing.ease)});
    }, [colorSelection])
    const MAX_RADIUS = Math.SQRT2 * Math.max(width+ colorSelection.position.x , height + colorSelection.position.y);
    const rStyle = useAnimatedStyle(()=>{
        return {
            top: -45+colorSelection.position.y,
            left: -45+colorSelection.position.x, 
            borderRadius: 45,
            width: 90,
            height: 90,
            backgroundColor: colorSelection.current.start,
            transform: [{scale: progress.value *( MAX_RADIUS/45)}],
        }
    })
    return <View style={
        {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: colorSelection.previous.start
        }
        }>
            <Animated.View style={rStyle}></Animated.View>
    </View>
}