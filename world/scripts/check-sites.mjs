import assert from 'node:assert/strict'
import fs from 'node:fs'

const root = new URL('../', import.meta.url)
const catalog = JSON.parse(fs.readFileSync(new URL('sources/data/site-catalog.json', root), 'utf8'))
assert.equal(new Set(catalog.map(site => site.id)).size, catalog.length)
const urls = catalog.filter(site => site.url).map(site => site.url.replace(/\/$/, ''))
assert.equal(new Set(urls).size, urls.length)
const homepage = new URL('src/App.tsx', root)
if (fs.existsSync(homepage)) {
    const links = [...fs.readFileSync(homepage, 'utf8').matchAll(/https:\/\/[^"'`\s<>]+/g)].map(match => match[0])
    for (const url of new Set(links)) {
        if (new URL(url).hostname === 'x.com') continue // Contact links live in site-contacts.json.
        assert.ok(urls.includes(url.replace(/\/$/, '')), `Homepage link missing from directory: ${url}`)
    }
}
for (const site of catalog) {
    assert.match(site.title, /[\u4e00-\u9fff]/)
    if (site.url) assert.equal(new URL(site.url).protocol, 'https:')
}
assert.equal(catalog.find(site => site.id === 'shop').url, 'https://example.com/shop')
assert.equal(catalog.find(site => site.id === 'cinema').url, 'https://example.com/cinema')
const source = fs.readFileSync(new URL('sources/Game/SiteDirectory.js', root), 'utf8')
    .replace("import catalog from '../data/site-catalog.json'", `const catalog = ${JSON.stringify(catalog)}`)
const { filterSites } = await import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'))
assert.equal(filterSites('小店').length, 1)
assert.equal(filterSites('  BLOG  ')[0].title, '我的博客')
assert.equal(filterSites('不存在的站点').length, 0)
for (const category of new Set(catalog.map(site => site.category))) {
    assert.ok(filterSites('', category).length > 0)
    assert.ok(filterSites('', category).every(site => site.category === category))
}
console.log(`PASS: ${catalog.length} entries, ${urls.length} source URLs; unique IDs, Chinese titles, search and categories`)
