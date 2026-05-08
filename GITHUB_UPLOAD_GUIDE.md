# IDcard-smjj - GitHub上传指南

## 项目信息

- **名称**: idcard-smjj
- **版本**: v1.1.0
- **描述**: 私募基金管理人销售卡片生成器 - 12标准板块 + 万神殿分析（4部分）
- **作者**: 赖克宝 🐸
- **更新日期**: 2026-05-08

---

## 文件清单

```
idcard-smjj/
├── .gitignore              # Git忽略规则
├── README.md               # 项目说明文档（GitHub主页展示）
├── SKILL.md                # OpenClaw Skill定义文件
├── EXECUTION_RULE.md       # 执行规范（强制性）
├── index.js                # 核心实现（生成销售卡片）
├── skill.js                # CLI入口（v1.1.0优化版）
├── package.json            # NPM包配置
├── template.json           # 数据模板示例
└── GITHUB_UPLOAD_GUIDE.md  # 本文件
```

---

## 上传到GitHub步骤

### 1. 创建GitHub仓库

1. 登录 [GitHub](https://github.com)
2. 点击右上角 `+` → `New repository`
3. 填写信息：
   - **Repository name**: `idcard-smjj`
   - **Description**: `私募基金管理人销售卡片生成器 - 12板块+万神殿分析`
   - **Visibility**: 选择 `Public`（推荐，方便分享）
   - **Initialize**: 不要勾选任何选项（我们已有完整文件）
4. 点击 `Create repository`

### 2. 本地初始化并上传

在 PowerShell 或 CMD 中执行：

```powershell
# 进入skill目录
cd C:\Users\Administrator\.openclaw\workspace\skills\idcard-smjj

# 初始化git仓库
git init

# 添加所有文件
git add .

# 提交（v1.1.0版本）
git commit -m "Release v1.1.0: 智能万神殿模板 + 数据验证 + 质量报告"

# 关联远程仓库（替换YOUR_USERNAME为你的GitHub用户名）
git remote add origin https://github.com/YOUR_USERNAME/idcard-smjj.git

# 推送到GitHub
git push -u origin main
```

### 3. 验证上传

访问 `https://github.com/YOUR_USERNAME/idcard-smjj` 确认：
- [ ] 所有文件已上传
- [ ] README.md 正常显示
- [ ] 代码高亮正常

---

## 版本发布

### 打标签发布 v1.1.0

```bash
git tag -a v1.1.0 -m "Release v1.1.0: 智能万神殿模板 + 数据验证"
git push origin v1.1.0
```

### 在GitHub创建Release

1. 进入仓库页面 → 点击右侧 `Releases`
2. 点击 `Create a new release`
3. 选择标签 `v1.1.0`
4. 填写发布标题：`IDcard-smjj v1.1.0`
5. 填写发布说明（复制下面内容）：

```markdown
## IDcard-smjj v1.1.0 发布说明

### 新增功能
- ✅ **智能万神殿模板**：根据策略类型自动推荐10位大师对照表
- ✅ **数据验证功能**：生成前自动检查数据完整性
- ✅ **模板生成功能**：一键生成标准JSON数据模板
- ✅ **质量检查报告**：生成后输出详细质量报告

### 支持策略类型
- 债券策略（--strategy 债券）
- 主观多头（--strategy 主观）
- 价值投资（--strategy 价值）
- 量化策略（--strategy 量化）
- CTA策略（--strategy CTA）
- 医药主题（--strategy 医药）

### 使用示例
```bash
# 生成模板
node skill.js --template 机构_data.json

# 验证数据
node skill.js --validate 机构_data.json

# 智能生成
node skill.js --data 机构_data.json --output 销售卡片.docx --strategy 债券
```

### 完整文档
- [SKILL.md](./SKILL.md) - Skill使用说明
- [EXECUTION_RULE.md](./EXECUTION_RULE.md) - 执行规范
```

6. 点击 `Publish release`

---

## 使用方式

### 方式1：作为 OpenClaw Skill

在 OpenClaw 配置中引用：

```yaml
skills:
  - name: idcard-smjj
    source: github:YOUR_USERNAME/idcard-smjj
    version: v1.1.0
```

### 方式2：直接克隆使用

```bash
git clone https://github.com/YOUR_USERNAME/idcard-smjj.git
cd idcard-smjj
npm install
node skill.js --help
```

### 方式3：作为 Node.js 模块

```javascript
const { generateSalesCard } = require('./index.js');

const data = { /* 12板块数据 */ };
await generateSalesCard(data, '输出路径.docx');
```

---

## 项目特性

### ✅ 标准12板块结构
1. 基本信息
2. 产品线详解
3. 基金经理实战复盘
4. 核心优势
5. 风险提示
6. 市场环境与配置建议
7. **【万神殿分析】**（4部分完整）⭐
8. 投资建议
9. 客户常见问题（FAQ）
10. 舆情小插曲
11. 投资者真实评价
12. 附录

### ✅ 万神殿分析（4部分）
- 10位大师 × 管理人对照表（5列）
- 5条通用投资原则适配度
- 管理人独特性（为什么在中国市场有效）
- 大师语录 × 管理人实践对照

### ✅ 智能模板（v1.1.0新增）
根据策略类型自动推荐大师匹配度：
- 债券策略 → 霍华德·马克斯、巴菲特、张磊（高匹配）
- 主观多头 → 巴菲特、张磊、霍华德·马克斯（高匹配）
- 价值投资 → 巴菲特、霍华德·马克斯、张磊（高匹配）
- 量化策略 → 西蒙斯、阿斯尼斯、达利欧（高匹配）

### ✅ 视觉设计规范
- 配色：深蓝(#1E3A5F) / 中蓝(#2E5984) / 金色(#D4AF37)
- 表格：交替行背景、匹配度颜色标识
- 图标：★优势 ⚠风险 📰舆情 ◆独特性 ▶案例
- 页眉页脚：自动包含机构名和页码

---

## 依赖说明

```json
{
  "dependencies": {
    "docx": "^8.x"  // Word文档生成
  }
}
```

可选依赖：
- **AlphaGBM/investment-masters**: 10位大师详细数据（skill内置大师库作为fallback）

---

## 许可证

MIT License - 可自由使用、修改、分发

---

**作者**: 赖克宝 🐸  
**版本**: v1.1.0  
**更新日期**: 2026-05-08
