import { FC, useRef } from "react"
import  { Surface } from 'gl-react-expo'
import { Dimensions, StyleSheet, View } from "react-native"
import { GLSL, Node, Shaders } from "gl-react"
import { color2vector, useGLProgress } from "./helpers"

const { width, height } = Dimensions.get('window');

interface IProps {
    colorSelection: {
        position: { x: number, y: number },
        current: { id: number,start: string, end: string },
        previous: {id: number, start: string, end: string}
    }
}


const shaders = Shaders.create({
  background: {
    frag: GLSL`
precision highp float;
varying vec2 uv;
uniform vec2 position;
uniform vec3 backgroundColorStart;
uniform vec3 backgroundColorEnd;
uniform vec3 foregroundColorStart;
uniform vec3 foregroundColorEnd;
uniform float progress;

vec4 gradient(vec3 start, vec3 end) {
  return vec4(mix(start, end, uv.y), 1.0);
}

void main() {
  float mag = distance(uv, position);
  gl_FragColor = mag < progress ? 
    gradient(foregroundColorStart, foregroundColorEnd)
  : 
    gradient(backgroundColorStart, backgroundColorEnd);
}
`,
  },
});


export const BackgroundGL: FC<IProps> = ({colorSelection})=>{
    const node = useRef<Node>(null);
    const uniforms =  {
                position: [((height-width)/2 + colorSelection.position.x/width), colorSelection.position.y/height],
                backgroundColorStart: color2vector(colorSelection.previous.start),
                foregroundColorStart: color2vector(colorSelection.previous.start),
                backgroundColorEnd: color2vector(colorSelection.current.end),
                foregroundColorEnd: color2vector(colorSelection.current.end)
                
            }
    useGLProgress(node, uniforms, [colorSelection.current])
    return <Surface style={styles.container}>
        <Node 
        ref={node}
        shader={shaders.background} 
        uniforms={uniforms} />
    </Surface>
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: -(height-width)/2,
        height,
        width
    }
});