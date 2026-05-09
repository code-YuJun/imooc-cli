# 慕课网前端统一研发脚手架

## About

慕课网前端架构师课程专属脚手架

## Getting Started

安装：

```bash
npm install -g @imooc-cli/core
# OR
yarn global add @imooc-cli/core
```

创建项目

```bash
imooc-cli init 
```

发布项目

```bash
imooc-cli publish
```

## More

清空缓存：

```bash
imooc-cli clean
```

DEBUG 模式：

```bash
imooc-cli --debug
```

指定本地包：

```bash
imooc-cli init --packagePath /Users/sam/Desktop/imooc-cli/packages/init/
```


## 指令使用方式
## 一、命令列表及详细说明
### 1. **`learn` - 访问课程链接**
**执行指令：**
```bash
imooc-cli learn
```
- 输出课程信息（绿色成功提示）：
  - 欢迎学习：慕课网前端架构师课程
  - 课程链接：https://coding.imooc.com/class/445.html
  - 课程介绍：小宇宙燃烧吧
  - 作者介绍：Sam@2020
---

### 2. **`add` - 添加内容**
**执行指令：**
```bash
imooc-cli add
```
**执行效果：**
- 调用 `@imooc-cli/add` 包处理添加逻辑
- 具体行为取决于 `add` 模块的实现
---

### 3. **`init [type]` - 项目初始化**
**执行指令：**
```bash
imooc-cli init                  # 基础初始化
imooc-cli init react            # 指定类型初始化
imooc-cli init --force          # 强制覆盖
imooc-cli init --packagePath /custom/path  # 指定包路径
```
**可选参数：**
| 参数 | 说明 |
|------|------|
| `[type]` | 项目类型（如 react/vue） |
| `--packagePath <path>` | 手动指定 init 包路径 |
| `--force` | 覆盖当前路径文件 |
**执行效果：**
- 动态安装/更新 `@imooc-cli/init@1.0.0` 包
- 执行 init 包的入口文件，传入 `type` 和 `force` 参数
---

### 4. **`publish` - 项目发布**
**执行指令：**
```bash
imooc-cli publish                          # 基础发布
imooc-cli publish --prod                   # 正式发布
imooc-cli publish --force                  # 强制更新所有缓存
imooc-cli publish --cnpm                   # 使用 cnpm
imooc-cli publish --sshUser root --sshIp 192.168.1.100 --sshPath /var/www
```
**可选参数：**
| 参数 | 说明 |
|------|------|
| `--packagePath <path>` | 手动指定 publish 包路径 |
| `--refreshToken` | 强制更新 git token |
| `--refreshOwner` | 强制更新 git owner |
| `--refreshServer` | 强制更新 git server |
| `--force` | 等同于同时设置上述三个 refresh 参数 |
| `--prod` | 正式发布模式 |
| `--keepCache` | 保留缓存 |
| `--cnpm` | 使用 cnpm 安装依赖 |
| `--buildCmd <cmd>` | 自定义构建命令 |
| `--sshUser <user>` | SSH 用户名 |
| `--sshIp <ip>` | 服务器 IP/域名 |
| `--sshPath <path>` | 服务器上传路径 |

**执行效果：**
- 动态安装/更新 `@imooc-cli/publish@1.0.0` 包
- 执行 publish 包的入口文件，处理项目发布流程
---

### 5. **`replace` - 作业网站优化**
**执行指令：**
```bash
imooc-cli replace --region oss-cn-hangzhou --bucket my-bucket --ossAccessKey xxx --ossSecretKey xxx
```

**可选参数：**
| 参数 | 说明 |
|------|------|
| `--packagePath <path>` | 手动指定 replace 包路径 |
| `--region <region>` | OSS 区域 |
| `--bucket <bucket>` | OSS Bucket 名称 |
| `--ossAccessKey <key>` | OSS AccessKey |
| `--ossSecretKey <key>` | OSS SecretKey |

**执行效果：**
- 动态安装/更新 `@imooc-cli/replace@1.0.0` 包
- 执行 replace 包的入口文件，处理 OSS 相关优化操作
---

### 6. **`clean` - 清空缓存文件**
**执行指令：**
```bash
imooc-cli clean               # 清空全部缓存（默认）
imooc-cli clean -a            # 清空全部缓存
imooc-cli clean --all         # 清空全部缓存
imooc-cli clean -d            # 仅清空依赖文件
imooc-cli clean --dep         # 仅清空依赖文件
```
**执行效果：**
- `clean -a` 或 `clean --all`：清空 `cliHome` 目录下所有内容
- `clean -d` 或 `clean --dep`：仅清空 `cliHome/dependencies` 目录
- 如果目录不存在，输出"文件夹不存在"提示
---

## 二、全局选项
### `--debug` - 调试模式
**使用方式：**
```bash
imooc-cli <command> --debug
```
**执行效果：**
- 开启详细日志输出（`LOG_LEVEL=verbose`）
- 错误时显示完整堆栈信息
---

## 三、默认行为
未输入任何命令时：
```bash
imooc-cli
```
- 输出帮助信息（`program.outputHelp()`）
---
## 四、命令执行机制
所有命令（除 `learn`、`add`、`clean`）都通过 `execCommand` 函数统一执行：
1. **检查包路径**：如果指定了 `--packagePath`，使用自定义路径
2. **包管理**：自动安装/更新对应 npm 包（`@imooc-cli/xxx`）
3. **执行入口**：通过 `node -e` 执行包的入口文件
4. **参数传递**：将配置和命令行参数传入执行
---

## 五、完整示例

```bash
# 查看课程信息
imooc-cli learn

# 初始化 React 项目（强制覆盖）
imooc-cli init react --force

# 正式发布项目（使用 cnpm）
imooc-cli publish --prod --cnpm --sshUser deploy --sshIp 10.0.0.5 --sshPath /data/app

# 清空所有缓存
imooc-cli clean -a

# 调试模式执行 init
imooc-cli init --debug
```
