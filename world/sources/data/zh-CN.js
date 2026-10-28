export const translations = {
    'Now playing': '正在播放',
    'Interact':'互动','Unstuck':'回到道路','Your message here':'在这里写下留言','Welcome!':'欢迎来到我的小世界！','Options':'设置','Audio':'声音','Toggles sound':'开启或关闭声音','Quality':'画质','Toggles some effects':'切换画面效果','Low':'流畅','High':'精细',"I'm stuck!":'车辆卡住了','Teleports you to the closest respawn':'返回附近的安全位置','Respawn':'回到道路','Reset':'重置','Resets every object':'恢复场景物体的位置','Renderer':'渲染方式','Best for performance':'高性能渲染','Server':'联机服务','Pending':'连接中','Online':'已连接','Offline':'离线','Should be back soon':'联机服务暂未连接','Mouse Keyboard':'鼠标键盘','Mobile Tablet':'手机平板','Gamepad':'游戏手柄','or':'或','ARROWS':'方向键','Move around':'驾驶车辆','Boost':'加速','CTRL LEFT':'左 Ctrl','Brake':'刹车','SPACE':'空格','Jump':'跳跃','ENTER':'回车','Map':'地图','Mute':'静音','Post a whisper':'发布留言','NUM KEYS':'数字键','NUM PAD':'数字小键盘','Activate hydraulics':'控制悬挂','LEFT CLICK (DRAG)':'按住鼠标左键拖动','Move camera':'移动镜头','Honk':'鸣笛','One finger':'单指拖动','Move the car':'驾驶车辆','Two fingers':'双指操作','Move camera / zoom':'移动镜头或缩放','Tap (on the car)':'轻点车辆','Interact / Exit':'互动或退出','Accelerate':'向前加速','Backward accelerate':'倒车','Hydraulics':'悬挂','Joystick Left':'左摇杆','Turn wheels':'转向','Joystick Left (press)':'按下左摇杆','Joystick Right':'右摇杆','Joystick Right (press)':'按下右摇杆','Zoom in/out':'放大或缩小','Select':'选择键','Start':'开始','Pause':'暂停','Achievements':'探索成就','Rewards':'奖励','Unlock at':'解锁条件','Reset achievements':'重置成就','Circuit':'环岛赛道',"Server currently offline. Scores can't be saved.":'联机服务离线，成绩暂时无法保存。','No score yet today':'今天暂无成绩','Resets in':'重置倒计时','Restart':'重新开始','End':'结束','Controls':'操作说明','Leave a whisper':'留下悄悄话','Whispers are messages left by visitors.':'在这里留下你的探索心情。','- Everyone can see them':'- 所有访客都能看到留言','- New whispers remove old ones (max 30)':'- 最多展示 30 条留言，新留言会替换较早的留言','- One whisper per user':'- 每位访客保留一条留言','- Choose a flag':'- 选择一面旗帜','- No slur!':'- 请友善交流','- Max 30 characters':'- 最多 30 个字符','Server currently offline':'留言服务暂未连接','No result':'暂无结果','Behind the scene':'关于这个世界','Your time':'你的用时',"Sorry, you didn't make it to the top 10.":'距离前十名还差一点，再试一次吧。','Submit':'提交','Search…':'搜索…','Your message':'写下你的留言','Your name':'你的昵称','Are you sure?':'确认重置？','Definitely?':'再次确认？','Done!':'已完成！','Projects':'我的作品','Lab':'工具收藏','Landing':'欢迎广场','Social':'联系我','Career':'创作旅程','Altar':'星光祭坛','Bowling':'保龄球场','Cookie':'饼干工坊','Time Machine':'时光机','Behind<br /> the scene':'关于世界','OnlyFans':'小风扇','Open':'打开','Close':'关闭','Next':'下一个','Previous':'上一个','Enter':'进入','Exit':'返回','Play':'开始','role':'用途','at':'分类','with':'归属'
}

export function translate(text) { return typeof text === 'string' ? (translations[text.trim()] ?? text) : text }

export function localizeInterface() {
    const visit = node => {
        if (node.nodeType === Node.TEXT_NODE) {
            if (node.parentElement?.closest('script,style,input,textarea,[contenteditable]')) return
            const value = translate(node.textContent)
            if (value !== node.textContent) node.textContent = value
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            for (const attribute of ['placeholder', 'title', 'aria-label']) {
                if (node.hasAttribute(attribute)) node.setAttribute(attribute, translate(node.getAttribute(attribute)))
            }
            for (const child of node.childNodes) visit(child)
        }
    }
    visit(document.body)
    const observer = new MutationObserver(records => {
        for (const record of records) {
            if (record.type === 'characterData') visit(record.target)
            else for (const node of record.addedNodes) visit(node)
        }
    })
    observer.observe(document.body, {childList: true, subtree: true, characterData: true})
}
