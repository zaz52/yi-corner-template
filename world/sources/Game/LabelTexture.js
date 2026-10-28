import * as THREE from 'three/webgpu'

export function createLabelTexture(lines, width = 1024, height = 256) {
    const canvas = document.createElement('canvas')
    canvas.width = width; canvas.height = height
    const context = canvas.getContext('2d')
    context.fillStyle = '#000'; context.fillRect(0, 0, width, height)
    context.fillStyle = '#fff'; context.textAlign = 'center'; context.textBaseline = 'middle'
    context.font = `bold ${Math.floor(height / (lines.length * 2.1))}px system-ui, sans-serif`
    lines.forEach((line, index) => context.fillText(line, width / 2, height * (index + .5) / lines.length, width * .92))
    const result = new THREE.CanvasTexture(canvas)
    result.flipY = false
    result.minFilter = THREE.LinearFilter; result.magFilter = THREE.LinearFilter
    result.generateMipmaps = false
    return result
}

export class IntroLabelLoader {
    load(path, onLoad) {
        const lines = path.includes('touch') ? ['轻触屏幕', '开始探索']
            : path.includes('gamepad') ? ['按下互动键', '开始探索'] : ['按回车键', '开始探索']
        const result = createLabelTexture(lines, 512, 256)
        queueMicrotask(() => onLoad(result))
        return result
    }
}
