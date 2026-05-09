/**
 * 管理动态下载的 npm 包 工具类
 */
const fs = require('fs');
const path = require('path');
// 增强版文件系统（支持递归创建目录等）
const fse = require('fs-extra');
// 高性能 npm 包安装工具
const npminstall = require('npminstall');
const log = require('./log');
const npm = require('./npm');
// 路径格式化工具
const formatPath = require('./formatPath');

// 是否使用官方 npm 源（false 表示使用私有/镜像源）
const useOriginNpm = false;
/**
 * Package 类
 * 1. 下载安装 ：通过 npminstall 将指定的 npm 包下载到本地
 * 2. 缓存管理 ：将包缓存到 storePath ，避免重复下载
 * 3. 版本管理 ：支持获取最新版本、检查更新
 * 4. 路径管理 ：提供包的入口文件路径，方便动态加载
 */
class Package {
  constructor(options) {
    log.verbose('options', options);
    // 目标安装路径
    this.targetPath = options.targetPath;
    // 缓存存储路径（npm 包的缓存目录）
    this.storePath = options.storePath;
    // 包名
    this.packageName = options.name;
    // 包版本
    this.packageVersion = options.version;
    // 处理 scoped 包名，将 npm 包名中的 / 替换为 _ ，是因为文件系统路径不能直接包含 / 。
    this.npmFilePathPrefix = this.packageName.replace('/', '_');
  }
  /**
   * 作用 ：计算 npm 包在本地缓存中的完整路径。
   * 路径格式 ： storePath/_包名@版本@包名
   */
  get npmFilePath() {
    return path.resolve(this.storePath, `_${this.npmFilePathPrefix}@${this.packageVersion}@${this.packageName}`);
  }

  // 安装前的准备工作——创建必要目录，并获取最新版本号。
  async prepare() {
    // 确保目标目录存在
    if (!fs.existsSync(this.targetPath)) {
      // 递归创建目录（包括父目录）
      fse.mkdirpSync(this.targetPath);
    }
    // 确保缓存目录存在
    if (!fs.existsSync(this.storePath)) {
      fse.mkdirpSync(this.storePath);
    }
    // 打印路径信息
    log.verbose(this.targetPath);
    log.verbose(this.storePath);
    // 获取该包的最新版本号
    const latestVersion = await npm.getLatestVersion(this.packageName);
    log.verbose('latestVersion', this.packageName, latestVersion);
    if (latestVersion) {
      this.packageVersion = latestVersion;
    }
  }
  // 安装指定的 npm 包
  async install() {
    // 先执行准备工作
    await this.prepare();
    return npminstall({
      root: this.targetPath, // 安装根目录
      storeDir: this.storePath, // 缓存目录
      registry: npm.getNpmRegistry(useOriginNpm), // npm 仓库地址
      pkgs: [{
        name: this.packageName,
        version: this.packageVersion,
      }],
    });
  }
  // 检查指定版本的包是否已存在于本地缓存。
  async exists() {
    await this.prepare(); // 确保版本号已更新
    return fs.existsSync(this.npmFilePath); // 检查缓存中是否已存在该包
  }
  // 读取 npm 包的 package.json 内容。
  getPackage(isOriginal = false) {
    if (!isOriginal) {
      // 读取缓存中该包的 package.json
      return fse.readJsonSync(path.resolve(this.npmFilePath, 'package.json'));
    }
    // 读取原始 storePath 下的 package.json（用于特殊场景）
    return fse.readJsonSync(path.resolve(this.storePath, 'package.json'));
  }
  // 获取包的入口文件路径（如 lib/index.js ），并格式化路径（处理 Windows 路径等）。
  getRootFilePath(isOriginal = false) {
    const pkg = this.getPackage(isOriginal);
    if (pkg) {
      if (!isOriginal) {
        // 返回包的入口文件路径（从 package.json 的 main 字段获取）
        return formatPath(path.resolve(this.npmFilePath, pkg.main));
      }
      return formatPath(path.resolve(this.storePath, pkg.main));
    }
    return null;
  }
  // 获取当前本地安装的包版本号
  async getVersion() {
    await this.prepare();
    return await this.exists() ? this.getPackage().version : null;
  }
  // 获取 npm 仓库上可用的最新版本号（基于 semver 规范）
  async getLatestVersion() {
    const version = await this.getVersion();
    if (version) {
      const latestVersion = await npm.getNpmLatestSemverVersion(this.packageName, version);
      return latestVersion;
    }
    return null;
  }
  // 将包更新到最新版本
  async update() {
    const latestVersion = await this.getLatestVersion();
    return npminstall({
      root: this.targetPath,
      storeDir: this.storePath,
      registry: npm.getNpmRegistry(useOriginNpm),
      pkgs: [{
        name: this.packageName,
        version: latestVersion,
      }],
    });
  }
}

module.exports = Package;
/**
当 CLI 工具需要 动态加载插件或模板 时，就可以用这个类来管理依赖的下载和更新

const pkg = new Package({
  targetPath: '/tmp/plugins',
  storePath: '/Users/user/.cli/cache',
  name: '@vue/cli',
  version: 'latest'
});

await pkg.install();           // 安装包
const entry = pkg.getRootFilePath();  // 获取入口文件
require(entry);               // 动态加载
*/
