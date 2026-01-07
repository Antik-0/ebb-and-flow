---
tags: ['node', '杂谈']
---

# Node 版本管理

::page-meta
::

`Github` 上星标前三的 `node` 版本管理工具如下：

- [nvm](https://github.com/nvm-sh/nvm)
- [nvm - window](https://github.com/coreybutler/nvm-windows)
- [fnm](https://github.com/Schniz/fnm)

## fnm

`fnm` 是一个 `shell` 工具，因此可以通过各平台的命令行工具进行安装，详见[官网](https://github.com/Schniz/fnm?#Installation)。

### 安装(windows)

我的开发环境是 `windows` 平台，并且选择的是 `PowerShell` 工具，如果通过 `windows` 自带的包管理工具 - `winget`，可以通过如下命令进行安装。

```shell
winget install Schniz.fnm
```

不过我这里是直接选择下载[发行版](https://github.com/Schniz/fnm/releases)，其解压后只有一个 `.exe` 文件。

然后，需要将 `.exe` 文件添加在 `环境变量` 中，如果是通过命令行安装的，需要自行查找下可执行文件的路径。

### shell 配置

接着，需要配置 `PowerShell` 进行安装，将以下内容添加到 `PowerShell` 的配置文件中，目的是每次打开 `PowerShell` 都会自动运行下述命令，如果不进行这步配置，那么每次打开 `PowerShell` 运行 `fnm` 相关命令都会提示缺少 `env` 变量。

```shell
fnm env --use-on-cd --shell power-shell | Out-String | Invoke-Expression
```

在 `PowerShell` 中可以运行如下命令直接打开 `shell` 配置文件。

```shell
# 打开配置文件
notepad $profile
```

如果提示未找到文件路径，则需要创建一个配置文件，然后保存上述脚本命令。

```shell
# 查看配置文件路径
$profile

# 创建配置文件
New-Item -Path $PROFILE -ItemType File -Force
```

### shell 权限

上述 `shell` 配置文件实际上是添加了一个脚本命令，如果重新启动 `PowerShell`，出现下述提示：

```shell
无法加载文件 ~\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1，因为在此系统上禁止运行脚
本。有关详细信息，请参阅 https:/go.microsoft.com/fwlink/?LinkID=135170 中的 about_Execution_Policies
```

此时需要修改 `PowerShell` 的执行策略，只需执行如下命令即可，具体可见[微软官网](https://learn.microsoft.com/zh-cn/powershell/module/microsoft.powershell.core/about/about_execution_policies?view=powershell-7.4)

```shell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### fnm 常用命令

这里列出几个常用命令，[命令使用文档](https://github.com/Schniz/fnm/blob/master/docs/commands.md)。

```shell
# 查看 node 远程所有可用版本
fnm list-remote

# 查看本地安装的 node 版本列表
fnm list

# 安装 node 具体版本
fnm install v20.16.0

# 安装 node v20 最新版
fnm install 20

# 通过版本号切换 node 版本
fnm use v20

# 设置别名
fnm alise v20.16.0 prod

# 通过别名切换 node 版本
fnm use prod

# 卸载 node 版本
fnm uninstall v20

# 查看 fnm 配置
fnm env
```

### fnm 配置

在使用之前可以配置一下 `node` 的安装目录，只需要修改配置文件中的环境变量即可，这里我选择放到 `document` 文件中，方便管理。

```shell
$env:FNM_DIR = "C:\Users\Antik\Documents\fnm"
fnm env --use-on-cd --shell power-shell | Out-String | Invoke-Expression
```

为了使用方便，可以将某个版本设置为 `default`，命令如下：

```shell
fnm default v20
```

::custom-block{title='TIP'}
如果习惯了使用 `CMD` 命令工具，则可以将安装目录中的某个 `node` 版本添加到环境变量中，这样就可以在 `CMD` 中执行 `node npm` 等命令了。

推荐将 `~\aliases\default` 这个默认版本添加到环境变量中。
::

### fnm 特性

`fnm` 有一个很方便的特性：可以根据项目配置，自动检测和切换 `node` 版本。

比如本地安装了 `v18/v20` 两个版本，同时项目配置了 `.node-version` 文件锁定了 `node` 版本为 `v20`，那么 `fnm` 可以自动切换到 `v20` 的 `node` 版本，如果本地没有安装 `v20` 版本，也会提示是否要进行安装。

## pnpm 配置

因为习惯了使用 `pnpm` 管理器，所以在此处记录下 `pnpm` 的个人配置习惯，方便以后查阅。

`pnpm` 的默认配置文件位于：

```
~/AppData/Local/pnpm/config/rc
```

修改 `pnpm` 缓存，安装目录，命令如下：

```shell
pnpm config set cache-dir "C:\Users\Antik\Documents\pnpm\cache"
pnpm config set global-dir "C:\Users\Antik\Documents\pnpm\global"
pnpm config set global-bin-dir "C:\Users\Antik\Documents\pnpm"

# 查看修改配置
pnpm config list
```
