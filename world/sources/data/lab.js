import catalog from './site-catalog.json'

export default catalog.filter(site => !site.mine && site.url).map(site => ({title: site.title, url: site.url, image: site.id, imageMini: site.id}))
