import contacts from './site-contacts.json'

export default contacts.map(contact => ({name: ({GitHub: '代码主页', X: '动态主页', Telegram: '电报联系', WhatsApp: '即时联系'})[contact.label] ?? contact.label, url: contact.href, align: 'right'}))
