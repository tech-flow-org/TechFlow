export const code = `
以下是：
\`\`\`tsx
/**
 * @title 站点令牌
 * @description 站点的一些基础配置信息
 */
interface SiteToken {
  /**
   * @title 头部高度
   */
  headerHeight: number;
  /**
   * @title 底部高度
   */
  footerHeight: number;
  /**
   * @title 侧边栏宽度
   */
  sidebarWidth: number;
  /**
   * @title 目录宽度
   */
  tocWidth: number;
  /**
   * @title 内容最大宽度
   * @description 文本内容的最大宽度 1152
   */
  contentMaxWidth: number;
  /**
   * @title 渐变色1
   */
  gradientColor1: string;
  /**
   * @title 渐变色2
   */
  gradientColor2: string;
  /**
   * @title 渐变色3
   */
  gradientColor3: string;
  /**
   * @title 渐变背景色
   */
  gradientHeroBgG: string;
  /**
   * @title 默认图标渐变色
   */
  gradientIconDefault: string;
  /**
   * @title 实色
   */
  colorSolid: string;
  /**
   * @title 代码高亮字体
   */
  fontFamilyHighlighter: string;
}
\`\`\`
    `;
