const fs = require('fs');
const path = require('path');

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const AMAZON_ID = process.env.AMAZON_TRACKING_ID || '';
const RAKUTEN_ID = process.env.RAKUTEN_AFFILIATE_ID || '';

const KEYWORDS = [
  {kw:"\u56fd\u5185\u65c5\u884c \u304a\u3059\u3059\u3081 \u7a74\u5834",genre:"domestic"},
  {kw:"\u65c5\u884c \u7bc0\u7d04\u8853 \u5b89\u304f\u884c\u304f",genre:"budget"},
  {kw:"\u65c5\u884c \u6301\u3061\u7269 \u30c1\u30a7\u30c3\u30af\u30ea\u30b9\u30c8",genre:"packing"},
  {kw:"\u6c96\u7e04 \u89b3\u5149 \u304a\u3059\u3059\u3081\u30b9\u30dd\u30c3\u30c8",genre:"domestic"},
  {kw:"\u5317\u6d77\u9053 \u65c5\u884c \u30e2\u30c7\u30eb\u30b3\u30fc\u30b9",genre:"domestic"},
  {kw:"\u6d77\u5916\u65c5\u884c \u521d\u5fc3\u8005 \u6e96\u5099",genre:"overseas"},
  {kw:"\u65c5\u884c \u30db\u30c6\u30eb \u9078\u3073\u65b9",genre:"hotel"},
  {kw:"\u683c\u5b89\u822a\u7a7a\u5238 \u53d6\u308a\u65b9 \u30b3\u30c4",genre:"budget"},
  {kw:"\u65c5\u884c\u4fdd\u967a \u5fc5\u8981\u6027 \u304a\u3059\u3059\u3081",genre:"overseas"},
  {kw:"\u3072\u3068\u308a\u65c5 \u56fd\u5185 \u304a\u3059\u3059\u3081",genre:"domestic"}
];

const SYS = `あなたは旅行・観光専門ライターです。読者目線で分かりやすく、SEOに強い記事を書きます。見出しはH2/H3を使ってください。文字数2000字以上。Markdown形式で出力。記事内でおすすめ商品を紹介する箇所には[AMAZON:商品名]と[RAKUTEN:商品名]を合計5箇所挿入してください。`;

function insertLinks(text) {
  text = text.replace(/\[AMAZON:([^\]]+)\]/g, (_, p) => {
    return `[🛒 ${p}をAmazonでチェック](https://www.amazon.co.jp/s?k=${encodeURIComponent(p)}&tag=${AMAZON_ID})`;
  });
  text = text.replace(/\[RAKUTEN:([^\]]+)\]/g, (_, p) => {
    return `[🛍 ${p}を楽天でチェック](https://search.rakuten.co.jp/search/mall/${encodeURIComponent(p)}/?rafcid=${RAKUTEN_ID})`;
  });
  return text;
}

function toSlug(kw) {
  return kw.replace(/[\s\u3000]+/g, '-').replace(/[^a-zA-Z0-9\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF-]/g, '') + '-' + Date.now();
}

async function generateArticle(kw, genre) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 3000,
      system: SYS,
      messages: [{ role: 'user', content: `ジャンル：${genre}\nキーワード：「${kw}」\n\nSEO記事をMarkdownで書いてください。` }],
    }),
  });
  const data = await res.json();
  return data.content?.map(c => c.text || '').join('') || '';
}

async function main() {
  const contentDir = path.join(process.cwd(), 'content/blog');
  if (!fs.existsSync(contentDir)) fs.mkdirSync(contentDir, { recursive: true });

  const targets = KEYWORDS.sort(() => Math.random() - 0.5).slice(0, 5);

  for (const { kw, genre } of targets) {
    console.log(`生成中: ${kw}`);
    try {
      let text = await generateArticle(kw, genre);
      text = insertLinks(text);
      const slug = toSlug(kw);
      const content = `---\ntitle: "${kw}"\ndate: "${new Date().toISOString().split('T')[0]}"\ngenre: "${genre}"\ntags: [${genre}]\n---\n\n${text}\n`;
      fs.writeFileSync(path.join(contentDir, `${slug}.mdx`), content);
      console.log(`完了: ${slug}.mdx`);
      await new Promise(r => setTimeout(r, 1000));
    } catch (e) {
      console.error(`エラー: ${kw}`, e.message);
    }
  }
  console.log('全記事生成完了！');
}

main();
