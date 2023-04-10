# 贡献指南

感谢你对 miru-project/miru-next 的兴趣和支持！我们欢迎任何人为这个项目做出贡献，无论是提交 bug 报告、功能建议、代码改进、文档完善，还是其他形式的帮助。请遵循以下指南，以便我们能够更高效地协作和沟通。

## 提交问题

如果你在使用 miru-project/miru-next 时遇到了问题，或者有任何想法和建议，你可以在 [GitHub Issues](https://github.com/miru-project/miru-next/issues) 上提交一个 issue。在提交之前，请先搜索一下是否已经有类似的 issue 存在，以避免重复。如果没有找到相关的 issue，你可以创建一个新的 issue，并提供以下信息：

- 问题的标题和描述
- 问题发生的环境（浏览器、操作系统、网络等）
- 问题重现的步骤
- 期望的结果和实际的结果
- 如果可能，附上截图或录屏

请尽量使用清晰、简洁、规范的语言描述你的问题，这样可以帮助我们更快地理解和解决问题。

## 提交代码

如果你想为 miru-project/miru-next 贡献代码，你可以按照以下步骤进行：

- Fork 这个仓库到你自己的 GitHub 账号下
- 克隆你 fork 的仓库到本地
- 在本地创建一个新的分支，并进行代码修改
- 推送你的分支到你的远程仓库
- 在 GitHub 上创建一个 pull request，请求将你的分支合并到主分支
- 等待代码审查和反馈

在编写代码时，请注意以下几点：

- 遵循项目的代码风格和规范
- 尽量保持代码简洁、可读、可维护
- 尽量避免引入不必要的依赖或冗余的代码
- 尽量添加适当的注释和文档
- 尽量编写测试用例并保证代码覆盖率
- 在提交 pull request 时，请描述清楚你修改了什么，为什么要修改，以及如何测试你的修改

我们会尽快审查你的 pull request，并给出反馈或建议。如果一切顺利，我们会合并你的 pull request，并感谢你对 miru-project/miru-next 的贡献。

## 如何命名一个新的分支

你需要知道你想干什么，功能优化？性能提升？代码风格规范？新功能？它们都对应着它们自己的命名规范。我在这里列举几个常用的

- feat：新功能（feature）
- fix：修复 bug，可以是 QA 发现的 BUG，也可以是研发自己发现的 BUG。
- docs：文档（documentation）
- style：格式（不影响代码运行的变动）
- refactor：重构（即不是新增功能，也不是修改 bug 的代码变动）
- perf：优化相关，比如提升性能、体验
- test：增加测试
- chore：构建过程或辅助工具的变动
- revert：回滚到上一个版本
- merge：代码合并
- sync：同步主线或分支的 Bug

比如我想加一个新功能，那么这个分支取名应该为：`feat/a-new-feature`

## Pull Request 规范

当你进行 Pull Request 的时候，你需要提出你的修改带来的影响是什么，我们需要注意代码中什么东西，这些影响会带来什么后果（好的或坏的）

你的标题需要按照你的分支名来描写，格式为 `<type>(<scope>): <subject>`

- type 用于说明修改类别，类别请查看上文
- scope 用于说明 commit 影响的范围，如果你的修改涉及到一个全新的模块，则不需要填写。但是全新的模块我们将会建议您先撰写 RFC 文档，经过讨论后可行才进行 PR，在此之前我们可能并不会合并您的代码。
- subject 是 PR 目的的简短描述，语言随意，中国人用中文描述问题能更清楚一些，但结尾不加句号或其他标点符号

> 如 `feat/posts-options`，则标题为：`feat(posts): more options for posts` 或 `feat(posts): 更多的文章管理选项`。社区管理员会按照您的修改大小来区分是否为 breaking change

如果你的代码还缺乏部分尚未完成，请你点击 Draft Pull Request，而不是 Open Pull Request

## 参与讨论

如果你想与 miru-project/miru-next 的开发者和用户交流，你可以在 [GitHub Discussions](https://github.com/miru-project/miru-next/discussions) 上参与讨论。这里是一个开放、友好、尊重的平台，你可以提出问题、分享经验、提供反馈、寻求帮助、讨论想法等等。请注意遵守社区规范，不要发布任何不恰当、不礼貌、不尊重、不友好或不相关的内容。

## 其他方式

除了以上提到的方式外，你除了以上提到的方式外，你还可以通过以下方式为 miru-project/miru-next 做出贡献：

- 在你的社交媒体上推荐或分享 miru-project/miru-next
- 在你的博客或网站上写一篇关于 miru-project/miru-next 的文章或教程
- 在你的朋友或同事中推广或介绍 miru-project/miru-next
- 在你的项目中使用或集成 miru-project/miru-next
- 给 miru-project/miru-next 的仓库点一个星星或者赞助我们

无论你选择哪种方式，我们都非常感谢你对 miru-project/miru-next 的支持和贡献！