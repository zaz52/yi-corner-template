import catalog from '../data/site-catalog.json'

export function filterSites(query = '', category = '全部') {
    const needle = query.trim().toLocaleLowerCase('zh-CN')
    return catalog.filter(site => (category === '全部' || site.category === category)
        && `${site.title} ${site.description} ${site.url ?? ''}`.toLocaleLowerCase('zh-CN').includes(needle))
}

export class SiteDirectory {
    constructor(game) {
        this.game = game
        this.category = '全部'
        this.dialog = document.createElement('dialog')
        this.dialog.className = 'yi-dialog yi-directory'
        this.dialog.setAttribute('aria-labelledby', 'yi-directory-title')
        this.dialog.innerHTML = `<button class="yi-close" aria-label="关闭网站目录">×</button><h2 id="yi-directory-title">我的网站地图</h2><p>小店、影院、创作工具和日常收藏，都在这里。</p><label class="yi-search-label">查找网站<input type="search" placeholder="搜索名称、用途或网址" aria-label="搜索网站"></label><div class="yi-categories" role="group" aria-label="网站分类"></div><div class="yi-count" role="status" aria-live="polite"></div><div class="yi-site-list"></div>`
        document.body.append(this.dialog)
        this.search = this.dialog.querySelector('input')
        this.search.addEventListener('input', () => this.render())
        this.dialog.querySelector('.yi-close').addEventListener('click', () => this.dialog.close())
        for (const category of ['全部', ...new Set(catalog.map(site => site.category))]) {
            const button = document.createElement('button')
            button.textContent = category
            button.dataset.category = category
            button.addEventListener('click', () => { this.category = category; this.render() })
            this.dialog.querySelector('.yi-categories').append(button)
        }
        this.dialog.addEventListener('close', () => {
            this.game.inputs.filters.clear()
            for (const filter of this.previousFilters ?? []) this.game.inputs.filters.add(filter)
        })
    }

    open(category = '全部') {
        if (this.dialog.open) return
        this.category = category
        this.search.value = ''
        this.render()
        this.previousFilters = [...this.game.inputs.filters]
        this.game.inputs.filters.clear()
        this.game.inputs.filters.add('yi-directory')
        this.dialog.showModal()
        this.search.focus()
    }

    render() {
        const sites = filterSites(this.search.value, this.category)
        this.dialog.querySelector('.yi-count').textContent = `找到 ${sites.length} 个入口 · 共 ${catalog.length} 个`
        this.dialog.querySelectorAll('[data-category]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.category === this.category)))
        const list = this.dialog.querySelector('.yi-site-list')
        list.replaceChildren()
        for (const site of sites) {
            const card = document.createElement('article')
            card.className = 'yi-site-card'
            const badge = document.createElement('small')
            badge.textContent = site.mine ? '我的作品' : '精选收藏 · 第三方'
            const title = document.createElement('h3'); title.textContent = site.title
            const description = document.createElement('p'); description.textContent = site.description
            const link = document.createElement(site.url ? 'a' : 'span')
            link.textContent = site.url ? '打开网站 ↗' : '地址待补充'
            if (site.url) { link.href = site.url; link.target = '_blank'; link.rel = 'noopener noreferrer' }
            card.append(badge, title, description, link)
            list.append(card)
        }
        if (!sites.length) { const empty = document.createElement('p'); empty.textContent = '没有找到相关网站，试试其他关键词。'; list.append(empty) }
    }
}
