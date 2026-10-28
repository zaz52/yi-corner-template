import catalog from './site-catalog.json'

export const destinations = Object.fromEntries(catalog.map(site => [site.id, site]))
