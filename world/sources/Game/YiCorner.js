import * as THREE from 'three/webgpu'
import { color, texture } from 'three/tsl'
import { MeshDefaultMaterial } from './Materials/MeshDefaultMaterial.js'
import { destinations } from '../data/destinations.js'
import { SiteDirectory } from './SiteDirectory.js'
import '../style/yi-corner.css'

/** Local preview extension. Original renderer, physics, vehicle and environment stay upstream. */
export class YiCorner {
    constructor(game) {
        this.game = game
        this.materials = new Map()
        this.markers = []
        this.group = new THREE.Group()
        game.scene.add(this.group)
        this.ui()
        this.directory = new SiteDirectory(game)
        this.shop(31, 37)
        this.cinema(43, 29)
        this.directoryBoard('我的作品', 35, 19)
        this.directoryBoard('AI 效率', 40, 19)
        this.directoryBoard('内容创作', 45, 19)
        this.directoryBoard('影音娱乐', 50, 19)
        game.ticker.events.on('tick', () => this.update(), 15)
        document.documentElement.classList.add('yi-ready')
    }

    material(hex) {
        if (!this.materials.has(hex)) this.materials.set(hex, new MeshDefaultMaterial({ colorNode: color(hex) }))
        return this.materials.get(hex)
    }

    box(parent, size, position, hex, solid = true) {
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), this.material(hex))
        mesh.position.set(...position)
        mesh.castShadow = true
        mesh.receiveShadow = true
        parent.add(mesh)
        if (solid) {
            const p = parent.position.clone().add(mesh.position)
            const R = this.game.RAPIER
            this.game.physics.world.createCollider(R.ColliderDesc.cuboid(...size.map(v => v / 2)).setTranslation(p.x, p.y, p.z))
        }
        return mesh
    }

    sign(parent, text, x, y, z, width = 6) {
        const canvas = document.createElement('canvas')
        canvas.width = 1024; canvas.height = 256
        const context = canvas.getContext('2d')
        context.fillStyle = '#f6bb91'; context.fillRect(0, 0, 1024, 256)
        context.strokeStyle = '#803d4c'; context.lineWidth = 22; context.strokeRect(12, 12, 1000, 232)
        context.fillStyle = '#542445'; context.font = 'bold 100px sans-serif'
        context.textAlign = 'center'; context.textBaseline = 'middle'; context.fillText(text, 512, 137, 950)
        const map = new THREE.CanvasTexture(canvas)
        map.colorSpace = THREE.SRGBColorSpace
        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, width / 4), new MeshDefaultMaterial({colorNode: texture(map).rgb}))
        mesh.position.set(x, y, z); parent.add(mesh)
        return mesh
    }

    lantern(parent, x, z) {
        this.box(parent, [.24, 3, .24], [x, 1.5, z], '#754263')
        this.box(parent, [.85, .22, .85], [x, 3, z], '#ad655e')
        const bulb = new THREE.Mesh(new THREE.BoxGeometry(.48, .7, .48), new THREE.MeshBasicNodeMaterial({color: new THREE.Color('#ffb24b').multiplyScalar(3)}))
        bulb.position.set(x, 2.55, z); parent.add(bulb)
    }

    shop(x, z) {
        const root = new THREE.Group(); root.position.set(x, .4, z); this.group.add(root)
        this.box(root, [7, .25, 5], [0, .1, 0], '#c67e6c')
        this.box(root, [7, 3.8, .35], [0, 2, -2], '#b66657')
        for (const sx of [-3.3, 3.3]) this.box(root, [.32, 4.6, .32], [sx, 2.3, 1.6], '#8e4c55')
        for (let i = 0; i < 9; i++) this.box(root, [.78, .22, 4.8], [-3.12 + i * .78, 4.25, 0], i % 2 ? '#d98a67' : '#ae5556')
        this.box(root, [6.8, 1.2, 1.2], [0, .8, 1], '#a85a54')
        this.sign(root, '我的小店', 0, 5.2, 1.8)
        for (let i = 0; i < 3; i++) {
            const parcel = this.box(root, [1.15, 1.15, 1.15], [-1.8 + i * 1.8, 1.95, 1], ['#e3b17e', '#aa75b2', '#ce805f'][i], false)
            this.markers.push({ mesh: parcel, base: 1.95, phase: i })
        }
        this.lantern(root, -4.2, 1); this.lantern(root, 4.2, 1)
        this.portal('shop', x, z + 4.5)
    }

    cinema(x, z) {
        const root = new THREE.Group(); root.position.set(x, .4, z); this.group.add(root)
        for (const sx of [-4.5, 4.5]) this.box(root, [.5, 6, .5], [sx, 3, -2], '#71506f')
        this.box(root, [9.8, 5.8, .5], [0, 3.5, -2], '#5e3a65')
        this.sign(root, '我的影院', 0, 6.9, -1.68, 7)
        const screen = new THREE.Mesh(new THREE.PlaneGeometry(8.6, 4.6), new THREE.MeshBasicNodeMaterial({color: '#dba8c5'}))
        screen.position.set(0, 3.6, -1.72); root.add(screen)
        this.screen = screen
        this.sign(root, '今晚看什么？', 0, 3.6, -1.68, 8)
        for (let row = 0; row < 2; row++) for (const sx of [-2.4, 2.4]) {
            this.box(root, [3.6, .22, 1], [sx, .9, 1 + row * 2], '#b77565')
            this.box(root, [3.6, .9, .2], [sx, 1.35, .55 + row * 2], '#a75d60')
            for (const leg of [-1.4, 1.4]) this.box(root, [.2, .8, .5], [sx + leg, .4, 1 + row * 2], '#634566')
        }
        this.lantern(root, -5.2, 1); this.lantern(root, 5.2, 1)
        this.portal('cinema', x, z + 6.5)
    }

    portal(key, x, z) {
        const mesh = new THREE.Mesh(new THREE.TorusGeometry(1.3, .06, 6, 32), new THREE.MeshBasicNodeMaterial({color: new THREE.Color('#ffc05e').multiplyScalar(2)}))
        mesh.rotation.x = Math.PI / 2; mesh.position.set(x, .65, z); this.group.add(mesh)
        this.markers.push({key, mesh, position: new THREE.Vector3(x, 0, z)})
    }

    directoryBoard(category, x, z) {
        const root = new THREE.Group(); root.position.set(x, .4, z); this.group.add(root)
        this.box(root, [.2, 2.6, .2], [0, 1.3, 0], '#754263')
        this.sign(root, category, 0, 2.4, .15, 4)
        this.portal(`directory:${category}`, x, z + 2)
    }

    ui() {
        const hud = document.createElement('div'); hud.className = 'yi-hud'
        hud.innerHTML = `<div class="yi-brand">我的小世界<small>可玩的个人网站</small></div><nav aria-label="目的地"><button data-destination="shop">我的小店</button><button data-destination="cinema">我的影院</button><button data-destination="coffee">请我喝咖啡</button><button data-destination="directory:全部">全部网站</button></nav><div class="yi-guide">WASD / 方向键 · 驾驶　空格 · 跳跃　R · 回到道路　M · 地图</div><button class="yi-nearby" hidden></button><div class="yi-credit">场景与驾驶系统：Bruno Simon · MIT 开源许可</div>`
        document.body.append(hud)
        hud.querySelectorAll('[data-destination]').forEach(button => button.addEventListener('click', () => this.open(button.dataset.destination)))
        this.nearby = hud.querySelector('.yi-nearby')
        this.nearby.addEventListener('click', () => this.open(this.nearest))
        this.dialog = document.createElement('dialog'); this.dialog.className = 'yi-dialog'
        this.dialog.innerHTML = '<button class="yi-close" aria-label="关闭">×</button><h2></h2><p></p><a target="_blank" rel="noopener noreferrer">打开网站 ↗</a><button class="yi-back">继续探索</button>'
        document.body.append(this.dialog)
        this.dialog.querySelectorAll('button').forEach(b => b.addEventListener('click', () => this.dialog.close()))
        this.dialog.addEventListener('close', () => {
            this.game.inputs.filters.clear()
            for (const filter of this.previousFilters ?? ['wandering']) this.game.inputs.filters.add(filter)
        })
        window.addEventListener('keydown', event => {
            if (event.code === 'KeyE' && this.nearest && !this.dialog.open) this.open(this.nearest)
        })
    }

    open(key) {
        if (this.directory.dialog.open || this.dialog.open) return
        if (key?.startsWith('directory:')) { this.directory.open(key.slice(10)); return }
        const destination = destinations[key]
        if (!destination || this.dialog.open) return
        this.dialog.querySelector('h2').textContent = destination.title
        this.dialog.querySelector('p').textContent = destination.description
        const link = this.dialog.querySelector('a'); link.hidden = !destination.url
        if (destination.url) link.href = destination.url
        else link.removeAttribute('href')
        this.previousFilters = [...this.game.inputs.filters]
        this.game.inputs.filters.clear(); this.game.inputs.filters.add('yi-dialog')
        this.dialog.showModal()
    }

    update() {
        const t = this.game.ticker.elapsed
        this.nearest = null
        for (const marker of this.markers) {
            if (marker.key) {
                const p = this.game.player.position
                if (Math.hypot(p.x - marker.position.x, p.z - marker.position.z) < 4) this.nearest = marker.key
                marker.mesh.scale.setScalar(1 + Math.sin(t * 2) * .045)
            } else { marker.mesh.position.y = marker.base + Math.sin(t * 1.5 + marker.phase) * .12 }
        }
        this.nearby.hidden = !this.nearest
        if (this.nearest) this.nearby.textContent = `E · ${this.nearest.startsWith('directory:') ? this.nearest.slice(10) : destinations[this.nearest].title} ↗`
    }
}
