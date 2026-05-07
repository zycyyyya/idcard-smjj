# IDcard-smjj - GitHub上传指南

## 文件清单

```
IDcard-smjj/
├── .gitignore          # Git忽略规则（不提交node_modules和临时文件）
├── README.md           # 项目说明文档
├── SKILL.md            # OpenClaw Skill定义文件
├── index.js            # 核心实现（生成销售卡片）
├── package.json        # NPM包配置
├── skill.js            # CLI入口
└── template.json       # 数据模板
```

## 上传到GitHub步骤

### 1. 创建GitHub仓库

1. 登录 GitHub
2. 点击右上角 `+` → `New repository`
3. 填写信息：
   - Repository name: `idcard-smjj`
   - Description: `私募基金管理人销售卡片生成器 - 12板块+万神殿分析`
   - 选择 `Public` 或 `Private`
   - 勾选 `Add a README file`（可选，我们已有README.md）
4. 点击 `Create repository`

### 2. 本地初始化并上传

```bash
# 进入skill目录
cd ~/.openclaw/workspace/skills/IDcard-smjj

# 初始化git仓库
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit: IDcard-smjj v1.0.0"

# 关联远程仓库（替换为你的GitHub用户名）
git remote add origin https://github.com/YOUR_USERNAME/idcard-smjj.git

# 推送到GitHub
git push -u origin main
```

### 3. 验证上传

访问 `https://github.com/YOUR_USERNAME/idcard-smjj` 确认文件已上传。

## 使用方式

### 作为OpenClaw Skill

在OpenClaw中引用：

```yaml
skills:
  - name: idcard-smjj
    source: github:YOUR_USERNAME/idcard-smjj
```

### 作为NPM包

```bash
npm install -g idcard-smjj
idcard-smjj --data 数据.json --output 销售卡片.docx
```

### 作为Node.js模块

```javascript
const { generateSalesCard } = require('idcard-smjj');
```

## 版本发布

### 打标签发布v1.0.0

```bash
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

### 在GitHub创建Release

1. 进入仓库页面
2. 点击右侧 `Releases`
3. 点击 `Create a new release`
4. 选择标签 `v1.0.0`
5. 填写发布说明
6. 点击 `Publish release`

## 特性说明

### ✅ 无垃圾中间文件
- `.gitignore` 已配置忽略临时文件
- 直接输出干净的 `.docx` 文件
- 不生成 `_tw_*.txt` 等临时脚本

### ✅ 标准12板块结构
- 基本信息、产品线、基金经理复盘
- 核心优势、风险提示、市场环境
- **万神殿分析（4部分完整）**
- 投资建议、FAQ、舆情、评价、附录

### ✅ 万神殿分析集成
- 10位大师对照表
- 5条通用原则适配度
- 管理人独特性
- 大师语录对照

### ✅ 视觉设计规范
- 统一配色方案
- 标准表格样式
- 页眉页脚规范
- 图标系统

## 依赖说明

- **docx**: Word文档生成
- **AlphaGBM/investment-masters**: 10位大师数据（可选，skill内置大师库）

## 许可证

MIT License - 可自由使用、修改、分发

---

**作者**: 赖克宝 🐸  
**版本**: 1.0.0  
**日期**: 2026-05-08
