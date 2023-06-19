export class StringTemplate {
  private readonly template: string;
  readonly variableNames: string[];

  constructor(template: string) {
    this.template = template;
    this.variableNames = this.extractVariableNames(template);
  }

  private extractVariableNames(template: string): string[] {
    const variablePattern = /\{(.+?)\}/g;
    let match: RegExpExecArray | null;
    const variableNames: string[] = [];

    while ((match = variablePattern.exec(template)) !== null) {
      const variableName = match[1];

      // 检查变量名是否合法
      if (!/^[\w]+$/.test(variableName)) {
        // throw new Error(`Invalid variable name: ${variableName}`);
      } else {
        variableNames.push(variableName);
      }
    }

    return variableNames;
  }

  public render(variables: { [key: string]: string }): string {
    let result = this.template;

    for (const name of this.variableNames) {
      let value = variables[name];
      if (typeof value !== 'string') {
        value = '';
      }

      // 防止注入攻击，需要确保值中不包含特殊字符
      // if (!/^[\w\s]+$/.test(value)) {
      //   throw new Error(`Invalid variable value: ${value}`);
      // }

      const replacePattern = new RegExp(`\\{${name}\\}`, 'g');
      result = result.replace(replacePattern, value);
    }

    return result;
  }
}
