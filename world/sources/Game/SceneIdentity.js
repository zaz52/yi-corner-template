import * as THREE from 'three/webgpu'
import { color, texture } from 'three/tsl'
import { MeshDefaultMaterial } from './Materials/MeshDefaultMaterial.js'
import { createLabelTexture } from './LabelTexture.js'

export function replaceBoardLabel(mesh, lines) {
    mesh.geometry.computeBoundingBox()
    const bounds = mesh.geometry.boundingBox
    const size = bounds.getSize(new THREE.Vector3())
    const center = bounds.getCenter(new THREE.Vector3())
    const normalY = mesh.geometry.getAttribute('normal')?.getY(0) ?? 1
    const map = createLabelTexture(lines, 512, 640)
    map.flipY = true
    mesh.geometry = new THREE.PlaneGeometry(size.x, size.z)
        .rotateX(normalY < 0 ? Math.PI / 2 : -Math.PI / 2)
        .translate(center.x, center.y, center.z)
    mesh.material = new MeshDefaultMaterial({
        colorNode: color('#ffedcf'), alphaNode: texture(map).r,
        transparent: true, side: THREE.DoubleSide
    })
}

/** Replace author-specific silhouettes while retaining the existing rigid body. */
export function replaceIdentityBlock(mesh, label) {
    if (!mesh.isMesh) throw new Error(`Identity reference is not a mesh: ${mesh.name}`)
    mesh.geometry.computeBoundingBox()
    const bounds = mesh.geometry.boundingBox
    const size = bounds.getSize(new THREE.Vector3())
    const center = bounds.getCenter(new THREE.Vector3())
    const canvas = document.createElement('canvas')
    canvas.width = 512; canvas.height = 512
    const context = canvas.getContext('2d')
    context.fillStyle = '#bd705c'
    context.fillRect(0, 0, 512, 512)
    context.strokeStyle = '#e4a279'; context.lineWidth = 18
    context.strokeRect(24, 24, 464, 464)
    context.fillStyle = '#ffe0ad'
    context.font = 'bold 320px "Microsoft YaHei", sans-serif'
    context.textAlign = 'center'; context.textBaseline = 'middle'
    context.fillText(label, 256, 268, 410)
    const map = new THREE.CanvasTexture(canvas)
    map.colorSpace = THREE.SRGBColorSpace
    // Keep local bounds and transforms so collision, reset and hit sounds survive.
    mesh.geometry = new THREE.BoxGeometry(size.x, size.y, size.z).translate(center.x, center.y, center.z)
    mesh.material = new MeshDefaultMaterial({ colorNode: texture(map).rgb })
    mesh.castShadow = true
    mesh.receiveShadow = true
}
