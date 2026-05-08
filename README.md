# IDcard-smjj 🐸

私募基金管理人销售卡片生成器

[![Version](https://img.shields.io/badge/version-v1.1.0-blue.svg)](./CHANGELOG.md)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)
[![OpenClaw](https://img.shields.io/badge/OpenClaw-Skill-orange.svg)](https://github.com/openclaw)

> 根据尽调报告自动生成符合标准格式的私募基金管理人销售卡片（.docx），包含12标准板块 + 万神殿分析（4部分完整）

---

## ✨ 特性

### 标准12板块结构
1. 📋 基本信息
2. 📊 产品线详解
3. 👨‍💼 基金经理实战复盘
4. ⭐ 核心优势
5. ⚠️ 风险提示
6. 📈 市场环境与配置建议
7. 🏛️ **【万神殿分析】**（4部分完整）
8. 💡 投资建议
9. ❓ 客户常见问题（FAQ）
10. 📰 舆情小插曲
11. 💬 投资者真实评价
12. 📎 附录

### 万神殿分析（核心差异化）
| 部分 | 内容 |
|------|------|
| 大师对照表 | 10位投资大师 × 管理人对照（5列） |
| 原则适配度 | 5条通用投资原则匹配分析 |
| 独特性 | 为什么在中国市场有效（3-4条） |
| 语录对照 | 大师语录 × 管理人实践 |

### 智能模板（v1.1.0新增）
根据策略类型自动推荐大师匹配度：

```bash
# 债券策略 → 霍华德·马克斯、巴菲特、张磊（高匹配）
node skill.js --data data.json --output card.docx --strategy 债券

# 主观多头 → 巴菲特、张磊、霍华德·马克斯（高匹配）
node skill.js --data data.json --output card.docx --strategy 主观

# 价值投资 → 巴菲特、霍华德·马克斯、张磊（高匹配）
node skill.js --data data.json --output card.docx --strategy 价值
```

---

## 🚀 快速开始

### 安装

```bash
# 克隆仓库
git clone https://github.com/YOUR_USERNAME/idcard-smjj.git
cd idcard-smjj

# 安装依赖
npm install
```

### 使用

```bash
# 1. 生成数据模板
node skill.js --template 机构_data.json

# 2. 填写数据后验证
node skill.js --validate 机构_data.json

# 3. 生成销售卡片（使用智能模板）
node skill.js --data 机构_data.json --output 销售卡片.docx --strategy 债券
```

---

## 📖 完整文档

- [SKILL.md](./SKILL.md) - Skill详细使用说明
- [EXECUTION_RULE.md](./EXECUTION_RULE.md) - 执行规范（强制性）
- [GITHUB_UPLOAD_GUIDE.md](./GITHUB_UPLOAD_GUIDE.md) - GitHub上传指南

---

## 🎨 视觉设计

### 配色方案
| 用途 | 颜色 | 色值 |
|------|------|------|
| 主色（标题） | 深蓝 | #1E3A5F |
| 辅色（次级标题） | 中蓝 | #2E5984 |
| 强调色（万神殿） | 金色 | #D4AF37 |
| 高匹配 | 绿色 | #27AE60 |
| 中匹配 | 橙色 | #F39C12 |
| 低匹配 | 红色 | #E74C3C |

### 图标系统
- ⭐ 核心优势
- ⚠️ 风险提示
- 📰 舆情新闻
- ◆ 独特性
- ▶ 案例

---

## 🏛️ 万神殿大师库

| 大师 | 风格 | 核心理念 |
|------|------|----------|
| 巴菲特 Buffett | 价值投资/护城河 | 长期持有优质标的 |
| 霍华德·马克斯 Marks | 第二层思维/周期 | 不研究收益，只研究风险 |
| 泰珀 Tepper | 逆向投资 | 极度悲观时买入 |
| 达利欧 Dalio | 风险平价/全天候 | 分散化是圣杯 |
| 索罗斯 Soros | 宏观/反射性 | 承认错误立刻认错 |
| 西蒙斯 Simons | 量化/统计套利 | 市场存在短期定价错误 |
| 阿斯尼斯 Asness | 因子投资 | 价值/动量长期有效 |
| 阿克曼 Ackman | 集中持股/事件驱动 | 书面退出标准 |
| 张磊 Hillhouse | 长期主义/中国价值 | 长期创造价值 |
| 伍德 Wood | 颠覆式创新 | 创新解决问题 |

---

## 📦 作为 OpenClaw Skill 使用

```yaml
skills:
  - name: idcard-smjj
    source: github:YOUR_USERNAME/idcard-smjj
    version: v1.1.0
```

---

## 📝 更新日志

### v1.1.0 (2026-05-08)
- ✅ 新增智能万神殿模板
- ✅ 新增数据验证功能
- ✅ 新增模板生成功能
- ✅ 新增质量检查报告

### v1.0.0 (2026-05-08)
- 🎉 初始版本发布
- ✅ 12标准板块完整支持
- ✅ 万神殿分析4部分完整
- ✅ 视觉设计规范实现

---

## 🤝 贡献

欢迎提交 Issue 和 PR！

---

## 📄 许可证

[MIT License](./LICENSE)

---

**作者**: 赖克宝 🐸  
**版本**: v1.1.0  
**更新日期**: 2026-05-08
