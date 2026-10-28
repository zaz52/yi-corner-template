import * as THREE from 'three/webgpu'
import catalog from '../data/site-catalog.json'

/** Text panels for the in-world directory screens. */
export class SiteCardLoader {
    load(path, onLoad) {
        const site = catalog.find(item => item.id === path.split('/').at(-1))
        if (!site) throw new Error(`Unknown site card: ${path}`)
        const canvas = document.createElement('canvas'); canvas.width = 960; canvas.height = 540
        const context = canvas.getContext('2d')
        context.fillStyle = '#4c2d58'; context.fillRect(0, 0, 960, 540)
        context.strokeStyle = '#b8798d'; context.lineWidth = 4; context.strokeRect(25, 25, 910, 490)
        context.fillStyle = '#ffc18b'; context.font = '24px system-ui'; context.fillText(site.mine ? '我的作品' : '精选收藏', 65, 95)
        context.fillStyle = '#fff0de'; context.font = 'bold 52px system-ui'; context.fillText(site.title, 65, 195, 830)
        context.font = '26px system-ui'
        let line = '', y = 275
        for (const char of site.description) {
            if (context.measureText(line + char).width > 810) { context.fillText(line, 65, y); y += 42; line = '' }
            line += char
            if (y > 365) break
        }
        context.fillText(line, 65, y)
        context.fillStyle = '#ffc18b'; context.font = '23px system-ui'; context.fillText('点击入口 · 前往探索 ↗', 65, 455)
        const map = new THREE.CanvasTexture(canvas)
        map.colorSpace = THREE.SRGBColorSpace; map.flipY = false
        queueMicrotask(() => onLoad(map))
        return map
    }
}
