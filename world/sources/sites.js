import { SiteDirectory } from './Game/SiteDirectory.js'
import './style/yi-corner.css'

const directory = new SiteDirectory({inputs: {filters: new Set()}})
document.querySelector('#open-directory').addEventListener('click', () => directory.open())
directory.open()
