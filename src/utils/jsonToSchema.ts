import isEqual from 'lodash.isequal';
import keys from 'lodash.keys';
import merge from 'lodash.merge';
import xor from 'lodash.xor';

type OptionsType = {
  required?: boolean;
  postProcessFnc?: any;
  strings?: {
    detectFormat: boolean;
    preProcessFnc: (value: Record<string, any>, fn: any) => Record<string, any>;
  };
  arrays?: {
    mode: string;
  };
  objects?: {
    preProcessFnc: (value: Record<string, any>, fn: any) => Record<string, any>;
    postProcessFnc: (Schema: any, value: Record<string, any>, fn: any) => Record<string, any>;
    additionalProperties: boolean;
  };
};

const types = {
  string: function testString(instance: any) {
    return typeof instance === 'string';
  },

  number: function testNumber(instance: number) {
    // isFinite returns false for NaN, Infinity, and -Infinity
    return typeof instance === 'number' && isFinite(instance); // eslint-disable-line no-restricted-globals
  },

  integer: function testInteger(instance: number) {
    return typeof instance === 'number' && instance % 1 === 0;
  },

  boolean: function testBoolean(instance: any) {
    return typeof instance === 'boolean';
  },

  array: function testArray(instance: any) {
    return instance instanceof Array;
  },

  null: function testNull(instance: null) {
    return instance === null;
  },

  date: function testDate(instance: any) {
    return instance instanceof Date;
  },

  /* istanbul ignore next: not using this but keeping it here for sake of completeness */
  any: function testAny() {
    // eslint-disable-line no-unused-vars
    return true;
  },

  object: function testObject(instance: any) {
    return (
      instance &&
      typeof instance === 'object' &&
      !(instance instanceof Array) &&
      !(instance instanceof Date)
    );
  },
};

const BASE_FORMAT_REGEXPS = {
  'date-time':
    /^\d{4}-(?:0[0-9]{1}|1[0-2]{1})-(3[01]|0[1-9]|[12][0-9])[tT ](2[0-4]|[01][0-9]):([0-5][0-9]):(60|[0-5][0-9])(\.\d+)?([zZ]|[+-]([0-5][0-9]):(60|[0-5][0-9]))$/,
  date: /^\d{4}-(?:0[0-9]{1}|1[0-2]{1})-(3[01]|0[1-9]|[12][0-9])$/,
  time: /^(2[0-4]|[01][0-9]):([0-5][0-9]):(60|[0-5][0-9])$/,

  email:
    /^(?:[\w!#$%&'*+-/=?^`{|}~]+\.)*[\w!#$%&'*+-/=?^`{|}~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/,
  'ip-address':
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
  ipv6: /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/,
  uri: /^[a-zA-Z][a-zA-Z0-9+-.]*:[^\s]*$/,

  color:
    /^(#?([0-9A-Fa-f]{3}){1,2}\b|aqua|black|blue|fuchsia|gray|green|lime|maroon|navy|olive|orange|purple|red|silver|teal|white|yellow|(rgb\(\s*\b([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\b\s*,\s*\b([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\b\s*,\s*\b([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\b\s*\))|(rgb\(\s*(\d?\d%|100%)+\s*,\s*(\d?\d%|100%)+\s*,\s*(\d?\d%|100%)+\s*\)))$/,

  // hostname regex from: http://stackoverflow.com/a/1420225/5628
  hostname:
    /^(?=.{1,255}$)[0-9A-Za-z](?:(?:[0-9A-Za-z]|-){0,61}[0-9A-Za-z])?(?:\.[0-9A-Za-z](?:(?:[0-9A-Za-z]|-){0,61}[0-9A-Za-z])?)*\.?$/,
  'host-name':
    /^(?=.{1,255}$)[0-9A-Za-z](?:(?:[0-9A-Za-z]|-){0,61}[0-9A-Za-z])?(?:\.[0-9A-Za-z](?:(?:[0-9A-Za-z]|-){0,61}[0-9A-Za-z])?)*\.?$/,

  alpha: /^[a-zA-Z]+$/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  'utc-millisec': (input: string | number) =>
    typeof input === 'string' &&
    parseFloat(input) === parseInt(input, 10) &&
    !isNaN(parseInt(input)), // eslint-disable-line no-restricted-globals
  regex(input: string | RegExp) {
    // eslint-disable-line space-before-function-paren
    let result = true;
    try {
      new RegExp(input); // eslint-disable-line no-new
    } catch (e) {
      result = false;
    }
    return result;
  },
  style: /\s*(.+?):\s*([^;]+);?/g,
  phone: /^\+(?:[0-9] ?){6,14}[0-9]$/,
};

const FORMAT_REGEXPS = {
  ...BASE_FORMAT_REGEXPS,
  regexp: BASE_FORMAT_REGEXPS.regex,
  pattern: BASE_FORMAT_REGEXPS.regex,
  ipv4: BASE_FORMAT_REGEXPS['ip-address'],
};

const isFormat = function isFormat(input: any, format: keyof typeof FORMAT_REGEXPS) {
  if (typeof input === 'string' && FORMAT_REGEXPS[format] !== undefined) {
    if (FORMAT_REGEXPS[format as 'regexp'] instanceof RegExp) {
      return (FORMAT_REGEXPS[format] as RegExp).test(input);
    }
    if (typeof FORMAT_REGEXPS[format] === 'function') {
      return (FORMAT_REGEXPS[format] as (value: string) => boolean)(input);
    }
  }
  return true;
};

const helpers = {
  stringFormats: keys(FORMAT_REGEXPS),

  isFormat,

  typeNames: [
    'integer',
    'number', // make sure number is after integer (for proper type detection)
    'string',
    'array',
    'object',
    'boolean',
    'null',
    'date',
  ] as const,

  getType(val: any) {
    return helpers.typeNames.find((typeName) => types[typeName](val));
  },

  /**
   * Tries to find the least common schema from two supplied JSON schemas. If it is unable to find
   * such a schema, it returns null. Incompatibility in structure/types leads to returning null,
   * except when the difference is only integer/number. Than the 'number' is used instead 'int'.
   * Types/Structure incompatibility in array items only leads to schema that doesn't specify
   * items structure/type.
   * @param {object} schema1 - JSON schema
   * @param {object} schema2 - JSON schema
   * @returns {object|null}
   */
  mergeSchemaObjs(
    schema1: { [x: string]: any; type: string },
    schema2: { [x: string]: any; type: string },
  ) {
    const schema1Keys = keys(schema1);
    const schema2Keys = keys(schema2);
    if (!isEqual(schema1Keys, schema2Keys)) {
      if (schema1.type === 'array' && schema2.type === 'array') {
        // TODO optimize???
        if (isEqual(xor(schema1Keys, schema2Keys), ['items'])) {
          const schemaWithoutItems = schema1Keys.length > schema2Keys.length ? schema2 : schema1;
          const schemaWithItems = schema1Keys.length > schema2Keys.length ? schema1 : schema2;
          const isSame = keys(schemaWithoutItems).reduce(
            (acc: any, current: string | number) =>
              isEqual(schemaWithoutItems[current], schemaWithItems[current]) && acc,
            true,
          );
          if (isSame) {
            return schemaWithoutItems;
          }
        }
      }
      if (schema1.type !== 'object' || schema2.type !== 'object') {
        return null;
      }
    }

    const retObj: Record<string, any> = {};
    for (let i = 0, { length } = schema1Keys; i < length; i++) {
      const key = schema1Keys[i];
      if (helpers.getType(schema1[key]) === 'object') {
        const x = helpers.mergeSchemaObjs(schema1[key], schema2[key]);
        if (!x) {
          if (schema1.type === 'object' || schema2.type === 'object') {
            return { type: 'object' };
          }
          // special treatment for array items. If not mergeable, we can do without them
          if (key !== 'items' || schema1.type !== 'array' || schema2.type !== 'array') {
            return null;
          }
        } else {
          retObj[key] = x;
        }
      } else {
        // simple value schema properties (not defined by object)
        if (key === 'type') {
          // eslint-disable-line no-lonely-if
          if (schema1[key] !== schema2[key]) {
            if (
              (schema1[key] === 'integer' && schema2[key] === 'number') ||
              (schema1[key] === 'number' && schema2[key] === 'integer')
            ) {
              retObj[key] = 'number';
            } else {
              return null;
            }
          } else {
            retObj[key] = schema1[key];
          }
        } else {
          if (!isEqual(schema1[key], schema2[key])) {
            // TODO Is it even possible to take this path?
            return null;
          }
          retObj[key] = schema1[key];
        }
      }
    }
    return retObj;
  },
};

const defaultOptions = {
  required: false,
  postProcessFnc: null,

  strings: {
    detectFormat: true,
    preProcessFnc: null,
  },
  arrays: {
    mode: 'all',
  },
  objects: {
    preProcessFnc: null,
    postProcessFnc: null,
    additionalProperties: true,
  },
};

const skipReverseFind = [
  'hostname',
  'host-name',
  'alpha',
  'alphanumeric',
  'regex',
  'regexp',
  'pattern',
];
const filteredFormats = helpers.stringFormats.filter(
  (item: string) => skipReverseFind.indexOf(item) < 0,
);

function getCommonTypeFromArrayOfTypes(arrOfTypes: any[]) {
  let lastVal;
  for (let i = 0, { length } = arrOfTypes; i < length; i++) {
    let currentType = arrOfTypes[i];
    if (i > 0) {
      if (currentType === 'integer' && lastVal === 'number') {
        currentType = 'number';
      } else if (currentType === 'number' && lastVal === 'integer') {
        lastVal = 'number';
      }
      if (lastVal !== currentType) return null;
    }
    lastVal = currentType;
  }
  return lastVal;
}

function getCommonArrayItemsType(arr: any[]) {
  return getCommonTypeFromArrayOfTypes(arr.map((item: any) => helpers.getType(item)));
}

class ToJsonSchema {
  options: OptionsType;
  constructor(options: OptionsType) {
    this.options = merge({}, defaultOptions, options);
    this.getObjectSchemaDefault = this.getObjectSchemaDefault.bind(this);
    this.getStringSchemaDefault = this.getStringSchemaDefault.bind(this);
    this.objectPostProcessDefault = this.objectPostProcessDefault.bind(this);
    this.commmonPostProcessDefault = this.commmonPostProcessDefault.bind(this);
    this.objectPostProcessDefault = this.objectPostProcessDefault.bind(this);
  }

  /**
   * Tries to find the least common schema that would validate all items in the array. More details
   * helpers.mergeSchemaObjs description
   * @param {array} arr
   * @returns {object|null}
   */
  getCommonArrayItemSchema(arr: any[]) {
    const schemas = arr.map((item: any) => this.getSchema(item));
    // schemas.forEach(schema => console.log(JSON.stringify(schema, '\t')))
    return schemas.reduce(
      (acc: any, current: any) => helpers.mergeSchemaObjs(acc, current),
      schemas.pop(),
    );
  }

  getObjectSchemaDefault(obj: Record<string, any>) {
    const schema: Record<string, any> = { type: 'object' };
    const objKeys = Object.keys(obj);
    if (objKeys.length > 0) {
      schema.properties = objKeys.reduce((acc, propertyName) => {
        acc[propertyName] = this.getSchema(obj[propertyName]); // eslint-disable-line no-param-reassign
        return acc;
      }, {} as Record<string, any>);
    }
    return schema;
  }

  getObjectSchema(obj: Record<string, any>) {
    if (this.options?.objects?.preProcessFnc) {
      return this.options?.objects.preProcessFnc(obj, this.getObjectSchemaDefault);
    }
    return this.getObjectSchemaDefault(obj);
  }

  getArraySchemaMerging(arr: any) {
    const schema: Record<string, any> = { type: 'array' };
    const commonType = getCommonArrayItemsType(arr);
    if (commonType) {
      schema.items = { type: commonType };
      if (commonType !== 'integer' && commonType !== 'number') {
        const itemSchema = this.getCommonArrayItemSchema(arr);
        if (itemSchema) {
          schema.items = itemSchema;
        }
      } else if (this.options.required) {
        schema.items.required = true;
      }
    }
    return schema;
  }

  getArraySchemaNoMerging(arr: Record<string, any>) {
    const schema: Record<string, any> = { type: 'array' };
    if (arr.length > 0) {
      schema.items = this.getSchema(arr[0]);
    }
    return schema;
  }

  getArraySchemaTuple(arr: Record<string, any>) {
    const schema: Record<string, any> = { type: 'array' };
    if (arr.length > 0) {
      schema.items = arr.map((item: any) => this.getSchema(item));
    }
    return schema;
  }

  getArraySchemaUniform(arr: Record<string, any>) {
    const schema = this.getArraySchemaNoMerging(arr);

    if (arr.length > 1) {
      for (let i = 1; i < arr.length; i++) {
        if (!isEqual(schema.items, this.getSchema(arr[i]))) {
          throw new Error('Invalid schema, incompatible array items');
        }
      }
    }
    return schema;
  }

  getArraySchema(arr: Record<string, any>) {
    if (arr.length === 0) {
      return { type: 'array' };
    }
    switch (this.options?.arrays?.mode) {
      case 'all':
        return this.getArraySchemaMerging(arr);
      case 'first':
        return this.getArraySchemaNoMerging(arr);
      case 'uniform':
        return this.getArraySchemaUniform(arr);
      case 'tuple':
        return this.getArraySchemaTuple(arr);
      default:
        throw new Error(`Unknown array mode option '${this.options?.arrays?.mode}'`);
    }
  }

  getStringSchemaDefault(value: Record<string, any>) {
    const schema: Record<string, any> = { type: 'string' };

    if (!this.options?.strings?.detectFormat) {
      return schema;
    }

    const index = filteredFormats.findIndex((item: any) => helpers.isFormat(value, item));
    if (index >= 0) {
      schema.format = filteredFormats[index];
    }

    return schema;
  }

  getStringSchema(value: Record<string, any>) {
    if (this.options?.strings?.preProcessFnc) {
      return this.options.strings.preProcessFnc(value, this.getStringSchemaDefault);
    }
    return this.getStringSchemaDefault(value);
  }

  commmonPostProcessDefault(type: string, schema: Record<string, any>) {
    // eslint-disable-line no-unused-vars
    if (this.options.required) {
      return merge({}, schema, { required: true });
    }
    return schema;
  }

  objectPostProcessDefault(schema: any, obj: any) {
    if (
      this.options.objects?.additionalProperties === false &&
      Object.getOwnPropertyNames(obj).length > 0
    ) {
      return merge({}, schema, { additionalProperties: false });
    }
    return schema;
  }

  /**
   * Gets JSON schema for provided value
   * @param value
   * @returns {object}
   */
  getSchema(value: Record<string, any>): Record<string, any> {
    const type = helpers.getType(value);
    if (!type) {
      throw new Error("Type of value couldn't be determined");
    }

    let schema;
    switch (type) {
      case 'object':
        schema = this.getObjectSchema(value);
        break;
      case 'array':
        schema = this.getArraySchema(value);
        break;
      case 'string':
        schema = this.getStringSchema(value);
        break;
      default:
        schema = { type };
    }

    if (this.options.postProcessFnc) {
      schema = this.options.postProcessFnc(type, schema, value, this.commmonPostProcessDefault);
    } else {
      schema = this.commmonPostProcessDefault(type, schema);
    }

    if (type === 'object') {
      if (this.options?.objects?.postProcessFnc) {
        schema = this.options?.objects.postProcessFnc(schema, value, this.objectPostProcessDefault);
      } else {
        schema = this.objectPostProcessDefault(schema, value);
      }
    }

    return schema;
  }
}

export function jsonToSchema(value: Record<string, any>, options: OptionsType) {
  const tjs = new ToJsonSchema(options);
  return tjs.getSchema(value);
}
