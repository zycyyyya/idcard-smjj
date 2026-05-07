/**
 * IDcard-smjj - CLI入口
 * 用法：node skill.js --data data.json --output 销售卡片.docx
 */

const { generateSalesCard, getMastersData } = require('./index.js');
const fs = require('fs');
const path = require('path');

// 解析命令行参数
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {};
  
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--data' && args[i + 1]) {
      options.data = args[i + 1];
      i++;
    } else if (args[i] === '--output' && args[i + 1]) {
      options.output = args[i + 1];
      i++;
    } else if (args[i] === '--help' || args[i] === '-h') {
      options.help = true;
    }
  }
  
  return options;
}

// 显示帮助信息
function showHelp() {
  console.log(`
IDcard-smjj - 私募基金管理人销售卡片生成器

用法：
  node skill.js --data <数据文件.json> --output <输出路径.docx>

选项：
  --data    JSON数据文件路径（包含12板块数据）
  --output  输出Word文档路径
  --help    显示帮助信息

示例：
  node skill.js --data 滴海基金_data.json --output 滴海基金_销售卡片.docx

数据文件格式：
  {
    "basic": { "name": "机构名", "fullName": "...", ... },
    "products": [...],
    "cases": [...],
    "advantages": [...],
    "risks": [...],
    "marketFit": [...],
    "recommendation": {...},
    "faq": [...],
    "news": [...],
    "reviews": [...],
    "appendix": {...},
    "pantheon": {
      "mastersComparison": [...],
      "principles": [...],
      "uniqueness": [...],
      "quotes": [...]
    }
  }
`);
}

// 主函数
async function main() {
  const options = parseArgs();
  
  if (options.help) {
    showHelp();
    return;
  }
  
  if (!options.data || !options.output) {
    console.error('❌ 错误：必须指定 --data 和 --output 参数');
    showHelp();
    process.exit(1);
  }
  
  // 读取数据文件
  if (!fs.existsSync(options.data)) {
    console.error(`❌ 错误：数据文件不存在：${options.data}`);
    process.exit(1);
  }
  
  let data;
  try {
    const content = fs.readFileSync(options.data, 'utf-8');
    data = JSON.parse(content);
  } catch (err) {
    console.error(`❌ 错误：无法解析数据文件：${err.message}`);
    process.exit(1);
  }
  
  // 确保输出目录存在
  const outputDir = path.dirname(options.output);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // 验证并补充万神殿数据
  console.log('\n📚 加载万神殿大师数据...');
  const mastersData = getMastersData();
  
  // 如果用户未提供完整的 mastersComparison，使用大师库作为参考
  if (!data.pantheon) {
    data.pantheon = {};
  }
  
  if (!data.pantheon.mastersComparison || data.pantheon.mastersComparison.length === 0) {
    console.log('⚠️ 警告：未提供万神殿大师对照数据，已加载参考模板');
    console.log('💡 提示：请根据机构特点填写各大师的"重合度"、"核心重叠"、"核心差异"');
    // 创建模板结构供参考
    data.pantheon.mastersComparison = mastersData.map(m => ({
      master: m.name,
      style: m.style,
      alignment: "待填写",
      overlap: "待填写",
      difference: "待填写"
    }));
  }
  
  // 生成销售卡片
  try {
    await generateSalesCard(data, options.output);
    console.log('\n✅ 生成成功！');
    console.log(`📄 输出文件：${options.output}`);
  } catch (err) {
    console.error(`❌ 生成失败：${err.message}`);
    process.exit(1);
  }
}

main();
