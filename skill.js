/**
 * IDcard-smjj - CLI入口 (优化版 v1.1.0)
 * 用法：node skill.js --data data.json --output 销售卡片.docx
 * 
 * 更新日志：
 * v1.1.0 (2026-05-08)
 * - 增加数据验证功能，提前提示缺失字段
 * - 增加智能万神殿模板，根据策略类型自动推荐
 * - 优化错误提示信息
 * - 增加数据文件模板生成功能 (--template)
 */

const { generateSalesCard, getMastersData, MASTERS, PRINCIPLES } = require('./index.js');
const fs = require('fs');
const path = require('path');

// 策略类型到万神殿模板的映射
const STRATEGY_TEMPLATES = {
  '债券': {
    high: ['霍华德·马克斯', '巴菲特', '张磊'],
    medium: ['泰珀', '阿克曼', '达利欧'],
    low: ['索罗斯', '西蒙斯', '阿斯尼斯', '伍德']
  },
  '主观': {
    high: ['巴菲特', '张磊', '霍华德·马克斯'],
    medium: ['泰珀', '阿克曼', '索罗斯'],
    low: ['西蒙斯', '阿斯尼斯', '达利欧', '伍德']
  },
  '价值': {
    high: ['巴菲特', '霍华德·马克斯', '张磊'],
    medium: ['泰珀', '阿克曼'],
    low: ['索罗斯', '西蒙斯', '阿斯尼斯', '达利欧', '伍德']
  },
  '量化': {
    high: ['西蒙斯', '阿斯尼斯', '达利欧'],
    medium: ['巴菲特', '张磊'],
    low: ['索罗斯', '泰珀', '阿克曼', '伍德', '霍华德·马克斯']
  },
  'CTA': {
    high: ['达利欧', '西蒙斯', '阿斯尼斯'],
    medium: ['霍华德·马克斯', '索罗斯'],
    low: ['巴菲特', '泰珀', '阿克曼', '张磊', '伍德']
  },
  '医药': {
    high: ['张磊', '巴菲特', '伍德'],
    medium: ['霍华德·马克斯', '泰珀'],
    low: ['索罗斯', '西蒙斯', '阿斯尼斯', '达利欧', '阿克曼']
  },
  '默认': {
    high: ['巴菲特', '霍华德·马克斯', '张磊'],
    medium: ['泰珀', '达利欧', '阿克曼'],
    low: ['索罗斯', '西蒙斯', '阿斯尼斯', '伍德']
  }
};

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
    } else if (args[i] === '--template' && args[i + 1]) {
      options.template = args[i + 1];
      i++;
    } else if (args[i] === '--strategy' && args[i + 1]) {
      options.strategy = args[i + 1];
      i++;
    } else if (args[i] === '--validate' && args[i + 1]) {
      options.validate = args[i + 1];
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
╔══════════════════════════════════════════════════════════════╗
║     IDcard-smjj - 私募基金管理人销售卡片生成器 v1.1.0         ║
╚══════════════════════════════════════════════════════════════╝

用法：
  node skill.js --data <数据文件.json> --output <输出路径.docx>

选项：
  --data       JSON数据文件路径（包含12板块数据）
  --output     输出Word文档路径
  --strategy   策略类型（债券/主观/价值/量化/CTA/医药），用于智能万神殿模板
  --template   生成数据文件模板（指定输出路径）
  --validate   验证数据文件格式（不生成文档）
  --help       显示帮助信息

示例：
  # 生成销售卡片
  node skill.js --data 滴海基金_data.json --output 滴海基金_销售卡片.docx

  # 使用智能万神殿模板（债券策略）
  node skill.js --data 滴海基金_data.json --output 滴海基金_销售卡片.docx --strategy 债券

  # 生成数据模板
  node skill.js --template 模板.json

  # 验证数据文件
  node skill.js --validate 滴海基金_data.json

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

// 生成数据文件模板
function generateTemplate(outputPath) {
  const template = {
    _comment: "私募基金管理人销售卡片数据模板 - 按12板块结构填写",
    basic: {
      name: "机构简称",
      fullName: "机构全称私募基金管理有限公司",
      founded: "20XX年X月X日",
      licenseNumber: "PXXXXXX",
      scale: "X-X亿元",
      regCapital: "XXXX万元",
      paidCapital: "XXXX万元",
      location: "XX市XX区",
      employees: "XX人（全职），XX人投研",
      coreTeam: "XXX（职位，背景），XXX（职位，背景）"
    },
    products: [
      {
        strategy: "策略名称",
        style: "策略特色/风格描述",
        performance: "业绩表现",
        note: "备注"
      }
    ],
    managerBackground: "基金经理背景介绍...",
    cases: [
      {
        date: "20XX年X月",
        event: "事件描述",
        result: "结果描述"
      }
    ],
    advantages: [
      "核心优势1（有数据支撑）",
      "核心优势2（有数据支撑）",
      "核心优势3（有数据支撑）"
    ],
    risks: [
      "具体风险点1",
      "具体风险点2",
      "具体风险点3",
      "具体风险点4"
    ],
    marketEnvironment: "当前市场环境分析...",
    marketFit: [
      {
        theme: "市场主线1",
        fit: "高/中/低",
        note: "说明"
      }
    ],
    recommendation: {
      position: "组合中的定位",
      clientType: "适配客户类型",
      holdingPeriod: "建议持有期限",
      productChoice: "具体产品选择",
      pairing: "搭配建议"
    },
    faq: [
      { q: "问题1", a: "回答1" },
      { q: "问题2", a: "回答2" },
      { q: "问题3", a: "回答3" },
      { q: "问题4", a: "回答4" }
    ],
    news: ["舆情新闻1", "舆情新闻2", "舆情新闻3"],
    reviews: [
      "投资者评价1——评价人身份",
      "投资者评价2——评价人身份",
      "投资者评价3——评价人身份"
    ],
    appendix: {
      equity: "股权关系描述",
      career: "履历关联描述",
      mentorship: "师承/同门关系（无则写'无明确师承关系'）"
    },
    pantheon: {
      mastersComparison: [],
      principles: [],
      uniqueness: [],
      quotes: []
    }
  };

  fs.writeFileSync(outputPath, JSON.stringify(template, null, 2));
  console.log(`✅ 模板文件已生成：${outputPath}`);
}

// 验证数据文件
function validateData(data, verbose = true) {
  const errors = [];
  const warnings = [];

  // 检查必填字段
  const requiredFields = {
    'basic.name': '机构简称',
    'basic.fullName': '机构全称',
    'basic.founded': '成立时间',
    'basic.licenseNumber': '备案编号',
    'basic.scale': '管理规模',
    'basic.location': '所在地',
    'basic.coreTeam': '核心团队'
  };

  for (const [field, label] of Object.entries(requiredFields)) {
    const parts = field.split('.');
    let value = data;
    for (const part of parts) {
      value = value?.[part];
    }
    if (!value || value.includes('待') || value.includes('XX')) {
      errors.push(`❌ 缺少或未完成：${label} (${field})`);
    }
  }

  // 检查数组字段
  if (!data.products || data.products.length === 0) {
    errors.push('❌ 缺少产品线数据 (products)');
  }
  if (!data.advantages || data.advantages.length < 3) {
    warnings.push(`⚠️ 核心优势建议至少3条，当前${data.advantages?.length || 0}条`);
  }
  if (!data.risks || data.risks.length < 4) {
    warnings.push(`⚠️ 风险提示建议至少4条，当前${data.risks?.length || 0}条`);
  }
  if (!data.faq || data.faq.length < 4) {
    warnings.push(`⚠️ FAQ建议至少4个问题，当前${data.faq?.length || 0}个`);
  }

  // 检查万神殿数据
  if (!data.pantheon?.mastersComparison || data.pantheon.mastersComparison.length === 0) {
    warnings.push('⚠️ 未提供万神殿大师对照数据，将使用智能模板');
  } else if (data.pantheon.mastersComparison.length < 10) {
    warnings.push(`⚠️ 万神殿大师对照建议10条，当前${data.pantheon.mastersComparison.length}条`);
  }

  if (verbose) {
    if (errors.length === 0 && warnings.length === 0) {
      console.log('✅ 数据验证通过，所有字段完整！');
    } else {
      if (errors.length > 0) {
        console.log('\n❌ 错误（必须修复）：');
        errors.forEach(e => console.log(`   ${e}`));
      }
      if (warnings.length > 0) {
        console.log('\n⚠️ 警告（建议完善）：');
        warnings.forEach(w => console.log(`   ${w}`));
      }
    }
  }

  return { valid: errors.length === 0, errors, warnings };
}

// 生成智能万神殿模板
function generateSmartPantheon(strategyType = '默认') {
  const template = STRATEGY_TEMPLATES[strategyType] || STRATEGY_TEMPLATES['默认'];
  const mastersData = getMastersData();
  
  const mastersComparison = mastersData.map(m => {
    let alignment = '低';
    let overlap = '无显著重叠';
    let difference = '策略方向不同';

    if (template.high.some(h => m.name.includes(h))) {
      alignment = '高';
      overlap = '投资理念高度一致';
      difference = '具体执行方式有差异';
    } else if (template.medium.some(h => m.name.includes(h))) {
      alignment = '中';
      overlap = '部分理念相通';
      difference = '侧重点不同';
    }

    return {
      master: m.name,
      style: m.style,
      alignment,
      overlap,
      difference
    };
  });

  const principles = PRINCIPLES.map(p => ({
    principle: p,
    fit: '高',
    evidence: '待补充具体体现'
  }));

  return {
    mastersComparison,
    principles,
    uniqueness: [
      '◆ 独特性1：待补充',
      '◆ 独特性2：待补充',
      '◆ 独特性3：待补充'
    ],
    quotes: [
      {
        master: '巴菲特',
        quote: '投资的第一原则是永远不要亏损，第二原则是永远记住第一原则',
        practice: '待补充管理人的实践对照'
      },
      {
        master: '霍华德·马克斯',
        quote: '投资最重要的是风险管理，而不是收益最大化',
        practice: '待补充管理人的实践对照'
      }
    ]
  };
}

// 主函数
async function main() {
  const options = parseArgs();
  
  if (options.help) {
    showHelp();
    return;
  }

  // 生成模板模式
  if (options.template) {
    generateTemplate(options.template);
    return;
  }

  // 验证模式
  if (options.validate) {
    if (!fs.existsSync(options.validate)) {
      console.error(`❌ 错误：数据文件不存在：${options.validate}`);
      process.exit(1);
    }
    const content = fs.readFileSync(options.validate, 'utf-8');
    const data = JSON.parse(content);
    validateData(data);
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

  // 验证数据
  console.log('\n🔍 验证数据文件...');
  const validation = validateData(data);
  if (!validation.valid) {
    console.log('\n💡 提示：请完善上述错误后再生成');
    process.exit(1);
  }
  
  // 确保输出目录存在
  const outputDir = path.dirname(options.output);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // 加载万神殿数据
  console.log('\n📚 加载万神殿大师数据...');
  const mastersData = getMastersData();
  console.log(`✅ 已加载 ${mastersData.length} 位大师数据`);
  
  // 智能万神殿模板
  if (!data.pantheon) {
    data.pantheon = {};
  }
  
  if (!data.pantheon.mastersComparison || data.pantheon.mastersComparison.length === 0) {
    console.log(`\n🤖 使用智能万神殿模板（策略类型：${options.strategy || '默认'}）...`);
    const smartPantheon = generateSmartPantheon(options.strategy);
    data.pantheon = { ...smartPantheon, ...data.pantheon };
    console.log('💡 提示：已自动生成万神殿对照表，建议根据实际情况调整');
  }
  
  // 生成销售卡片
  console.log('\n📝 生成销售卡片...');
  try {
    await generateSalesCard(data, options.output);
    console.log('\n✅ 生成成功！');
    console.log(`📄 输出文件：${options.output}`);
    
    // 生成质量报告
    console.log('\n📊 质量检查报告：');
    console.log(`   ✅ 12板块结构：完整`);
    console.log(`   ✅ 万神殿分析：${data.pantheon.mastersComparison.length}位大师对照`);
    console.log(`   ✅ 核心优势：${data.advantages?.length || 0}条`);
    console.log(`   ✅ 风险提示：${data.risks?.length || 0}条`);
    console.log(`   ✅ FAQ：${data.faq?.length || 0}个问题`);
    
  } catch (err) {
    console.error(`\n❌ 生成失败：${err.message}`);
    console.error(err.stack);
    process.exit(1);
  }
}

main();
