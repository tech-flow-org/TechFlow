# 🤖 DrawingBoard

<!-- ciRelease -->

[ci-release-shield]: https://github.com/AI-flow-task/drawing-board/workflows/Release/badge.svg
[ci-release-url]: https://github.com/AI-flow-task/drawing-board/actions/workflows/release.yml

[https://drawing-board.antdigital.dev/](https://drawing-board.antdigital.dev/)

## 产品概述

💡 通过拖拽来构建自己的 AI 工作流。

- 界面美观：采用了精心设计的用户界面，使用户能够轻松地使用系统的各项功能。界面布局清晰，图形元素和颜色搭配和谐，提供直观的导航和操作。
- 多模型支持：除了支持 LLM（Language Model）外，还具备集成和支持其他多种模型的能力。开发人员可以按照一套规范将其他任意模型服务接入系统，扩展系统的功能范围，满足用户的不同需求。
- 灵活的集成能力：提供了一套标准的接口和规范，使开发人员能够轻松地集成其他任意服务。这极大地增强了系统的灵活性和可扩展性，使其能够适应各种不同的应用场景和模型需求。
- 强大的 SDK 支持：提供了全面的软件开发工具包（SDK），使开发人员能够将生成的工作流轻松地集成到现有系统中。不论是命令行界面（CLI）还是服务端应用，SDK 都提供了丰富的接口和功能，简化了整合流程，加快了系统的部署和应用。

愿景： 将 AI 能力作为一个模块嵌入到现有的功能，为业务带来更强的竞争力。

## 竞品

### AI Builder

功能强大，界面可靠，偏专业的算法开发同学，门槛很高。上限比较高，但是下限也很低。 [AI Builder 概述 - AI Builder](https://learn.microsoft.com/zh-cn/ai-builder/overview)

### Questflow

功能强大支持各种节点，界面也比较美观，开发门槛中等，做的是自动化的工作流，不支持集成，定位是一个个人工具。 [Questflow: Build AI agents for workflow automation with no-code](https://www.questflow.ai/)

### flowiseai

功能比较羸弱，只支持 LLM ，是个比较好的玩具，也是市面上最多的一种任务流模式。 [FlowiseAI - Build LLMs Apps Easily](https://flowiseai.com/?continueFlag=9406bc0089954e011896dda1a8ac4d07)

## 快速开始

```shell
git clone git@github.com:AI-flow-task/drawing-board.git
pnpm i
pnpm run dev
```

看到这样的界面就是启动成功了：

![image.png](https://cdn.nlark.com/yuque/0/2023/png/84868/1688886273722-908f713a-b17b-471b-bd3a-f75dabe142f5.png#averageHue=%23b8b8b8&clientId=u65d7d55a-2098-4&from=paste&height=757&id=u66b76309&originHeight=1514&originWidth=2660&originalType=binary&ratio=2&rotation=0&showTitle=false&size=523421&status=done&style=none&taskId=u08001f71-8137-4135-be29-5bcaf01f5bf&title=&width=1330)

### 环境变量

如果要完美运行，需要配置两个环境变量:

#### OPENAI_API_KEY

访问 openai 的服务需要想用的 token key，OPENAI_API_KEY 可以配置为自己的 key。

#### OPENAI_PROXY_URL

由于 openai 的封禁问题，国内使用一般会有问题，OPENAI_PROXY_URL 可以配置为一个代理地址，openai 的请求会被转发到 OPENAI_PROXY_URL。

```shell
export OPENAI_PROXY_URL=https://my.openai.com
```

#### API_END_PORT_URL

AI 环境在本地有可能搭建成本太高，API_END_PORT_URL 可以将本地的服务映射到相应的服务端。

```shell
export API_END_PORT_URL=https://drawing-board.antdigital.dev
```

## 使用指南

### 现有功能

- 任务流编排
- 角色管理
- 任务流运行

### 任务流编排

任务流编排用于设置自己的任务流，基于任务节点来编排出自己的 AI 工作流，接下来我们用一个运营活动来作为例子。

首先我们新建一个任务流：

![image.png](https://cdn.nlark.com/yuque/0/2023/png/84868/1688827736559-bf302883-58eb-4f7a-a256-fff377f00f2f.png#averageHue=%23f0f0f0&clientId=u12cefbde-3aa4-4&from=paste&height=703&id=u52f0daf2&originHeight=1406&originWidth=2616&originalType=binary&ratio=2&rotation=0&showTitle=false&size=263006&status=done&style=shadow&taskId=uc31bcc5c-cce3-4e87-b63d-8dfb463d0f4&title=&width=1308)

我们先来认识一下内置的节点:

- 📝 文本节点 - 作为输入数据来获取输入数据
- 🤖 AI 节点 - 使用大模型来处理数据，默认是 chatgpt
- 🧑‍🎨 文生图节点 - 调用 SD 来生成图片
- 🔗 网络节点 - 将数据发送给某个服务器

#### 文本节点

文本节点一般作为项目得开始，用于获取输入数据。一个文本节点代表一个必填的输入，在运行时会作为节点得前置条件。

![image.png](https://cdn.nlark.com/yuque/0/2023/png/84868/1688828001415-85282626-6da0-41bb-bdd4-874b760a184b.png#averageHue=%23f9f9f9&clientId=u12cefbde-3aa4-4&from=paste&height=170&id=u14cf2de3&originHeight=339&originWidth=1131&originalType=binary&ratio=2&rotation=0&showTitle=false&size=24680&status=done&style=shadow&taskId=u6322b0f5-aa9f-4f0c-bd4e-8a7b895190c&title=&width=565.5)

#### AI 节点

AI 节点是调用大模型的数据的，我们可以输入角色设定 和 提示词。

![image.png](https://cdn.nlark.com/yuque/0/2023/png/84868/1688827876647-ff2ea090-67d5-4fbb-8d12-52d65568e015.png#averageHue=%23f8f8f8&clientId=u12cefbde-3aa4-4&from=paste&height=768&id=ue5ab07c1&originHeight=1535&originWidth=1106&originalType=binary&ratio=2&rotation=0&showTitle=false&size=127719&status=done&style=shadow&taskId=u7757c947-d22a-4ebf-a9c7-204f04d5457&title=&width=553)

角色设定可以由 角色管理中设置，我们可以通过快捷方式注入。

![image.png](https://cdn.nlark.com/yuque/0/2023/png/84868/1688828812264-ce0679c5-83d0-471f-8fbf-1ca07606d480.png#averageHue=%23c0bfbf&clientId=u12cefbde-3aa4-4&from=paste&height=751&id=u836a146b&originHeight=1501&originWidth=1737&originalType=binary&ratio=2&rotation=0&showTitle=false&size=295237&status=done&style=shadow&taskId=ueb7c6276-ced1-4c1d-bed7-4af02b60fd6&title=&width=868.5)

这里我们选择[文案专员]

![image.png](https://cdn.nlark.com/yuque/0/2023/png/84868/1688828867176-5be92565-c423-4e28-a432-acaa8ccbe8a2.png#averageHue=%23f4f4f4&clientId=u12cefbde-3aa4-4&from=paste&height=488&id=ud6921305&originHeight=975&originWidth=1083&originalType=binary&ratio=2&rotation=0&showTitle=false&size=139225&status=done&style=shadow&taskId=u50f0ae29-deaa-4bc7-af6b-f767a843f0d&title=&width=541.5) 在运行输入中我们可以输入一写提示词，我们也可以 输入` {var--name}` 来从别的节点获取输入。输入完成后可以点击设定来让输入生效。这里我们使用 `请根据 {input} 节气生成相关的节日文案` 现在我们就可以看到一个圆圈锚点，我们可以将别的节点输出与他相联。

![image.png](https://cdn.nlark.com/yuque/0/2023/png/84868/1688829006385-c94125fa-fdcc-4f96-aee8-ed3d1bf9d2b0.png#averageHue=%23f1f1f1&clientId=u12cefbde-3aa4-4&from=paste&height=565&id=uc75b5606&originHeight=1129&originWidth=1386&originalType=binary&ratio=2&rotation=0&showTitle=false&size=200998&status=done&style=none&taskId=ua598113b-ad4c-498a-8221-8743f6481b2&title=&width=693) 效果看起来是这样的

![image.png](https://cdn.nlark.com/yuque/0/2023/png/84868/1688829057843-caf41646-abb3-4a2b-b5b7-c702a274f7ac.png#averageHue=%23f4f4f4&clientId=u12cefbde-3aa4-4&from=paste&height=560&id=u07258938&originHeight=1119&originWidth=2322&originalType=binary&ratio=2&rotation=0&showTitle=false&size=232114&status=done&style=none&taskId=u83a1ec61-dfb3-483d-b54b-9d51e69eee8&title=&width=1161)

接下来我们就可以运行节点来查看效果。

![image.png](https://cdn.nlark.com/yuque/0/2023/png/84868/1688829116585-554f1d6d-0ca3-4211-95e6-37c990be4357.png#averageHue=%23f1f1f1&clientId=u12cefbde-3aa4-4&from=paste&height=498&id=udb406823&originHeight=996&originWidth=1253&originalType=binary&ratio=2&rotation=0&showTitle=false&size=172848&status=done&style=none&taskId=u229077c3-7c01-49fc-95c1-b4174a37880&title=&width=626.5) 运行中的节点会有执行中的效果，我们可以运行结果中预览生成的内容，我们也看到了在运行结果旁边出现了一个锚点，我们可以将这个输出作为下一个节日的输入。多项输入与单项基本相同，可以自己尝试试试。

#### 文生图节点

文生图节点用于调用 stable diffusion 来根据提示词生成图片。

![image.png](https://cdn.nlark.com/yuque/0/2023/png/84868/1688829344380-9eb9a956-6ee9-43eb-8ab2-d68bfddc1445.png#averageHue=%23f6f6f6&clientId=u1aaddb19-def6-4&from=paste&height=521&id=ua2776f13&originHeight=1042&originWidth=1128&originalType=binary&ratio=2&rotation=0&showTitle=false&size=83498&status=done&style=none&taskId=uacad64f8-3875-495d-ac82-aa47f2f0f3c&title=&width=564) 我们可以用上次生成的文案来进行图片的绘制，由于 stable diffusion 对直接输入的文案效果不是很好，我们可以在中间再加一个节点来生成相应的提示词。效果看起来是这样的：

![image.png](https://cdn.nlark.com/yuque/0/2023/png/84868/1688829608201-0e597bdd-1385-4fea-8f88-0e2dd40a5f38.png#averageHue=%23f1f1f1&clientId=u1aaddb19-def6-4&from=paste&height=576&id=u74c87186&originHeight=1151&originWidth=2667&originalType=binary&ratio=2&rotation=0&showTitle=false&size=411284&status=done&style=none&taskId=ub8522750-b4a6-42b0-a651-55e682a3d65&title=&width=1333.5) 接下来我们就可以执行节点来查看效果啦，我们可以做一些提示词的增加和修改来固定生成的图片风格。

#### 网络节点

基于以上的步骤我们已经完成了一个运营任务的基本工作，接下来我们需要与外界的系统交互，我们可以靠网络节点来将数据发送到指定的服务端。

![image.png](https://cdn.nlark.com/yuque/0/2023/png/84868/1688830635586-a5f12f52-fda6-424f-8103-2782c1f7d231.png#averageHue=%23f5f5f5&clientId=u1aaddb19-def6-4&from=paste&height=358&id=JiRZ4&originHeight=716&originWidth=837&originalType=binary&ratio=2&rotation=0&showTitle=false&size=53646&status=done&style=none&taskId=u89c99643-ac92-4e96-89ea-2fbcfda306f&title=&width=418.5) 网络节点可以输入两个参数，网络地址 和 请求的参数字段。项目默认提供了一个服务用作测试，我们可以在命令行执行 `node .\test.serve.js` 来打开服务。

![image.png](https://cdn.nlark.com/yuque/0/2023/png/84868/1688830717909-c3502148-6b29-4951-b83c-e675086a3c74.png#averageHue=%230a0909&clientId=uf23f2515-e8ac-4&from=paste&height=92&id=u75409ed2&originHeight=184&originWidth=644&originalType=binary&ratio=2&rotation=0&showTitle=false&size=15509&status=done&style=none&taskId=u8a28947b-3dd5-413b-adee-79782f0c82c&title=&width=322)

然后我们将文生图节点和文案节点进行连接。

![image.png](https://cdn.nlark.com/yuque/0/2023/png/84868/1688830780792-8b03d8f0-2263-4668-be1b-42cb9e1e0efc.png#averageHue=%23f2f2f2&clientId=uf23f2515-e8ac-4&from=paste&height=680&id=u00ce45c2&originHeight=1359&originWidth=1673&originalType=binary&ratio=2&rotation=0&showTitle=false&size=316478&status=done&style=none&taskId=uf5530bfc-9812-4e80-982b-eb9384aa449&title=&width=836.5) 然后我们就可以看到网络节点的返回结果。

![image.png](https://cdn.nlark.com/yuque/0/2023/png/84868/1688830859656-044e6984-53b3-4ea2-9c34-33054f203c6e.png#averageHue=%23f5f5f5&clientId=uf23f2515-e8ac-4&from=paste&height=302&id=ud4fea316&originHeight=604&originWidth=900&originalType=binary&ratio=2&rotation=0&showTitle=false&size=54544&status=done&style=none&taskId=u4cf466d8-b232-4775-b406-f7c48b37fa8&title=&width=450)

在命令行中也会输出发起的请求参数。

![image.png](https://cdn.nlark.com/yuque/0/2023/png/84868/1688830881983-bc90290d-c81f-4207-82aa-826bf0979c08.png#averageHue=%23040404&clientId=uf23f2515-e8ac-4&from=paste&height=299&id=ub8b38932&originHeight=598&originWidth=2390&originalType=binary&ratio=2&rotation=0&showTitle=false&size=161869&status=done&style=none&taskId=u4b41ab5f-ace6-498e-8ddd-28b8b822fbc&title=&width=1195)

#### 执行所有任务

完成任务流编排之后我们可以通过顶部的 运行 来进行执行整个任务流。

![image.png](https://cdn.nlark.com/yuque/0/2023/png/84868/1688830974915-9c235f25-5f38-4a55-80da-6593b08b39a0.png#averageHue=%23f0f0f0&clientId=uf23f2515-e8ac-4&from=paste&height=703&id=u845e05ec&originHeight=1406&originWidth=2616&originalType=binary&ratio=2&rotation=0&showTitle=false&size=391792&status=done&style=none&taskId=ue099b940-924e-4f40-ae9c-c622a8ea1bd&title=&width=1308) 点击之后效果如下，任务流会依次执行。

![image.png](https://cdn.nlark.com/yuque/0/2023/png/84868/1688830952806-1cecb967-4f36-403c-afcf-ea1160353b2a.png#averageHue=%23f0f0f0&clientId=uf23f2515-e8ac-4&from=paste&height=703&id=uddf2c8f6&originHeight=1406&originWidth=2616&originalType=binary&ratio=2&rotation=0&showTitle=false&size=398293&status=done&style=none&taskId=u279aa6c3-77e5-4441-8638-04a2f0b4605&title=&width=1308)

我们也可以点击底部来查看统一的看日志。

![image.png](https://cdn.nlark.com/yuque/0/2023/png/84868/1688831054908-ec8688fd-109a-4f82-a213-109551c20eb5.png#averageHue=%23f0f0f0&clientId=uf23f2515-e8ac-4&from=paste&height=703&id=u15f42738&originHeight=1406&originWidth=2616&originalType=binary&ratio=2&rotation=0&showTitle=false&size=391882&status=done&style=none&taskId=u36b902f1-968e-4b92-bdad-f2d8e380f24&title=&width=1308) 这里会展示每个节点的运行状态和结果，并且可以随时修改输入节点的数值。

![image.png](https://cdn.nlark.com/yuque/0/2023/png/84868/1688831105965-830026e0-a9aa-4a09-b74a-87afd447aa18.png#averageHue=%23fbfbfb&clientId=uf23f2515-e8ac-4&from=paste&height=490&id=u7cc157fc&originHeight=979&originWidth=1966&originalType=binary&ratio=2&rotation=0&showTitle=false&size=93538&status=done&style=none&taskId=u0a3a89e7-6f1d-4f6a-8672-b2b637f5d10&title=&width=983)

#### 导出

我们可以在任务流编排的右上角点击导出生成一个 yaml 文件。

![image.png](https://cdn.nlark.com/yuque/0/2023/png/84868/1688831980362-d462bc56-63dd-4067-8cd9-39796372ebdf.png#averageHue=%23efe5e4&clientId=uf23f2515-e8ac-4&from=paste&height=161&id=u0eeb1e10&originHeight=322&originWidth=688&originalType=binary&ratio=2&rotation=0&showTitle=false&size=46312&status=done&style=none&taskId=uab6e1c77-5dd1-4398-bde7-7897ecdf8ea&title=&width=344) 我们可以 vscode 来查看内容。

![image.png](https://cdn.nlark.com/yuque/0/2023/png/84868/1688832028176-b85f294a-8b53-4b33-932c-09b8659242ae.png#averageHue=%23e3d4a6&clientId=uf23f2515-e8ac-4&from=paste&height=140&id=u0ea86b82&originHeight=280&originWidth=1289&originalType=binary&ratio=2&rotation=0&showTitle=false&size=54458&status=done&style=none&taskId=u5fa8f674-67f1-408e-be57-2aaa2634f8b&title=&width=644.5)

#### 导入

我们可以在右上角点击操作，选择导入。

![image.png](https://cdn.nlark.com/yuque/0/2023/png/84868/1688832069282-ed731463-3082-476d-9486-084f7905e222.png#averageHue=%23fb4c34&clientId=uf23f2515-e8ac-4&from=paste&height=142&id=u0536efb7&originHeight=283&originWidth=602&originalType=binary&ratio=2&rotation=0&showTitle=false&size=32836&status=done&style=none&taskId=uf297df77-bcd0-495b-ba16-d9e52151fed&title=&width=301)

这时候会弹出一个弹框，我们可以选择输入相应的 yaml 配置

![image.png](https://cdn.nlark.com/yuque/0/2023/png/84868/1688832114574-be649f33-7658-4b5a-8b5f-659ea44d870c.png#averageHue=%23cecece&clientId=uf23f2515-e8ac-4&from=paste&height=467&id=u1ad24d03&originHeight=934&originWidth=1826&originalType=binary&ratio=2&rotation=0&showTitle=false&size=121118&status=done&style=none&taskId=u06505895-f9bf-46bc-b8b8-2bf19158175&title=&width=913) 我们也可以选择文件来导入

![image.png](https://cdn.nlark.com/yuque/0/2023/png/84868/1688832147455-a908e71a-11ca-4007-9891-f15bd9f036d8.png#averageHue=%23b5b5b5&clientId=uf23f2515-e8ac-4&from=paste&height=703&id=u8cb8179d&originHeight=1406&originWidth=2616&originalType=binary&ratio=2&rotation=0&showTitle=false&size=270393&status=done&style=none&taskId=udfc725b1-2538-4e30-8258-e183aaa01e8&title=&width=1308) 选中文件会展示一个预览。

![image.png](https://cdn.nlark.com/yuque/0/2023/png/84868/1688832183546-ec76b2e3-6737-4123-a648-b377433cad2f.png#averageHue=%23bcbcbc&clientId=uf23f2515-e8ac-4&from=paste&height=703&id=u2ce76293&originHeight=1406&originWidth=2616&originalType=binary&ratio=2&rotation=0&showTitle=false&size=306650&status=done&style=none&taskId=u087aabde-24a7-47bf-8973-db69823fb44&title=&width=1308)

导入成功之后会修改当前打开的任务流。

![image.png](https://cdn.nlark.com/yuque/0/2023/png/84868/1688832217831-1ccf9b94-9ada-4263-a62f-828d30a3cae9.png#averageHue=%23f2f2f2&clientId=uf23f2515-e8ac-4&from=paste&height=703&id=uca1fc475&originHeight=1406&originWidth=2616&originalType=binary&ratio=2&rotation=0&showTitle=false&size=411742&status=done&style=none&taskId=u2642abb6-e100-4f2e-a9cc-729a1e557e0&title=&width=1308)

### 角色管理

角色管理勇于管理 AI 节点的角色设定，帮助我们快速设定一些常见的角色。

![image.png](https://cdn.nlark.com/yuque/0/2023/png/84868/1688831574751-ea6f16f0-89d0-43c4-b356-723ae9a2fd0d.png#averageHue=%23f3f3f3&clientId=uf23f2515-e8ac-4&from=paste&height=703&id=u705b399c&originHeight=1406&originWidth=2616&originalType=binary&ratio=2&rotation=0&showTitle=false&size=355905&status=done&style=none&taskId=ud4ab90d6-e507-4abe-9d17-58853f342cb&title=&width=1308) 我们可以点击一个角色来查看设定：

![image.png](https://cdn.nlark.com/yuque/0/2023/png/84868/1688831612591-8bc9cc2d-d867-4e16-8515-d1da7f4b6ec2.png#averageHue=%23969696&clientId=uf23f2515-e8ac-4&from=paste&height=703&id=ud1f746c9&originHeight=1406&originWidth=2616&originalType=binary&ratio=2&rotation=0&showTitle=false&size=447189&status=done&style=none&taskId=u136cb293-86d5-4c64-8a03-d32bbb80c8b&title=&width=1308)

我们也可以在查看更多的中看到所有的角色，并且进行的管理。

![image.png](https://cdn.nlark.com/yuque/0/2023/png/84868/1688831654215-0627d7ef-1282-4eb6-b551-03310c2cdb7a.png#averageHue=%23f3f3f3&clientId=uf23f2515-e8ac-4&from=paste&height=703&id=udfb72a74&originHeight=1406&originWidth=2616&originalType=binary&ratio=2&rotation=0&showTitle=false&size=363383&status=done&style=none&taskId=u26755221-81f9-4ab1-bd7b-80eb65c6638&title=&width=1308)

![image.png](https://cdn.nlark.com/yuque/0/2023/png/84868/1688831692831-76a64dbd-b765-4363-a873-cfd61fdf3f8b.png#averageHue=%23efefef&clientId=uf23f2515-e8ac-4&from=paste&height=703&id=ufe5e6016&originHeight=1406&originWidth=2616&originalType=binary&ratio=2&rotation=0&showTitle=false&size=514571&status=done&style=none&taskId=u7a8e0379-6b5f-4b3e-92ff-ae3993b4b2a&title=&width=1308)

我们也可以新建角色来进行设定：

![image.png](https://cdn.nlark.com/yuque/0/2023/png/84868/1688831717810-5af53eab-b2d2-471b-abf6-7c763fb63bc4.png#averageHue=%23f6f6f6&clientId=uf23f2515-e8ac-4&from=paste&height=703&id=u4f3a5ff3&originHeight=1406&originWidth=2616&originalType=binary&ratio=2&rotation=0&showTitle=false&size=191818&status=done&style=none&taskId=u40d36590-ee9c-4e85-9a03-38ec5cbc968&title=&width=1308) 输入内容后新建即可

![image.png](https://cdn.nlark.com/yuque/0/2023/png/84868/1688831772008-504c7f24-19cb-40a0-8a5d-c59ca1ace99c.png#averageHue=%23f1f1f1&clientId=uf23f2515-e8ac-4&from=paste&height=703&id=u35804d4e&originHeight=1406&originWidth=2616&originalType=binary&ratio=2&rotation=0&showTitle=false&size=353279&status=done&style=none&taskId=u09d274df-4187-4061-959f-5c6e93f3314&title=&width=1308)

### 运行任务流

当我们新建完成任务流之后就不需要进行修改了，我们可以在运行任务流中进行使用。以我们刚才的 【新的任务流】为例。任务流会生成一个表单，输入完成点击下一步可以执行模型。

![image.png](https://cdn.nlark.com/yuque/0/2023/png/84868/1688831876546-8c350579-1950-4812-b221-25a6b47599e4.png#averageHue=%23bb9c77&clientId=uf23f2515-e8ac-4&from=paste&height=703&id=u6f3ab0f6&originHeight=1406&originWidth=2616&originalType=binary&ratio=2&rotation=0&showTitle=false&size=840628&status=done&style=none&taskId=uc9669e89-b082-4102-9fb2-1ecf5af9d7a&title=&width=1308) 执行中我们可以查看输入参数和输出结果。

![image.png](https://cdn.nlark.com/yuque/0/2023/png/84868/1688831927752-00efbeb7-fd7f-4734-b713-9cb217b2df3d.png#averageHue=%23c9bda9&clientId=uf23f2515-e8ac-4&from=paste&height=703&id=uab1ea5b8&originHeight=1406&originWidth=2616&originalType=binary&ratio=2&rotation=0&showTitle=false&size=1174712&status=done&style=none&taskId=u1f5bfdc5-541f-4b2b-aea9-93fe4c11515&title=&width=1308)

## 开发节点

节点是 AI-Flow 的核心功能。每个节点代表了一个能力，官方内置了一些节点，如果不能满足你的需求，你也可以自定义自己的节点，并且将其加入到画布中。

### 基本数据结构

以最简单的文本节点为例，我们可以我们实现了 `SymbolMasterDefinition`类型。它有一个泛型参数 ，用于表示节点数据的类型。接口包含了 defaultContent 属性，用于存储节点的默认数据，defaultContent 的值会默认注入到 content 中，之后编辑的数据会修改 content 对象。

```typescript
export const StringSymbol: SymbolMasterDefinition<StringNodeContent> = {
  id: 'string',
  title: '文本',
  description: '纯文本输入节点',
  // 节点列表中展示的头像
  avatar: '📝',
  // 默认数据
  defaultContent: { text: '' },
  // 定义内容的输入逻辑
  schema: {
    text: {
      type: 'input',
      title: '文本',
      valueContainer: false,
      component: 'InputArea',
      handles: {
        target: true,
      },
    },
  },
  // 拖动时的预览组件
  preview: Preview,
  // 最终的节点组件
  render: Render,
  // 如何执行这个节点
  run: async (node，action) => {
    return {
      type: 'text',
      output: node.text,
    };
  },
  // 执行结果如何展示
  outputRender: (output) => {
    return output;
  },
};
```

### run 函数

run 是节点的核心配置，也是负责实现具体能力的地方。run 需要接收一个返回 Promise 的函数，并在组件调用时注入三个参数：content、vars 和 action。以下是 run 函数的类型定义：

```typescript
type ActionType<Content> = {
  // 当前任务流实例
  flow: FlowStore;
  // 更新当前 节点 的 loading 的状态
  updateLoading: (loading: boolean) => void;
  // 当前节点实例
  node: IFlowBasicNode<Content>;
  // 停止的 AbortController 实例
  abortController?: AbortController;
  // 更新当前节点的参数
  updateParams: (params: Record<string, any>) => void;
  // 更新当前节点的输出
  updateOutput: (output: string) => void;
};

run: (content: Content, vars: Record<string, any>, options: ActionType<Content>) =>
  Promise<{
    type: 'img' | 'text';
    output: string;
  }>;
```

在 run 函数的实现中，您可以根据需要使用 content 参数来访问用户编辑过的当前节点的数据。vars 参数则可以用于获取存储在其他节点中的数据。此外，通过使用 options 参数，您可以方便地执行一些常用的快捷操作或进行相关处理。在处理流程中，连续调用 updateOutput 可以获取流中的数据，并通过调用 updateParams 来更新请求参数。这种设计有助于调试过程的进行，并便于保留必要的数据。

```typescript
run: async (node, vars, action) => {
    const prompts = genChatMessages({
      systemRole: node.systemRole,
      messages: node.input,
    });
    const request: LangChainParams = {
      llm: { model: 'gpt3.5-turbo', temperature: 0.6 },
      prompts,
      vars,
    };
    action.updateParams(request);
    let output = '';

    await fetchLangChain({
      params: request,
      onMessageHandle: (text) => {
        output += text;
        action.updateOutput({output,type:"text"});
      },
      onLoadingChange: (loading) => {
        action.updateLoading(loading);
      },
      // 支持从全局结束 fetch。
      abortController: action.abortController,
    });

    return {
      type: 'text',
      output,
    };
  },
```

如果没有流的操作，实现起来会简单好多。

```typescript
run: async (node, vars, { updateParams }) => {
  let data: Record<string, any> = {};
  Object.keys(JSON.parse(node.data)).forEach((key) => {
    data[key] = lodashGet(vars, key);
  });

  const params = { ...node, output: undefined, params: undefined, data: JSON.stringify(data) };

  updateParams(params);

  const res = (await fetchNetworkServe(params)) as unknown as {
    message: string;
  };

  return {
    type: 'text',
    output: JSON.stringify(res, null, 2),
  };
},
```

这里要注意的是，Promise 需要返回 type 和 output 来告诉组件如何处理数据和数据是什么。

### schema 节点输入配置

schema 用于配置节点的输入属性，会根据 schema 来生成有哪些输入，string 节点的 schema 如下：

```typescript
schema: {
    text: {
      // 类型输入节点
      type: 'input',
      // 参数的名称
      title: '文本',
      // 是否需要被 node 包裹，如果为 false 则不会有背景颜色
      valueContainer: false,
      // 需要渲染的组件类型
      component: 'Input',
      // 定义节点是否包含锚点
      handles: {
        target: true,
      },
    },
  },
```

这代表它只有一个输入参数，并且输入组件是个 input 的框。

![image.png](https://cdn.nlark.com/yuque/0/2023/png/84868/1689001526988-18dace08-f4aa-485a-ab3a-30dc251401f8.png#averageHue=%23f7f7f7&clientId=ud97daccb-a37f-4&from=paste&height=195&id=u16c137a8&originHeight=390&originWidth=1096&originalType=binary&ratio=2&rotation=0&showTitle=false&size=30053&status=done&style=none&taskId=u410e1356-f510-417b-8f9e-1c6c50d0877&title=&width=548) 当然我们也支持其他的一些输入组件：

- Input 输入框
- Segmented 多选
- InputArea 输入区域
- SystemRole 角色设定
- TaskPromptsInput 提示词设定

在 AI 节点中我们可以看到所有的示例。

![image.png](https://cdn.nlark.com/yuque/0/2023/png/84868/1689001646872-63808713-8687-4370-a0d0-e8684c66678f.png#averageHue=%23ededed&clientId=ud97daccb-a37f-4&from=paste&height=493&id=u0b33e492&originHeight=986&originWidth=1076&originalType=binary&ratio=2&rotation=0&showTitle=false&size=260678&status=done&style=none&taskId=ub858a367-6bb6-47ac-a7d6-fd786c505ac&title=&width=538) 相应的 schema 配置是这样的, Segmented 需要单独配置 options 来设置选项，别的配置大差不差。

```typescript
schema: {
  model: {
    type: "input",
    valueKey: ["llm", "model"],
    component: "Segmented",
    title: "模型",
    options: ALL_MODELS.map((model) => ({
      label: model.name,
      value: model.name,
    })),
    valueContainer: false,
  },
  systemRole: {
    type: "input",
    hideContainer: true,
    component: "SystemRole",
    title: "角色定义",
    valueContainer: false,
  },
  input: {
    type: "input",
    component: "TaskPromptsInput",
    title: "运行输入",
    // 不展示 Field 由自己管理
    hideContainer: true,
    valueContainer: false,
  },
};
```

### preview 预览组件

Preview 组件 拖拽的时候出现， 会给用户提供一个简单的预览界面来告诉用户自己的加入的是什么节点。

![image.png](https://cdn.nlark.com/yuque/0/2023/png/84868/1688995753145-46482ca6-2f00-49a5-8dda-240c714ea54b.png#averageHue=%23f6f6f6&clientId=u1b196c22-fa57-4&from=paste&height=310&id=u0cbdbc1c&originHeight=619&originWidth=1016&originalType=binary&ratio=2&rotation=0&showTitle=false&size=39403&status=done&style=none&taskId=u81f8f0de-ab97-4180-84d3-ce7838050c8&title=&width=508)

通常情况下，预览功能只需要提供一个名为 `React.FC<{id: string, type: string}>` 的 React 组件。编辑器会自动注入 id``和`type`这两个参数，其中`type `表示节点的类型也就是是节点的配置 id。在这里，我们强烈建议使用图片作为预览节点的最佳方式，这里有一个例子：

```typescript
export const StringSymbol: SymbolMasterDefinition<StringNodeContent> = {
  id: 'string',
  title: '文本',
  description: '纯文本输入节点',
  avatar: '📝',
  defaultContent: { text: '' },
  preview: ({ id, type }) => <Image src={`/image/${type}/string.png`} />,
  schema: {
    text: {
      type: 'input',
      title: '文本',
      valueContainer: false,
      component: 'InputArea',
      handles: {
        target: true,
      },
    },
  },
};
```

不设置 `preview` 的情况下的 Preview 会使用的 schema 的配置来生成一些只读的预览，比如上面的 schema 配置就会生成一个文本节点的预览。

![image.png](https://cdn.nlark.com/yuque/0/2023/png/84868/1688996933857-dcbfd805-3ae8-4692-a8c9-057bf2a4e216.png#averageHue=%23f8f8f8&clientId=ud97daccb-a37f-4&from=paste&height=165&id=uf0e875c3&originHeight=478&originWidth=1118&originalType=binary&ratio=2&rotation=0&showTitle=false&size=32631&status=done&style=none&taskId=u84736e43-bb15-4480-b89b-a5086c87582&title=&width=386) 如果你的输入数据一般，可以无需关心预览组件，不设置即可。

### render 节点运行

render 方法决定了组件在画布上的展示效果，它是最重要的一个方法。默认情况下，我们建议对该方法进行配置， AI 节点作为一个很好的例子的可以参考下实现。

```typescript
export const AITaskSymbol: SymbolMasterDefinition<AITaskContent> = {
  id: 'aiTask',
  title: 'AI节点',
  avatar: '🤖',
  description: '使用大模型处理任务',
  defaultContent: initAITaskContent,
  schema: {
    model: {
      type: 'input',
      valueKey: ['llm', 'model'],
      component: 'Segmented',
      title: '模型',
      options: ALL_MODELS.map((model) => ({
        label: model.name,
        value: model.name,
      })),
      valueContainer: false,
    },
    systemRole: {
      type: 'input',
      hideContainer: true,
      component: 'SystemRole',
      title: '角色定义',
      valueContainer: false,
    },
    input: {
      type: 'input',
      component: 'TaskPromptsInput',
      title: '运行输入',
      hideContainer: true,
      valueContainer: false,
    },
  },
  onCreateNode: (node, activeData) => {
    if (activeData?.source === 'agent') {
      const agent = activeData as unknown as ChatAgent;
      return createNode(
        node,
        createAITaskContent({
          llm: { model: 'gpt-3.5-turbo' },
          systemRole: agent.content,
        }),
        agent,
      );
    }
    return createNode(node, initAITaskContent, { title: 'AI 节点' });
  },
  run: async (node, vars, action) => {
    const prompts = genChatMessages({
      systemRole: node.systemRole,
      messages: node.input,
    });
    const request: LangChainParams = {
      llm: { model: 'gpt3.5-turbo', temperature: 0.6 },
      prompts,
      vars,
    };
    action.updateParams(request);
    let output = '';
    await fetchLangChain({
      params: request,
      onMessageHandle: (text) => {
        output += text;
        action.updateOutput({
          output,
          type: 'text',
        });
      },
      onLoadingChange: (loading) => {
        action.updateLoading(loading);
      },
      abortController: action.abortController,
    });

    return {
      type: 'text',
      output,
    };
  },
};
```

如果你需要自定义，我们会把节点的 id 传递给组件。

```typescript
export const AITaskSymbol: SymbolMasterDefinition<AITaskContent> = {
  id: 'aiTask',
  title: 'AI节点',
  avatar: '🤖',
  description: '使用大模型处理任务',
  defaultContent: initAITaskContent,
  render: ({ id }) => <div>{id}</div>,
};
```

要实现复杂的功能，就需要熟练的使用数据流，这里有两个概念需要理解一下 flow 和 node。flow 代表工作流本身，我们可以在里面管理节点，连线和一些 flow 的基本信息。Node 代表实例化之后的节点，修改数据之后需要同步更新 node 节点上的数据。

```typescript
export interface FlowState {
  activeId: string | null;
  keywords: string;
  showNodeManager: boolean;
  nodeManagerKeywords: string;
  displayMode: FlowDisplayMode;
  flows: WorkflowMap;
  loading?: boolean;
  terminalHeight: number;
  showTerminal: boolean;
  editor: FlowEditorInstance;
}

export interface FlowCRUDSlice {
  dispatchFlow: (payload: FlowsDispatch, debug?: { type: string } & any) => void;
  createFlow: () => void;
  createFlowBaseOnAgent: (agent: ChatAgent) => void;
  removeFlow: (id: string) => void;
  importFlow: (id: string, flow: string) => void;
  openImportFlowModal: (id: string) => void;
  closeImportFlowModal: (id: string) => void;
  /**
   * 导出所有节点
   * @returns
   */
  exportWorkflow: () => void;
}

export interface FlowRunnerSlice {
  runFlowNode: (nodeId: string) => Promise<void>;
  abortFlowNode: (id: string) => void;
  /**
   * 运行所有节点
   * @returns
   */
  runFlow: () => void;
  /**
   * 取消所有节点的运行
   * @returns
   */
  cancelFlowNode: () => void;
}

export type FlowStore = FlowCRUDSlice & FlowRunnerSlice & FlowState;
```

其上包含着所有的任务流的管理方法和一些元数据可以按需取用。在组件中我们可以通过 `useFlowStore` 和 `flowSelectors` 来获取到当前的任务流，更多的高级功能需要来探索一下，我们提供了详细准确的类型定义。

```typescript
const RunButton = () => {
  const [flow] = useFlowStore((s) => [flowSelectors.currentFlowMeta(s)], shallow);
  return <div onclick={() => flow.runFlow()}>run</div>;
};
```

node 的定义相对复杂一些，毕竟所有的脏活都在 Node 中完成的。

```typescript
export type Node<T = any, U extends string | undefined = string | undefined> = {
  id: string;
  position: XYPosition;
  data: T;
  type?: U;
  style?: CSSProperties;
  className?: string;
  sourcePosition?: Position;
  targetPosition?: Position;
  hidden?: boolean;
  selected?: boolean;
  dragging?: boolean;
  draggable?: boolean;
  selectable?: boolean;
  connectable?: boolean;
  deletable?: boolean;
  dragHandle?: string;
  width?: number | null;
  height?: number | null;
  parentNode?: string;
  zIndex?: number;
  extent?: 'parent' | CoordinateExtent;
  expandParent?: boolean;
  positionAbsolute?: XYPosition;
  ariaLabel?: string;
  focusable?: boolean;
  resizing?: boolean;
  [internalsSymbol]?: {
    z?: number;
    handleBounds?: NodeHandleBounds;
    isParent?: boolean;
  };
};
```

我们可以通过 `getNodeByIdSafe` 和 `useFlowStore` 来获得某个实例化后的节点，下面是个简单的例子。

```typescript
const Render = ({ id }: { id: string }) => {
  const [type] = useFlowStore((s) => {
    const node = flowSelectors.getNodeByIdSafe<Record<string, any>>(id)(s);
    return [node];
  }, shallow);

  // 节点的配置
  const nodeConfig = symbolNodeList.find((item) => item.id === type);

  if (nodeConfig.id === 'string') return <Input />;
};
```

复杂的实现可以看官方的实例。

## 维护和支持

这个项目基于开源社区的 Github 平台，这意味着您可以积极参与其中，与其他开发者进行交流并为项目的进步贡献自己的力量。在 Github 上，您可以利用项目的 issue 功能来提出问题、报告 bug 或提出改进建议。这可以帮助项目的维护者和其他开发者更好地了解和解决存在的问题。此外，您还可以通过提交 PR（Pull Request）来帮助开源项目变得更好。PR 是一种提议性变更，您可以提出自己的代码修改或功能增加，并与项目的维护者一起讨论和改进。通过这种方式，您不仅可以为项目做出贡献，还能与其他开发者进行交流和协作，共同推动项目的发展。参与开源项目有助于提高您的技术能力，拓宽视野，并与其他开发者共同建设一个更好的软件生态系统。我鼓励您积极参与社区讨论和贡献，享受开源文化的乐趣。

## 授权和许可

```shell
The MIT License (MIT)
Copyright © 2023 <copyright holders>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```

可以进行任何意义上的 复制 和 修改，欢迎基于二次开发或提供 PR。
