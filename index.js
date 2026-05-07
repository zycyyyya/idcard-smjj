/**
 * IDcard-smjj - 私募基金管理人销售卡片生成器
 * 核心实现文件
 */

const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        AlignmentType, WidthType, ShadingType,
        Header, Footer, PageNumber, PageBreak } = require('docx');
const fs = require('fs');
const path = require('path');

// 视觉设计规范
const DESIGN = {
  colors: {
    primary: "1E3A5F",      // 深蓝 - 标题
    secondary: "2E5984",    // 中蓝 - 次级标题
    accent: "D4AF37",       // 金色 - 万神殿
    bg: "F5F5F5",          // 浅灰 - 交替行
    high: "27AE60",        // 绿色 - 高匹配
    medium: "F39C12",      // 橙色 - 中匹配
    low: "E74C3C",         // 红色 - 低匹配
    white: "FFFFFF",
    black: "000000"
  },
  fonts: {
    chinese: "微软雅黑",
    english: "Arial"
  }
};

// 10位大师库（用于万神殿分析）
const MASTERS = [
  { name: "巴菲特 Buffett", style: "价值投资/护城河", core: "长期持有优质标的" },
  { name: "霍华德·马克斯 Marks", style: "第二层思维/周期", core: "不研究收益，只研究风险" },
  { name: "泰珀 Tepper", style: "逆向投资", core: "极度悲观时买入" },
  { name: "达利欧 Dalio", style: "风险平价/全天候", core: "分散化是圣杯" },
  { name: "索罗斯 Soros", style: "宏观/反射性", core: "承认错误立刻认错" },
  { name: "西蒙斯 Simons", style: "量化/统计套利", core: "市场存在短期定价错误" },
  { name: "阿斯尼斯 Asness", style: "因子投资", core: "价值/动量长期有效" },
  { name: "阿克曼 Ackman", style: "集中持股/事件驱动", core: "书面退出标准" },
  { name: "张磊 Hillhouse", style: "长期主义/中国价值", core: "长期创造价值" },
  { name: "伍德 Wood", style: "颠覆式创新", core: "创新解决问题" }
];

// 5条通用原则
const PRINCIPLES = [
  "系统 > 直觉",
  "风险管理 > 选股",
  "明确论点 + 愿意认错",
  "周期意识",
  "长期主义"
];

/**
 * 创建标题段落
 */
function createTitle(text, level = 1) {
  const fontSize = level === 1 ? 32 : (level === 2 ? 26 : 24);
  const color = level === 1 ? DESIGN.colors.primary : DESIGN.colors.secondary;
  return new Paragraph({
    children: [new TextRun({ text, bold: true, size: fontSize, color, font: DESIGN.fonts.chinese })],
    spacing: { before: 400, after: 200 }
  });
}

/**
 * 创建普通段落
 */
function createParagraph(text, options = {}) {
  return new Paragraph({
    children: [new TextRun({ 
      text, 
      size: options.size || 21, 
      color: options.color || DESIGN.colors.black, 
      font: DESIGN.fonts.chinese,
      bold: options.bold || false 
    })],
    spacing: { before: 100, after: 100 },
    alignment: options.alignment || AlignmentType.LEFT
  });
}

/**
 * 创建带图标的列表项
 */
function createBullet(text, icon = "•") {
  return new Paragraph({
    children: [
      new TextRun({ text: `${icon} `, size: 21, color: DESIGN.colors.accent, font: DESIGN.fonts.chinese }),
      new TextRun({ text, size: 21, color: DESIGN.colors.black, font: DESIGN.fonts.chinese })
    ],
    spacing: { before: 60, after: 60 },
    indent: { left: 400 }
  });
}

/**
 * 创建表格单元格
 */
function createTableCell(text, options = {}) {
  const shading = options.shading ? { type: ShadingType.CLEAR, color: options.shading } : undefined;
  return new TableCell({
    children: [new Paragraph({
      children: [new TextRun({ 
        text, 
        bold: options.bold || false, 
        size: options.size || 21, 
        color: options.color || DESIGN.colors.black, 
        font: DESIGN.fonts.chinese 
      })],
      alignment: options.alignment || AlignmentType.LEFT
    })],
    shading,
    width: { type: WidthType.PERCENTAGE, size: options.width || 20 }
  });
}

/**
 * 获取匹配度颜色
 */
function getFitColor(fit) {
  if (fit === "极高" || fit === "高") return DESIGN.colors.high;
  if (fit === "中") return DESIGN.colors.medium;
  return DESIGN.colors.low;
}

/**
 * 生成万神殿分析（4部分）
 */
function generatePantheonSection(data) {
  const children = [];
  
  children.push(new PageBreak());
  children.push(createTitle("【万神殿分析】", 1));
  children.push(new Paragraph({
    children: [new TextRun({ 
      text: "—— 全球投资大师框架对照分析 ——", 
      size: 24, 
      color: DESIGN.colors.accent, 
      font: DESIGN.fonts.chinese, 
      italics: true 
    })],
    alignment: AlignmentType.CENTER,
    spacing: { after: 400 }
  }));
  
  // 1. 大师对照表
  children.push(createTitle("一、10位大师 × 管理人对照表", 2));
  
  const mastersTable = new Table({
    rows: [
      new TableRow({
        children: [
          createTableCell("大师", { bold: true, shading: DESIGN.colors.secondary, color: DESIGN.colors.white, width: 18 }),
          createTableCell("策略标签", { bold: true, shading: DESIGN.colors.secondary, color: DESIGN.colors.white, width: 18 }),
          createTableCell("重合度", { bold: true, shading: DESIGN.colors.secondary, color: DESIGN.colors.white, width: 12 }),
          createTableCell("核心重叠", { bold: true, shading: DESIGN.colors.secondary, color: DESIGN.colors.white, width: 22 }),
          createTableCell("核心差异", { bold: true, shading: DESIGN.colors.secondary, color: DESIGN.colors.white, width: 30 })
        ]
      }),
      ...(data.pantheon?.mastersComparison || []).map((m, i) => new TableRow({
        children: [
          createTableCell(m.master, { shading: i % 2 === 0 ? DESIGN.colors.bg : DESIGN.colors.white, width: 18 }),
          createTableCell(m.style, { shading: i % 2 === 0 ? DESIGN.colors.bg : DESIGN.colors.white, width: 18 }),
          createTableCell(m.alignment, { 
            shading: i % 2 === 0 ? DESIGN.colors.bg : DESIGN.colors.white, 
            color: getFitColor(m.alignment), 
            bold: true, 
            width: 12 
          }),
          createTableCell(m.overlap, { shading: i % 2 === 0 ? DESIGN.colors.bg : DESIGN.colors.white, width: 22 }),
          createTableCell(m.difference, { shading: i % 2 === 0 ? DESIGN.colors.bg : DESIGN.colors.white, width: 30 })
        ]
      }))
    ],
    width: { type: WidthType.PERCENTAGE, size: 100 }
  });
  children.push(mastersTable);
  children.push(new Paragraph({ spacing: { after: 300 } }));
  
  // 2. 5条通用原则适配度
  children.push(createTitle("二、5条通用投资原则适配度", 2));
  
  const principlesTable = new Table({
    rows: [
      new TableRow({
        children: [
          createTableCell("通用原则", { bold: true, shading: DESIGN.colors.secondary, color: DESIGN.colors.white, width: 30 }),
          createTableCell("适配度", { bold: true, shading: DESIGN.colors.secondary, color: DESIGN.colors.white, width: 15 }),
          createTableCell("具体体现", { bold: true, shading: DESIGN.colors.secondary, color: DESIGN.colors.white, width: 55 })
        ]
      }),
      ...(data.pantheon?.principles || []).map((p, i) => new TableRow({
        children: [
          createTableCell(p.principle, { shading: i % 2 === 0 ? DESIGN.colors.bg : DESIGN.colors.white, width: 30 }),
          createTableCell(p.fit, { 
            shading: i % 2 === 0 ? DESIGN.colors.bg : DESIGN.colors.white, 
            color: getFitColor(p.fit), 
            bold: true, 
            width: 15 
          }),
          createTableCell(p.evidence, { shading: i % 2 === 0 ? DESIGN.colors.bg : DESIGN.colors.white, width: 55 })
        ]
      }))
    ],
    width: { type: WidthType.PERCENTAGE, size: 100 }
  });
  children.push(principlesTable);
  children.push(new Paragraph({ spacing: { after: 300 } }));
  
  // 3. 管理人独特性
  children.push(createTitle("三、管理人独特性（为什么在中国市场有效）", 2));
  for (const u of (data.pantheon?.uniqueness || [])) {
    children.push(createBullet(u, "◆"));
  }
  children.push(new Paragraph({ spacing: { after: 300 } }));
  
  // 4. 大师语录对照
  children.push(createTitle("四、大师语录 × 管理人实践对照", 2));
  for (const q of (data.pantheon?.quotes || [])) {
    children.push(new Paragraph({
      children: [
        new TextRun({ text: `${q.master}：`, bold: true, size: 21, color: DESIGN.colors.secondary, font: DESIGN.fonts.chinese }),
        new TextRun({ text: `"${q.quote}"`, size: 21, color: DESIGN.colors.accent, font: DESIGN.fonts.chinese, italics: true })
      ],
      spacing: { before: 200, after: 100 }
    }));
    children.push(new Paragraph({
      children: [
        new TextRun({ text: "→ 实践：", bold: true, size: 21, color: DESIGN.colors.secondary, font: DESIGN.fonts.chinese }),
        new TextRun({ text: q.practice, size: 21, color: DESIGN.colors.black, font: DESIGN.fonts.chinese })
      ],
      spacing: { after: 200 },
      indent: { left: 400 }
    }));
  }
  
  return children;
}

/**
 * 生成完整销售卡片文档
 */
async function generateSalesCard(data, outputPath) {
  const children = [];
  
  // 封面
  children.push(new Paragraph({
    children: [new TextRun({ text: data.basic.name, bold: true, size: 72, color: DESIGN.colors.primary, font: DESIGN.fonts.chinese })],
    alignment: AlignmentType.CENTER,
    spacing: { before: 2000, after: 400 }
  }));
  children.push(new Paragraph({
    children: [new TextRun({ text: "私募基金管理人销售卡片", size: 36, color: DESIGN.colors.secondary, font: DESIGN.fonts.chinese })],
    alignment: AlignmentType.CENTER,
    spacing: { after: 800 }
  }));
  children.push(new Paragraph({
    children: [new TextRun({ text: `生成日期：${new Date().toLocaleDateString('zh-CN')}`, size: 21, color: "666666", font: DESIGN.fonts.chinese })],
    alignment: AlignmentType.CENTER
  }));
  children.push(new PageBreak());
  
  // 一、基本信息
  children.push(createTitle("一、基本信息", 1));
  const basicFields = [
    ["机构全称", data.basic.fullName],
    ["成立时间", data.basic.founded],
    ["备案编号", data.basic.licenseNumber],
    ["管理规模", data.basic.scale],
    ["注册资本", `${data.basic.regCapital}（实缴：${data.basic.paidCapital}）`],
    ["所在地", data.basic.location],
    ["团队人数", data.basic.employees],
    ["核心团队", data.basic.coreTeam]
  ];
  for (const [label, value] of basicFields) {
    children.push(new Paragraph({
      children: [
        new TextRun({ text: `${label}：`, bold: true, size: 21, color: DESIGN.colors.secondary, font: DESIGN.fonts.chinese }),
        new TextRun({ text: value || "待完善", size: 21, color: value ? DESIGN.colors.black : "999999", font: DESIGN.fonts.chinese })
      ],
      spacing: { before: 80, after: 80 }
    }));
  }
  
  // 二、产品线详解
  children.push(createTitle("二、产品线详解", 1));
  const productTable = new Table({
    rows: [
      new TableRow({
        children: [
          createTableCell("策略", { bold: true, shading: DESIGN.colors.secondary, color: DESIGN.colors.white, width: 20 }),
          createTableCell("特色/风格", { bold: true, shading: DESIGN.colors.secondary, color: DESIGN.colors.white, width: 35 }),
          createTableCell("业绩表现", { bold: true, shading: DESIGN.colors.secondary, color: DESIGN.colors.white, width: 25 }),
          createTableCell("备注", { bold: true, shading: DESIGN.colors.secondary, color: DESIGN.colors.white, width: 20 })
        ]
      }),
      ...(data.products || []).map((p, i) => new TableRow({
        children: [
          createTableCell(p.strategy, { shading: i % 2 === 0 ? DESIGN.colors.bg : DESIGN.colors.white, width: 20 }),
          createTableCell(p.style, { shading: i % 2 === 0 ? DESIGN.colors.bg : DESIGN.colors.white, width: 35 }),
          createTableCell(p.performance, { shading: i % 2 === 0 ? DESIGN.colors.bg : DESIGN.colors.white, width: 25 }),
          createTableCell(p.note, { shading: i % 2 === 0 ? DESIGN.colors.bg : DESIGN.colors.white, width: 20 })
        ]
      }))
    ],
    width: { type: WidthType.PERCENTAGE, size: 100 }
  });
  children.push(productTable);
  children.push(new Paragraph({ spacing: { after: 200 } }));
  
  // 三、基金经理实战复盘
  children.push(createTitle("三、基金经理实战复盘", 1));
  children.push(createTitle("历史回撤", 2));
  children.push(createParagraph(data.managerBackground || "待完善"));
  
  children.push(createTitle("典型案例", 2));
  for (const c of (data.cases || [])) {
    children.push(createBullet(`${c.date} - ${c.event}`, "▶"));
    children.push(createParagraph(c.result, { indent: { left: 600 } }));
  }
  
  // 四、核心优势
  children.push(createTitle("四、核心优势", 1));
  for (const adv of (data.advantages || [])) {
    children.push(createBullet(adv, "★"));
  }
  
  // 五、风险提示
  children.push(createTitle("五、风险提示", 1));
  for (const risk of (data.risks || [])) {
    children.push(createBullet(risk, "⚠"));
  }
  
  // 六、市场环境与配置建议
  children.push(createTitle("六、市场环境与配置建议", 1));
  children.push(createTitle("当前市场环境", 2));
  children.push(createParagraph(data.marketEnvironment || "待完善"));
  
  children.push(createTitle("匹配度分析", 2));
  const fitTable = new Table({
    rows: [
      new TableRow({
        children: [
          createTableCell("市场主线", { bold: true, shading: DESIGN.colors.secondary, color: DESIGN.colors.white, width: 30 }),
          createTableCell("匹配度", { bold: true, shading: DESIGN.colors.secondary, color: DESIGN.colors.white, width: 20 }),
          createTableCell("说明", { bold: true, shading: DESIGN.colors.secondary, color: DESIGN.colors.white, width: 50 })
        ]
      }),
      ...(data.marketFit || []).map((m, i) => new TableRow({
        children: [
          createTableCell(m.theme, { shading: i % 2 === 0 ? DESIGN.colors.bg : DESIGN.colors.white, width: 30 }),
          createTableCell(m.fit, { 
            shading: i % 2 === 0 ? DESIGN.colors.bg : DESIGN.colors.white, 
            color: getFitColor(m.fit), 
            bold: true, 
            width: 20 
          }),
          createTableCell(m.note, { shading: i % 2 === 0 ? DESIGN.colors.bg : DESIGN.colors.white, width: 50 })
        ]
      }))
    ],
    width: { type: WidthType.PERCENTAGE, size: 100 }
  });
  children.push(fitTable);
  children.push(new Paragraph({ spacing: { after: 200 } }));
  
  // ★ 万神殿分析（核心板块）
  children.push(...generatePantheonSection(data));
  
  // 七、投资建议
  children.push(new PageBreak());
  children.push(createTitle("七、投资建议", 1));
  const recTable = new Table({
    rows: [
      new TableRow({
        children: [
          createTableCell("项目", { bold: true, shading: DESIGN.colors.secondary, color: DESIGN.colors.white, width: 25 }),
          createTableCell("建议内容", { bold: true, shading: DESIGN.colors.secondary, color: DESIGN.colors.white, width: 75 })
        ]
      }),
      new TableRow({ children: [createTableCell("定位", { width: 25 }), createTableCell(data.recommendation?.position || "待完善", { width: 75 })] }),
      new TableRow({ children: [createTableCell("适配客户", { shading: DESIGN.colors.bg, width: 25 }), createTableCell(data.recommendation?.clientType || "待完善", { shading: DESIGN.colors.bg, width: 75 })] }),
      new TableRow({ children: [createTableCell("持有期限", { width: 25 }), createTableCell(data.recommendation?.holdingPeriod || "待完善", { width: 75 })] }),
      new TableRow({ children: [createTableCell("产品选择", { shading: DESIGN.colors.bg, width: 25 }), createTableCell(data.recommendation?.productChoice || "待完善", { shading: DESIGN.colors.bg, width: 75 })] }),
      new TableRow({ children: [createTableCell("搭配建议", { width: 25 }), createTableCell(data.recommendation?.pairing || "待完善", { width: 75 })] })
    ],
    width: { type: WidthType.PERCENTAGE, size: 100 }
  });
  children.push(recTable);
  children.push(new Paragraph({ spacing: { after: 200 } }));
  
  // 八、客户常见问题
  children.push(createTitle("八、客户常见问题（FAQ）", 1));
  for (let i = 0; i < (data.faq || []).length; i++) {
    const item = data.faq[i];
    children.push(new Paragraph({
      children: [
        new TextRun({ text: `Q${i + 1}：`, bold: true, size: 21, color: DESIGN.colors.secondary, font: DESIGN.fonts.chinese }),
        new TextRun({ text: item.q, size: 21, color: DESIGN.colors.black, font: DESIGN.fonts.chinese })
      ],
      spacing: { before: 200, after: 100 }
    }));
    children.push(new Paragraph({
      children: [
        new TextRun({ text: `A${i + 1}：`, bold: true, size: 21, color: DESIGN.colors.accent, font: DESIGN.fonts.chinese }),
        new TextRun({ text: item.a, size: 21, color: DESIGN.colors.black, font: DESIGN.fonts.chinese })
      ],
      spacing: { after: 200 },
      indent: { left: 200 }
    }));
  }
  
  // 九、舆情小插曲
  children.push(createTitle("九、舆情小插曲", 1));
  for (const news of (data.news || [])) {
    children.push(createBullet(news, "📰"));
  }
  
  // 十、投资者真实评价
  children.push(createTitle("十、投资者真实评价", 1));
  for (const review of (data.reviews || [])) {
    const parts = review.split('——');
    children.push(new Paragraph({
      children: [
        new TextRun({ text: '"', size: 28, color: DESIGN.colors.accent, font: DESIGN.fonts.chinese }),
        new TextRun({ text: parts[0], size: 21, color: DESIGN.colors.black, font: DESIGN.fonts.chinese }),
        new TextRun({ text: '"', size: 28, color: DESIGN.colors.accent, font: DESIGN.fonts.chinese })
      ],
      spacing: { before: 200, after: 100 },
      indent: { left: 400 }
    }));
    if (parts.length > 1) {
      children.push(new Paragraph({
        children: [new TextRun({ text: `——${parts[1]}`, size: 18, color: "666666", font: DESIGN.fonts.chinese, italics: true })],
        alignment: AlignmentType.RIGHT,
        spacing: { after: 200 }
      }));
    }
  }
  
  // 十一、附录
  children.push(createTitle("十一、附录", 1));
  children.push(createTitle("股权关系", 2));
  children.push(createParagraph(data.appendix?.equity || "待完善"));
  children.push(createTitle("履历关联", 2));
  children.push(createParagraph(data.appendix?.career || "待完善"));
  children.push(createTitle("师承/同门", 2));
  children.push(createParagraph(data.appendix?.mentorship || "无明确师承关系"));
  
  // 创建文档
  const doc = new Document({
    sections: [{
      properties: { page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
      headers: {
        default: new Header({
          children: [new Paragraph({
            children: [new TextRun({ text: `${data.basic.name} | 私募基金管理人销售卡片`, size: 18, color: "999999", font: DESIGN.fonts.chinese })],
            alignment: AlignmentType.CENTER
          })]
        })
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            children: [
              new TextRun({ text: "第 ", size: 18, color: "999999", font: DESIGN.fonts.chinese }),
              new TextRun({ text: PageNumber.CURRENT, size: 18, color: "999999", font: DESIGN.fonts.chinese }),
              new TextRun({ text: " 页", size: 18, color: "999999", font: DESIGN.fonts.chinese })
            ],
            alignment: AlignmentType.CENTER
          })]
        })
      },
      children: children
    }]
  });
  
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outputPath, buffer);
  console.log(`✅ 销售卡片已生成：${outputPath}`);
  return outputPath;
}

module.exports = {
  generateSalesCard,
  MASTERS,
  PRINCIPLES,
  DESIGN
};
