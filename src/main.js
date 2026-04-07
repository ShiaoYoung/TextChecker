import './style.css'

const sampleLeft = `订单号: A-1001
客户: Alice
商品: 键盘
数量: 2
备注: 加急
发票: 普票
地址: 上海市浦东新区
联系电话: 13800001111
`

const sampleRight = `客户: Alice
订单号: A-1001
商品: 键盘
数量: 3
发票: 普票
备注: 加急
地址: 上海市浦东新区
联系电话: 13800002222
`

document.querySelector('#app').innerHTML = `
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
`

const textA = document.querySelector('#textA')
const textB = document.querySelector('#textB')
const fileA = document.querySelector('#fileA')
const fileB = document.querySelector('#fileB')
const fileALabel = document.querySelector('#fileALabel')
const fileBLabel = document.querySelector('#fileBLabel')
const ignoreTrim = document.querySelector('#ignoreTrim')
const summary = document.querySelector('#summary')
const diffBody = document.querySelector('#diffBody')
const compareButton = document.querySelector('#compareButton')
const resetButton = document.querySelector('#resetButton')
const loadSampleButton = document.querySelector('#loadSample')
const filterButtons = Array.from(document.querySelectorAll('.filter-chip'))

const filterState = {
  equal: true,
  replace: true,
  delete: true,
  insert: true,
}

let latestRows = []

const initialEmptyState = '点击“开始对比”后，这里会显示自动对齐后的差异结果。'

loadSampleButton.addEventListener('click', () => {
  textA.value = sampleLeft
  textB.value = sampleRight
  renderComparison()
})

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const { filter } = button.dataset
    filterState[filter] = !filterState[filter]
    button.classList.toggle('is-active', filterState[filter])
    renderRows(latestRows)
  })
})

compareButton.addEventListener('click', () => {
  renderComparison()
})

resetButton.addEventListener('click', () => {
  textA.value = ''
  textB.value = ''
  fileA.value = ''
  fileB.value = ''
  fileALabel.textContent = '未选择文件'
  fileBLabel.textContent = '未选择文件'
  latestRows = []
  resetFilters()
  summary.textContent = '请先输入文本或上传两个文件。'
  diffBody.innerHTML = `<div class="empty-state">${initialEmptyState}</div>`
})

fileA.addEventListener('change', (event) => readFileIntoTextarea(event, textA, fileALabel))
fileB.addEventListener('change', (event) => readFileIntoTextarea(event, textB, fileBLabel))

ignoreTrim.addEventListener('change', () => {
  if (textA.value || textB.value) {
    renderComparison()
  }
})

async function readFileIntoTextarea(event, target, label) {
  const [file] = event.target.files

  if (!file) {
    label.textContent = '未选择文件'
    return
  }

  label.textContent = `已加载：${file.name}`
  target.value = await file.text()
}

function splitLines(text) {
  if (!text) {
    return []
  }

  const normalizedText = text.replace(/\r\n/g, '\n')

  if (normalizedText.endsWith('\n')) {
    return normalizedText.slice(0, -1).split('\n')
  }

  return normalizedText.split('\n')
}

function normalizeLine(line, shouldTrim) {
  return shouldTrim ? line.trim() : line
}

function buildLcsMatrix(left, right) {
  const rows = left.length + 1
  const cols = right.length + 1
  const dp = Array.from({ length: rows }, () => Array(cols).fill(0))

  for (let i = left.length - 1; i >= 0; i -= 1) {
    for (let j = right.length - 1; j >= 0; j -= 1) {
      if (left[i] === right[j]) {
        dp[i][j] = dp[i + 1][j + 1] + 1
      } else {
        dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1])
      }
    }
  }

  return dp
}

function diffLines(leftOriginal, rightOriginal, shouldTrim) {
  const left = leftOriginal.map((line) => normalizeLine(line, shouldTrim))
  const right = rightOriginal.map((line) => normalizeLine(line, shouldTrim))
  const dp = buildLcsMatrix(left, right)
  const operations = []

  let i = 0
  let j = 0

  while (i < left.length && j < right.length) {
    if (left[i] === right[j]) {
      operations.push({
        type: 'equal',
        leftLineNumber: i + 1,
        rightLineNumber: j + 1,
        leftText: leftOriginal[i],
        rightText: rightOriginal[j],
      })
      i += 1
      j += 1
      continue
    }

    if (dp[i + 1][j] >= dp[i][j + 1]) {
      operations.push({
        type: 'delete',
        leftLineNumber: i + 1,
        rightLineNumber: null,
        leftText: leftOriginal[i],
        rightText: '',
      })
      i += 1
    } else {
      operations.push({
        type: 'insert',
        leftLineNumber: null,
        rightLineNumber: j + 1,
        leftText: '',
        rightText: rightOriginal[j],
      })
      j += 1
    }
  }

  while (i < left.length) {
    operations.push({
      type: 'delete',
      leftLineNumber: i + 1,
      rightLineNumber: null,
      leftText: leftOriginal[i],
      rightText: '',
    })
    i += 1
  }

  while (j < right.length) {
    operations.push({
      type: 'insert',
      leftLineNumber: null,
      rightLineNumber: j + 1,
      leftText: '',
      rightText: rightOriginal[j],
    })
    j += 1
  }

  return compressOperations(operations)
}

function compressOperations(operations) {
  const rows = []
  let index = 0

  while (index < operations.length) {
    const current = operations[index]

    if (current.type === 'equal') {
      rows.push(current)
      index += 1
      continue
    }

    const deletes = []
    const inserts = []

    while (index < operations.length && operations[index].type !== 'equal') {
      if (operations[index].type === 'delete') {
        deletes.push(operations[index])
      } else {
        inserts.push(operations[index])
      }
      index += 1
    }

    const maxLength = Math.max(deletes.length, inserts.length)

    for (let position = 0; position < maxLength; position += 1) {
      const left = deletes[position]
      const right = inserts[position]

      if (left && right) {
        rows.push({
          type: 'replace',
          leftLineNumber: left.leftLineNumber,
          rightLineNumber: right.rightLineNumber,
          leftText: left.leftText,
          rightText: right.rightText,
        })
      } else if (left) {
        rows.push(left)
      } else if (right) {
        rows.push(right)
      }
    }
  }

  return rows
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function formatLineContent(value) {
  if (value === null || value === undefined) {
    return '—'
  }

  if (value === '') {
    return '<span class="blank-line">[空行]</span>'
  }

  return escapeHtml(value)
}

function resetFilters() {
  Object.keys(filterState).forEach((key) => {
    filterState[key] = true
  })

  filterButtons.forEach((button) => {
    button.classList.add('is-active')
  })
}

function buildStats(rows) {
  return rows.reduce(
    (accumulator, row) => {
      accumulator.total += 1
      accumulator[row.type] += 1
      return accumulator
    },
    { total: 0, equal: 0, replace: 0, delete: 0, insert: 0 },
  )
}

function getVisibleRows(rows) {
  return rows.filter((row) => filterState[row.type])
}

function renderRows(rows) {
  const visibleRows = getVisibleRows(rows)
  const allStats = buildStats(rows)
  const visibleStats = buildStats(visibleRows)

  summary.textContent = `共对齐 ${allStats.total} 行，当前显示 ${visibleStats.total} 行：相同 ${visibleStats.equal} 行，替换 ${visibleStats.replace} 行，仅 A ${visibleStats.delete} 行，仅 B ${visibleStats.insert} 行。`

  if (rows.length === 0) {
    diffBody.innerHTML = `<div class="empty-state">${initialEmptyState}</div>`
    return
  }

  if (visibleRows.length === 0) {
    diffBody.innerHTML = '<div class="empty-state">当前筛选条件下没有可显示的差异行，请调整筛选项。</div>'
    return
  }

  diffBody.innerHTML = visibleRows
    .map(
      (row) => `
        <div role="row" class="diff-row diff-row-${row.type}">
          <div class="line-number">${row.leftLineNumber ?? ''}</div>
          <div class="line-text">${formatLineContent(row.leftLineNumber === null ? null : row.leftText)}</div>
          <div class="status-pill status-${row.type}">${statusTextMap[row.type]}</div>
          <div class="line-number">${row.rightLineNumber ?? ''}</div>
          <div class="line-text">${formatLineContent(row.rightLineNumber === null ? null : row.rightText)}</div>
        </div>
      `,
    )
    .join('')
}

function renderComparison() {
  const leftLines = splitLines(textA.value)
  const rightLines = splitLines(textB.value)

  if (leftLines.length === 0 && rightLines.length === 0) {
    latestRows = []
    summary.textContent = '请先输入文本或上传两个文件。'
    diffBody.innerHTML = `<div class="empty-state">${initialEmptyState}</div>`
    return
  }

  latestRows = diffLines(leftLines, rightLines, ignoreTrim.checked)
  renderRows(latestRows)
}

const statusTextMap = {
  equal: '相同',
  replace: '替换',
  delete: '仅 A',
  insert: '仅 B',
}
