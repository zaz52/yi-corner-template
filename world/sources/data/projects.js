import catalog from './site-catalog.json'

export default catalog.filter(site => site.mine && site.url).map(site => ({
    title: site.title, titleSmall: [site.title], url: site.url,
    attributes: {role: '个人作品', at: site.category}, distinctions: [], images: [site.id]
}))
