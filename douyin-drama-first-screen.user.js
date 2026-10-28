// ==UserScript==
// @name         抖音剧情过滤：精选首屏补漏
// @name:en      Douyin Drama Filter: Featured Page Companion
// @namespace    douyin-drama-filter
// @version      2026.10.28.1
// @description  仅在精选页隐藏短剧、剧情演绎、情景搞笑和 AI 漫剧卡片，补充初始卡片过滤；不处理首页推荐播放器或搜索结果。
// @description:en Hide drama, fictional skits and AI drama cards on Douyin’s featured page only. Does not filter the home recommendation player or search results.
// @license      MIT
// @author       HappyWalkers
// @homepageURL  https://github.com/HappyWalkers/douyin-drama-filter
// @supportURL   https://github.com/HappyWalkers/douyin-drama-filter/issues
// @match        https://www.douyin.com/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(() => {
  'use strict';
  // 改为 false 可只过滤带短剧标记或短剧关键词的视频。
  const STRONG = true;
  const CARD = '.discover-video-card-item';
  const mark = 'data-dy-drama-hidden';
  const style = document.createElement('style');
  style.textContent = `[${mark}="1"]{display:none!important}`;
  (document.head || document.documentElement).append(style);

  function videoInfo(card) {
    const inner = card.querySelector('.jingxuanVideoCard');
    if (!inner) return null;
    const fiberKey = Object.keys(inner).find(k => k.startsWith('__reactFiber$'));
    let fiber = inner[fiberKey];
    const expectedId = card.getAttribute('data-aweme-id');
    for (let depth = 0; fiber && depth < 7; depth++, fiber = fiber.return) {
      const props = fiber.memoizedProps;
      for (const info of [props?.awemeInfo, props?.itemInfo]) {
        const id = info?.awemeId ?? info?.aweme_id;
        if (id && (!expectedId || String(id) === expectedId)) return info;
      }
    }
    return null;
  }

  function reason(info) {
    if (!info) return '';
    const series = info.seriesInfo ?? info.series_info;
    const mix = info.mixInfo ?? info.mix_info;
    const seriesName = series?.seriesName ?? series?.series_name ?? '';
    const extras = info.textExtra ?? info.text_extra ?? [];
    const text = [info.desc, seriesName, mix?.mixName, mix?.mix_name,
      mix?.desc, ...extras.map(x => x.hashtagName ?? x.hashtag_name ?? '')].filter(Boolean).join('\n');
    const tags = (info.videoTag ?? info.video_tag ?? []).map(x => x.tagName ?? x.tag_name ?? '');
    const declaration = (info.riskInfos ?? info.risk_infos)?.content ?? '';
    if (/^短剧\s*[·:：]/.test(seriesName)) return '平台短剧合集';
    if (/短剧|微短剧|红果短剧/.test(text)) return '短剧文案或话题';
    if (!STRONG) return '';
    if (tags.some(t => /^(剧情演绎|剧情|情景剧|短剧|微短剧|漫剧|猫剧情|狗剧情)$/.test(t))) return '平台剧情分类';
    if (/(剧情|虚构|情景)演绎|情节虚构|纯属虚构/.test(declaration)) return '虚构演绎声明';
    if (/漫剧|动态漫|沙雕动画|沙雕动漫|情景剧|小剧场|情景演绎|剧情演绎|[Aa][Ii]剧|原创剧集|一人分饰多角|小说推文/.test(text)) return '漫剧或情景剧线索';
    if (/内容由\s*[Aa][Ii]\s*生成/.test(declaration) &&
        tags.some(t => /^(动漫IP|电影剪辑|电视剧剪辑)$/.test(t))) return 'AI 动画或影视剪辑';
    return '';
  }

  function scan() {
    pending = false;
    const inScope = location.pathname === '/jingxuan' || location.pathname.startsWith('/jingxuan/');
    for (const card of document.querySelectorAll(CARD)) {
      const why = inScope ? reason(videoInfo(card)) : '';
      if (why) {
        if (card.getAttribute(mark) !== '1') {
          card.setAttribute(mark, '1');
          card.setAttribute('data-dy-drama-reason', why);
          card.querySelectorAll('video').forEach(video => video.pause());
        }
      } else {
        card.removeAttribute(mark);
        card.removeAttribute('data-dy-drama-reason');
      }
    }
  }
  let pending = false;
  function schedule() {
    if (!pending) {
      pending = true;
      setTimeout(scan, 100);
    }
  }
  new MutationObserver(schedule).observe(document.documentElement, {childList: true, subtree: true});
  // React hydration can attach metadata without inserting a new DOM node.
  setInterval(schedule, 1500);
  schedule();
})();
