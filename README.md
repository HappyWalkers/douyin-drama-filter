# 抖音剧情过滤 / Douyin Drama Filter

在抖音网页版尽量少看到短剧、剧情演绎、情景搞笑和 AI 漫剧。

项目包含两部分，覆盖范围不同：

| 文件 | 用途 | 覆盖范围 |
| --- | --- | --- |
| [strong-filter-rules.json](rules/strong-filter-rules.json) | 导入「抖音优化」的 6 条强力过滤规则 | 由原脚本支持的推荐等接口处理 |
| [douyin-drama-first-screen.user.js](douyin-drama-first-screen.user.js) | 独立补漏脚本，隐藏匹配的精选卡片 | 仅 `/jingxuan` 及其子路径 |

**只装补漏脚本不会过滤首页推荐流。** 完整方案需要安装原作者的「抖音优化」、导入规则，并安装补漏脚本。规则不会识别视频画面或语音，平台标签和文案不足时仍会漏过剧情内容。

## 安装

1. 安装 [Tampermonkey](https://www.tampermonkey.net/)。Chrome 按[官方说明](https://www.tampermonkey.net/faq.php?q=Q209)开启「允许用户脚本 / Allow User Scripts」。
2. 从原作者页面安装 [抖音优化 — WhiteSevs](https://greasyfork.org/zh-CN/scripts/494643-抖音优化)。本项目不包含原脚本和它的依赖。
3. [下载强力过滤规则](https://raw.githubusercontent.com/HappyWalkers/douyin-drama-filter/main/rules/strong-filter-rules.json)，将文件另存为 `strong-filter-rules.json`。在抖音页打开 Tampermonkey 菜单 → 抖音优化「设置」→ 视频 → 过滤器 → 规则导入 → 本地导入，选择这个文件。
4. [安装精选补漏脚本](https://raw.githubusercontent.com/HappyWalkers/douyin-drama-filter/main/douyin-drama-first-screen.user.js)。若没有弹出安装页，可在 Tampermonkey 管理面板新建脚本，用该文件的完整内容替换模板并保存。
5. 刷新抖音。推荐页主要由原脚本处理，精选页另有卡片补漏。

不要把规则 JSON 导入 Tampermonkey 的「实用工具 → 备份恢复」；它是「抖音优化」过滤器的规则文件。

## 规则依据

- 平台短剧合集标记。
- 文案、话题和合集名称中的短剧关键词。
- 平台的剧情演绎、情景剧、漫剧等分类。
- 「剧情演绎」「情节虚构」「纯属虚构」等作者声明。
- 漫剧、动态漫、小剧场、一人分饰多角等线索。
- 同时标为动漫或影视剪辑、又带 AI 生成声明的内容。

强力范围会误伤部分动画、影视相关内容和文化展示；例如 AI 古人生活展示可能被平台归为电视剧剪辑。它不等于「屏蔽一切 AI 视频」。

## 调整或停用

如果误伤较多，可以在「抖音优化」规则管理器关闭不需要的规则；同时停用补漏脚本，避免它继续执行独立的强力规则。

只过滤明确的短剧标记时，可改用 [standard-filter-rules.json](rules/standard-filter-rules.json)，关闭之前的强力规则，并将补漏脚本中的 `const STRONG = true` 改为 `false` 后保存，或者直接停用补漏脚本。

完全停用时，在 Tampermonkey 关闭补漏脚本，并在「抖音优化」内停用本项目规则，然后刷新抖音。

## 隐私与权限

本项目补漏脚本使用 `@grant none`，没有第三方依赖，不发起网络请求，不读取 Cookie 或登录凭据，不发送「不感兴趣」反馈。它读取当前精选卡片已有的视频元数据，在本地隐藏匹配卡片，并暂停卡片内的视频。

「抖音优化」是独立的第三方脚本，具有自己的功能和权限；上面的隐私说明仅针对本项目补漏脚本。请查看原作者页面了解它的权限和更新。

## 验证情况

在 Chrome for Testing 151.0.7922.34、Tampermonkey 5.5.1 和「抖音优化」2026.10.27 环境中验证过；用户主 Chrome 上也观察到了实际推荐流过滤日志。详见 [验证记录](docs/verification.md)。

这是基于视频元数据的启发式过滤，不能保证识别全部剧情。抖音页面结构、React 元数据或接口变化后可能失效。补漏脚本目前不处理首页推荐播放器和搜索结果。

## 致谢与许可

推荐接口过滤由 [WhiteSevs 的「抖音优化」](https://greasyfork.org/zh-CN/scripts/494643-抖音优化)提供；它的源码标记为 `GPL-3.0-only`。本项目提供独立的规则预设和精选卡片补漏脚本，不复制或重新发布原脚本。

本仓库内规则、补漏脚本和文档采用 [MIT](LICENSE) 许可。

---

This project provides aggressive filtering presets for WhiteSevs' Douyin optimization userscript, plus an independent companion that hides matching cards on Douyin's **精选 (`/jingxuan`) page only**. The companion alone does **not** filter the home recommendation player. It uses metadata rather than visual or audio recognition; false positives and missed dramas are expected.
