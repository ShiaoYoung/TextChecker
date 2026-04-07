(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=`订单号: A-1001
客户: Alice
商品: 键盘
数量: 2
备注: 加急
发票: 普票
地址: 上海市浦东新区
联系电话: 13800001111
`,t=`客户: Alice
订单号: A-1001
商品: 键盘
数量: 3
发票: 普票
备注: 加急
地址: 上海市浦东新区
联系电话: 13800002222
`;document.querySelector(`#app`).innerHTML=`
  <main class="app-shell">
    <section class="hero-panel">
      <div>
        <p class="eyebrow">Text Checker</p>
        <h1>对比两个文本文件，自动对齐相同内容。</h1>
        <p class="hero-copy">
          适合大部分内容相同、只有少量差异，但相同行可能出现在不同位置的文本。
          工具会按内容序列重新对齐，而不是死板地逐行硬比。
        </p>
      </div>

      <div class="hero-actions">
        <button id="loadSample" class="button button-primary" type="button">加载示例</button>
        <button id="compareButton" class="button button-secondary" type="button">开始对比</button>
        <button id="resetButton" class="button button-ghost" type="button">重置</button>
      </div>
    </section>

    <section class="toolbar" aria-label="比较选项">
      <label class="check-option">
        <input id="ignoreTrim" type="checkbox" checked />
        <span>忽略每行首尾空白</span>
      </label>
      <p class="toolbar-hint">按行做内容对齐，最适合“整体相似、局部有改动或行位置偏移”的文本。</p>
      <p id="summary" class="summary-text">请先输入文本或上传两个文件。</p>
    </section>

    <section class="editor-grid">
      <article class="editor-card">
        <div class="card-head">
          <div>
            <p class="card-label">文件 A</p>
            <h2>原始内容</h2>
          </div>
          <label class="upload-button">
            <input id="fileA" type="file" accept=".txt,.md,.csv,.log,.json,.yaml,.yml" />
            <span>上传文件</span>
          </label>
        </div>
        <p id="fileALabel" class="file-meta">未选择文件</p>
        <textarea id="textA" spellcheck="false" placeholder="在这里粘贴第一份文本，或上传文件。"></textarea>
      </article>

      <article class="editor-card">
        <div class="card-head">
          <div>
            <p class="card-label">文件 B</p>
            <h2>对比内容</h2>
          </div>
          <label class="upload-button">
            <input id="fileB" type="file" accept=".txt,.md,.csv,.log,.json,.yaml,.yml" />
            <span>上传文件</span>
          </label>
        </div>
        <p id="fileBLabel" class="file-meta">未选择文件</p>
        <textarea id="textB" spellcheck="false" placeholder="在这里粘贴第二份文本，或上传文件。"></textarea>
      </article>
    </section>

    <section class="result-card" aria-live="polite">
      <div class="result-head">
        <div>
          <p class="card-label">结果视图</p>
          <h2>差异明细</h2>
        </div>
        <div class="result-tools">
          <div class="legend">
            <span class="legend-item same">相同</span>
            <span class="legend-item replace">替换</span>
            <span class="legend-item delete">仅 A</span>
            <span class="legend-item insert">仅 B</span>
          </div>
          <div class="filter-group" aria-label="差异筛选">
            <button class="filter-chip is-active" type="button" data-filter="equal">相同</button>
            <button class="filter-chip is-active" type="button" data-filter="replace">替换</button>
            <button class="filter-chip is-active" type="button" data-filter="delete">仅 A</button>
            <button class="filter-chip is-active" type="button" data-filter="insert">仅 B</button>
          </div>
        </div>
      </div>

      <div class="diff-table" role="table" aria-label="文本差异结果">
        <div class="diff-header" role="rowgroup">
          <div role="row" class="diff-row diff-row-header">
            <div role="columnheader">A 行号</div>
            <div role="columnheader">A 内容</div>
            <div role="columnheader">状态</div>
            <div role="columnheader">B 行号</div>
            <div role="columnheader">B 内容</div>
          </div>
        </div>
        <div id="diffBody" class="diff-body" role="rowgroup">
          <div class="empty-state">点击“开始对比”后，这里会显示自动对齐后的差异结果。</div>
        </div>
      </div>
    </section>
  </main>
`;var n=document.querySelector(`#textA`),r=document.querySelector(`#textB`),i=document.querySelector(`#fileA`),a=document.querySelector(`#fileB`),o=document.querySelector(`#fileALabel`),s=document.querySelector(`#fileBLabel`),c=document.querySelector(`#ignoreTrim`),l=document.querySelector(`#summary`),u=document.querySelector(`#diffBody`),d=document.querySelector(`#compareButton`),f=document.querySelector(`#resetButton`),p=document.querySelector(`#loadSample`),m=Array.from(document.querySelectorAll(`.filter-chip`)),h={equal:!0,replace:!0,delete:!0,insert:!0},g=[],_=`点击“开始对比”后，这里会显示自动对齐后的差异结果。`;p.addEventListener(`click`,()=>{n.value=e,r.value=t,A()}),m.forEach(e=>{e.addEventListener(`click`,()=>{let{filter:t}=e.dataset;h[t]=!h[t],e.classList.toggle(`is-active`,h[t]),k(g)})}),d.addEventListener(`click`,()=>{A()}),f.addEventListener(`click`,()=>{n.value=``,r.value=``,i.value=``,a.value=``,o.textContent=`未选择文件`,s.textContent=`未选择文件`,g=[],E(),l.textContent=`请先输入文本或上传两个文件。`,u.innerHTML=`<div class="empty-state">${_}</div>`}),i.addEventListener(`change`,e=>v(e,n,o)),a.addEventListener(`change`,e=>v(e,r,s)),c.addEventListener(`change`,()=>{(n.value||r.value)&&A()});async function v(e,t,n){let[r]=e.target.files;if(!r){n.textContent=`未选择文件`;return}n.textContent=`已加载：${r.name}`,t.value=await r.text()}function y(e){if(!e)return[];let t=e.replace(/\r\n/g,`
`);return t.endsWith(`
`)?t.slice(0,-1).split(`
`):t.split(`
`)}function b(e,t){return t?e.trim():e}function x(e,t){let n=e.length+1,r=t.length+1,i=Array.from({length:n},()=>Array(r).fill(0));for(let n=e.length-1;n>=0;--n)for(let r=t.length-1;r>=0;--r)e[n]===t[r]?i[n][r]=i[n+1][r+1]+1:i[n][r]=Math.max(i[n+1][r],i[n][r+1]);return i}function S(e,t,n){let r=e.map(e=>b(e,n)),i=t.map(e=>b(e,n)),a=x(r,i),o=[],s=0,c=0;for(;s<r.length&&c<i.length;){if(r[s]===i[c]){o.push({type:`equal`,leftLineNumber:s+1,rightLineNumber:c+1,leftText:e[s],rightText:t[c]}),s+=1,c+=1;continue}a[s+1][c]>=a[s][c+1]?(o.push({type:`delete`,leftLineNumber:s+1,rightLineNumber:null,leftText:e[s],rightText:``}),s+=1):(o.push({type:`insert`,leftLineNumber:null,rightLineNumber:c+1,leftText:``,rightText:t[c]}),c+=1)}for(;s<r.length;)o.push({type:`delete`,leftLineNumber:s+1,rightLineNumber:null,leftText:e[s],rightText:``}),s+=1;for(;c<i.length;)o.push({type:`insert`,leftLineNumber:null,rightLineNumber:c+1,leftText:``,rightText:t[c]}),c+=1;return C(o)}function C(e){let t=[],n=0;for(;n<e.length;){let r=e[n];if(r.type===`equal`){t.push(r),n+=1;continue}let i=[],a=[];for(;n<e.length&&e[n].type!==`equal`;)e[n].type===`delete`?i.push(e[n]):a.push(e[n]),n+=1;let o=Math.max(i.length,a.length);for(let e=0;e<o;e+=1){let n=i[e],r=a[e];n&&r?t.push({type:`replace`,leftLineNumber:n.leftLineNumber,rightLineNumber:r.rightLineNumber,leftText:n.leftText,rightText:r.rightText}):n?t.push(n):r&&t.push(r)}}return t}function w(e){return e.replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#39;`)}function T(e){return e==null?`—`:e===``?`<span class="blank-line">[空行]</span>`:w(e)}function E(){Object.keys(h).forEach(e=>{h[e]=!0}),m.forEach(e=>{e.classList.add(`is-active`)})}function D(e){return e.reduce((e,t)=>(e.total+=1,e[t.type]+=1,e),{total:0,equal:0,replace:0,delete:0,insert:0})}function O(e){return e.filter(e=>h[e.type])}function k(e){let t=O(e),n=D(e),r=D(t);if(l.textContent=`共对齐 ${n.total} 行，当前显示 ${r.total} 行：相同 ${r.equal} 行，替换 ${r.replace} 行，仅 A ${r.delete} 行，仅 B ${r.insert} 行。`,e.length===0){u.innerHTML=`<div class="empty-state">${_}</div>`;return}if(t.length===0){u.innerHTML=`<div class="empty-state">当前筛选条件下没有可显示的差异行，请调整筛选项。</div>`;return}u.innerHTML=t.map(e=>`
        <div role="row" class="diff-row diff-row-${e.type}">
          <div class="line-number">${e.leftLineNumber??``}</div>
          <div class="line-text">${T(e.leftLineNumber===null?null:e.leftText)}</div>
          <div class="status-pill status-${e.type}">${j[e.type]}</div>
          <div class="line-number">${e.rightLineNumber??``}</div>
          <div class="line-text">${T(e.rightLineNumber===null?null:e.rightText)}</div>
        </div>
      `).join(``)}function A(){let e=y(n.value),t=y(r.value);if(e.length===0&&t.length===0){g=[],l.textContent=`请先输入文本或上传两个文件。`,u.innerHTML=`<div class="empty-state">${_}</div>`;return}g=S(e,t,c.checked),k(g)}var j={equal:`相同`,replace:`替换`,delete:`仅 A`,insert:`仅 B`};